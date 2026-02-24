import { useState, useEffect } from 'react'

// Breakpoint: < 1024px = mobile, >= 1024px = desktop
const DESKTOP_BREAKPOINT = 1024

export function useViewport() {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== 'undefined'
      ? window.innerWidth >= DESKTOP_BREAKPOINT
      : false
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { isMobile: !isDesktop, isDesktop }
}
