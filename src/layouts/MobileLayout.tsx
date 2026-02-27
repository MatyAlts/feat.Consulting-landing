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
  const { scrollDir } = useScrollDirection()

  // El snap está habilitado si:
  // 1. Estamos antes de "How?" (step < 19)
  // 2. Estamos en "How?" PERO subiendo (queremos capturarlo de nuevo para encajarlo)
  const isSnapDisabled = !(activeStep < 19 || (activeStep === 19 && scrollDir === 'up'))

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FCFAF3]">
      <MobileNavbar />
      <main className={[
        'flex-1 overflow-y-auto h-full scroll-smooth hide-scrollbar',
        isSnapDisabled ? '' : 'snapping-locked'
      ].join(' ')}
      >
        <section className="snap-start snap-always min-h-screen bg-[#FCFAF3]">
          <MobileHero />
        </section>
        
        <MobileServices onStepChange={setActiveStep} />
        
        <MobileDecisionStage />

        <MobileApproach />

        <section className="min-h-screen bg-[#FCFAF3]">
          <MobileAbout />
        </section>
        <section className="min-h-screen bg-[#FCFAF3]">
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
