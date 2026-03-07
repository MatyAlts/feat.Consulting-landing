import { useState, useEffect } from 'react'
import Logo from '../shared/Logo'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import flechaIcon from '../../assets/icons/flecha.svg'
import { useNavigate, useLocation } from 'react-router-dom'

interface MobileNavbarProps {
  forceHide?: boolean
}

const MENU_ITEMS = [
  { title: 'Direction', desc: 'Where scale is stalling, and what actually drives it.' },
  { title: 'System', desc: 'How aligned decisions become durable growth.' },
  { title: 'In Practice', desc: 'What installed direction looks like in practice.' },
  { title: 'Entry Points', desc: 'Different ways to engage, depending on where you are.' },
  { title: 'Impact', desc: 'What shifts inside your company when alignment is real.' },
  { title: 'FAQs', desc: 'Clarity around scope, timelines, and a little more about how we work.' },
]

export default function MobileNavbar({ forceHide = false }: MobileNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollDir, isAtTop, isInHero } = useScrollDirection()
  const navigate = useNavigate()
  const location = useLocation()

  const isHidden = !isMenuOpen && scrollDir === 'down' && (forceHide || (!isAtTop && !isInHero))

  // Bloquea el scroll del body cuando el menu esta abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleNavClick = (title: string) => {
    setIsMenuOpen(false)

    const navMap: Record<string, { path: string, hash: string }> = {
      Direction: { path: '/', hash: '#direction' },
      System: { path: '/strategy', hash: '#system' },
      'In Practice': { path: '/strategy', hash: '#in-practice' },
      'Entry Points': { path: '/strategy', hash: '#entry-points' },
      Impact: { path: '/strategy', hash: '#impact' },
      FAQs: { path: '/strategy', hash: '#faqs' },
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
      <header
        className={[
          'fixed top-0 left-0 right-0 z-40',
          'flex items-center justify-between',
          'px-5 bg-[#FCFAF3] border-b border-brand-dark/10',
          'transition-transform duration-300 ease-in-out',
          isHidden ? '-translate-y-full' : 'translate-y-0',
        ].join(' ')}
        style={{ height: 'var(--mobile-nav-header-height)' }}
      >
        <button
          onClick={() => {
            if (location.pathname === '/') {
              document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              navigate('/')
            }
          }}
          className="flex items-center"
          aria-label="Ir al inicio"
        >
          <div
            className="origin-left"
            style={{ transform: 'scale(var(--mobile-nav-logo-scale))' }}
          >
            <Logo width={21} height={23.16} variant="dark" />
          </div>
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col justify-center items-center w-11 h-11 -mr-0.5 relative z-50 group"
          aria-label="Abrir menu"
        >
          <span className={`absolute w-3.5 h-[1.2px] bg-brand-dark transition-transform duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
          <span className={`absolute w-3.5 h-[1.2px] bg-brand-dark transition-transform duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'rotate-90'}`} />
        </button>
      </header>

      <div
        className={[
          'fixed inset-0 z-60 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-menu-shell w-full h-full relative bg-white flex flex-col">
          <div className="absolute inset-0 mix-blend-multiply bg-[#171425] backdrop-blur-[2.55px]" />

          <div
            className={[
              'relative px-5 flex items-center justify-between z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
              isMenuOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
            style={{ height: 'var(--mobile-nav-header-height)' }}
          >
            <div
              className="origin-left"
              style={{ transform: 'scale(var(--mobile-nav-logo-scale))' }}
            >
              <Logo width={21} height={23.16} variant="light" />
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex flex-col justify-center items-center w-11 h-11 -mr-0.5 relative z-50 group"
              aria-label="Cerrar menu"
            >
              <span className={`absolute w-3.5 h-[1.2px] bg-white/90 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
              <span className={`absolute w-3.5 h-[1.2px] bg-white/90 transition-transform duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'rotate-90'}`} />
            </button>
          </div>

          <div className="w-full h-[0.5px] bg-white/10 relative z-50" />

          <div
            className={[
              'mobile-menu-panel relative z-50 flex-1 min-h-0 h-full px-[22px] overflow-hidden flex flex-col',
              'transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
              isMenuOpen ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
            style={{ paddingTop: 'var(--mobile-menu-panel-top-padding)' }}
          >
            <nav
              className="flex min-h-0 flex-1 flex-col justify-start items-start self-stretch overflow-hidden"
              style={{ gap: 'calc(20px * var(--mobile-menu-space-factor))' }}
            >
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavClick(item.title)}
                  className="w-full flex flex-col group text-left"
                >
                  <span
                    className="text-white font-normal font-['Fustat'] group-active:text-indigo-200 transition-colors leading-tight"
                    style={{ fontSize: 'calc(20px * var(--mobile-menu-title-factor))' }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="text-indigo-200 font-light font-['Lato'] opacity-70 leading-tight"
                    style={{
                      marginTop: 'calc(2px * var(--mobile-menu-space-factor))',
                      fontSize: 'calc(15px * var(--mobile-menu-desc-factor))',
                    }}
                  >
                    {item.desc}
                  </span>
                </button>
              ))}
            </nav>

            <div
              className="w-full mt-auto shrink-0"
              style={{
                paddingTop: 'calc(8px * var(--mobile-menu-space-factor))',
                paddingBottom: 'var(--mobile-menu-cta-bottom-space)',
              }}
            >
              <div
                className="flex flex-col justify-start items-start"
                style={{ gap: 'calc(2px * var(--mobile-menu-space-factor))' }}
              >
                <span
                  className="text-indigo-200 font-light font-['Lato'] opacity-60"
                  style={{ fontSize: 'calc(15px * var(--mobile-menu-desc-factor))' }}
                >
                  Ready to get growing?
                </span>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate('/contact')
                  }}
                  className="flex items-center group text-left"
                  style={{ gap: 'calc(12px * var(--mobile-menu-space-factor))' }}
                >
                  <span
                    className="text-white font-normal font-['Fustat'] tracking-tight group-active:text-indigo-200 transition-colors"
                    style={{ fontSize: 'calc(clamp(32px, 10vw, 40px) * var(--mobile-menu-cta-factor))' }}
                  >
                    Let's talk
                  </span>
                  <img
                    src={flechaIcon}
                    alt="Arrow"
                    className="transition-transform group-active:translate-x-1 group-active:-translate-y-1"
                    style={{
                      width: 'calc(22px * var(--mobile-menu-cta-factor))',
                      height: 'calc(22px * var(--mobile-menu-cta-factor))',
                    }}
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
