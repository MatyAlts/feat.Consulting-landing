import { useState, useEffect } from 'react'
import Logo from '../shared/Logo'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import flechaIcon from '../../assets/icons/flecha.svg'



interface MobileNavbarProps {
  forceHide?: boolean
}

export default function MobileNavbar({ forceHide = false }: MobileNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollDir, isAtTop, isInHero } = useScrollDirection()

  const isHidden = !isMenuOpen && scrollDir === 'down' && (forceHide || (!isAtTop && !isInHero))

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <>
      {/* 1. Header Estático (Fondo y Logo Oscuro) - z-40 (Debajo del menú) */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-40',
          'flex items-center justify-between',
          'h-[60px] px-5 bg-[#FCFAF3] border-b border-brand-dark/10',
          'transition-transform duration-300 ease-in-out',
          isHidden ? '-translate-y-full' : 'translate-y-0',
        ].join(' ')}
      >
        <div className="flex items-center">
          <Logo width={21} height={23.16} variant="dark" />
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col justify-center items-center w-6 h-6 mr-2 relative z-50 group"
          aria-label="Abrir menú"
        >
          <span className={`absolute w-5 h-[1.2px] bg-brand-dark transition-transform duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
          <span className={`absolute w-5 h-[1.2px] bg-brand-dark transition-transform duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'rotate-90'}`} />
        </button>
      </header>

      {/* 2. Menú de apertura con efecto 'Wipe' para el Logo - z-60 */}
      <div
        className={[
          'fixed inset-0 z-60 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!isMenuOpen}
      >
        {/* Contenedor que compensa el movimiento para mantener el logo 'fijo' mientras el fondo se barre */}
        <div className="w-full h-full relative bg-white">
          {/* Layer 1: Overlay Multiplicativo */}
          <div className="absolute w-[539px] h-[908px] left-[-44.97px] top-[-23px] mix-blend-multiply bg-[#171425] backdrop-blur-[2.55px]" />

          {/* Header Replicado (Logo Blanco con contra-animación) */}
          <div
            className={[
              'absolute top-0 left-0 right-0 h-[60px] px-5 flex items-center justify-between z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            ].join(' ')}
          >
            <Logo width={21} height={23.16} variant="light" />

            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex flex-col justify-center items-center w-6 h-6 mr-2 relative z-50 group"
              aria-label="Cerrar menú"
            >
              <span className={`absolute w-6 h-[1.2px] bg-white/90 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
              <span className={`absolute w-6 h-[1.2px] bg-white/90 transition-transform duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'rotate-90'}`} />
            </button>
          </div>

          <div className="absolute top-[60px] left-0 w-full h-[0.5px] bg-white/10" />

          {/* Contenido de Navegación */}
          <div className="absolute left-[22px] top-[95px] w-[calc(100%-44px)] flex flex-col justify-start items-start gap-6 h-[calc(100%-140px)] overflow-y-auto hide-scrollbar">
            <nav className="self-stretch flex flex-col justify-start items-start gap-6">
              {[
                { title: 'Direction', desc: 'How we think about growth, and why force is never the answer.' },
                { title: 'Mechanism', desc: 'How validated direction becomes structure, and structure becomes leverage.' },
                { title: 'Work', desc: 'What installed direction looks like in practice.' },
                { title: 'Entry Points', desc: 'Different ways to engage, depending on where you are.' },
                { title: 'What Changes', desc: 'What shifts inside your company when alignment is real.' },
                { title: 'FAQs', desc: 'Clarity around scope, timelines, and a little more about how we work.' },
              ].map((item) => (
                <a
                  key={item.title}
                  href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex flex-col group"
                >
                  <span className="text-white text-xl font-normal font-['Fustat'] leading-tight group-active:text-indigo-200 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-indigo-200 text-[15.69px] font-light font-['Lato'] leading-tight mt-1 opacity-70">
                    {item.desc}
                  </span>
                </a>
              ))}
              <div className="self-stretch h-px border-t border-indigo-200/20 my-2" />
            </nav>

            {/* Footer de contacto */}
            <div className="mt-auto w-full pt-10 pb-20">
              <div className="flex flex-col justify-start items-start gap-1">
                <span className="text-indigo-200 text-[15.69px] font-light font-['Lato'] opacity-60">
                  Want to get in contact?
                </span>
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4.5 group"
                >
                  <span className="text-white text-[41.81px] font-normal font-['Fustat'] tracking-tight group-active:text-indigo-200 transition-colors">
                    Let’s talk
                  </span>
                  <img
                    src={flechaIcon}
                    alt="Arrow"
                    className="w-[23.5px] h-[23.5px] transition-transform group-active:translate-x-1 group-active:-translate-y-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
