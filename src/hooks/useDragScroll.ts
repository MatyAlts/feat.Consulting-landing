import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * useDragScroll — Emulación 1:1 de touch scrolling con mouse.
 *
 * Comportamiento idéntico a un dispositivo móvil real:
 * - Click+Arrastrar = deslizar (scroll vertical u horizontal)
 * - Soltar con velocidad = inercia/momentum con fricción
 * - Distinción click vs drag con slop threshold
 * - Bloqueo de eje (vertical vs horizontal) una vez decidido
 * - Elementos con [data-horizontal-drag] se deslizan horizontalmente
 * - Previene selección de texto, arrastre de imágenes, etc.
 * - Wheel: un tick = siguiente sección snap (como en mobile)
 * - CSS snap nativo se respeta y se maneja transparentemente
 */

type Options = {
  slop?: number
  friction?: number
  minVelocity?: number
  maxVelocity?: number
}

export function useDragScroll(
  ref: RefObject<HTMLElement | null>,
  isEnabled: boolean = true,
  opts: Options = {}
) {
  useEffect(() => {
    if (!isEnabled) return
    const el = ref.current
    if (!el) return

    const {
      slop = 6,
      friction = 0.95,
      minVelocity = 0.3,
      maxVelocity = 80,
    } = opts

    // ── Estilos base ──
    el.style.overscrollBehavior = 'contain'
    el.style.touchAction = 'none'

    // ── Estado del gesto ──
    let pointerDown = false
    let pointerId: number | null = null
    let axis: 'x' | 'y' | null = null
    let dragging = false
    let savedSnapType = ''
    let dragStartScrollTop = 0
    let inSnapZone = false   // true si el drag empezó en una zona con snap activo
    let dragDeltaY = 0       // acumulador de delta total del gesto

    let startX = 0, startY = 0, prevX = 0, prevY = 0

    const VELOCITY_WINDOW = 80
    let samples: { dx: number; dy: number; t: number }[] = []

    let momentumRaf: number | null = null
    let velX = 0, velY = 0

    let hTarget: HTMLElement | null = null

    // ── Snap Helpers ──

    /** Recopila las posiciones scrollTop de todos los snap points */
    const getSnapPositions = (): number[] => {
      const snapEls = el.querySelectorAll('.snap-start')
      if (snapEls.length === 0) return []

      const elRect = el.getBoundingClientRect()
      
      // En desktop el contenedor puede estar escalado con CSS transform.
      // OffsetWidth es el tamaño real (CSS pixels), elRect.width el tamaño renderizado.
      // Necesitamos compensar esa escala para que el scrollTo sea preciso.
      const invScale = el.offsetWidth / elRect.width || 1
      
      const positions: number[] = []

      snapEls.forEach(child => {
        const rect = (child as HTMLElement).getBoundingClientRect()
        // Ajustar el delta por el factor inverso de escala
        const scrollPos = el.scrollTop + (rect.top - elRect.top) * invScale
        positions.push(Math.round(scrollPos))
      })

      return positions.sort((a, b) => a - b)
    }

    /** Encuentra el snap point más cercano a la posición actual */
    const findNearestSnap = (): number | null => {
      const positions = getSnapPositions()
      if (positions.length === 0) return null

      const current = el.scrollTop
      let best = positions[0]
      let bestDist = Math.abs(current - best)

      for (const pos of positions) {
        const dist = Math.abs(current - pos)
        if (dist < bestDist) {
          bestDist = dist
          best = pos
        }
      }

      return best
    }

    /** Encuentra el siguiente snap point en la dirección dada */
    const findNextSnap = (direction: 'down' | 'up'): number | null => {
      const positions = getSnapPositions()
      if (positions.length === 0) return null

      const current = el.scrollTop
      const threshold = 10 // margen aumentado para evitar quedarse trabado

      if (direction === 'down') {
        for (const pos of positions) {
          if (pos > current + threshold) return pos
        }
        return positions[positions.length - 1] // último
      } else {
        for (let i = positions.length - 1; i >= 0; i--) {
          if (positions[i] < current - threshold) return positions[i]
        }
        return positions[0] // primero
      }
    }

    /** Desactiva CSS snap durante el drag */
    const disableSnap = () => {
      const computed = getComputedStyle(el).scrollSnapType
      if (computed && computed !== 'none') {
        savedSnapType = computed
        el.style.scrollSnapType = 'none'
      }
    }

    /** Restaura CSS snap y fuerza re-snap con lógica de dirección.
     *  Si el usuario arrastró más de un % del viewport → siguiente sección.
     *  Si menos → vuelve a la sección donde empezó.
     */
    const restoreSnapAndAlign = () => {
      if (!savedSnapType) return
      
      const currentScroll = el.scrollTop
      const delta = currentScroll - dragStartScrollTop
      const containerH = el.clientHeight
      const DRAG_THRESHOLD = containerH * 0.10 // 10% del viewport

      let target: number | null = null

      if (Math.abs(delta) > DRAG_THRESHOLD) {
        // Movió suficiente → ir a la siguiente sección en esa dirección
        const direction = delta > 0 ? 'down' : 'up'
        target = findNextSnap(direction)
        // Fallback al más cercano si no hay siguiente
        if (target === null) target = findNearestSnap()
      } else {
        // Movió poco → volver a donde empezó (snap back)
        const positions = getSnapPositions()
        let best = dragStartScrollTop
        let bestDist = Infinity
        for (const pos of positions) {
          const dist = Math.abs(dragStartScrollTop - pos)
          if (dist < bestDist) { bestDist = dist; best = pos }
        }
        target = best
      }
      
      // Restaurar el snap CSS
      el.style.scrollSnapType = ''
      savedSnapType = ''

      if (target !== null) {
        el.scrollTo({ top: target, behavior: 'smooth' })
      }
    }

    // ── Otros Helpers ──

    const stopMomentum = () => {
      if (momentumRaf !== null) {
        cancelAnimationFrame(momentumRaf)
        momentumRaf = null
      }
      velX = 0
      velY = 0
    }

    const computeVelocity = (): { vx: number; vy: number } => {
      const now = performance.now()
      const recent = samples.filter(s => now - s.t < VELOCITY_WINDOW)
      if (recent.length < 2) return { vx: 0, vy: 0 }

      let totalDx = 0, totalDy = 0
      for (const s of recent) { totalDx += s.dx; totalDy += s.dy }

      const dt = recent[recent.length - 1].t - recent[0].t
      return dt > 0 ? { vx: totalDx / dt, vy: totalDy / dt } : { vx: 0, vy: 0 }
    }

    const clamp = (v: number) => Math.max(-maxVelocity, Math.min(maxVelocity, v))
    const MIN_V = minVelocity / 16

    /** Momentum/inercia animation */
    const startMomentum = (target: HTMLElement, horizontal: boolean) => {
      const { vx, vy } = computeVelocity()

      if (horizontal) {
        velX = clamp(vx); velY = 0
        if (Math.abs(velX) < MIN_V) return
      } else {
        velX = 0; velY = clamp(vy)
        if (Math.abs(velY) < MIN_V) return
      }

      let lastT = performance.now()

      const tick = (now: number) => {
        const dt = now - lastT
        lastT = now

        if (dt <= 0 || dt > 100) {
          momentumRaf = requestAnimationFrame(tick)
          return
        }

        if (horizontal) {
          target.scrollLeft -= velX * dt
          const max = target.scrollWidth - target.clientWidth
          if (target.scrollLeft <= 0 || target.scrollLeft >= max) velX = 0
          velX *= Math.pow(friction, dt / 16)
          if (Math.abs(velX) < MIN_V) { momentumRaf = null; return }
        } else {
          target.scrollTop -= velY * dt
          const max = target.scrollHeight - target.clientHeight
          if (target.scrollTop <= 0 || target.scrollTop >= max) velY = 0
          velY *= Math.pow(friction, dt / 16)
          if (Math.abs(velY) < MIN_V) {
            momentumRaf = null
            restoreSnapAndAlign()
            return
          }
        }

        momentumRaf = requestAnimationFrame(tick)
      }

      momentumRaf = requestAnimationFrame(tick)
    }

    // ── Wheel Handler: un tick = una sección ──

    let wheelCooldown = false
    let wheelAccumulator = 0

    const onWheel = (e: WheelEvent) => {
      // Solo interceptar si hay snap activo
      const snapType = getComputedStyle(el).scrollSnapType
      if (!snapType || snapType === 'none') return

      e.preventDefault()

      if (wheelCooldown) return

      // Acumular el delta para evitar que movimientos mínimos disparen el snap
      wheelAccumulator += e.deltaY

      const TRIGGER_THRESHOLD = 50 // Requerir cierta "fuerza" de scroll
      if (Math.abs(wheelAccumulator) < TRIGGER_THRESHOLD) return

      wheelCooldown = true
      const direction = wheelAccumulator > 0 ? 'down' : 'up'
      wheelAccumulator = 0 // Reset tras disparo

      const target = findNextSnap(direction)

      if (target !== null) {
        el.scrollTo({ top: target, behavior: 'smooth' })
      }

      // Cooldown más corto para mejor respuesta (400ms es suficiente)
      setTimeout(() => { wheelCooldown = false }, 400)
    }

    // ── Pointer Event Handlers ──

    let currentInvScale = 1

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return

      stopMomentum()

      pointerDown = true
      dragging = false
      axis = null
      pointerId = e.pointerId
      hTarget = null
      currentInvScale = 1

      startX = e.clientX; startY = e.clientY
      prevX = e.clientX; prevY = e.clientY
      samples = []
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown || e.pointerId !== pointerId) return

      const dxRaw = e.clientX - prevX
      const dyRaw = e.clientY - prevY
      const now = performance.now()

      if (!axis) {
        const totalDx = Math.abs(e.clientX - startX)
        const totalDy = Math.abs(e.clientY - startY)

        if (totalDx < slop && totalDy < slop) return

        axis = totalDy >= totalDx ? 'y' : 'x'
        dragging = true

        // Calcular escala una sola vez al inicio del drag
        const elRect = el.getBoundingClientRect()
        currentInvScale = el.offsetWidth / elRect.width || 1

        if (axis === 'y') {
          dragStartScrollTop = el.scrollTop
          dragDeltaY = 0
          // Detectar si estamos en zona snap
          const snapType = getComputedStyle(el).scrollSnapType
          inSnapZone = !!(snapType && snapType !== 'none')
          disableSnap()
          // scrollBehavior auto solo durante drag
          el.style.scrollBehavior = 'auto'
          try { el.setPointerCapture(e.pointerId) } catch {}
          el.style.userSelect = 'none'
          el.style.cursor = 'grabbing'
        } else {
          const target = e.target as HTMLElement
          hTarget = target.closest?.('[data-horizontal-drag]') as HTMLElement | null

          if (hTarget) {
            try { el.setPointerCapture(e.pointerId) } catch {}
            hTarget.style.userSelect = 'none'
            hTarget.style.cursor = 'grabbing'
            hTarget.style.scrollBehavior = 'auto'
            hTarget.style.scrollSnapType = 'none'
          } else {
            axis = 'y'
            dragStartScrollTop = el.scrollTop
            dragDeltaY = 0
            const snapType = getComputedStyle(el).scrollSnapType
            inSnapZone = !!(snapType && snapType !== 'none')
            disableSnap()
            el.style.scrollBehavior = 'auto'
            try { el.setPointerCapture(e.pointerId) } catch {}
            el.style.userSelect = 'none'
            el.style.cursor = 'grabbing'
          }
        }
      }

      // Aplicar escala a los deltas
      const dx = dxRaw * currentInvScale
      const dy = dyRaw * currentInvScale

      if (axis === 'y') {
        if (inSnapZone) {
          // En zona snap: aplicar resistencia (rubber band)
          const resistance = 0.2
          el.scrollTop -= dy * resistance
        } else {
          // En zona libre: scroll 1:1
          el.scrollTop -= dy
        }
        dragDeltaY += dy // acumular delta real escalado
        e.preventDefault()
      } else if (axis === 'x' && hTarget) {
        hTarget.scrollLeft -= dx
        e.preventDefault()
      }

      samples.push({ dx, dy, t: now })
      while (samples.length > 0 && now - samples[0].t > VELOCITY_WINDOW) {
        samples.shift()
      }

      prevX = e.clientX
      prevY = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDown || e.pointerId !== pointerId) return
      pointerDown = false

      try { el.releasePointerCapture(e.pointerId) } catch {}

      if (dragging) {
        if (axis === 'x' && hTarget) {
          hTarget.style.userSelect = ''
          hTarget.style.cursor = ''

          startMomentum(hTarget, true)

          const snapTarget = hTarget
          const restoreHSnap = () => {
            if (momentumRaf === null) {
              snapTarget.style.scrollBehavior = ''
              snapTarget.style.scrollSnapType = ''
              requestAnimationFrame(() => {
                const w = snapTarget.clientWidth
                if (w > 0) {
                  const nearest = Math.round(snapTarget.scrollLeft / w)
                  snapTarget.scrollTo({ left: nearest * w, behavior: 'smooth' })
                }
              })
            } else {
              requestAnimationFrame(restoreHSnap)
            }
          }
          requestAnimationFrame(restoreHSnap)
          hTarget = null
        } else if (axis === 'y') {
          el.style.scrollBehavior = ''
          if (inSnapZone) {
            // En snap zone: NO momentum. Page-flip directo.
            // Primero volver al inicio (deshacer rubber band)
            el.scrollTop = dragStartScrollTop
            
            const containerH = el.clientHeight
            const DRAG_THRESHOLD = containerH * 0.10
            const { vy } = computeVelocity()
            const flicked = Math.abs(vy) > MIN_V * 2
            
            // dragDeltaY positivo = dedo movió hacia abajo = scroll hacia arriba
            // dragDeltaY negativo = dedo movió hacia arriba = scroll hacia abajo
            const movedEnough = Math.abs(dragDeltaY) > DRAG_THRESHOLD
            
            if (movedEnough || flicked) {
              // Ir a la siguiente sección en la dirección del gesto
              const direction = dragDeltaY > 0 ? 'up' : 'down'
              const target = findNextSnap(direction)
              
              el.style.scrollSnapType = ''
              savedSnapType = ''
              
              if (target !== null) {
                el.scrollTo({ top: target, behavior: 'smooth' })
              }
            } else {
              // No movió suficiente: snap back
              el.style.scrollSnapType = ''
              savedSnapType = ''
              el.scrollTo({ top: dragStartScrollTop, behavior: 'smooth' })
            }
          } else {
            // Zona libre: momentum normal
            const { vy } = computeVelocity()
            if (Math.abs(vy) < MIN_V) {
              restoreSnapAndAlign()
            } else {
              startMomentum(el, false)
            }
          }
        }
      }

      el.style.userSelect = ''
      el.style.cursor = ''
      pointerId = null
      axis = null
      dragging = false
    }

    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      pointerDown = false
      dragging = false

      try { el.releasePointerCapture(e.pointerId) } catch {}

      if (hTarget) {
        hTarget.style.userSelect = ''
        hTarget.style.cursor = ''
        hTarget.style.scrollBehavior = ''
        hTarget.style.scrollSnapType = ''
        hTarget = null
      }

      el.style.scrollBehavior = ''
      el.style.scrollSnapType = ''
      el.style.userSelect = ''
      el.style.cursor = ''
      savedSnapType = ''
      pointerId = null
      axis = null
    }

    const onDragStart = (e: DragEvent) => e.preventDefault()

    const onSelectStart = (e: Event) => {
      if (pointerDown) e.preventDefault()
    }

    const onContextMenu = (e: MouseEvent) => {
      if (dragging) e.preventDefault()
    }

    // ── Registrar listeners ──
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove, { passive: false })
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('dragstart', onDragStart)
    el.addEventListener('selectstart', onSelectStart)
    el.addEventListener('contextmenu', onContextMenu)

    return () => {
      stopMomentum()
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('dragstart', onDragStart)
      el.removeEventListener('selectstart', onSelectStart)
      el.removeEventListener('contextmenu', onContextMenu)

      el.style.overscrollBehavior = ''
      el.style.scrollBehavior = ''
      el.style.touchAction = ''
      el.style.userSelect = ''
      el.style.cursor = ''
      el.style.scrollSnapType = ''
    }
  }, [isEnabled, ref, opts.slop, opts.friction, opts.minVelocity, opts.maxVelocity])
}
