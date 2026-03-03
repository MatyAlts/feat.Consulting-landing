import { useState, useEffect } from 'react'
import MobileLayout from './MobileLayout'
import logoBlanco from '../assets/icons/LOGO BLANCO.svg'
import flechaIcon from '../assets/icons/flecha.svg'
import qrCode from '../assets/desktop/qr.png'
import mobileSimulated from '../assets/desktop/mobile_simulated.png'
import Logo from '../components/shared/Logo'

/* ── Design-base constants (designed at 1920 × 1080) ── */
const BASE_W = 1920
const BASE_H = 1080

/** Hook: returns a CSS scale factor so the 1920×1080 artboard fits any viewport */
function useDesktopScale() {
  const [scale, setScale] = useState(() => {
    const sx = window.innerWidth / BASE_W
    const sy = window.innerHeight / BASE_H
    return Math.min(sx, sy)
  })

  useEffect(() => {
    const onResize = () => {
      const sx = window.innerWidth / BASE_W
      const sy = window.innerHeight / BASE_H
      setScale(Math.min(sx, sy))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return scale
}

export default function DesktopLayout({ showStrategy = false }: { showStrategy?: boolean }) {
  const [showMobile, setShowMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const scale = useDesktopScale()

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#020A30] flex items-center justify-center">
      
      {/* ─── Landing Screen ──────────────────────────────────────────────────────── */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${!showMobile ? 'opacity-100' : 'opacity-0 pointer-events-none scale-95 blur-sm'}`}
      >
        {/* Outer sizer — takes up exactly the scaled artboard dimensions so flex centering works */}
        <div style={{ width: `${BASE_W * scale}px`, height: `${BASE_H * scale}px`, flexShrink: 0 }}>
          {/* Inner artboard — 1920×1080 scaled from top-left */}
          <div
            style={{
              width: `${BASE_W}px`,
              height: `${BASE_H}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'relative',
            }}
          >
            {/* ── Left column: Logo → Headline → QR + Scan label ── */}
            <div
              className="absolute flex flex-col"
              style={{ left: '92px', top: '80px' }}
            >
              {/* Logo 29.71 × 32.77 */}
              <img
                src={logoBlanco}
                alt="feat. Consulting"
                style={{ width: '29.71px', height: '32.77px', flexShrink: 0 }}
              />

              {/* Headline — 85 px below logo */}
              <div style={{ marginTop: '85px', maxWidth: '730px' }}>
                <p
                  style={{
                    fontFamily: 'Fustat, sans-serif',
                    fontWeight: 400,
                    fontSize: '64.89px',
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  We designed this for how how people{' '}
                  <span
                    style={{
                      fontFamily: '"Lato", sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: '#B7A9FF',
                    }}
                  >
                    actually
                  </span>
                  {' '}decide.
                </p>
              </div>

              {/* QR + "Scan to continue on mobile." — side by side */}
              <div style={{ marginTop: '33px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={qrCode}
                  alt="Escanea el QR para continuar en móvil"
                  style={{ width: '150px', height: '150px', flexShrink: 0 }}
                />
                <p
                  style={{
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: 300,
                    fontSize: '32.4px',
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  Scan to<br />
                  continue<br />
                  on mobile.
                </p>
              </div>
            </div>

            {/* ── Mobile simulated image — right-side, bottom-anchored, 50 % opacity ── */}
            <div
              className="absolute"
              style={{
                right: '120px',
                bottom: 0,
                width: '550px',
              }}
            >
              <img
                src={mobileSimulated}
                alt=""
                style={{
                  width: '100%',
                  height: 'auto',
                  opacity: 0.5,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              {/* Gradient overlay — fades the bottom of the phone into the background */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '40%',
                  background: 'linear-gradient(to bottom, transparent 0%, #020A30 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ── "Prefer to stay on Desktop?" — centred with phone ── */}
            <p
              className="absolute whitespace-nowrap"
              style={{
                fontFamily: '"Lato", sans-serif',
                fontWeight: 300,
                fontSize: '22.77px',
                color: '#FFFFFF',
                bottom: '100px',
                /* phone centre = right:120 + 550/2 = 395 from right */
                right: '395px',
                transform: 'translateX(50%)',
                margin: 0,
              }}
            >
              Prefer to stay on Desktop?
            </p>

            {/* ── "Click here →" button — centred with phone, pill-shaped ── */}
            <button
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              onClick={() => setShowMobile(true)}
              className="absolute"
              style={{
                bottom: '40px',
                right: '395px',
                transform: 'translateX(50%)',
                paddingLeft: btnHovered ? '52px' : '32px',
                paddingRight: btnHovered ? '52px' : '32px',
                height: '52px',
                backgroundColor: btnHovered ? '#C6D7F9' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.30)',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 380ms cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: '"Lato", sans-serif',
                  fontWeight: 300,
                  fontSize: '20px',
                  color: btnHovered ? '#0A0B26' : '#FFFFFF',
                  transition: 'color 380ms ease',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.3px',
                }}
              >
                Click here →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Container Screen ────────────────────────────────────────── */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${showMobile ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-105'}`}
      >
        {/* Outer sizer — takes up exactly the scaled artboard dimensions so flex centering works */}
        <div style={{ width: `${BASE_W * scale}px`, height: `${BASE_H * scale}px`, flexShrink: 0 }}>
          {/* Inner artboard — 1920×1080 scaled from top-left */}
          <div
            style={{
              width: `${BASE_W}px`,
              height: `${BASE_H}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'relative',
            }}
          >
            {/* Logo */}
            <img 
              src={logoBlanco} 
              alt="feat. logo" 
              className="absolute" 
              style={{ top: '35.66px', left: '87px', width: '35px', height: '38.6px' }} 
            />

            <button
              onClick={() => setIsMenuOpen(true)}
              className="absolute flex items-center justify-center text-[#FFFFFF] font-light cursor-pointer hover:opacity-80 transition-opacity"
              style={{ top: '41.42px', right: '89.17px', fontSize: '16.17px', lineHeight: 1 }}
              aria-label="Abrir menú"
            >
              +
            </button>

            {/* Device Emulator Container */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 shadow-2xl rounded-t-[35px] bg-[#FCFAF3] flex flex-col overflow-hidden transition-all duration-1000 delay-300 ${showMobile ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ bottom: '0px', width: '450px', height: '760px' }}
            >
              <div className="shrink-0 flex items-center bg-[#FCFAF3] z-50 border-b border-brand-dark/10" style={{ height: '60px', paddingLeft: '23px' }}>
                <Logo width={23} height={26} variant="dark" />
              </div>
              <div className="flex-1 relative overflow-hidden">
                {/* Render MobileLayout only when showMobile is true to avoid unnecessary background load if possible, 
                    OR render it always but let it handle its own state. 
                    Given the request for fluidez, we render it but control visibility. */}
                <MobileLayout isDesktopContainer={true} showStrategy={showStrategy} />
              </div>
            </div>

            {/* Bottom-right CTA */}
            <p 
              className="absolute whitespace-nowrap" 
              style={{ 
                color: '#C6D7F9', 
                fontFamily: 'Lato', 
                fontWeight: 300, 
                fontSize: '18.21px', 
                bottom: '95.46px',
                right: '154px',
                lineHeight: 1
              }}
            >
              Ready to get growing?
            </p>

            <a 
              href="#contact"
              className="absolute flex items-center cursor-pointer group hover:opacity-80 transition-opacity" 
              style={{ right: '164px', bottom: '36px', textDecoration: 'none' }}
            >
              <span style={{ color: '#FFFFFF', fontFamily: 'Fustat', fontWeight: 300, fontSize: '41.81px', lineHeight: 1 }}>
                Let's talk
              </span>
            </a>

            <img 
              src={flechaIcon} 
              alt="Arrow" 
              className="absolute" 
              style={{ bottom: '48.89px', right: '121.03px', width: '23.5px', height: '23.5px' }} 
            />
          </div>
        </div>
      </div>

      {/* Full-screen menu overlay — outside the artboard so it covers the entire viewport */}
      <div
        className={[
          'fixed inset-0 z-100 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!isMenuOpen}
      >
        <div className="w-full h-full relative bg-[#020A30]">
          <div className="absolute top-0 left-0 right-0 h-25 flex items-center justify-between z-50" style={{ paddingLeft: '87px', paddingRight: '89.17px' }}>
            <img 
              src={logoBlanco} 
              alt="feat. logo" 
              style={{ width: '35px', height: '38.6px', marginTop: '35.66px' }} 
              className={`absolute top-0 left-21.75 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            />

            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute flex items-center justify-center text-[#FFFFFF] font-light cursor-pointer hover:opacity-80 transition-opacity"
              style={{ top: '41.42px', right: '89.17px', fontSize: '16.17px', lineHeight: 1 }}
              aria-label="Cerrar menú"
            >
              x
            </button>
          </div>

          <div className="absolute top-25 left-0 w-full h-[0.5px] bg-white/10" />

          <div className="w-full h-full flex items-center justify-center pt-25">
            <nav className="flex flex-col justify-center items-center gap-10">
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
                  className="w-full flex flex-col items-center group text-center"
                >
                  <span style={{ fontFamily: 'Fustat' }} className="text-white text-[32px] font-normal leading-tight group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </span>
                  <span style={{ fontFamily: 'Lato' }} className="text-indigo-200 text-[18px] font-light leading-tight mt-2 opacity-70">
                    {item.desc}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
