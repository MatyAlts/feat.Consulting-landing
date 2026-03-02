import { useState, useEffect } from 'react'

const THRESHOLD = 8

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up')
  const [isAtTop, setIsAtTop] = useState(true)
  const [isInHero, setIsInHero] = useState(true)

  useEffect(() => {
    // Rastreamos lastScrollY por contenedor para evitar saltos
    // al hacer la transición entre el snap container y <main>
    const lastScroll = { snap: 0, main: 0 }
    let ticking = false

    const update = (target: HTMLElement) => {
      const isMain = target.tagName === 'MAIN'
      const scrollY = target.scrollTop
      const key = isMain ? 'main' : 'snap'
      const lastScrollY = lastScroll[key]

      // isAtTop es true cuando el scroll está cerca del tope
      const vh = isMain ? target.clientHeight : window.innerHeight
      setIsAtTop(scrollY < THRESHOLD)
      setIsInHero(scrollY < vh * 0.8)

      if (Math.abs(scrollY - lastScrollY) >= THRESHOLD) {
        setScrollDir(scrollY > lastScrollY ? 'down' : 'up')
        lastScroll[key] = scrollY
      }
      ticking = false
    }

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'MAIN' ||
        target.classList?.contains('snap-container') ||
        target === document.documentElement ||
        target === document.body
      ) {
        if (!ticking) {
          requestAnimationFrame(() => update(target))
          ticking = true
        }
      }
    }

    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [])

  return { scrollDir, isAtTop, isInHero }
}
