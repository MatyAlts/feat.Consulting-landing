import { useState, useEffect } from 'react'
import Logo from '../shared/Logo'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import flechaIcon from '../../assets/icons/flecha.svg'
import { useNavigate, useLocation } from 'react-router-dom'

interface MobileNavbarProps {
  forceHide?: boolean
}

export default function MobileNavbar({ forceHide = false }: MobileNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollDir, isAtTop, isInHero } = useScrollDirection()
  const navigate = useNavigate()
  const location = useLocation()

  const isHidden = !isMenuOpen && scrollDir === 'down' && (forceHide || (!isAtTop && !isInHero))

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const handleNavClick = (title: string) => {
    setIsMenuOpen(false)
    
    const navMap: Record<string, { path: string, hash: string }> = {
      'Direction': { path: '/', hash: '#direction' },
      'System': { path: '/strategy', hash: '#system' },
      'In Practice': { path: '/strategy', hash: '#in-practice' },
      'Entry Points': { path: '/strategy', hash: '#entry-points' },
      'Impact': { path: '/strategy', hash: '#impact' },
      'FAQs': { path: '/strategy', hash: '#faqs' },
    }

    const target = navMap[title]
    if (!target) return

    if (location.pathname === target.path) {
      if (target.hash) {
        const el = document.querySelector(target.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      navigate(target.path + target.hash)
    }
  }

  // Effect to scroll to hash after navigation
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [location])

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
          className="flex flex-col justify-center items-center w-11 h-11 -mr-0.5 relative z-50 group"
          aria-label="Abrir menú"
        >
          <span className={`absolute w-3.5 h-[1.2px] bg-brand-dark transition-transform duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
          <span className={`absolute w-3.5 h-[1.2px] bg-brand-dark transition-transform duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'rotate-90'}`} />
        </button>
      </header>

      {/* 2. Menú de apertura con efecto 'Wipe' para el Logo — z-60 */}
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
              className="flex flex-col justify-center items-center w-11 h-11 -mr-0.5 relative z-50 group"
              aria-label="Cerrar menú"
            >
              <span className={`absolute w-3.5 h-[1.2px] bg-white/90 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
              <span className={`absolute w-3.5 h-[1.2px] bg-white/90 transition-transform duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'rotate-90'}`} />
            </button>
          </div>

          <div className="absolute top-[60px] left-0 w-full h-[0.5px] bg-white/10" />

          {/* Contenido de Navegación */}
          <div className={[
            "absolute left-[22px] top-[95px] w-[calc(100%-44px)] flex flex-col justify-between h-[calc(100vh-140px)] overflow-hidden",
            "transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          ].join(' ')}>
            <nav className="self-stretch flex flex-col justify-start items-start gap-5">
              {[
                { title: 'Direction', desc: 'Where scale is stalling, and what actually drives it.' },
                { title: 'System', desc: 'How aligned decisions become durable growth.' },
                { title: 'In Practice', desc: 'What installed direction looks like in practice.' },
                { title: 'Entry Points', desc: 'Different ways to engage, depending on where you are.' },
                { title: 'Impact', desc: 'What shifts inside your company when alignment is real.' },
                { title: 'FAQs', desc: 'Clarity around scope, timelines, and a little more about how we work.' },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavClick(item.title)}
                  className="w-full flex flex-col group text-left"
                >
                  <span className="text-white text-xl font-normal font-['Fustat'] leading-tight group-active:text-indigo-200 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-indigo-200 text-[15px] font-light font-['Lato'] leading-tight mt-0.5 opacity-70">
                    {item.desc}
                  </span>
                </button>
              ))}
            </nav>

            {/* Footer de contacto */}
            <div className="w-full pb-8">
              <div className="flex flex-col justify-start items-start gap-1">
                <span className="text-indigo-200 text-[15px] font-light font-['Lato'] opacity-60">
                  Ready to get growing?
                </span>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/contact')
                  }}
                  className="flex items-center gap-3 group text-left"
                >
                  <span className="text-white text-[40px] font-normal font-['Fustat'] tracking-tight group-active:text-indigo-200 transition-colors">
                    Let's talk
                  </span>
                  <img
                    src={flechaIcon}
                    alt="Arrow"
                    className="w-[22px] h-[22px] transition-transform group-active:translate-x-1 group-active:-translate-y-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
