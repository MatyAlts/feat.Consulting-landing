import { useState, useEffect } from 'react'
import MobileNavbar from '../components/mobile/Navbar'
import MobileHero from '../components/mobile/Hero'
import MobileServices from '../components/mobile/Services'
import MobileDecisionStage from '../components/mobile/DecisionStage'
import MobileApproach from '../components/mobile/Approach'
import MobileFAQs from '../components/mobile/FAQs'
import StickyFooter from '../components/mobile/StickyFooter'
import { useDragScroll } from '../hooks/useDragScroll'
import { useRef } from 'react'

import ContactForm from '../components/mobile/ContactForm'

interface MobileLayoutProps {
  isDesktopContainer?: boolean;
  showStrategy?: boolean;
  showForm?: boolean;
}

export default function MobileLayout({ isDesktopContainer = false, showStrategy = false, showForm = false }: MobileLayoutProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const mainRef = useRef<HTMLElement>(null)

  // Habilitar drag to scroll para desktop emulation
  useDragScroll(mainRef, isDesktopContainer)

  // Handle scroll restoration and preservation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }

    const mainElement = mainRef.current;
    if (!mainElement) return;

    const scrollKey = showStrategy ? 'scrollPos_strategy' : 'scrollPos_home';

    // 1. If we are entering a view that is NOT the form, check for saved position
    if (!showForm) {
      // Check for a cross-route scroll target (e.g. navigate('/strategy') with #system anchor)
      const scrollTarget = sessionStorage.getItem('scrollTarget');
      if (scrollTarget) {
        sessionStorage.removeItem('scrollTarget');
        setTimeout(() => {
          const el = document.querySelector(scrollTarget);
          if (el && mainRef.current) {
            mainRef.current.scrollTop = (el as HTMLElement).offsetTop;
          }
        }, 150);
      } else {
        const savedPos = sessionStorage.getItem(scrollKey);
        if (savedPos) {
          // Wait for components (DecisionStage/Services) to have rendered fully
          setTimeout(() => {
            if (mainRef.current) {
              mainRef.current.scrollTo(0, parseInt(savedPos, 10));
              sessionStorage.removeItem(scrollKey);
            }
          }, 100);
        } else {
          // First enter (no saved pos), start at top
          mainElement.scrollTo(0, 0);
        }
      }
    }

    // 2. Save scroll position only when leaving a non-form view
    return () => {
      if (!showForm && mainRef.current) {
        sessionStorage.setItem(scrollKey, mainRef.current.scrollTop.toString());
      }
    };
  }, [showForm, showStrategy]);

  return (
    <div
      className={`flex flex-col overflow-hidden bg-[#FCFAF3] ${isDesktopContainer ? 'h-full w-full' : ''}`}
      style={{ height: isDesktopContainer ? '100%' : '100dvh' }}
    >
      {!isDesktopContainer && !showForm && <MobileNavbar forceHide={activeStep >= 1 && activeStep <= 20} />}
      <main 
        ref={mainRef}
        className={[
        'flex-1 overflow-y-auto hide-scrollbar',
        isDesktopContainer ? 'emulator-container' : 'scroll-smooth',
      ].filter(Boolean).join(' ')}
      >
        {showForm ? (
          <ContactForm />
        ) : !showStrategy ? (
          <>
            <MobileHero />
            <MobileServices onStepChange={setActiveStep} />
          </>
        ) : (
          <>
            <MobileDecisionStage onStepChange={setActiveStep} />
            <MobileApproach onStepChange={setActiveStep} />
            <MobileFAQs />
          </>
        )}
      </main>
      {!isDesktopContainer && !showForm && <StickyFooter isStrategy={showStrategy} />}
    </div>
  )
}
