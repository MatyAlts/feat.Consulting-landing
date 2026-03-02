import { useRef, useEffect, useState } from 'react';
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

export default function MobileApproach() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const textOverflowRef = useRef(0);

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

  return (
    <section className="flex flex-col w-full">

      {/* ── Scroll-scrub wrapper ─────────────────────────────────────────
          Height = sticky natural height + textOverflow (set by JS).
          When the wrapper's bottom reaches the sticky element's bottom,
          the sticky releases — exactly when the pan animation finishes.
      ── */}
      <div ref={wrapperRef} className="bg-[#151324] relative">

        {/* Sticky phrase — natural height, no h-screen, no justify-center */}
        <div
          ref={stickyRef}
          className="sticky top-0 z-10 bg-[#151324] overflow-hidden px-[30px] pt-40 pb-0"
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

      {/* ── Dark body ────────────────────────────────────────────────────
          pt-[258px] = exact visual gap from phrase bottom to first paragraph.
          The wrapper above ends right where the phrase ends, so this gap
          is exactly what the user sees.
      ── */}
      <div className="bg-[#151324] pt-[258px] pb-20 w-full overflow-hidden">
        <div className="flex flex-col justify-start items-center gap-40 w-full">

          {/* How this actually works - START OF SNAP SCROLL SECTIONS */}
          <div className="snap-start snap-always full-height w-full flex flex-col justify-center items-center px-[30px] relative">
            <FadeInBlock delay={150}>
              <div className="w-full text-center text-zinc-300 text-xl font-light font-['Fustat']">
                How this actually works:
              </div>
            </FadeInBlock>
          </div>

          <div className="w-full flex flex-col">
            <div className="snap-start snap-always full-height-min py-20 w-full flex flex-col justify-center items-start px-[30px] relative">
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

            <div className="snap-start snap-always full-height-min py-20 w-full flex flex-col justify-center items-start px-[30px] relative">
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

            <div className="snap-start snap-always full-height-min py-20 w-full flex flex-col justify-center items-start px-[30px] relative">
              <FadeInBlock delay={300}>
                <div className="w-full flex justify-start items-center gap-[193px]">
                  <div className="whitespace-nowrap">
                    <span className="text-stone-50 text-xl font-extralight font-['Fustat'] leading-7">We </span>
                    <span className="text-stone-50 text-xl font-normal font-['Fustat'] leading-7">create.</span>
                  </div>
                  <img src={chevronIcon} alt="Arrow Right" className="w-6 h-6 object-contain shrink-0" />
                </div>
              </FadeInBlock>
            </div>

            <div className="snap-start snap-always full-height-min py-20 w-full flex flex-col justify-center items-start px-[30px] relative">
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

            <div className="snap-start snap-always full-height-min py-20 w-full flex flex-col justify-center items-start px-[30px] relative">
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

            <div className="snap-start snap-always full-height-min py-20 w-full flex flex-col justify-center items-start px-[30px] relative">
              <FadeInBlock delay={150}>
                <div className="w-full justify-start">
                  <span className="text-stone-50 text-4xl font-normal font-['Fustat'] leading-tight">So you can stop pushing growth<br /></span>
                  <span className="text-stone-50 text-3xl font-extralight font-['Fustat'] leading-tight">and start directing it.</span>
                </div>
              </FadeInBlock>
            </div>
          </div>

        </div>
      </div>

      {/* ── Light Part: Entry Point ── */}
      <div className="bg-[#FCFAF3] px-[30px] py-40">
        <div className="w-full flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-slate-400 text-2xl font-normal font-['Fustat'] leading-tight">
              Scale starts with the right entry point.
            </div>
            <div className="self-stretch justify-start text-gray-900 text-5xl font-medium font-['Fustat'] leading-tight">
              Go from Friction to Focus
            </div>
          </div>
          <div className="self-stretch justify-start text-zinc-800 text-2xl font-light font-['Fustat'] leading-tight">
            Not every company needs the same intervention.<br />
            We've designed our engagement accordingly.
          </div>
        </div>
      </div>

    </section>
  );
}
