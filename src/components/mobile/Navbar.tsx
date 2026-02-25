import { useState, useEffect } from 'react'
import Logo from '../shared/Logo'
import { useScrollDirection } from '../../hooks/useScrollDirection'

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollDir, isAtTop } = useScrollDirection()

  const isHidden = scrollDir === 'down' && !isAtTop && !isMenuOpen

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'flex items-center justify-between',
          'h-[60px]',
          'bg-[#FCFAF3] border-b border-brand-dark/10',
          'transition-transform duration-300 ease-in-out',
          isHidden ? '-translate-y-full' : 'translate-y-0',
        ].join(' ')}
      >
        <div className="px-5">
          <Logo width={21} height={23.16} />
        </div>

        <button
          onClick={() => setIsMenuOpen(prev => !prev)}
          className="flex flex-col justify-center items-center w-[14px] h-[14px] mr-[20px] relative"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
        >
          <span
            className={[
              'absolute w-full h-[1.5px] bg-brand-dark',
              'transition-all duration-300',
              isMenuOpen ? 'rotate-45' : 'rotate-0',
            ].join(' ')}
          />
          <span
            className={[
              'absolute w-full h-[1.5px] bg-brand-dark',
              'transition-all duration-300',
              isMenuOpen ? '-rotate-45' : 'rotate-90',
            ].join(' ')}
          />
        </button>
      </header>

      {/* Menú overlay - Animación desde la derecha */}
      <div
        className={[
          'fixed inset-0 z-40 bg-[#FCFAF3]',
          'flex flex-col pt-32 px-8',
          'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-brand-muted text-sm uppercase tracking-widest font-medium">Get in touch</span>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-brand-dark text-5xl font-medium tracking-tight"
            >
              Let’s talk ↗
            </a>
          </div>

          <div className="h-px bg-brand-dark/10 w-full" />

          <div className="flex flex-col gap-8">
            <span className="text-brand-muted text-sm uppercase tracking-widest font-medium">Navigation</span>
            {['Services', 'About', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-brand-dark text-3xl font-normal hover:text-brand-muted transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-auto pb-12">
          <p className="text-brand-muted text-sm">© 2026 feat.Consulting</p>
        </div>
      </div>
    </>
  )
}
