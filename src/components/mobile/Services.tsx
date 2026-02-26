import { useRef, useEffect, useState } from 'react'

export default function MobileServices() {
  const [activeColor, setActiveColor] = useState("#FCFAF3")
  const [activeStep, setActiveStep] = useState(0)
  const lastStepRef = useRef(-1)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const stepIndex = Number(entry.target.getAttribute('data-step'))
            const color = entry.target.getAttribute('data-color')

            setActiveStep(stepIndex)
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

  const getStepStyle = (step: number, delay: number = 0) => {
    const isActive = activeStep === step
    // Determinamos si la sección está "arriba" o "abajo" de la actual para el efecto de slide
    const isPast = activeStep > step

    return {
      opacity: isActive ? 1 : 0,
      filter: isActive ? 'blur(0px)' : 'blur(20px)',
      transform: isActive
        ? 'translateY(0px)'
        : isPast
          ? 'translateY(-60px)' // Aumentamos para que se note la caída desde el top al volver
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
        className="snap-start snap-always h-screen w-full flex items-center px-[17px] justify-start overflow-hidden"
      >
        <div className="w-full">
          <h2
            className="text-narrative-title font-medium text-brand-dark leading-[1.05] tracking-tight text-left"
            style={getStepStyle(0)}
          >
            But the strain doesn’t appear overnight.
          </h2>
        </div>
      </section>

      {/* 2. Frase Derecha (Step 1) */}
      <section
        data-step={1}
        data-color="#010D17"
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="snap-start snap-always h-screen w-full flex items-center px-[17px] justify-end overflow-hidden"
      >
        <div className="w-full">
          <h2
            className={`text-narrative-title font-medium text-white leading-[1.05] tracking-tight text-right`}
            style={getStepStyle(1)}
          >
            It builds gradually.
          </h2>
        </div>
      </section>

      {/* Combo Blocks (Sticky Background #010D17) */}
      {[
        { t1: "Growth is visible", t2: "But it’s fragile.", start: 2 },
        { t1: "You’re getting wins", t2: "But they’re inconsistent.", start: 4 },
        { t1: "Your team is moving", t2: "But not always on the same page.", start: 6 },
        { t1: "Making progress...", t2: "But only when you’re involved.", start: 8 }
      ].map((combo, i) => (
        <section key={i} className="relative h-[200vh]">
          <div className="sticky top-0 h-screen w-full flex items-center px-[17px] justify-start overflow-hidden">
            <div className="w-full flex flex-col gap-2 text-left">
              <p
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
            <div data-step={combo.start} data-color="#010D17" ref={(el) => { sectionRefs.current[combo.start] = el; }} className="h-screen snap-start snap-always pointer-events-auto" />
            <div data-step={combo.start + 1} data-color="#010D17" ref={(el) => { sectionRefs.current[combo.start + 1] = el; }} className="h-screen snap-start snap-always pointer-events-auto" />
          </div>
        </section>
      ))}

      {/* Step 10: Outcome */}
      <section
        data-step={10}
        data-color="#D2D2FF"
        ref={(el) => { sectionRefs.current[10] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{
              fontSize: '17.05px',
              ...getStepStyle(10, 0)
            }}
          >
            We’ll help you
          </span>

          <h2
            className="text-brand-dark font-medium leading-[1.1] tracking-tight mt-[3px]"
            style={{
              fontSize: '53.18px',
              ...getStepStyle(10, 100)
            }}
          >
            Move from effort to structure.
          </h2>

          <p
            className="text-brand-dark font-light mt-[23px]"
            style={{
              fontSize: '22.05px',
              ...getStepStyle(10, 200)
            }}
          >
            So that you can...
          </p>
        </div>
      </section>

      {/* 7. Strategy (Step 11) */}
      <section
        data-step={11}
        data-color="#DBE9EE"
        ref={(el) => { sectionRefs.current[11] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{
              fontSize: '17.05px',
              ...getStepStyle(11, 0)
            }}
          >
            So you can...
          </span>

          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{
              fontSize: '56.18px',
              ...getStepStyle(11, 100)
            }}
          >
            Operate from strategy
          </h2>
        </div>
      </section>

      {/* 8. Urgency (Step 12) */}
      <section
        data-step={12}
        data-color="#010D17"
        ref={(el) => { sectionRefs.current[12] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-light tracking-tight"
            style={{
              fontSize: '42.18px',
              color: '#FCFAF3',
              ...getStepStyle(12, 0)
            }}
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
        className="snap-start snap-always h-screen w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{
              fontSize: '17.05px',
              ...getStepStyle(13, 0)
            }}
          >
            So you can...
          </span>

          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{
              fontSize: '56.18px',
              ...getStepStyle(13, 100)
            }}
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
        className="snap-start snap-always h-screen w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-light tracking-tight"
            style={{
              fontSize: '42.18px',
              color: '#FCFAF3',
              ...getStepStyle(14, 0)
            }}
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
        className="snap-start snap-always h-screen w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{
              fontSize: '17.05px',
              ...getStepStyle(15, 0)
            }}
          >
            So you can...
          </span>

          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{
              fontSize: '56.18px',
              ...getStepStyle(15, 100)
            }}
          >
            Scale what’s proven
          </h2>
        </div>
      </section>

      {/* 12. Feeling (Step 16) */}
      <section
        data-step={16}
        data-color="rgba(1, 13, 23, 0.7)"
        ref={(el) => { sectionRefs.current[16] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-normal tracking-tight flex flex-col items-center leading-[1.1]"
            style={{
              fontSize: '42.18px',
              color: '#FCFAF3',
              ...getStepStyle(16, 0)
            }}
          >
            <span>not what</span>
            <span>
              <span style={{ fontFamily: '"Lato", sans-serif', fontStyle: 'italic' }}>feels</span> right.
            </span>
          </h2>
        </div>
      </section>

      {/* 13. Final (Step 17) */}
      <section
        data-step={17}
        data-color="#FCFAF3"
        ref={(el) => { sectionRefs.current[17] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center px-5 overflow-hidden"
      >
        <div className="flex flex-col">
          <span
            className="text-brand-dark font-light"
            style={{
              fontSize: '17.05px',
              ...getStepStyle(17, 0)
            }}
          >
            And, finally,
          </span>

          <h2
            className="text-brand-dark font-medium leading-[1.05] tracking-tight mt-[1px]"
            style={{
              fontSize: '56.18px',
              ...getStepStyle(17, 100)
            }}
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
        className="snap-start snap-always h-screen w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-light tracking-tight"
            style={{
              fontSize: '42.18px',
              color: '#FCFAF3',
              ...getStepStyle(18, 0)
            }}
          >
            not “carry” it.
          </h2>
        </div>
      </section>

      {/* 15. How? (Step 19) */}
      <section
        data-step={19}
        data-color="rgba(21, 19, 36, 0.97)"
        ref={(el) => { sectionRefs.current[19] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center items-center px-5 overflow-hidden"
      >
        <div className="w-full text-center">
          <h2
            className="font-medium tracking-tight"
            style={{
              fontSize: '74.18px',
              color: '#FCFAF3',
              ...getStepStyle(19, 0)
            }}
          >
            How?
          </h2>
        </div>
      </section>

      {/* 16. Decade (Step 20) */}
      <section
        data-step={20}
        data-color="rgba(13, 17, 31, 0.86)"
        ref={(el) => { sectionRefs.current[20] = el; }}
        className="snap-start snap-always h-screen w-full flex flex-col justify-center px-[30px] overflow-hidden"
      >
        <div className="flex flex-col gap-0 items-start">
          <p
            className="tracking-tight"
            style={{
              fontSize: '23.18px',
              color: '#FCFAF3',
              fontFamily: '"Fustat", sans-serif',
              fontWeight: 300,
              lineHeight: 1.2,
              ...getStepStyle(20, 0)
            }}
          >
            After a decade building growth systems, one pattern holds:
          </p>

          <h2
            className="tracking-tight"
            style={{
              fontSize: '40.5px',
              color: '#B1B2FF',
              fontFamily: '"Lato", sans-serif',
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.1,
              ...getStepStyle(20, 100)
            }}
          >
            Validated direction
          </h2>

          <p
            className="tracking-tight"
            style={{
              fontSize: '35.5px',
              color: 'rgba(252, 250, 243, 0.3)',
              fontFamily: '"Fustat", sans-serif',
              fontWeight: 300,
              lineHeight: 1.1,
              ...getStepStyle(20, 200)
            }}
          >
            becomes structure.
          </p>
        </div>
      </section>
    </div>
  )
}
