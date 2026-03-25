import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import Lenis from 'lenis'
import MobileNavbar from '../components/mobile/Navbar'
import MobileHero from '../components/mobile/Hero'
import MobileServices from '../components/mobile/Services'
import MobileDecisionStage from '../components/mobile/DecisionStage'
import MobileApproach from '../components/mobile/Approach'
import DecisionStages from '../components/mobile/DecisionStages'
import MobileFAQs from '../components/mobile/FAQs'
import StickyFooter from '../components/mobile/StickyFooter'
import { useDragScroll } from '../hooks/useDragScroll'
import ContactForm from '../components/mobile/ContactForm'
import { getScrollAnchor, clearScrollAnchor } from '../utils/scrollRestore'

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
        // Prioritize manual scroll anchor from utilities
        const manualSavedPos = getScrollAnchor();
        const autoSavedPos = sessionStorage.getItem(scrollKey);
        const finalSavedPos = manualSavedPos !== null ? manualSavedPos : (autoSavedPos ? parseInt(autoSavedPos, 10) : null);

        if (finalSavedPos !== null) {
          // Wait for components (DecisionStage/Services) to have rendered fully
          setTimeout(() => {
            if (mainRef.current) {
              mainRef.current.scrollTo(0, finalSavedPos);
              sessionStorage.removeItem(scrollKey);
              clearScrollAnchor();
            }
          }, 150); // Increased timeout slightly for safer restoration
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
      const snapEndTrigger = document.querySelector('#snap-end-trigger') as HTMLElement | null
      const normalScrollStartSection = document.querySelector('#strategy') as HTMLElement | null
      if (!firstStorySection || !snapEndTrigger || !normalScrollStartSection) return

      const snapStartTop = Math.max(0, firstStorySection.offsetTop)
      const snapEndTop = Math.max(0, snapEndTrigger.offsetTop)
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

      // Re-entry reset: when user comes back up to snap end, arm snap zone again.
      if (ctaBoundaryReleasedRef.current && scrollDelta < 0 && currentTop <= snapEndTop + 12) {
        ctaBoundaryReleasedRef.current = false
      }

      // Downward release: once user pushes down from snap end, keep snap disabled.
      if (!ctaBoundaryReleasedRef.current && currentTop >= snapEndTop - 10 && scrollDelta > 0) {
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
          if (currentTop >= snapEndTop - 10 && scrollDelta > 0) return false
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

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const decisionRef = useRef<HTMLDivElement>(null);
  const isInDecisionSection = useInView(decisionRef, { margin: "-20% 0px -20% 0px" });

  const isDecisionSnap = activeStep >= 30 && activeStep <= 31;
  const shouldHideChrome = isDecisionSnap || isInDecisionSection;

  // Reset activeStep when near top to avoid stuck states from lower sections
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleScroll = () => {
      if (main.scrollTop < 100 && activeStep > 0) {
        setActiveStep(-1);
      }
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, [activeStep]);

  // Lenis Smooth Scrolling Setup para mobile version
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const contentWrapper = main.querySelector('.lenis-content-wrapper') as HTMLElement;
    if (!contentWrapper) return;

    const lenis = new Lenis({
      wrapper: main,
      content: contentWrapper,
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [showForm]);

  return (
    <div
      className={`flex flex-col overflow-hidden bg-[#FCFAF3] ${isDesktopContainer ? 'h-full w-full' : ''}`}
      style={{ height: isDesktopContainer ? '100%' : '100dvh' }}
    >
      {!isDesktopContainer && !showForm && (
        <MobileNavbar forceHide={shouldHideChrome} />
      )}
      <main 
        ref={mainRef}
        className={[
          'flex-1 overflow-y-auto hide-scrollbar',
          isDesktopContainer ? 'emulator-container' : '',
          !showForm ? 'story-snap-main' : '',
          !showForm && isStorySnapEnabled ? 'story-snap-enabled' : '',
        ].filter(Boolean).join(' ')}
      >
        {showForm ? (
          <div className="lenis-content-wrapper w-full flex flex-col">
            <ContactForm />
          </div>
        ) : (
          <div className="lenis-content-wrapper w-full flex flex-col relative h-max">
            <MobileHero animateEntry={enableHeroEntryAnimation} />
            <MobileServices onStepChange={handleStepChange} />
            <div ref={decisionRef} className="contents-wrapper w-full flex flex-col relative">
              <MobileDecisionStage onStepChange={handleStepChange} />
              <DecisionStages onStepChange={handleStepChange} />
            </div>
            <MobileApproach onStepChange={handleStepChange} />
            <MobileFAQs />
          </div>
        )}
      </main>
      {!isDesktopContainer && !showForm && <StickyFooter activeStep={activeStep} forceHide={shouldHideChrome} />}
    </div>
  )
}
