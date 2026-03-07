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
const HARD_TOP_JUMP_KEY = 'storyHardTopJumpTs'

export default function MobileLayout({ isDesktopContainer = false, showStrategy = false, showForm = false }: MobileLayoutProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const [isStorySnapEnabled, setIsStorySnapEnabled] = useState(false)
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
    const hardTopJumpTsRaw = sessionStorage.getItem(HARD_TOP_JUMP_KEY)
    const hardTopJumpActive = (() => {
      if (!hardTopJumpTsRaw) return false
      const hardTopJumpTs = Number(hardTopJumpTsRaw)
      return Number.isFinite(hardTopJumpTs) && Date.now() - hardTopJumpTs < 1200
    })()

    // 1. If we are entering a view that is NOT the form, check for saved position
    if (!showForm) {
      if (!showStrategy && hardTopJumpActive) {
        mainElement.scrollTo(0, 0)
        sessionStorage.removeItem(scrollKey)
      } else {
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
    }

    // 2. Save scroll position only when leaving a non-form view
    return () => {
      if (!showForm) {
        sessionStorage.setItem(scrollKey, mainElement.scrollTop.toString());
      }
    };
  }, [showForm, showStrategy]);

  useEffect(() => {
    const isHomeStoryRoute = !showStrategy && !showForm
    if (!isHomeStoryRoute) return

    const main = mainRef.current
    if (!main) return

    const updateSnapBoundary = () => {
      const bypassTsRaw = sessionStorage.getItem(HARD_TOP_JUMP_KEY)
      if (bypassTsRaw) {
        const bypassTs = Number(bypassTsRaw)
        const bypassActive = Number.isFinite(bypassTs) && Date.now() - bypassTs < 1200
        if (bypassActive) {
          setIsStorySnapEnabled(false)
          return
        }
        sessionStorage.removeItem(HARD_TOP_JUMP_KEY)
      }

      const firstStorySection = document.querySelector('#direction') as HTMLElement | null
      if (!firstStorySection) return

      const boundaryTop = Math.max(0, firstStorySection.offsetTop)
      const enterThreshold = Math.max(0, boundaryTop - 12)
      const exitThreshold = Math.max(0, boundaryTop - 84)
      const currentTop = main.scrollTop

      setIsStorySnapEnabled((prev) => {
        if (prev) {
          if (currentTop <= exitThreshold) return false
          return true
        }

        if (currentTop >= enterThreshold) return true
        return false
      })
    }

    // Run after layout settles (hero + services mount).
    const rafId = requestAnimationFrame(updateSnapBoundary)
    main.addEventListener('scroll', updateSnapBoundary, { passive: true })
    window.addEventListener('resize', updateSnapBoundary)

    return () => {
      cancelAnimationFrame(rafId)
      main.removeEventListener('scroll', updateSnapBoundary)
      window.removeEventListener('resize', updateSnapBoundary)
    }
  }, [showStrategy, showForm])

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
        !showStrategy && !showForm ? 'story-snap-main' : '',
        !showStrategy && !showForm && isStorySnapEnabled ? 'story-snap-enabled' : '',
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
