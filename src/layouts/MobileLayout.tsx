import { useState } from 'react'
import MobileNavbar from '../components/mobile/Navbar'
import MobileHero from '../components/mobile/Hero'
import MobileServices from '../components/mobile/Services'
import MobileAbout from '../components/mobile/About'
import MobileContact from '../components/mobile/Contact'
import MobileFooter from '../components/mobile/Footer'
import MobileDecisionStage from '../components/mobile/DecisionStage'
import MobileApproach from '../components/mobile/Approach'
import StickyFooter from '../components/mobile/StickyFooter'
import { useScrollDirection } from '../hooks/useScrollDirection'

export default function MobileLayout() {
  const [activeStep, setActiveStep] = useState(0)
  const { isInHero } = useScrollDirection()

  // El snap está habilitado si:
  // 1. Estamos en las secciones de Services (step 0 al 20)
  // 2. O si estamos en el Hero (step -1 y isInHero), para capturar el primer snap
  // 3. O en la sección Approach (steps 50-60, arbitrariamente)
  const isSnapDisabled = !(
    (activeStep >= 0 && activeStep <= 20) ||
    (activeStep >= 50 && activeStep <= 60) ||
    (activeStep === -1 && isInHero)
  )

  return (
    <div
      className="flex flex-col overflow-hidden bg-[#FCFAF3]"
      style={{ height: '100dvh' }}
    >
      <MobileNavbar forceHide={activeStep >= 1 && activeStep <= 20} />
      <main className={[
        'flex-1 overflow-y-auto scroll-smooth hide-scrollbar',
        isSnapDisabled ? '' : 'snapping-locked'
      ].join(' ')}
      >
        <MobileHero />

        <MobileServices onStepChange={setActiveStep} />

        <MobileDecisionStage onStepChange={setActiveStep} />

        <MobileApproach onStepChange={setActiveStep} />

        <section className="min-h-[100dvh] bg-[#FCFAF3]">
          <MobileAbout />
        </section>
        <section className="min-h-[100dvh] bg-[#FCFAF3]">
          <MobileContact />
        </section>
        <section className="bg-[#FCFAF3]">
          <MobileFooter />
        </section>
      </main>
      <StickyFooter />
    </div>
  )
}
