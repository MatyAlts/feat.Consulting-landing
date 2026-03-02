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
}

export default function MobileLayout({ isDesktopContainer = false }: MobileLayoutProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const [hasEnteredServices, setHasEnteredServices] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Habilitar drag to scroll para desktop emulation
  useDragScroll(mainRef, isDesktopContainer)

  // Marca la primera vez que el usuario entra a Services.
  // Esto evita la condición de carrera donde isInHero se vuelve false
  // antes de que el IntersectionObserver dispare el step 0.
  useEffect(() => {
    if (!hasEnteredServices && activeStep >= 0 && activeStep <= 20) {
      setHasEnteredServices(true)
    }
  }, [activeStep, hasEnteredServices])

  // El snap está habilitado si:
  // 1. Estamos en las secciones de Services (step 0 al 20)
  // 2. O si estamos en el Hero (step -1 y aún no hemos entrado a Services)
  // 3. O en la sección Approach (steps 50-60)
  const isSnapDisabled = !(
    (activeStep >= 0 && activeStep <= 20) ||
    (activeStep >= 50 && activeStep <= 60) ||
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
        <MobileHero />

        <MobileServices onStepChange={setActiveStep} />

        <MobileDecisionStage onStepChange={setActiveStep} />

        <MobileApproach />

        <section className="min-h-[100dvh] bg-[#FCFAF3]">
          <MobileAbout />
        </section>
        <section className="min-h-[100dvh] bg-[#FCFAF3]">
          <MobileContact />
        </section>
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
