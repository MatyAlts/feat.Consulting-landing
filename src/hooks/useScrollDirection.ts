import { useState, useEffect } from 'react'

const THRESHOLD = 8

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up')
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    let lastScrollY = 0
    let ticking = false

    const update = (target: HTMLElement) => {
      const scrollY = target.scrollTop
      setIsAtTop(scrollY < THRESHOLD)
      if (Math.abs(scrollY - lastScrollY) >= THRESHOLD) {
        setScrollDir(scrollY > lastScrollY ? 'down' : 'up')
        lastScrollY = scrollY
      }
      ticking = false
    }

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement
      // Solo nos interesa el scroll del contenedor principal (main)
      if (target.tagName === 'MAIN' || target === document.documentElement || target === document.body) {
        if (!ticking) {
          requestAnimationFrame(() => update(target))
          ticking = true
        }
      }
    }

    // Usamos capture: true para detectar eventos de scroll que no burbujean
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [])

  return { scrollDir, isAtTop }
}
