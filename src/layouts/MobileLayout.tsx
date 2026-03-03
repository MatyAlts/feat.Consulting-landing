import { useState, useEffect } from 'react'
import MobileNavbar from '../components/mobile/Navbar'
import MobileHero from '../components/mobile/Hero'
import MobileServices from '../components/mobile/Services'
import MobileAbout from '../components/mobile/About'
import MobileContact from '../components/mobile/Contact'
import MobileFooter from '../components/mobile/Footer'
import MobileDecisionStage from '../components/mobile/DecisionStage'
import MobileApproach from '../components/mobile/Approach'
import StickyFooter from '../components/mobile/StickyFooter'
import { useDragScroll } from '../hooks/useDragScroll'
import { useRef } from 'react'

interface MobileLayoutProps {
  isDesktopContainer?: boolean;
  showStrategy?: boolean;
}

export default function MobileLayout({ isDesktopContainer = false, showStrategy = false }: MobileLayoutProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const [hasEnteredServices, setHasEnteredServices] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Habilitar drag to scroll para desktop emulation
  useDragScroll(mainRef, isDesktopContainer)

  // Reset scroll and set manual restoration only ONCE on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [])

  // Keep track of services entry
  useEffect(() => {
    if (!hasEnteredServices && activeStep >= 0 && activeStep <= 20) {
      setHasEnteredServices(true)
    }
  }, [activeStep, hasEnteredServices])

  // El snap está habilitado si:
  // 1. En Strategy: Solo en los pasos de la metodología (50-60)
  // 2. En Home: En Services (0-20) o al inicio del Hero (-1)
  const isSnapDisabled = showStrategy
    ? !(activeStep >= 50 && activeStep <= 60)
    : !(
        (activeStep >= 0 && activeStep <= 20) ||
        (activeStep === -1 && !hasEnteredServices)
      )

  return (
    <div
      className={`flex flex-col overflow-hidden bg-[#FCFAF3] ${isDesktopContainer ? 'h-full w-full' : ''}`}
      style={{ height: isDesktopContainer ? '100%' : '100dvh' }}
    >
      {!isDesktopContainer && <MobileNavbar forceHide={activeStep >= 1 && activeStep <= 20} />}
      <main 
        ref={mainRef}
        className={[
        'flex-1 overflow-y-auto hide-scrollbar',
        isDesktopContainer ? 'emulator-container' : 'scroll-smooth',
        isSnapDisabled ? '' : 'snapping-locked'
      ].filter(Boolean).join(' ')}
      >
        {!showStrategy ? (
          <>
            <MobileHero />
            <MobileServices onStepChange={setActiveStep} />
          </>
        ) : (
          <>
            <MobileDecisionStage onStepChange={setActiveStep} />
            <MobileApproach onStepChange={setActiveStep} />
            <section className="min-h-dvh bg-[#FCFAF3]">
              <MobileAbout />
            </section>
            <section className="min-h-dvh bg-[#FCFAF3]">
              <MobileContact />
            </section>
          </>
        )}
        {!isDesktopContainer && (
          <section className="bg-[#FCFAF3]">
            <MobileFooter />
          </section>
        )}
      </main>
      {!isDesktopContainer && <StickyFooter />}
    </div>
  )
}
