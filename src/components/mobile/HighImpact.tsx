import { useRef, useEffect } from 'react'

/**
 * HighImpact — Diseño exacto según imagen de referencia:
 *
 * [A] Título con lyrics word-by-word (scroll progress de la sección)
 *
 * [B] Rectángulo #8B8CFB con overflow:hidden
 *     Las 4 frases se deslizan horizontalmente DENTRO del rectángulo.
 *     El clip del borde crea el efecto de "letras apareciendo del borde".
 *     Animación: scroll-scrubbed usando la posición del rectángulo en el viewport.
 *     Dir alternada: izq / der / izq / der
 *
 * [C] "Grounded in response." + "Not theory." con blur reveal
 */

const TITLE_WORDS = "That's how high-impact assets get built:".split(' ')

// dir: -1 = entra desde izquierda (empieza en -100%), 1 = desde derecha (+100%)
const SERVICES = [
  { text: 'Landing ecosystems.', dir: -1 },
  { text: 'Conversion architecture.', dir: +1 },
  { text: 'Narrative alignment.', dir: -1 },
  { text: 'Acquisition systems.', dir: +1 },
]

function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)) }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3) }

function positionOpacity(rect: DOMRect, vh: number, dim = 0): number {
  const activeLine = vh * 0.42
  const dimLine = vh * 0.88
  const center = rect.top + rect.height / 2
  if (center <= activeLine) return 1
  if (center >= dimLine) return dim
  const t = (center - activeLine) / (dimLine - activeLine)
  return 1 - easeOut(t) * (1 - dim)
}

export default function MobileHighImpact() {
  const titleRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([])
  const groundedRef = useRef<HTMLDivElement>(null)
  const notRef = useRef<HTMLParagraphElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const update = () => {
      const main = document.querySelector('main')
      const vh = main ? main.clientHeight : window.innerHeight

      // ── A: word-by-word lyrics (progreso de la sección del título) ─────────
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect()
        const raw = (vh * 0.85 - rect.top) / (vh * 0.75)
        const sP = clamp(raw)
        const paintedFloat = sP * TITLE_WORDS.length

        TITLE_WORDS.forEach((_, i) => {
          const span = wordRefs.current[i]
          if (!span) return
          const wordP = easeOut(clamp(paintedFloat - i))
          // #CECCCA → #171425
          span.style.color = `rgb(
            ${Math.round(206 - wordP * 183)},
            ${Math.round(204 - wordP * 184)},
            ${Math.round(202 - wordP * 165)}
          )`
        })
      }

      // ── B: horizontal slide dentro del rectángulo ─────────────────────────
      // Usamos la posición del rectángulo en el viewport para calcular
      // cuánto ha "subido" y distribuir ese progreso entre las 4 frases.
      // Cuando el centro del box llega al 80% del viewport → progress = 0 (todo afuera)
      // Cuando el centro del box llega al 20% del viewport → progress = 1 (todo adentro)
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const raw = (vh * 0.82 - center) / (vh * 0.62)  // 0.82→0.20 = rango de 62%
        const boxP = clamp(raw)

        // Cada frase tiene su propio subrango dentro de [0, 1]
        // Se solapan para que siempre haya al menos una frase visible
        const ranges = [
          [0.00, 0.35],   // frase 0
          [0.22, 0.57],   // frase 1
          [0.44, 0.79],   // frase 2
          [0.65, 1.00],   // frase 3
        ]

        serviceRefs.current.forEach((div, i) => {
          if (!div) return
          const [start, end] = ranges[i]
          const p = easeOut(clamp((boxP - start) / (end - start)))
          const dir = SERVICES[i].dir
          // Empieza 120% fuera del contenedor, llega a 0
          div.style.transform = `translateX(${dir * (1 - p) * 120}%)`
        })
      }

      // ── C: grounded + not theory por posición ────────────────────────────
      if (groundedRef.current) {
        const op = positionOpacity(groundedRef.current.getBoundingClientRect(), vh)
        groundedRef.current.style.opacity = String(op)
        groundedRef.current.style.filter = `blur(${(1 - op) * 16}px)`
      }
      if (notRef.current) {
        const op = positionOpacity(notRef.current.getBoundingClientRect(), vh)
        notRef.current.style.opacity = String(op)
        notRef.current.style.filter = `blur(${(1 - op) * 16}px)`
      }

      rafRef.current = 0
    }

    const onScroll = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'MAIN') {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true })
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section style={{ backgroundColor: '#FCFAF3', padding: '80px 0 120px' }}>

      {/* ── A: Título word-by-word ──────────────────────────────────────── */}
      <div ref={titleRef} style={{ padding: '0 20px', marginBottom: '21.78px' }}>
        <h2
          style={{
            fontFamily: '"Fustat", sans-serif',
            fontWeight: 500,
            fontSize: '44.18px',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            margin: 0,
          }}
        >
          {TITLE_WORDS.map((word, i) => (
            <span
              key={i}
              ref={el => { wordRefs.current[i] = el }}
              style={{ color: '#CECCCA', willChange: 'color' }}
            >
              {word}{' '}
            </span>
          ))}
        </h2>
      </div>

      {/* ── B: Rectángulo con frases en flujo normal ────────────────────── */}
      {/*
          overflow:hidden hace el clip de las frases que sobresalen.
          Las frases empiezan con translateX(±120%) y llegan a 0
          conforme el rectángulo sube por el viewport.
      */}
      <div
        ref={boxRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          // El rectángulo tiene márgen horizontal de 20px con el borde de pantalla
          margin: '0 0',
        }}
      >
        {/* Capa de fondo blur — solo afecta al fondo, no al texto */}
        <div
          style={{
            position: 'absolute',
            inset: '-20px -20px',
            backgroundColor: '#8B8CFB',
            filter: 'blur(18px)',
          }}
        />

        {/* Frases — encima del blur */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            paddingTop: '22px',
            paddingBottom: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '19px',
          }}
        >
          {SERVICES.map((svc, i) => (
            <div
              key={i}
              ref={el => { serviceRefs.current[i] = el }}
              style={{
                // Estado inicial: fuera de pantalla en la dirección correspondiente
                transform: `translateX(${svc.dir * 120}%)`,
                willChange: 'transform',
                // Alineación espejada: izq entrando desde izq → texto alineado izq
                // der entrando desde der → texto alineado der
                textAlign: svc.dir === -1 ? 'left' : 'right',
                paddingLeft: svc.dir === -1 ? '20px' : '0',
                paddingRight: svc.dir === +1 ? '20px' : '0',
              }}
            >
              <span
                style={{
                  fontFamily: '"Fustat", sans-serif',
                  fontWeight: 300,
                  fontSize: '41.18px',
                  color: '#4C4A76',
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                }}
              >
                {svc.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── C: Grounded in response ─────────────────────────────────────── */}
      <div style={{ padding: '0 20px' }}>
        <div
          ref={groundedRef}
          style={{
            marginTop: '35px',
            width: '100%',
            textAlign: 'center',
            opacity: 0,
            filter: 'blur(16px)',
            willChange: 'opacity, filter',
          }}
        >
          <p style={{ lineHeight: 1.1, margin: 0 }}>
            <span style={{ fontFamily: '"Fustat", sans-serif', fontWeight: 400, fontSize: '48.18px', color: '#171425' }}>
              Grounded in{' '}
            </span>
            <span style={{ fontFamily: '"Lato", sans-serif', fontWeight: 500, fontSize: '48.18px', color: '#8B8CFB', fontStyle: 'italic' }}>
              response.
            </span>
          </p>
        </div>

        <p
          ref={notRef}
          style={{
            marginTop: '12px',
            fontFamily: '"Fustat", sans-serif',
            fontWeight: 200,
            fontSize: '22.18px',
            color: '#171425',
            textAlign: 'center',
            opacity: 0,
            filter: 'blur(16px)',
            willChange: 'opacity, filter',
          }}
        >
          Not theory.
        </p>
      </div>

    </section>
  )
}
