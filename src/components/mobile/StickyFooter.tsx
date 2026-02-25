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
            const containerHeight = target.clientHeight

            // Buscamos todos los elementos con snap-start dentro del main
            const sections = Array.from(target.querySelectorAll('.snap-start'))
            if (sections.length > 0) {
                // Encontrar el índice de la sección que está más cerca del tope del viewport
                let currentSectionIndex = 0
                let minDistance = Infinity

                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect()
                    const distance = Math.abs(rect.top)
                    if (distance < minDistance) {
                        minDistance = distance
                        currentSectionIndex = index
                    }
                });

                // El progreso se basa en el índice de la sección activa
                // 0 en la primera sección, 1 en la última
                const targetProgress = currentSectionIndex / (sections.length - 1)
                setProgress(targetProgress)
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
                    className="text-brand-dark text-[15px] font-medium underline underline-offset-4 decoration-1"
                >
                    Let’s talk
                </a>
                <a
                    href="#contact"
                    className="text-brand-dark text-[15px] font-medium underline underline-offset-4 decoration-1 flex items-center gap-1"
                >
                    Let’s talk <span className="text-[12px] no-underline">↗</span>
                </a>

                {/* Progress Bar Container */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden">
                    {/* Progress Bar Fill - Discrete steps logic */}
                    <div
                        className="h-full bg-brand-dark will-change-transform origin-left opacity-80"
                        style={{
                            transform: `scaleX(${progress})`,
                            // Usamos una transición un poco más larga para que el "paso" sea suave al hacer swipe
                            transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
