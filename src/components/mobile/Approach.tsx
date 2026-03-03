import { useRef, useEffect, useState } from 'react';
import { StaggerReveal } from '../shared/StaggerReveal';
import chevronIcon from '../../assets/icons/si_chevron-right-circle-line.png';

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Requiere que el elemento esté al menos a un 25% dentro del viewport (top y bottom)
      // Esto previene que se dispare mientras aún estás en el "sticky" de la animación horizontal
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { 
      threshold: 0,
      rootMargin: '0px 0px -40% 0px' 
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-opacity duration-1000 ease-in-out"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        transform: 'none'
      }}
    >
      {children}
    </div>
  );
}

export default function MobileApproach({ onStepChange }: { onStepChange?: (step: number) => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const textOverflowRef = useRef(0);

  /* ── Step Tracker ── */
  useEffect(() => {
    if (!onStepChange) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepAttr = entry.target.getAttribute('data-step');
          if (stepAttr) {
            onStepChange(parseInt(stepAttr));
          }
        }
      });
    }, {
      threshold: 0.3, // Umbral más bajo para detectar antes el cambio al subir
      root: null 
    });

    // Observar todos los elementos con data-step que pertenecen a esta lógica
    const steps = containerRef.current?.parentElement?.querySelectorAll('[data-approach-block]');
    steps?.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, [onStepChange]);

  /* ── Measure: wrapper height = sticky natural height + pan travel ── */
  useEffect(() => {
    const measure = () => {
      const text = textRef.current;
      const wrapper = wrapperRef.current;
      const sticky = stickyRef.current;
      if (!text || !wrapper || !sticky) return;

      // Adjusted distance to ensure "consultancy" stays visible with 90px from components right edge
      const containerWidth = document.querySelector('main')?.clientWidth || window.innerWidth;
      const overflow = Math.max(0, text.scrollWidth - containerWidth + 145);
      textOverflowRef.current = overflow;

      // wrapper height = sticky content natural height + panning scroll distance
      // This means sticky releases exactly when the animation ends.
      wrapper.style.height = `${sticky.offsetHeight + overflow}px`;
    };

    // Small delay to let fonts/layout settle
    const t = setTimeout(measure, 50);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);


  /* ── Scroll → translateX ── */
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const wrapperTop = wrapper.offsetTop;
      const scrollTop = main.scrollTop;
      const scrollRange = textOverflowRef.current;
      if (scrollRange <= 0) return;

      const raw = (scrollTop - wrapperTop) / scrollRange;
      const p = Math.max(0, Math.min(1, raw));
      setTranslateX(-textOverflowRef.current * p);
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Accordion State ── */
  const [isWeCreateOpen, setIsWeCreateOpen] = useState(false);

  return (
    <>
      {/* ── Scroll-scrub wrapper (Release Step 48) ────────────────────── */}
      <div 
        ref={wrapperRef} 
        data-step="48"
        data-approach-block
        className="bg-[#151324] relative w-full snap-start"
      >
        {/* Sticky phrase */}
        <div
          ref={stickyRef}
          className="sticky top-0 z-10 bg-[#151324] overflow-hidden pl-[11.87px] pr-7.5 pt-40 pb-0"
        >
          <div className="text-slate-200 text-base font-normal font-['Fustat'] mb-3 leading-6">
            You might have guessed...
          </div>
          <div
            ref={textRef}
            className="whitespace-nowrap text-white text-5xl font-medium font-['Fustat'] leading-[55.70px] will-change-transform"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            feat's not your run-of-the-mill consultancy.
          </div>
        </div>
      </div>

      {/* ── Dark body Narrative (Release Step 49) ── */}
      <div 
        data-step="49"
        data-approach-block
        className="bg-[#151324] pt-40 pb-20 w-full overflow-hidden flex flex-col gap-40 snap-start" 
        ref={containerRef}
      >
        {/* First Narrative Block */}
        <div className="pl-[11.87px] text-left my-24.5">
          <StaggerReveal staggerDelay={80} baseDelay={100} rootMargin="0px">
            <h2 className="text-white font-light font-['Fustat'] leading-[1.1]" style={{ fontSize: '39.18px' }}>
              We don’t hand <br />
              you a strategy <br />
              and disappear.
            </h2>
          </StaggerReveal>
        </div>

        {/* Second Narrative Block */}
        <div className="w-full flex justify-start pl-[11.87px] pr-7.5 mb-24.5">
          <div className="text-left">
            <StaggerReveal staggerDelay={80} baseDelay={100} rootMargin="0px">
              <h2 className="text-white font-light font-['Fustat'] leading-[1.1]" style={{ fontSize: '39.18px' }}>
                And we don’t <br />
                execute blindly <br />
                either.
              </h2>
            </StaggerReveal>
          </div>
        </div>

        {/* Third Narrative Block */}
        <div className="w-full flex justify-start pl-[11.87px] pr-7.5 mb-24.5">
          <div className="text-left">
            <StaggerReveal staggerDelay={80} baseDelay={100} rootMargin="0px">
              <h2 className="text-white font-light font-['Fustat'] leading-[1.1]" style={{ fontSize: '39.18px' }}>
                <span className="whitespace-nowrap">We build what your</span> <br />
                reality demands <br />
                <span className="opacity-20">— and see it <br /> through.</span>
              </h2>
            </StaggerReveal>
          </div>
        </div>
      </div>

      {/* How this actually works - START OF SNAP SCROLL SECTIONS */}
      <div 
        data-step="50"
        data-approach-block
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <FadeInBlock delay={150}>
          <div className="w-full text-left text-zinc-300 text-xl font-light font-['Fustat']">
            How this actually works:
          </div>
        </FadeInBlock>
      </div>

      <div 
        data-step="51"
        data-approach-block
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <FadeInBlock>
          <div className="w-full justify-start">
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">We start by identifying your</span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7"> real buying cohort <br /></span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">not demographically, but </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">behaviorally</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">.</span>
          </div>
        </FadeInBlock>
      </div>

      <div 
        data-step="52"
        data-approach-block
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <FadeInBlock delay={150}>
          <div className="w-full justify-start">
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">We reshape</span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7"> narrative + structure </span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">to</span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7"> match </span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">that logic.</span>
          </div>
        </FadeInBlock>
      </div>

      <div 
        data-step="53"
        data-approach-block
        className="snap-start snap-always min-h-dvh py-20 w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <div className="w-full flex flex-col items-start">
          <button 
            onClick={() => setIsWeCreateOpen(!isWeCreateOpen)}
            className="w-full flex justify-between items-center py-2 active:opacity-70 transition-opacity"
          >
            <h3 className="text-stone-50 font-['Fustat'] leading-tight" style={{ fontSize: '21.05px' }}>
              <span className="font-extralight">We </span>
              <span className="font-normal">create:</span>
            </h3>
            <img 
              src={chevronIcon} 
              alt="Toggle details" 
              className={`w-8 h-8 object-contain shrink-0 transition-transform duration-300 ${isWeCreateOpen ? 'rotate-180' : 'rotate-0'}`} 
            />
          </button>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${isWeCreateOpen ? 'mt-8 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="flex flex-col gap-6 mb-10 pl-2">
              {[
                "Landing journeys matched to awareness depth",
                "Messaging architecture tied to decision stage",
                "Acquisition flows aligned with entry logic",
                "Conversion systems built around intent"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FCFAF3] mt-2.5 shrink-0" />
                  <span className="text-[#FCFAF3] font-['Fustat'] font-extralight" style={{ fontSize: '18.05px' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            
            <p className="text-[#FCFAF3] font-['Fustat'] font-light leading-snug" style={{ fontSize: '18.05px' }}>
              Everything speaks to where the buyer actually is.
            </p>
          </div>
        </div>
      </div>

      <div 
        data-step="54"
        data-approach-block
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <FadeInBlock delay={150}>
          <div className="w-full justify-start">
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">We </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">launch</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7"> under </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">real conditions</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">.</span>
            <br />
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">Let the </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">market</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7"> </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">respond</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">...</span>
          </div>
        </FadeInBlock>
      </div>

      <div 
        data-step="55"
        data-approach-block
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <FadeInBlock delay={300}>
          <div className="w-full justify-start">
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">And </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">align the system</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7"> around </span>
            <span className="text-stone-50 text-xl font-medium font-['Fustat'] leading-7">what</span>
            <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7"> </span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">proved </span>
            <span className="text-stone-50 text-xl font-medium font-['Fustat'] leading-7">itself</span>
            <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">.</span>
            <br />
            <span className="text-stone-50 text-xl font-light font-['Fustat'] leading-7">Across Marketing. Product. And Sales.</span>
          </div>
        </FadeInBlock>
      </div>

      <div 
        data-step="56"
        data-approach-block
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start pl-[11.87px] pr-7.5 relative bg-[#151324]"
      >
        <FadeInBlock delay={150}>
          <div className="w-full justify-start">
            <span className="text-stone-50 text-4xl font-normal font-['Fustat'] leading-tight">So you can stop pushing growth<br /></span>
            <span className="text-stone-50 text-3xl font-extralight font-['Fustat'] leading-tight">and start directing it.</span>
          </div>
        </FadeInBlock>
      </div>

      {/* ── Light Part: Entry Point (Release Step 61) ── */}
      <div 
        data-step="61"
        data-approach-block
        className="px-[11.87px] py-40 snap-start"
        style={{ background: 'linear-gradient(to bottom, #DBE9EE, #FFFFFF)' }}
      >
        <div className="w-full flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start font-light font-['Fustat'] leading-[1.2]" style={{ color: '#516066', fontSize: '22.05px' }}>
              Scaling isn’t a template.
            </div>
            <div className="self-stretch justify-start font-medium font-['Fustat'] leading-[1.1]" style={{ color: '#171425', fontSize: '50.18px' }}>
              Growth Depends on Where You’re Constrained
            </div>
          </div>
          <div className="self-stretch justify-start font-light font-['Fustat'] leading-[1.3] mb-[37px]" style={{ color: '#1E262D', fontSize: '22.05px' }}>
            Some companies need clarity before momentum. Others need the system to scale what’s already working.<br />
            We start where friction actually lives.
          </div>
        </div>

        {/* ── Direction Sprint Card ── */}
        <div 
          className="rounded-[30px] px-6 py-10 flex flex-col items-start relative box-border w-full"
          style={{ 
            backgroundColor: '#C6D7F9', 
            height: '760px',
            boxShadow: 'inset 0 0 0 0.5px #191432',
          }}
        >
          <div className="w-full flex-1 flex flex-col">
            <h2 className="font-['Fustat'] font-semibold leading-none mb-1" style={{ color: '#171425', fontSize: '29.98px' }}>
              Direction Sprint
            </h2>
            
            <p className="font-['Lato'] italic leading-tight mb-2.5" style={{ color: '#1A1A2E', fontSize: '17px' }}>
              When scaling feels busy, but not unified.
            </p>

            <p className="font-['Lato'] font-light leading-tight" style={{ color: '#171425', fontSize: '15px' }}>
              You’ve tested angles, launched campaigns, optimized metrics, but growth still feels scattered.
            </p>
            <p className="font-['Lato'] font-normal leading-tight mb-[18px]" style={{ color: '#171425', fontSize: '15px' }}>
              More activity isn’t the answer. Direction is.
            </p>

            <div className="w-full h-px mb-2.5" style={{ backgroundColor: '#1B1B2F' }} />

            <h3 className="font-['Lato'] font-semibold leading-none mb-[3.85px]" style={{ color: '#171425', fontSize: '18.84px' }}>
              We’ll be calibrating:
            </h3>
            <ul className="flex flex-col gap-1 mb-[13px]">
              {[
                "The exact cohort worth prioritizing, based on behavior and awareness stage",
                "The entry point that matches their specific intent",
                "The specific narrative structured around how your offer is processed",
                "A custom experience built to surface signal and reduce friction"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="shrink-0" style={{ color: '#171425', fontSize: '15px' }}>•</span>
                  <span className="font-['Lato'] font-light leading-tight" style={{ color: '#171425', fontSize: '15px' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="font-['Lato'] font-semibold leading-none mb-[3.85px]" style={{ color: '#171425', fontSize: '18.84px' }}>
              What you’ll leave with:
            </h3>
            <ul className="flex flex-col gap-1 mb-[19.7px]">
              {[
                "Clarity on what’s truly moving the needle",
                "A validated approach worth scaling",
                "Dedicated journeys (ads, landing pages, email flows) engineered to convert",
                "A unified decision logic across teams",
                "A practical roadmap, grounded in proof and ready for expansion"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="shrink-0" style={{ color: '#171425', fontSize: '15px' }}>•</span>
                  <span className="font-['Lato'] font-light leading-tight" style={{ color: '#171425', fontSize: '15px' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-['Lato'] font-normal leading-tight mb-[19px]" style={{ color: '#171425', fontSize: '15px' }}>
              This is not consulting. It’s validated direction, built and pressure-tested in-market.
            </p>
          </div>

          <div className="w-full mt-auto">
            <button 
              className="w-full flex items-center justify-center rounded-full active:scale-[0.98] transition-transform mb-2.5 shadow-sm"
              style={{ backgroundColor: '#1A1A2E', height: '60px' }}
            >
              <span className="text-white font-['Fustat'] font-medium" style={{ fontSize: '18.75px' }}>
                Calibrate your Growth →
              </span>
            </button>

            <p className="w-full text-center font-['Lato'] font-light" style={{ color: '#3C3C3C', fontSize: '14.56px' }}>
              Build once. Scale deliberately.
            </p>
          </div>
        </div>

        <div className="mt-5" />

        {/* ── Expansion System Card ── */}
        <div 
          className="rounded-[30px] px-6 py-10 flex flex-col items-start relative box-border w-full mx-auto"
          style={{ 
            backgroundColor: '#171425', 
            height: '980px',
            boxShadow: 'inset 0 0 0 0.5px #191432',
          }}
        >
          <div className="w-full flex-1 flex flex-col">
            <h2 className="font-['Fustat'] font-semibold leading-none mb-1 text-white" style={{ fontSize: '29.98px' }}>
              Expansion System
            </h2>
            
            <p className="font-['Lato'] italic font-light leading-tight mb-2.5" style={{ color: '#D2D2FF', fontSize: '17px' }}>
              When the approach is evident, but scale demands deeper execution.
            </p>

            <div className="flex flex-col gap-0 mb-6">
              <p className="font-['Lato'] font-light leading-tight text-white" style={{ fontSize: '15px' }}>
                You’ve validated the direction.
              </p>
              <p className="font-['Lato'] font-normal leading-tight text-white" style={{ fontSize: '15px' }}>
                Now we extend it across your highest-leverage surfaces.
              </p>
            </div>

            <div className="w-full h-px mb-6 opacity-20" style={{ backgroundColor: '#FFFFFF' }} />

            <h3 className="font-['Lato'] font-semibold leading-none mb-[3.85px] text-white" style={{ fontSize: '18.84px' }}>
              We operationalize it through:
            </h3>
            <ul className="flex flex-col gap-1 mb-6">
              {[
                "Upgrading your key growth assets for scale (site, funnels, decks)",
                "Optimizing acquisition around proven signals",
                "Reinforcing conversion systems for expansion and efficiency",
                "Embedding narrative cohesion across Product, Marketing, and Sales"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="shrink-0 text-white" style={{ fontSize: '15px' }}>•</span>
                  <span className="font-['Lato'] font-light leading-tight text-white" style={{ fontSize: '15px' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="font-['Lato'] font-semibold leading-none mb-[3.85px] text-white" style={{ fontSize: '18.84px' }}>
              Depending on where scale is bottlenecked, this can extend to:
            </h3>
            <ul className="flex flex-col gap-0.5 mb-6 pl-2">
              {[
                "Website restructuring",
                "Landing ecosystems",
                "Campaign systems",
                "Sales enablement",
                "Product narrative alignment"
              ].map((item, i) => (
                <li key={i} className="font-['Lato'] font-light leading-tight text-white" style={{ fontSize: '15px' }}>
                  – {item}
                </li>
              ))}
            </ul>

            <h3 className="font-['Lato'] font-semibold leading-none mb-[3.85px] text-white" style={{ fontSize: '18.84px' }}>
              What you’ll leave with:
            </h3>
            <ul className="flex flex-col gap-1 mb-6">
              {[
                "Structural alignment across critical channels and surfaces",
                "Systems designed to convert and installed to scale, not strain",
                "Cohesive execution across teams",
                "Structural capacity to expand what works",
                "Growth that compounds instead of resets"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="shrink-0 text-white" style={{ fontSize: '15px' }}>•</span>
                  <span className="font-['Lato'] font-light leading-tight text-white" style={{ fontSize: '15px' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-0 mt-auto mb-4">
              <p className="font-['Lato'] font-normal leading-tight text-white" style={{ fontSize: '15px' }}>
                This is not more activity.
              </p>
              <p className="font-['Lato'] font-normal leading-tight text-white" style={{ fontSize: '15px' }}>
                It’s structural expansion built on proof.
              </p>
            </div>
          </div>

          <div className="w-full mt-auto">
            <button 
              className="w-full flex items-center justify-center rounded-full active:scale-[0.98] transition-transform mb-2.5 shadow-sm"
              style={{ backgroundColor: '#8B8CFB', height: '60px' }}
            >
              <span className="font-['Fustat'] font-semibold" style={{ color: '#171425', fontSize: '18.75px' }}>
                Scale What Works →
              </span>
            </button>
            <p className="w-full text-center font-['Lato'] font-light" style={{ color: '#9FAECB', fontSize: '14.56px' }}>
              Build the system that scales.
            </p>
          </div>
        </div>

        {/* ── Final Call to Action Section ── */}
        <div className="mt-20 flex flex-col items-center text-center">
          <h2 className="font-['Fustat'] font-medium mb-1.5" style={{ color: '#191432', fontSize: '40.18px', lineHeight: '1.1' }}>
            Not sure where <br />
            you stand?
          </h2>
          
          <p className="font-['Fustat'] font-extralight mb-[23px]" style={{ color: '#191432', fontSize: '20.05px' }}>
            We’ll identify it in one focused session.
          </p>

          <p className="font-['Fustat'] font-light mb-[23px]" style={{ color: '#191432', fontSize: '22.05px', lineHeight: '1.3' }}>
            Direction or expansion,<br />
            you’ll leave knowing exactly <br />
            where to start.
          </p>

          <div className="w-full px-[51.5px]">
            <button 
              className="w-full flex items-center justify-center rounded-full active:scale-[0.98] transition-transform mb-2.5 shadow-md"
              style={{ 
                backgroundColor: '#191432', 
                height: '60px',
                border: '0.5px solid #1A1A2E'
              }}
            >
              <span className="text-white font-['Fustat'] font-medium" style={{ fontSize: '18.75px' }}>
                Fix your Growth →
              </span>
            </button>
          </div>

          <p className="font-['Lato'] font-light" style={{ color: '#191627', fontSize: '14.56px' }}>
            No obligation. Just alignment.
          </p>
        </div>
      </div>
    </>
  );
}
