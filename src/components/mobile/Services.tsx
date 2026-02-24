import { useRef, useEffect, useState } from 'react'

export default function MobileServices() {
  const [activeColor, setActiveColor] = useState("#FCFAF3")
  const [activeStep, setActiveStep] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const stepIndex = Number(entry.target.getAttribute('data-step'))
            const color = entry.target.getAttribute('data-color')

            setActiveStep(stepIndex)
            if (color) setActiveColor(color)
          }
        })
      },
      { threshold: 0.6 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div
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
          <h2 className={`text-narrative-title font-medium text-brand-dark leading-[1.05] tracking-tight transition-all duration-700 ease-out text-left ${activeStep === 0 ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-xl translate-y-10'}`}>
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
          <h2 className={`text-narrative-title font-medium text-white leading-[1.05] tracking-tight transition-all duration-700 ease-out text-right ${activeStep === 1 ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-xl translate-y-10'}`}>
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
              <p className="transition-all duration-700 ease-out tracking-tight" style={{ fontSize: "28.13px", fontWeight: "400", color: "#D6D6F0", opacity: activeStep >= combo.start && activeStep <= combo.start + 1 ? 1 : 0, filter: activeStep >= combo.start && activeStep <= combo.start + 1 ? 'blur(0)' : 'blur(10px)', transform: activeStep >= combo.start && activeStep <= combo.start + 1 ? 'translateY(0)' : 'translateY(10px)' }}>
                {combo.t1}
              </p>
              <h2 className="transition-all duration-700 ease-out leading-[1.05] tracking-tight" style={{ fontSize: "41.21px", fontWeight: "500", color: "#FFFFFF", opacity: activeStep === combo.start + 1 ? 1 : 0, filter: activeStep === combo.start + 1 ? 'blur(0)' : 'blur(10px)', transform: activeStep === combo.start + 1 ? 'translateY(0)' : 'translateY(10px)' }}>
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

      {/* 6. Frase Final (Step 10) */}
      <section
        data-step={10}
        data-color="#B0AA9A"
        ref={(el) => { sectionRefs.current[10] = el; }}
        className="snap-start snap-always h-screen w-full flex items-center px-[17px] justify-start overflow-hidden"
      >
        <div className="w-full">
          <h2 className={`text-narrative-title font-medium text-brand-dark leading-[1.05] tracking-tight transition-all duration-700 ease-out text-left ${activeStep === 10 ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-xl translate-y-10'}`}>
            Suddenly, scaling feels impossible.
          </h2>
        </div>
      </section>
    </div>
  )
}
