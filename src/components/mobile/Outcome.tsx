import { useRef, useEffect, useState } from 'react'

export default function MobileOutcome() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Para que se active tanto al bajar como al subir
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0.2,
                // Añadimos un margen para que la animación empiece antes de que sea totalmente visible
                rootMargin: '0px 0px -10% 0px'
            }
        )

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    // Ajustado a 500ms para que se sienta más "rápida" y reactiva
    // Usamos el cubic-bezier estándar de Tailwind para consistencia
    const entryStyle = (delay: number) => ({
        transition: `all 600ms cubic-bezier(0, 0, 0.2, 1) ${delay}ms`,
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(20px)',
        transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    })

    return (
        <section
            ref={sectionRef}
            className="snap-start snap-always h-screen w-full flex flex-col justify-center px-5 bg-[#D2D2FF] overflow-hidden"
        >
            <div className="flex flex-col">
                <span
                    className="text-brand-dark font-light"
                    style={{
                        fontSize: '17.05px',
                        ...entryStyle(0)
                    }}
                >
                    We’ll help you
                </span>

                <h2
                    className="text-brand-dark font-medium leading-[1.1] tracking-tight mt-[3px]"
                    style={{
                        fontSize: '53.18px',
                        ...entryStyle(100)
                    }}
                >
                    Move from effort to structure.
                </h2>

                <p
                    className="text-brand-dark font-light mt-[23px]"
                    style={{
                        fontSize: '22.05px',
                        ...entryStyle(200)
                    }}
                >
                    So that you can...
                </p>
            </div>
        </section>
    )
}
