
import { useState, useRef, useEffect } from 'react';
import { StaggerReveal } from '../shared/StaggerReveal';

interface MobileDecisionStageProps {
  onStepChange?: (step: number) => void;
}

export default function MobileDecisionStage({ onStepChange }: MobileDecisionStageProps) {
  const chips = [
    "Awareness depth",
    "Problem clarity",
    "Solution familiarity",
    "Channel context",
    "Evaluation mode",
    "Risk sensitivity",
    "Intent strength",
    "Acquisition source"
  ];

  // 1. Data Definitions
  const projects = [
    {
      id: 'iscp',
      name: 'ISCP',
      logo: '/src/assets/logos/ISCP.png',
      bgColor: '#3B070B',
      slides: [
        {
          type: 'title-context',
          name: 'ISCP',
          description: 'Global membership-based organization',
          pill: 'Context',
          content: 'Institutional brand. No coherent conversion journey.',
          image: '/src/assets/slides/ICSP_1.png'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Installed a stage-aware entry layer. Structured three intent-based tiers. Let behavior shape the message.',
          image: '/src/assets/slides/ICSP_1.png'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'Behavior clarified positioning. The ecosystem was rebuilt around proven demand.',
          image: '/src/assets/slides/ICSP_1.png'
        },
        {
          type: 'cta',
          topLine: 'Direction made visible.',
          mainLine: 'Scale made deliberate.',
          ctaText: 'Calibrate your Growih',
          image: '/src/assets/slides/ICSP_1.png'
        }
      ]
    },
    {
      id: 'mobybots',
      name: 'MobyBots',
      logo: '/src/assets/logos/MobyBots.png',
      bgColor: '#1E293B',
      slides: [
        {
          type: 'title-context',
          name: 'MobyBots',
          description: 'Global membership-based organization',
          pill: 'Context',
          content: 'Early traction.\nExpansion friction.\n\nNew buyers were skeptical.',
          image: '/src/assets/slides/MobyBots_1.png'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Shifted from outcome-led to pain-led positioning.\nValidated demand with fake-door testing.\nLet real behavior redirect the roadmap.',
          image: '/src/assets/slides/MobyBots_1.png'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'Signal clarified real buyer intent.\n\nProduct, sales, and fundraising\naligned around proven pull.',
          image: '/src/assets/slides/MobyBots_1.png'
        },
        {
          type: 'cta',
          topLine: 'Find the pull worth scaling.',
          mainLine: 'Scale from there.',
          ctaText: 'Calibrate your Growih',
          image: '/src/assets/slides/MobyBots_1.png'
        }
      ]
    },
    {
      id: 'doinglobal',
      name: 'doinGlobal',
      logo: '/src/assets/logos/doinGlobal.png',
      bgColor: '#0F172A',
      slides: [
        {
          type: 'title-context',
          name: 'doinGlobal',
          description: 'Global membership-based organization',
          pill: 'Context',
          content: 'Strong program.\nLow resonance.\n\nThe positioning assumed awareness\nthat wasn’t there.'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Mapped awareness depth\nbefore restructuring the offer.\n\nReordered the journey\naround how prospects actually move.'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'Alignment replaced explanation.\nThe problem became undeniable.\n\nThe offer stopped feeling educational,\nand started feeling necessary.'
        },
        {
          type: 'cta',
          topLine: 'Don’t explain the offer.',
          mainLine: 'Reveal the necessity.',
          ctaText: 'Calibrate your Growih'
        }
      ]
    },
    {
      id: 'obrasdemar',
      name: 'Obras de Mar',
      logo: '/src/assets/logos/ObrasDeMar.png',
      bgColor: '#134E4A',
      slides: [
        {
          type: 'title-context',
          name: 'Obras de Mar',
          description: 'Global membership-based organization',
          pill: 'Context',
          content: 'High consideration cycle.\nLow structural alignment.\n\nBuyers were navigating touchpoints —\nnot a progression.'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Installed a stage-aligned growth architecture.\n\nRe-architected acquisition, landing, sales, and events around a common buyer progression.'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'From scattered touchpoints\nto structured journeys.\n\nSales stopped compensating.\nThe path did the work.'
        },
        {
          type: 'cta',
          topLine: 'Don’t push harder.',
          mainLine: 'Build the system.',
          ctaText: 'Calibrate your Growih'
        }
      ]
    }
  ];

  // 2. State Management
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const activeProject = projects[activeProjectIdx];
  const activeSlide = activeProject.slides[activeSlideIdx];

  const scrollRef = useRef<HTMLDivElement>(null);

  // 3. Navigation Handlers
  const syncSlideIndex = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeSlideIdx) setActiveSlideIdx(index);
  };

  const goToSlide = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.clientWidth,
      behavior: 'smooth'
    });
    setActiveSlideIdx(index);
  };

  const nextSlide = () => goToSlide((activeSlideIdx + 1) % activeProject.slides.length);
  const prevSlide = () => goToSlide((activeSlideIdx - 1 + activeProject.slides.length) % activeProject.slides.length);

  // Reset scroll on project change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
      setActiveSlideIdx(0);
    }
  }, [activeProjectIdx]);

  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!onStepChange || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onStepChange(30); // Step 30 is outside snap ranges
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onStepChange]);

  return (
    <section ref={sectionRef} className="bg-[#FCFAF3] py-20 overflow-hidden">
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-2.5 w-full">
        {/* Header Block */}
        <div className="self-stretch flex flex-col justify-center items-center px-5">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              <StaggerReveal staggerDelay={120} className="w-80 text-center justify-start leading-9">
                <span className="text-gray-900 text-4xl font-semibold font-['Fustat']">Match the Build to the </span>
                <span className="text-indigo-400 text-4xl font-semibold font-['Fustat']">Decision Stage<span className="text-gray-900 font-normal">.</span></span>
              </StaggerReveal>
              <StaggerReveal staggerDelay={80} baseDelay={600} className="self-stretch text-center justify-start text-slate-900 text-base font-light font-['Fustat']">
                Growth isn’t static. Execution must adapt.
              </StaggerReveal>
            </div>
          </div>
        </div>

        {/* Chips Infinite Carousel */}
        <div className="w-full relative overflow-hidden mt-[10px]">
          <div className="flex w-fit animate-marquee gap-[5px]">
            {chips.map((text, idx) => (
              <div
                key={`orig-${idx}`}
                className="px-7 py-4 bg-violet-100/70 rounded-[10px] outline-[0.43px] outline-stone-50 backdrop-blur-md flex justify-center items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                <div className="opacity-80 text-center text-slate-900 text-lg font-extralight font-['Fustat'] leading-5">
                  {text}
                </div>
              </div>
            ))}
            {chips.map((text, idx) => (
              <div
                key={`dup-${idx}`}
                className="px-7 py-4 bg-violet-100/70 rounded-[10px] outline-[0.43px] outline-stone-50 backdrop-blur-md flex justify-center items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                <div className="opacity-80 text-center text-slate-900 text-lg font-extralight font-['Fustat'] leading-5">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Takes Shape Section */}
        <div className="mt-[51px] self-stretch flex flex-col justify-start items-center gap-8 w-full">
          <div className="self-stretch text-center text-zinc-600 text-xl font-normal font-['Fustat']">
            This is how the system takes shape:
          </div>

          <div className="flex flex-col items-center gap-6 w-full px-5">
            {/* Main Card Container with Fixed Background Image */}
            <div 
              className="w-full max-w-95 h-129.25 rounded-[40px] transition-colors duration-500 relative overflow-hidden shadow-2xl"
              style={{ backgroundColor: `${activeProject.bgColor}F2` }} // F2 for 95% opacity
            >
              {/* Static Background Image Layer */}
              {(activeSlide as any).image && (
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <img 
                    src={(activeSlide as any).image} 
                    alt="" 
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-150 transition-all duration-700"
                  />
                  <div 
                    className="absolute inset-0" 
                    style={{ background: 'linear-gradient(to bottom, #000000, #8B8CFB)', opacity: 0.6 }} 
                  />
                </div>
              )}

              {/* Horizontal Scroll Container (Slides) */}
              <div 
                ref={scrollRef}
                onScroll={syncSlideIndex}
                className="relative z-10 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full overscroll-x-contain"
                style={{ scrollbarWidth: 'none' }}
              >
                {activeProject.slides.map((slide, i) => (
                  <div 
                    key={i}
                    className="w-full min-w-full h-full snap-start snap-always shrink-0 px-8 py-14 relative flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    {slide.type === 'title-context' && (
                      <>
                        {/* Title Block */}
                        <div className="absolute top-7.75 left-0 right-0 inline-flex flex-col justify-end items-center gap-20">
                          <div className="flex flex-col justify-start items-center">
                            <div className="self-stretch text-center justify-start text-white text-lg font-normal font-['Fustat'] leading-5 whitespace-pre-line">{slide.name}</div>
                            <div className="w-80 text-center justify-start text-slate-200 text-xl font-extralight font-['Fustat'] leading-6 whitespace-pre-line">{slide.description}</div>
                          </div>
                        </div>

                        {/* Context Block */}
                        <div className="absolute bottom-[38.82px] left-0 right-0 inline-flex justify-center items-end gap-1 px-5">
                          <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                            <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                              <div className="w-20 self-stretch text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">{slide.pill}</div>
                            </div>
                            <div className="w-80 text-center justify-start text-white text-2xl font-light font-['Fustat'] leading-7 whitespace-pre-line">
                              {slide.content}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {slide.type === 'intervention' && (
                      <div className="absolute top-6.5 left-0 right-0 inline-flex justify-center items-end gap-1 px-5">
                        <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                          <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                            <div className="text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">{slide.pill}</div>
                          </div>
                          <div className="w-80 text-center justify-start text-white text-xl font-light font-['Fustat'] leading-6 whitespace-pre-line">
                            {slide.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {slide.type === 'outcome' && (
                      <div className="absolute bottom-[38.82px] left-0 right-0 inline-flex justify-center items-end gap-1 px-5">
                        <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                          <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                            <div className="text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">{slide.pill}</div>
                          </div>
                          <div className="w-80 text-center justify-start text-white text-xl font-light font-['Fustat'] leading-6 whitespace-pre-line">
                            {slide.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {slide.type === 'cta' && (
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="text-slate-200 text-xl font-extralight font-['Fustat'] leading-tight whitespace-pre-line">{slide.topLine}</div>
                          <div className="text-white text-4xl font-normal font-['Fustat'] leading-tight whitespace-pre-line">{slide.mainLine}</div>
                        </div>
                        
                        <button className="w-72 px-8 py-4 bg-white rounded-[50px] shadow-lg flex items-center justify-center gap-2 mt-[15.98px] active:scale-95 transition-transform">
                          <span className="text-slate-900 text-lg font-medium font-['Fustat']">{slide.ctaText}</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-6">
              <button 
                onClick={prevSlide}
                className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                aria-label="Previous slide"
              >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <div className="flex gap-2">
                {activeProject.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeSlideIdx === i ? 'bg-indigo-400 w-3 h-3' : 'bg-zinc-300'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                aria-label="Next slide"
              >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Logo Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-4">
              {projects.map((proj, idx) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveProjectIdx(idx);
                    setActiveSlideIdx(0);
                  }}
                  className={`flex items-center justify-center transition-all duration-500 transform ${
                    activeProjectIdx === idx ? 'grayscale-0 scale-105' : 'grayscale opacity-40 hover:opacity-70'
                  }`}
                >
                  <img 
                    src={proj.logo} 
                    alt={proj.name} 
                    className="max-h-8 w-auto object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
