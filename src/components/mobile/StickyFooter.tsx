import { useState, useEffect, useRef } from 'react'

export default function StickyFooter() {
    const [isVisible, setIsVisible] = useState(false)
    const [progress, setProgress] = useState(0)
    const lastScrollTop = useRef(0)
    const ticking = useRef(false)

    useEffect(() => {
        const THRESHOLD = 3

        const updateProgress = (target: HTMLElement) => {
            const scrollTop = target.scrollTop

            // Buscamos el hero para saber dónde empezar a contar
            const hero = target.querySelector('#hero') as HTMLElement
            if (!hero) return

            const heroHeight = hero.offsetHeight
            const maxScroll = target.scrollHeight - target.clientHeight

            // El progreso empieza después del Hero
            const scrollableRange = maxScroll - heroHeight
            const currentLevel = Math.max(0, scrollTop - heroHeight)

            if (scrollableRange > 0) {
                const targetProgress = currentLevel / scrollableRange
                setProgress(Math.max(0, Math.min(1, targetProgress)))
            } else {
                setProgress(0)
            }

            // Lógica de visibilidad basada en dirección
            if (Math.abs(scrollTop - lastScrollTop.current) > THRESHOLD) {
                if (scrollTop > 50) {
                    setIsVisible(scrollTop > lastScrollTop.current)
                } else {
                    setIsVisible(false)
                }
                lastScrollTop.current = scrollTop
            }
            ticking.current = false
        }

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement
            // Asegurarnos de capturar el scroll del contenedor main
            if (target.tagName === 'MAIN' || target.classList?.contains('snap-container')) {
                if (!ticking.current) {
                    requestAnimationFrame(() => updateProgress(target))
                    ticking.current = true
                }
            }
        }

        // Listener global para capturar el scroll del contenedor main
        window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
        return () => window.removeEventListener('scroll', handleScroll, { capture: true })
    }, [])

    return (
        <div
            className={[
                'fixed bottom-0 left-0 right-0 z-50 h-[53px]',
                'bg-[#FCFAF3] border-t border-brand-dark/10',
                'transition-transform duration-500 ease-in-out',
                isVisible ? 'translate-y-0' : 'translate-y-full',
            ].join(' ')}
        >
            <div className="flex items-center justify-center gap-12 h-full px-4 relative">
                <a
                    href="#contact"
                    className="text-brand-dark text-[15px] font-medium flex items-center gap-1"
                >
                    Let’s talk <span className="text-[12px]">↗</span>
                </a>

                {/* Progress Bar Container */}
                <div className="absolute bottom-0 left-0 w-full h-[5px] overflow-hidden">
                    {/* Progress Bar Fill - Discrete steps logic */}
                    <div
                        className="h-full will-change-transform origin-left"
                        style={{
                            backgroundColor: '#5C63C3',
                            transform: `scaleX(${progress})`,
                            // Usamos una transición un poco más larga para que el "paso" sea suave al hacer swipe
                            transition: 'transform 150ms cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
