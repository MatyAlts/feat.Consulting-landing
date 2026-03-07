import { useRef, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface MobileServicesProps {
  onStepChange?: (step: number) => void;
}

const DOUBLE_PHRASE_STAGE_ENTRIES = [2, 4, 6, 8] as const
const AUTO_REVEAL_DELAY_MS = 220

interface StoryStageProps {
  id?: string;
  step?: number;
  color?: string;
  stageClassName?: string;
  stickyClassName?: string;
  sectionRef?: (el: HTMLElement | null) => void;
  children: ReactNode;
}

function StoryStage({
  id,
  step,
  color,
  stageClassName = 'full-height',
  stickyClassName = '',
  sectionRef,
  children
}: StoryStageProps) {
  return (
    <section
      id={id}
      data-step={step}
      data-color={color}
      ref={sectionRef}
      className={`relative story-snap-step ${stageClassName}`}
    >
      <div className={`full-height ${stickyClassName}`}>
        {children}
      </div>
    </section>
  )
}

export default function MobileServices({ onStepChange }: MobileServicesProps) {
  const navigate = useNavigate()
  const [activeColor, setActiveColor] = useState("#FCFAF3")
  const [activeStep, setActiveStep] = useState(0)
  const [revealedSecondSteps, setRevealedSecondSteps] = useState<Record<number, boolean>>({})
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Refs para medir la posición exacta de los textos
  const soThatTextRef = useRef<HTMLParagraphElement>(null)    // "So that you can..."
  const soYouTextRef = useRef<HTMLSpanElement>(null)           // "So you can..."
  const section10Ref = useRef<HTMLElement>(null)
  const section11Ref = useRef<HTMLElement>(null)

  const buildsTextRef = useRef<HTMLHeadingElement>(null)      // "It builds gradually."
  const growingTextRef = useRef<HTMLParagraphElement>(null)   // "You're growing."
  const section1Ref = useRef<HTMLElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const servicesContainer = document.querySelector('[data-services-container]') as HTMLElement | null
    const main = document.querySelector('main')

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((entry) => entry.isIntersecting && entry.target !== servicesContainer)
          .map((entry) => {
            const stepIndexStr = entry.target.getAttribute('data-step')
            if (stepIndexStr === null) return null

            const stepIndex = Number(stepIndexStr)
            if (Number.isNaN(stepIndex)) return null

            return {
              stepIndex,
              ratio: entry.intersectionRatio,
              color: entry.target.getAttribute('data-color')
            }
          })
          .filter(Boolean) as Array<{ stepIndex: number; ratio: number; color: string | null }>

        if (candidates.length === 0) return

        const winner = candidates.reduce((best, current) => current.ratio > best.ratio ? current : best)
        setActiveStep(winner.stepIndex)
        if (winner.color) setActiveColor(winner.color)
      },
      {
        root: main,
        threshold: [0.35, 0.6, 0.85]
      }
    )

    // Observar todas las secciones
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    
    if (servicesContainer) observer.observe(servicesContainer)

    const containerObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Si salimos por arriba (hero), resetear
          if (entry.boundingClientRect.top > 0) {
            setActiveStep(-1)
            onStepChange?.(-1)
          }
        }
      },
      { root: main, threshold: 0 }
    )

    if (servicesContainer) containerObserver.observe(servicesContainer)

    return () => {
      observer.disconnect()
      containerObserver.disconnect()
    }
  }, [onStepChange])

  useEffect(() => {
    if (activeStep < 0) return
    if (!DOUBLE_PHRASE_STAGE_ENTRIES.includes(activeStep as (typeof DOUBLE_PHRASE_STAGE_ENTRIES)[number])) return
    if (revealedSecondSteps[activeStep]) return

    const timer = window.setTimeout(() => {
      setRevealedSecondSteps((prev) => ({ ...prev, [activeStep]: true }))
    }, AUTO_REVEAL_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [activeStep, revealedSecondSteps])

  useEffect(() => {
    onStepChange?.(activeStep)
  }, [activeStep, onStepChange])

  // Mide la posición exacta del texto relativa a su sección padre.
  useEffect(() => {
    const measure = () => {
      // Logic for measuring can be added here if needed
    }

    const t = setTimeout(measure, 150)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  const getStepStyle = (step: number, delay: number = 0) => {
    const isActive = activeStep === step
    const isPast = activeStep > step

    return {
      opacity: isActive ? 1 : 0,
      filter: isActive ? 'blur(0px)' : 'blur(20px)',
      transform: isActive
        ? 'translateY(0px)'
        : isPast
          ? 'translateY(-60px)'
          : 'translateY(40px)',
      transition: `all 600ms cubic-bezier(0, 0, 0.2, 1) ${delay}ms`,
    }
  }

  return (
    <div
      data-services-container
      className="transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: activeColor }}
    >
      {/* Sections 1-19 */}
      <>
        {/* 1. Frase Inicial (Step 0) */}
        <StoryStage
          id="direction"
          step={0}
          color="#FCFAF3"
          sectionRef={(el) => { sectionRefs.current[0] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-center px-4 justify-start overflow-hidden"
        >
          <div className="w-full">
            <h2
              className="text-narrative-title font-medium text-brand-dark leading-[1.05] tracking-tight text-left"
              style={getStepStyle(0)}
            >
              The strain doesn't appear overnight.
            </h2>
          </div>
        </StoryStage>

        {/* 2. Frase Derecha (Step 1) */}
        <StoryStage
          step={1}
          color="#010D17"
          sectionRef={(el) => { sectionRefs.current[1] = el; section1Ref.current = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-center px-4 justify-end overflow-hidden relative"
        >
          <div className="w-full relative z-10">
            <h2
              ref={buildsTextRef}
              className="text-narrative-title font-medium text-white leading-[1.05] tracking-tight text-right"
              style={getStepStyle(1)}
            >
              It builds gradually.
            </h2>
          </div>
        </StoryStage>

        {/* Combo Blocks */}
        {[ 
          { t1: "You're growing.", t2: <>But it doesn't<br />feel stable.</>, start: 2 },
          { t1: "Wins happen.", t2: "But they're inconsistent.", start: 4 },
          { t1: "Your team is moving", t2: <>But sales still<br />has to explain <br />everything.</>, start: 6 },
          { t1: "You're doing the work.", t2: <>And it's not<br />getting lighter.</>, start: 8 }
        ].map((combo, i) => (
          <StoryStage
            key={i}
            step={combo.start}
            color="#010D17"
            sectionRef={(el) => {
              sectionRefs.current[combo.start] = el
              sectionRefs.current[combo.start + 1] = el
              if (i === 0) section2Ref.current = el as HTMLDivElement | null
            }}
            stageClassName="full-height"
            stickyClassName="w-full flex items-center pl-[16vw] pr-4 justify-start overflow-hidden relative"
          >
            <div className="w-full flex flex-col gap-2 text-left relative z-10">
              <p
                ref={i === 0 ? growingTextRef : null}
                className="tracking-tight"
                style={{
                  fontSize: "var(--text-narrative-small)",
                  fontWeight: "400",
                  color: "#D6D6F0",
                  ...getStepStyle(activeStep === combo.start ? combo.start : -2, 0)
                }}
              >
                {combo.t1}
              </p>
              <h2
                className="leading-[1.05] tracking-tight"
                style={{
                  fontSize: "var(--text-narrative-medium)",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  ...getStepStyle(
                    activeStep === combo.start && revealedSecondSteps[combo.start] ? combo.start : -2,
                    100
                  )
                }}
              >
                {combo.t2}
              </h2>
            </div>
          </StoryStage>
        ))}

        {/* Step 10: Outcome */}
        <StoryStage
          step={10}
          color="#D2D2FF"
          sectionRef={(el) => { sectionRefs.current[10] = el; section10Ref.current = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center px-5 overflow-hidden relative"
        >
          <div className="flex flex-col relative z-10">
            <span
              className="text-brand-dark font-light"
              style={{ fontSize: 'var(--text-services-label)', ...getStepStyle(10, 0) }}
            >
              We'll help you
            </span>
            <h2
              className="text-brand-dark font-medium leading-[1.1] tracking-tight mt-[3px]"
              style={{ fontSize: 'var(--text-hero-title)', ...getStepStyle(10, 100) }}
            >
              Go from<br />effort to control.
            </h2>
            <p
              ref={soThatTextRef}
              className="text-brand-dark font-light mt-[23px]"
              style={{ fontSize: 'var(--text-hero-body)', ...getStepStyle(10, 200) }}
            >
              So that you can...
            </p>
          </div>
        </StoryStage>

        {/* 7. Strategy (Step 11) */}
        <StoryStage
          step={11}
          color="#DBE9EE"
          sectionRef={(el) => { sectionRefs.current[11] = el; section11Ref.current = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center px-5 overflow-hidden relative"
        >
          <div className="flex flex-col relative z-10">
            <span
              ref={soYouTextRef}
              className="text-brand-dark font-light"
              style={{ fontSize: 'var(--text-services-label)', ...getStepStyle(11, 0) }}
            >
              So you can...
            </span>
            <h2
              className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
              style={{ fontSize: 'var(--text-services-large)', ...getStepStyle(11, 100) }}
            >
              Operate<br />from<br />strategy
            </h2>
          </div>
        </StoryStage>

        {/* 8. Urgency (Step 12) */}
        <StoryStage
          step={12}
          color="#010D17"
          sectionRef={(el) => { sectionRefs.current[12] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center items-center px-5 overflow-hidden"
        >
          <div className="w-full text-center">
            <h2
              className="font-light tracking-tight"
              style={{ fontSize: 'var(--text-services-emphasis)', color: '#FCFAF3', ...getStepStyle(12, 0) }}
            >
              not urgency.
            </h2>
          </div>
        </StoryStage>

        {/* 9. Evidence (Step 13) */}
        <StoryStage
          step={13}
          color="#C6D7F9"
          sectionRef={(el) => { sectionRefs.current[13] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center px-5 overflow-hidden"
        >
          <div className="flex flex-col">
            <span
              className="text-brand-dark font-light"
              style={{ fontSize: 'var(--text-services-label)', ...getStepStyle(13, 0) }}
            >
              So you can...
            </span>
            <h2
              className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
              style={{ fontSize: 'var(--text-services-large)', ...getStepStyle(13, 100) }}
            >
              Invest from evidence
            </h2>
          </div>
        </StoryStage>

        {/* 10. Instinct (Step 14) */}
        <StoryStage
          step={14}
          color="#010D17"
          sectionRef={(el) => { sectionRefs.current[14] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center items-center px-5 overflow-hidden"
        >
          <div className="w-full text-center">
            <h2
              className="font-light tracking-tight"
              style={{ fontSize: 'var(--text-services-emphasis)', color: '#FCFAF3', ...getStepStyle(14, 0) }}
            >
              not instinct.
            </h2>
          </div>
        </StoryStage>

        {/* 11. Scale (Step 15) */}
        <StoryStage
          step={15}
          color="#DBE9EE"
          sectionRef={(el) => { sectionRefs.current[15] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center px-5 overflow-hidden"
        >
          <div className="flex flex-col">
            <span
              className="text-brand-dark font-light"
              style={{ fontSize: 'var(--text-services-label)', ...getStepStyle(15, 0) }}
            >
              So you can...
            </span>
            <h2
              className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
              style={{ fontSize: 'var(--text-services-large)', ...getStepStyle(15, 100) }}
            >
              Scale what's proven
            </h2>
          </div>
        </StoryStage>

        {/* 12. Feeling (Step 16) */}
        <StoryStage
          step={16}
          color="rgba(1, 13, 23, 0.7)"
          sectionRef={(el) => { sectionRefs.current[16] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center items-center px-5 overflow-hidden"
        >
          <div className="w-full text-center">
            <h2
              className="font-normal tracking-tight leading-[1.1] text-[#FCFAF3]"
              style={{ fontSize: 'var(--text-services-emphasis)', ...getStepStyle(16, 0) }}
            >
              not what <br />
              <span className="font-['Lato'] italic">feels</span> right.
            </h2>
          </div>
        </StoryStage>

        {/* 13. Final (Step 17) */}
        <StoryStage
          step={17}
          color="#FCFAF3"
          sectionRef={(el) => { sectionRefs.current[17] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center px-5 overflow-hidden"
        >
          <div className="flex flex-col">
            <span
              className="text-brand-dark font-light"
              style={{ fontSize: 'var(--text-services-label)', ...getStepStyle(17, 0) }}
            >
              And, finally,
            </span>
            <h2
              className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
              style={{ fontSize: 'var(--text-services-large)', ...getStepStyle(17, 100) }}
            >
              Lead your company
            </h2>
          </div>
        </StoryStage>

        {/* 14. Carry (Step 18) */}
        <StoryStage
          step={18}
          color="#312E3C"
          sectionRef={(el) => { sectionRefs.current[18] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center items-center px-5 overflow-hidden"
        >
          <div className="w-full text-center">
            <h2
              className="font-light tracking-tight"
              style={{ fontSize: 'var(--text-services-emphasis)', color: '#FCFAF3', ...getStepStyle(18, 0) }}
            >
              not "carry" it.
            </h2>
          </div>
        </StoryStage>

        {/* 15. How? (Step 19) */}
        <StoryStage
          step={19}
          color="rgba(21, 19, 36, 0.97)"
          sectionRef={(el) => { sectionRefs.current[19] = el; }}
          stageClassName="full-height"
          stickyClassName="w-full flex flex-col justify-center items-end pr-9.25 overflow-hidden"
        >
          <button
            onClick={() => {
              sessionStorage.setItem('scrollTarget', '#system');
              navigate('/strategy');
            }}
            style={{
              ...getStepStyle(19, 0),
              textDecoration: 'none',
              textAlign: 'right',
              fontFamily: 'Fustat',
              fontWeight: 200,
              fontSize: 'var(--text-services-cta)',
              color: '#FCFAF3',
              lineHeight: 1.12,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
          >
            So how does this<br />
            <span className="underline">happen? {'->'}</span>
          </button>
        </StoryStage>
      </>
    </div>
  )
}
