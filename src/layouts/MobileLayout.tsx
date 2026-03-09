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
  showForm?: boolean;
  enableHeroEntryAnimation?: boolean;
}
const HARD_TOP_JUMP_KEY = 'storyHardTopJumpTs'
const ANCHOR_JUMP_BYPASS_KEY = 'storyAnchorJumpTs'

export default function MobileLayout({
  isDesktopContainer = false,
  showForm = false,
  enableHeroEntryAnimation = true
}: MobileLayoutProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const [isStorySnapEnabled, setIsStorySnapEnabled] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const ctaBoundaryReleasedRef = useRef(false)

  // Habilitar drag to scroll para desktop emulation
  useDragScroll(mainRef, isDesktopContainer)

  // Handle scroll restoration and preservation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }

    const mainElement = mainRef.current;
    if (!mainElement) return;

    const scrollKey = 'scrollPos_home';
    const hardTopJumpTsRaw = sessionStorage.getItem(HARD_TOP_JUMP_KEY)
    const hardTopJumpActive = (() => {
      if (!hardTopJumpTsRaw) return false
      const hardTopJumpTs = Number(hardTopJumpTsRaw)
      return Number.isFinite(hardTopJumpTs) && Date.now() - hardTopJumpTs < 1200
    })()

    // 1. If we are entering a view that is NOT the form, check for saved position
    if (!showForm) {
      if (hardTopJumpActive) {
        mainElement.scrollTo(0, 0)
        sessionStorage.removeItem(scrollKey)
      } else {
      // Check for a cross-route scroll target
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
  }, [showForm]);

  useEffect(() => {
    if (showForm) return

    const main = mainRef.current
    if (!main) return
    let previousTop = main.scrollTop

    const updateSnapBoundary = () => {
      const hardTopBypassTsRaw = sessionStorage.getItem(HARD_TOP_JUMP_KEY)
      if (hardTopBypassTsRaw) {
        const bypassTs = Number(hardTopBypassTsRaw)
        const bypassActive = Number.isFinite(bypassTs) && Date.now() - bypassTs < 1200
        if (bypassActive) {
          setIsStorySnapEnabled(false)
          return
        }
        sessionStorage.removeItem(HARD_TOP_JUMP_KEY)
      }

      const anchorJumpBypassActive = sessionStorage.getItem(ANCHOR_JUMP_BYPASS_KEY) === '1'
      if (anchorJumpBypassActive) {
        setIsStorySnapEnabled(false)
        return
      }

      const firstStorySection = document.querySelector('#direction') as HTMLElement | null
      const ctaBoundarySection = document.querySelector('#how-does-this-happen') as HTMLElement | null
      const normalScrollStartSection = document.querySelector('#strategy') as HTMLElement | null
      if (!firstStorySection || !ctaBoundarySection || !normalScrollStartSection) return

      const snapStartTop = Math.max(0, firstStorySection.offsetTop)
      const ctaBoundaryTop = Math.max(0, ctaBoundarySection.offsetTop)
      const normalScrollStartTop = Math.max(0, normalScrollStartSection.offsetTop)

      const enterSnapThreshold = Math.max(0, snapStartTop - 12)
      const exitToHeroThreshold = Math.max(0, snapStartTop - 84)
      const disableSnapAtNormalThreshold = Math.max(0, normalScrollStartTop - 12)
      const reenableSnapFromNormalThreshold = Math.max(0, normalScrollStartTop - 96)
      const currentTop = main.scrollTop
      const scrollDelta = currentTop - previousTop
      previousTop = currentTop

      if (currentTop <= exitToHeroThreshold) {
        ctaBoundaryReleasedRef.current = false
      }

      // Re-entry reset: when user comes back up to CTA boundary, arm snap zone again.
      if (ctaBoundaryReleasedRef.current && scrollDelta < 0 && currentTop <= ctaBoundaryTop + 12) {
        ctaBoundaryReleasedRef.current = false
      }

      // Downward release: once user pushes down from CTA, keep snap disabled until reset above.
      if (!ctaBoundaryReleasedRef.current && currentTop >= ctaBoundaryTop - 10 && scrollDelta > 0) {
        ctaBoundaryReleasedRef.current = true
      }

      if (ctaBoundaryReleasedRef.current && currentTop < normalScrollStartTop + 12) {
        setIsStorySnapEnabled(false)
        return
      }

      setIsStorySnapEnabled((prev) => {
        if (prev) {
          if (currentTop <= exitToHeroThreshold) return false
          // Final snap stage can settle, but must release when user keeps pushing down.
          if (currentTop >= ctaBoundaryTop - 10 && scrollDelta > 0) return false
          if (currentTop >= disableSnapAtNormalThreshold) return false
          return true
        }

        if (currentTop >= enterSnapThreshold && currentTop < reenableSnapFromNormalThreshold) return true
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
  }, [showForm])

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
        !showForm ? 'story-snap-main' : '',
        !showForm && isStorySnapEnabled ? 'story-snap-enabled' : '',
      ].filter(Boolean).join(' ')}
      >
        {showForm ? (
          <ContactForm />
        ) : (
          <>
            <MobileHero animateEntry={enableHeroEntryAnimation} />
            <MobileServices onStepChange={setActiveStep} />
            <MobileDecisionStage onStepChange={setActiveStep} />
            <MobileApproach onStepChange={setActiveStep} />
            <MobileFAQs />
          </>
        )}
      </main>
      {!isDesktopContainer && !showForm && <StickyFooter />}
    </div>
  )
}
