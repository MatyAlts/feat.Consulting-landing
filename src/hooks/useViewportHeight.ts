import { useEffect } from 'react'

/**
 * Hook para calcular la altura real del viewport en iOS Chrome.
 *
 * El pull-to-refresh de Chrome hace que la medición temprana sea incorrecta
 * porque el spinner empuja el contenido durante la carga. La solución es
 * diferir la medición hasta que el browser se haya "asentado".
 */
export function useViewportHeight() {
    useEffect(() => {
        let rafId: number
        let timeoutId: ReturnType<typeof setTimeout>

        const measureVh = () => {
            const height = window.visualViewport
                ? window.visualViewport.height
                : window.innerHeight
            document.documentElement.style.setProperty('--real-vh', `${height * 0.01}px`)
        }

        // Medición diferida: múltiples intentos para asegurar que el browser
        // haya terminado el pull-to-refresh antes de medir
        const deferredMeasure = () => {
            // Cancelar cualquier intento previo
            cancelAnimationFrame(rafId)
            clearTimeout(timeoutId)

            // Intentar en el próximo frame
            rafId = requestAnimationFrame(() => {
                measureVh()
                // Segundo intento después de 300ms para capturar el estado final
                timeoutId = setTimeout(measureVh, 300)
            })
        }

        // Medición inicial diferida (para cubrir el pull-to-refresh al cargar)
        deferredMeasure()

        // También re-medir cuando el browser termina de animar el PTR
        // El evento 'scroll' se dispara justo cuando el PTR termina y el contenido sube
        const handleScroll = () => deferredMeasure()

        // Eventos de cambio de viewport
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', deferredMeasure)
        }
        window.addEventListener('resize', deferredMeasure)
        window.addEventListener('orientationchange', deferredMeasure)
        // Re-medir al primer scroll del usuario (post-PTR)
        window.addEventListener('scroll', handleScroll, { passive: true, once: true })
        document.addEventListener('scroll', handleScroll, { passive: true, once: true })

        return () => {
            cancelAnimationFrame(rafId)
            clearTimeout(timeoutId)
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', deferredMeasure)
            }
            window.removeEventListener('resize', deferredMeasure)
            window.removeEventListener('orientationchange', deferredMeasure)
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])
}
