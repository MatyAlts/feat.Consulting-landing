import { useRef, useEffect, useState } from 'react'
import { StaggerReveal } from '../shared/StaggerReveal'

interface MobileServicesProps {
  onStepChange?: (step: number) => void;
}

export default function MobileServices({ onStepChange }: MobileServicesProps) {
  const [activeColor, setActiveColor] = useState("#FCFAF3")
  const [activeStep, setActiveStep] = useState(0)
  const lastStepRef = useRef(-1)
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

  // Estado con las posiciones calculadas de la línea
  const [line10Top, setLine10Top] = useState<number | null>(null)
  const [line11Height, setLine11Height] = useState<number | null>(null)
  const [line1Top, setLine1Top] = useState<number | null>(null)
  const [line2Height, setLine2Height] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const stepIndex = Number(entry.target.getAttribute('data-step'))
            const color = entry.target.getAttribute('data-color')

            setActiveStep(stepIndex)
            onStepChange?.(stepIndex)
            lastStepRef.current = stepIndex
            if (color) setActiveColor(color)
          }
        })
      },
      {
        threshold: [0.1, 0.5, 0.8],
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    const containerObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setActiveStep(-1)
          onStepChange?.(-1)
        }
      },
      { threshold: 0 }
    )

    const container = document.querySelector('[data-services-container]')
    if (container) containerObserver.observe(container)

    return () => {
      observer.disconnect()
      containerObserver.disconnect()
    }
  }, [])

  // Mide la posición exacta del texto relativa a su sección padre.
  // Suma offsetTop por toda la cadena DOM hasta llegar a la sección,
  // evitando errores por divs intermedios con position:relative.
  useEffect(() => {
    const getOffsetFromSection = (el: HTMLElement, section: HTMLElement): number => {
      let top = 0
      let current: HTMLElement | null = el
      while (current && current !== section) {
        top += current.offsetTop
        current = current.offsetParent as HTMLElement | null
      }
      return top
    }

    const measure = () => {
      // Sección 10: línea empieza 53px después del bottom de "So that you can..."
      if (soThatTextRef.current && section10Ref.current) {
        const relTop = getOffsetFromSection(soThatTextRef.current, section10Ref.current)
        setLine10Top(relTop + soThatTextRef.current.offsetHeight + 53)
      }
      // Sección 11: línea termina 53px antes del top de "So you can..."
      if (soYouTextRef.current && section11Ref.current) {
        const relTop = getOffsetFromSection(soYouTextRef.current, section11Ref.current)
        setLine11Height(relTop - 53)
      }

      // Sección 1 a 2: línea entre "It builds gradually" y "You're growing"
      if (buildsTextRef.current && section1Ref.current) {
        const relTop = getOffsetFromSection(buildsTextRef.current, section1Ref.current)
        setLine1Top(relTop + buildsTextRef.current.offsetHeight + 53)
      }
      if (growingTextRef.current && section2Ref.current) {
        const relTop = getOffsetFromSection(growingTextRef.current, section2Ref.current)
        setLine2Height(relTop - 53)
      }
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
      {/* 1. Frase Inicial (Step 0) */}
      <section
        data-step={0}
        data-color="#FCFAF3"
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="snap-start snap-always full-height w-full flex items-start px-[17px] justify-start overflow-hidden"
      >
        <div className="w-full pt-[100px]">
          <h2
            className="text-narrative-title font-medium text-brand-dark leading-[1.05] tracking-tight text-left"
            style={getStepStyle(0)}
          >
            The strain doesn't appear overnight.
          </h2>
        </div>
      </section>

      {/* 2. Frase Derecha (Step 1) */}
      <section
        data-step={1}
        data-color="#010D17"
        ref={(el) => { sectionRefs.current[1] = el; section1Ref.current = el; }}
        className="snap-start snap-always full-height w-full flex items-center px-[17px] justify-end overflow-hidden relative"
      >

        <div className="w-full relative z-10">
          <h2
            ref={buildsTextRef}
            className={`text-narrative-title font-medium text-white leading-[1.05] tracking-tight text-right`}
            style={getStepStyle(1)}
          >
            It builds gradually.
          </h2>
        </div>
      </section>

      {/* Combo Blocks (Sticky Background #010D17) */}
      {[
        { t1: "You're growing.", t2: <>But it doesn't<br />feel stable.</>, start: 2 },
        { t1: "Wins happen.", t2: "But they're inconsistent.", start: 4 },
        { t1: "Your team is moving", t2: <>But sales still<br />has to explain <br />everything.</>, start: 6 },
        { t1: "You're doing the work.", t2: <>And it's not<br />getting lighter.</>, start: 8 }
      ].map((combo, i) => (
        <section key={i} className="relative h-[200dvh]">
          <div
            className="sticky top-0 full-height w-full flex items-center pl-[64.5px] pr-[17px] justify-start overflow-hidden relative"
            ref={i === 0 ? section2Ref : null}
          >

            <div className="w-full flex flex-col gap-2 text-left relative z-10">
              <p
                ref={i === 0 ? growingTextRef : null}
                className="tracking-tight"
                style={{
                  fontSize: "28.13px",
                  fontWeight: "400",
                  color: "#D6D6F0",
                  ...getStepStyle(activeStep >= combo.start && activeStep <= combo.start + 1 ? activeStep : -2, 0)
                }}
              >
                {combo.t1}
              </p>
              <h2
                className="leading-[1.05] tracking-tight"
                style={{
                  fontSize: "41.21px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  ...getStepStyle(activeStep === combo.start + 1 ? activeStep : -2, 100)
                }}
              >
                {combo.t2}
              </h2>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div data-step={combo.start} data-color="#010D17" ref={(el) => { sectionRefs.current[combo.start] = el; }} className="full-height snap-start snap-always pointer-events-auto" />
            <div data-step={combo.start + 1} data-color="#010D17" ref={(el) => { sectionRefs.current[combo.start + 1] = el; }} className="full-height snap-start snap-always pointer-events-auto" />
          </div>
        </section>
      ))}

      {/* Step 10: Outcome */}
      <section
        data-step={10}
        data-color="#D2D2FF"
        ref={(el) => { sectionRefs.current[10] = el; section10Ref.current = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center px-5 overflow-hidden relative"
      >


        <div className="flex flex-col relative z-10">
          <span
            className="text-brand-dark font-light"
            style={{ fontSize: '17.05px', ...getStepStyle(10, 0) }}
          >
            We'll help you
          </span>
          <h2
            className="text-brand-dark font-medium leading-[1.1] tracking-tight mt-[3px]"
            style={{ fontSize: '53.18px', ...getStepStyle(10, 100) }}
          >
            Go from<br />effort to control.
          </h2>
          <p
            ref={soThatTextRef}
            className="text-brand-dark font-light mt-[23px]"
            style={{ fontSize: '22.05px', ...getStepStyle(10, 200) }}
          >
            So that you can...
          </p>
        </div>
      </section>

      {/* 7. Strategy (Step 11) */}
      <section
        data-step={11}
        data-color="#DBE9EE"
        ref={(el) => { sectionRefs.current[11] = el; section11Ref.current = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center px-5 overflow-hidden relative"
      >


        <div className="flex flex-col relative z-10">
          <span
            ref={soYouTextRef}
            className="text-brand-dark font-light"
            style={{ fontSize: '17.05px', ...getStepStyle(11, 0) }}
          >
            So you can...
          </span>
          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{ fontSize: '56.18px', ...getStepStyle(11, 100) }}
          >
            Operate<br />from<br />strategy
          </h2>
        </div>
      </section>


      {/* 8. Urgency (Step 12) */}
      <section
        data-step={12}
        data-color="#010D17"
        ref={(el) => { sectionRefs.current[12] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-light tracking-tight"
            style={{ fontSize: '42.18px', color: '#FCFAF3', ...getStepStyle(12, 0) }}
          >
            not urgency.
          </h2>
        </div>
      </section>

      {/* 9. Evidence (Step 13) */}
      <section
        data-step={13}
        data-color="#C6D7F9"
        ref={(el) => { sectionRefs.current[13] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{ fontSize: '17.05px', ...getStepStyle(13, 0) }}
          >
            So you can...
          </span>
          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{ fontSize: '56.18px', ...getStepStyle(13, 100) }}
          >
            Invest from evidence
          </h2>
        </div>
      </section>

      {/* 10. Instinct (Step 14) */}
      <section
        data-step={14}
        data-color="#010D17"
        ref={(el) => { sectionRefs.current[14] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-light tracking-tight"
            style={{ fontSize: '42.18px', color: '#FCFAF3', ...getStepStyle(14, 0) }}
          >
            not instinct.
          </h2>
        </div>
      </section>

      {/* 11. Scale (Step 15) */}
      <section
        data-step={15}
        data-color="#DBE9EE"
        ref={(el) => { sectionRefs.current[15] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{ fontSize: '17.05px', ...getStepStyle(15, 0) }}
          >
            So you can...
          </span>
          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{ fontSize: '56.18px', ...getStepStyle(15, 100) }}
          >
            Scale what's proven
          </h2>
        </div>
      </section>

      {/* 12. Feeling (Step 16) */}
      <section
        data-step={16}
        data-color="rgba(1, 13, 23, 0.7)"
        ref={(el) => { sectionRefs.current[16] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
            <h2
              className="text-[42.18px] font-normal tracking-tight leading-[1.1] text-[#FCFAF3]"
              style={getStepStyle(16, 0)}
            >
              not what <br />
              <span className="text-[42.18px] font-['Lato'] italic">feels</span> right.
            </h2>
        </div>
      </section>

      {/* 13. Final (Step 17) */}
      <section
        data-step={17}
        data-color="#FCFAF3"
        ref={(el) => { sectionRefs.current[17] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{ fontSize: '17.05px', ...getStepStyle(17, 0) }}
          >
            And, finally,
          </span>
          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{ fontSize: '56.18px', ...getStepStyle(17, 100) }}
          >
            Lead your company
          </h2>
        </div>
      </section>

      {/* 14. Carry (Step 18) */}
      <section
        data-step={18}
        data-color="#312E3C"
        ref={(el) => { sectionRefs.current[18] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-light tracking-tight"
            style={{ fontSize: '42.18px', color: '#FCFAF3', ...getStepStyle(18, 0) }}
          >
            not "carry" it.
          </h2>
        </div>
      </section>

      {/* 15. How? (Step 19) */}
      <section
        data-step={19}
        data-color="rgba(21, 19, 36, 0.97)"
        ref={(el) => { sectionRefs.current[19] = el; }}
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-medium tracking-tight"
            style={{ fontSize: '74.18px', color: '#FCFAF3', ...getStepStyle(19, 0) }}
          >
            How?
          </h2>
        </div>
      </section>

      {/* 16. Final Narrative Sequence (Step 20) */}
      <section
        data-step={20}
        data-color="rgba(13, 17, 31, 1)"
        ref={(el) => { sectionRefs.current[20] = el; }}
        className="snap-start snap-always full-height-min w-full flex flex-col justify-start px-[30px] overflow-hidden"
      >
        <div className="self-stretch flex flex-col justify-start items-start relative z-10 w-full pt-14">

          <StaggerReveal staggerDelay={80} baseDelay={200} rootMargin="0px" className="w-full">
            <div className="text-[#A5B4FC] text-2xl font-light font-['Fustat'] leading-6">
              After years building journeys,
            </div>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={1000} rootMargin="0px" className="w-full mb-7">
            <div className="text-[#A5B4FC] text-2xl font-light font-['Fustat'] leading-6">
              one pattern became clear:
            </div>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={1900} rootMargin="0px" className="w-full">
            <p className="text-white text-4xl font-normal font-['Fustat'] leading-[1.11]">
              When growth
            </p>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={2500} rootMargin="0px" className="w-full">
            <p className="text-white text-4xl font-normal font-['Fustat'] leading-[1.11]">
              reflects how buyers
            </p>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={3100} rootMargin="0px" className="w-full mb-5">
            <p className="text-white text-4xl font-normal font-['Fustat'] leading-[1.11]">
              <span className="italic-lato-word" style={{
                fontFamily: 'Lato, sans-serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}>actually</span>{' '}decide,
            </p>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={3900} rootMargin="0px" className="w-full mb-[65px]">
            <div className="w-full text-[#C7D2FE] text-[56px] font-normal font-['Fustat'] leading-[54.59px]">
              Scale stops depending on effort.
            </div>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={5300} rootMargin="0px" className="w-full flex flex-col">
            <p className="text-[#FCFAF3] text-[33.5px] font-light font-['Fustat'] leading-tight mb-[63px]">
              That's where leverage replaces grind.
            </p>
            <div className="w-full border-t border-[#FCFAF3]/10" />
          </StaggerReveal>

        </div>
      </section>
    </div >
  )
}
