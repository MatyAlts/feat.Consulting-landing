import { useRef, useEffect, useState } from 'react';
import { StaggerReveal } from '../shared/StaggerReveal';
import chevronIcon from '../../assets/icons/si_chevron-right-circle-line.png';

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Trigger animations earlier
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { 
      threshold: 0,
      rootMargin: '0px 0px -20% 0px' 
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
  const wordsScrollRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  /* ── Interactive Infinite Scroll Logic (100% User Controlled, Bidirectional) ── */
  useEffect(() => {
    const scrollContainer = wordsScrollRef.current;
    if (!scrollContainer) return;

    const handleInfiniteScroll = () => {
      const { scrollTop, scrollHeight } = scrollContainer;
      const oneThirdHeight = scrollHeight / 3;

      // Wrap around logic with buffer for inertia
      if (scrollTop >= oneThirdHeight * 2) {
        // We reached the bottom part, jump to middle part
        scrollContainer.scrollTop = scrollTop - oneThirdHeight;
      } else if (scrollTop <= oneThirdHeight * 0.5) {
        // We reached the top part, jump to middle part
        scrollContainer.scrollTop = scrollTop + oneThirdHeight;
      }
    };

    scrollContainer.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    
    // Initialize to middle part so both directions work from the start
    const initialPos = (scrollContainer.scrollHeight / 3);
    scrollContainer.scrollTop = initialPos;

    return () => scrollContainer.removeEventListener('scroll', handleInfiniteScroll);
  }, []);

  /* ── Services Carousel (Vertical-to-Horizontal) Logic ── */
  useEffect(() => {
    let requestRef: number;
    
    const updatePosition = () => {
      if (!horizontalScrollRef.current || !cardsRowRef.current) return;
      
      const container = horizontalScrollRef.current;
      const row = cardsRowRef.current;
      
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress (0 to 1) based on container presence in viewport
      const totalScrollableHeight = rect.height - windowHeight;
      const currentScrollPos = -rect.top;
      
      let progress = currentScrollPos / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      const viewportWidth = window.innerWidth;
      const scrollWidth = row.scrollWidth;
      
      // Calculate travel: we want to move from 0 to negative (total width - viewport + right margin)
      const maxTranslate = scrollWidth - viewportWidth + 21; 
      
      // Sync active dot: simple mapping of progress to index (0-4)
      const numCards = 5;
      const calculatedIdx = Math.min(numCards - 1, Math.floor(progress * (numCards - 0.1)));
      setActiveCardIdx(calculatedIdx);
      
      // Apply transform directly without transition for maximum smoothness
      row.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
      
      requestRef = requestAnimationFrame(updatePosition);
    };

    requestRef = requestAnimationFrame(updatePosition);
    
    return () => cancelAnimationFrame(requestRef);
  }, []);

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
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
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
        className="bg-[#151324] relative w-full"
      >
        {/* Sticky phrase */}
        <div
          ref={stickyRef}
          className="sticky top-0 z-10 bg-[#151324] overflow-hidden px-7.5 pt-40 pb-0"
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
        className="bg-[#151324] pt-40 pb-20 w-full overflow-hidden flex flex-col gap-40" 
        ref={containerRef}
      >
        {/* First Narrative Block */}
        <div className="px-7.5 text-left my-24.5">
          <StaggerReveal staggerDelay={80} baseDelay={100} rootMargin="0px">
            <h2 className="text-white font-light font-['Fustat'] leading-[1.1]" style={{ fontSize: '39.18px' }}>
              We don’t hand <br />
              you a strategy <br />
              and disappear.
            </h2>
          </StaggerReveal>
        </div>

        {/* Second Narrative Block */}
        <div className="w-full flex justify-start px-7.5 mb-24.5">
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
        <div className="w-full flex justify-start px-7.5 mb-24.5">
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
        className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-7.5 relative bg-[#151324]"
      >
        <FadeInBlock delay={150}>
          <div className="w-full text-center text-zinc-300 text-xl font-light font-['Fustat']">
            How this actually works:
          </div>
        </FadeInBlock>
      </div>

      <div 
        data-step="51"
        data-approach-block
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start px-7.5 relative bg-[#151324]"
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
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start px-7.5 relative bg-[#151324]"
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
        className="snap-start snap-always min-h-dvh py-20 w-full flex flex-col justify-center items-start px-7.5 relative bg-[#151324]"
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
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start px-7.5 relative bg-[#151324]"
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
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start px-7.5 relative bg-[#151324]"
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
        className="snap-start snap-always full-height py-20 w-full flex flex-col justify-center items-start px-7.5 relative bg-[#151324]"
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
            Some companies need clarity before momentum. Others need the system to scale what’s already working.<br /><br />
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

      {/* ── New Section: Direction Clear ── */}
      <div 
        className="w-full pb-40 px-0 mt-[-1px]"
        style={{ background: 'linear-gradient(to bottom, #171425, #FCFAF3)' }}
      >
        <div style={{ paddingTop: '127.1px' }} className="flex flex-col">
          <div className="mb-[60vh] px-7.5">
            <FadeInBlock delay={100}>
              <h2 className="text-white font-light font-['Fustat'] leading-[1.1]" style={{ fontSize: '37.18px' }}>
                When direction <br />
                is clear,
              </h2>
            </FadeInBlock>
          </div>
          
          <div className="w-full flex justify-end pr-[19.5px] mb-[60vh]">
            <FadeInBlock delay={100}>
              <h2 className="text-white font-normal font-['Fustat'] leading-[1.1] text-left" style={{ fontSize: '37.18px' }}>
                growth stops <br />
                depending <br />
                on effort.
              </h2>
            </FadeInBlock>
          </div>

          <div className="mt-40 px-0">
            <div className="mb-[80vh] pl-[21.5px]">
              <FadeInBlock delay={100}>
                <h3 className="font-medium font-['Fustat'] leading-[1.1] mb-[13px]" style={{ color: '#FFFFFF', fontSize: '50.18px' }}>
                  Finally Moving <br />
                  Forward
                </h3>
                <p className="font-light font-['Fustat'] leading-tight mb-[40px]" style={{ color: '#BBBCF1', fontSize: '22.05px' }}>
                  Alignment replaces debate.
                </p>
                <p className="font-medium font-['Fustat'] leading-tight text-white" style={{ fontSize: '22.05px' }}>
                  Less rework. Fewer loops.<br />
                  More forward motion.
                </p>
              </FadeInBlock>
            </div>

            <div className="mb-[80vh] pl-[21.5px]">
              <FadeInBlock delay={100}>
                <h3 className="font-medium font-['Fustat'] leading-[1.1] mb-[13px]" style={{ color: '#191432', fontSize: '50.18px' }}>
                  Focus where <br />
                  It Matters
                </h3>
                <p className="font-light font-['Fustat'] leading-tight mb-[40px]" style={{ color: '#191432', fontSize: '22.05px' }}>
                  Allocation follows validated <br />
                  traction.
                </p>
                <p className="font-medium font-['Fustat'] leading-tight" style={{ color: '#191432', fontSize: '22.05px' }}>
                  No more scattered bets.<br />
                  Double down on what works.
                </p>
              </FadeInBlock>
            </div>

            <div className="pb-0">
              <div className="pl-[21.5px] mb-10">
                <FadeInBlock delay={100}>
                  <h3 className="font-medium font-['Fustat'] leading-[1.1] mb-[13px]" style={{ color: '#191432', fontSize: '50.18px' }}>
                    Let It Work as <br />
                    One
                  </h3>
                  <p className="font-light font-['Fustat'] leading-tight mb-[17px]" style={{ color: '#191432', fontSize: '22.05px' }}>
                    Product, Marketing, and Sales <br />
                    pull in the same direction.
                  </p>
                  <p className="font-normal font-['Fustat'] leading-tight mb-[40.44px]" style={{ color: '#191432', fontSize: '22.05px' }}>
                    No more resets. What works <br />
                    scales.
                  </p>
                </FadeInBlock>
              </div>

              <FadeInBlock delay={100}>
                <div className="w-full px-[19px] flex justify-center text-left">
                  <div 
                    className="w-full h-[162px] rounded-[22px] overflow-hidden relative border-[0.5px] border-[#191432]"
                    style={{ backgroundColor: 'rgba(25, 20, 50, 0.05)' }}
                  >
                    <div 
                      ref={wordsScrollRef}
                      className="absolute inset-0 flex flex-col pt-4 overflow-y-auto hide-scrollbar touch-pan-y"
                    >
                      <div className="flex flex-col gap-3 pl-[26px]">
                        {[
                          "Landing ecosystems", "Positioned homepage", "Conversion architecture", "Sales narrative", 
                          "ICP refinement", "Messaging system", "Audience segmentation", "Channel prioritization", 
                          "Campaign systems", "Acquisition experiments", "Ad frameworks", "Email sequences", 
                          "Onboarding flows", "Offer architecture", "Product framing", "Pitch deck refinement", 
                          "GTM roadmap", "Strategic brief"
                        ].map((word, idx) => (
                          <span key={`v1-${idx}`} className="font-['Fustat'] font-extralight text-[22.05px] text-black shrink-0">
                            {word}
                          </span>
                        ))}
                        {[
                          "Landing ecosystems", "Positioned homepage", "Conversion architecture", "Sales narrative", 
                          "ICP refinement", "Messaging system", "Audience segmentation", "Channel prioritization", 
                          "Campaign systems", "Acquisition experiments", "Ad frameworks", "Email sequences", 
                          "Onboarding flows", "Offer architecture", "Product framing", "Pitch deck refinement", 
                          "GTM roadmap", "Strategic brief"
                        ].map((word, idx) => (
                          <span key={`v2-${idx}`} className="font-['Fustat'] font-extralight text-[22.05px] text-black shrink-0">
                            {word}
                          </span>
                        ))}
                        {[
                          "Landing ecosystems", "Positioned homepage", "Conversion architecture", "Sales narrative", 
                          "ICP refinement", "Messaging system", "Audience segmentation", "Channel prioritization", 
                          "Campaign systems", "Acquisition experiments", "Ad frameworks", "Email sequences", 
                          "Onboarding flows", "Offer architecture", "Product framing", "Pitch deck refinement", 
                          "GTM roadmap", "Strategic brief"
                        ].map((word, idx) => (
                          <span key={`v3-${idx}`} className="font-['Fustat'] font-extralight text-[22.05px] text-black shrink-0">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInBlock>

              <FadeInBlock delay={150}>
                <div className="w-full mt-[36px] pl-[21px] text-left">
                  <span 
                    className="underline font-['Fustat'] font-light text-[22.05px]"
                    style={{ color: '#191432' }}
                  >
                    Let’s get to work →
                  </span>
                </div>
              </FadeInBlock>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Section: Strategy meets Execution ── */}
      <div 
        className="w-full mt-0"
        style={{ backgroundColor: '#171425' }}
      >
        <div style={{ paddingTop: '160px' }} className="pl-[21px] text-left flex flex-col">
          <FadeInBlock delay={100}>
            <h2 className="text-white font-medium font-['Fustat'] leading-[1.1] mb-[13px]" style={{ fontSize: '45.18px' }}>
              Where Strategy <br />
              Meets Execution.
            </h2>
            <p className="text-white font-light font-['Fustat'] leading-tight" style={{ fontSize: '22.05px' }}>
              This only works if the thinking and <br />
              the building move together.
            </p>
          </FadeInBlock>
        </div>

        {/* ── Services Cards Carousel (Vertical-to-Horizontal Scroll) ── */}
        <div 
          ref={horizontalScrollRef}
          className="relative w-full h-[400vh] mt-[52px]"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
            <div 
              ref={cardsRowRef}
              className="flex px-[21px] gap-[21px] items-start will-change-transform"
            >
              {[
                {
                  supra: "Context-Aware Strategy",
                  title: "Built Around \nYour Reality",
                  text: "Some teams need clarity at the narrative layer. Others at the funnel, product, or sales motion.\nWe intervene where leverage actually lives."
                },
                {
                  supra: "Focused Calibration",
                  title: "Decisive by \nDesign",
                  text: "We focus on the decisions that unlock leverage first. We quickly cut through what’s blocking scale, so you can redirect with confidence and move without losing ground."
                },
                {
                  supra: "Clear Direction",
                  title: "Shared \nConviction.",
                  text: "Whether you come in with a clear perspective or we shape the path forward together, all strategic calls are made deliberately and carried through to execution. So teams can move with total focus, and traction continues to build."
                },
                {
                  supra: "Coordinated Execution",
                  title: "One Team. \nAll Surfaces.",
                  text: "Strategy, design, UX, media, and development move in sync, whether inside your team, ours, or both.\nNo fragmentation. Just coordinated execution."
                },
                {
                  supra: "Embedded Capability",
                  title: "Transferable \nSystems.",
                  text: "What we build becomes part of your company as part of how your team operates, long after our collaboration ends."
                }
              ].map((card, idx) => (
                <div 
                  key={idx}
                  className="shrink-0 border-[0.4px] border-[#E8E7E3]"
                  style={{ 
                    width: '327.03px',
                    borderRadius: '6.84px',
                    background: 'linear-gradient(225deg, #08141F 0%, #182431 100%)',
                    padding: '36.14px 29.3px'
                  }}
                >
                  <p className="font-['LatoExtraLight'] text-[20px] leading-tight mb-4" style={{ color: '#D6D6F0' }}>
                    {card.supra}
                  </p>
                  <h3 className="font-['Fustat'] font-medium text-[31.21px] text-white leading-[1.1] mb-6 whitespace-pre-line">
                    {card.title}
                  </h3>
                  <p className="font-['LatoExtraLight'] text-[20px] text-white leading-relaxed whitespace-pre-line">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div 
              className="flex items-center justify-center gap-[11.53px] w-full"
              style={{ marginTop: '41.83px' }}
            >
              {[0, 1, 2, 3, 4].map((i) => {
                const isActive = activeCardIdx === i;
                return (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: isActive ? '10.56px' : '8.34px',
                      height: isActive ? '10.56px' : '8.34px',
                      backgroundColor: isActive ? '#5B5CA9' : '#2D344E'
                    }}
                  />
                );
              })}
            </div>
        </div>
      </div>

      {/* ── CTA Container with Split Background ── */}
      <div 
        className="w-full relative pt-[121.11px] pb-24"
        style={{ 
          background: 'linear-gradient(to bottom, #171425 300.29px, #FCFAF3 300.29px)' 
        }}
      >
        {/* The CTA Card */}
        <div className="relative z-10 px-4">
          <div 
            className="w-full rounded-[30.34px] relative overflow-hidden flex flex-col items-center text-center"
            style={{ 
              height: '358.35px',
              background: 'linear-gradient(225deg, #D2D3FF 0%, #DBE9EE 100%)',
            }}
          >
            <p 
              className="font-['Fustat'] font-light"
              style={{ 
                fontSize: '21.3px', 
                color: '#171425',
                marginTop: '67.91px',
                lineHeight: '1'
              }}
            >
              When direction gets serious,
            </p>
            <h2 
              className="font-['Fustat'] font-medium"
              style={{ 
                fontSize: '39.69px', 
                color: '#171425',
                marginTop: '1px',
                lineHeight: '1.05'
              }}
            >
              Scaling becomes <br /> obvious.
            </h2>
            
            <button 
              className="rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
              style={{ 
                marginTop: '15.98px',
                width: '320px',
                height: '67.43px',
                backgroundColor: '#191432'
              }}
            >
              <span className="text-white font-['Fustat'] font-normal" style={{ fontSize: '18.75px' }}>
                Start the conversation →
              </span>
            </button>
            
            <p 
              className="font-['Lato'] font-light"
              style={{ 
                marginTop: '10px',
                fontSize: '14.56px',
                color: '#191432',
                opacity: 0.8
              }}
            >
              No commitment required.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
