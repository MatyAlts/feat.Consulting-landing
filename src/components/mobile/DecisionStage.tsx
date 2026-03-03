import { useRef, useEffect, useState } from 'react'
import { StaggerReveal } from '../shared/StaggerReveal'

// Map all assets in /src/assets for dynamic lookup
const assetModules = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg}', { eager: true, query: '?url', import: 'default' });

const resolveAsset = (path: string) => {
  // If it's already a resolved URL (starts with data: or http), return it
  if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('blob:')) return path;
  // Look up in the glob map
  return (assetModules[path] as any) || path;
};

interface MobileDecisionStageProps {
  onStepChange?: (step: number) => void;
}

export default function MobileDecisionStage({ onStepChange }: MobileDecisionStageProps) {
  // Reset scroll when entering this component in strategy page
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  }, []);

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
          description: 'Global membership-based\norganization',
          pill: 'Context',
          content: 'Institutional brand.\nNo coherent conversion journey.',
          image: '/src/assets/slides/ICSP_1.png'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Installed a stage-aware entry layer. Structured three intent-based tiers. Let behavior shape the message.',
          image: '/src/assets/slides/ICSP_2.png'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'Behavior clarified positioning.\nThe ecosystem was rebuilt around\nproven demand.',
          image: '/src/assets/slides/ICSP_3.png'
        },
        {
          type: 'cta',
          topLine: 'Direction made visible.',
          mainLine: 'Scale made deliberate.',
          ctaText: 'Calibrate your Growth',
          image: '/src/assets/slides/ICSP_4.png',
          layout: {
            topLineTop: '123.72px',
            mainLineTop: '153.72px',
            mainFontSize: '39.69px',
            buttonTop: '275.98px',
            linkBottom: '139.46px'
          }
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
          description: 'Advanced analytics product scaling\nbeyond founder-led sales',
          pill: 'Context',
          content: 'Early traction. Expansion friction.\nNew buyers were skeptical.',
          image: '/src/assets/slides/MobyBots_1.png'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Shifted from outcome-led to pain-led\npositioning.\nValidated demand with fake-door\ntesting.\nLet real behavior redirect the roadmap.',
          image: '/src/assets/slides/MobyBots_2.png'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'Signal clarified real buyer intent.\nProduct, sales, and fundraising aligned\naround proven pull.',
          image: '/src/assets/slides/MobyBots_3.png'
        },
        {
          type: 'cta',
          topLine: 'Find the pull worth scaling.',
          mainLine: 'Scale from there.',
          ctaText: 'Calibrate your Growth',
          image: '/src/assets/slides/MobyBots_4.png',
          layout: {
            topLineTop: '157.21px',
            mainLineTop: '187.21px',
            mainFontSize: '34.69px',
            buttonTop: '242.49px',
            linkBottom: '172.95px'
          }
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
          description: 'Professional education platform\nin a fast–evolving market',
          pill: 'Context',
          content: 'Strong program. Low resonance.\nThe positioning assumed awareness\nthat wasn’t there.',
          image: '/src/assets/slides/doinGlobal_1.png'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Mapped awareness depth before\nrestructuring the offer.\nReordered the journey around how\nprospects actually move.',
          image: '/src/assets/slides/doinGlobal_2.png'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'Alignment replaced explanation.\nThe problem became undeniable.\nThe offer stopped feeling educational,\nand started feeling necessary.',
          image: '/src/assets/slides/doinGlobal_3.png'
        },
        {
          type: 'cta',
          topLine: 'Don’t explain the offer.',
          mainLine: 'Reveal the necessity.',
          ctaText: 'Calibrate your Growth',
          image: '/src/assets/slides/doinGlobal_4.png',
          layout: {
            topLineTop: '143px',
            topLineFontWeight: 400, // Fustat Regular
            mainLineTop: '173px',
            mainFontSize: '34.69px',
            buttonTop: '228.28px',
            linkBottom: '187.16px'
          }
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
          description: 'Asset–heavy developer with\ncomplex buyer journey',
          pill: 'Context',
          content: 'High consideration cycle.\nLow structural alignment.\n\nBuyers were navigating touchpoints\ninstead, not progressing.',
          image: '/src/assets/slides/ObrasDeMar_1.png'
        },
        {
          type: 'intervention',
          pill: 'Our Intervention',
          content: 'Installed a stage-aligned growth\narchitecture.\n\nRe-architected acquisition, landing,\nsales, and events around a common\nbuyer progression.',
          image: '/src/assets/slides/ObrasDeMar_2.png'
        },
        {
          type: 'outcome',
          pill: 'The Outcome',
          content: 'From scattered touchpoints\nto structured journeys.\n\nSales stopped compensating.\nThe path did the work.',
          image: '/src/assets/slides/ObrasDeMar_3.png'
        },
        {
          type: 'cta',
          topLine: 'Don’t push harder.',
          mainLine: 'Build the system.',
          ctaText: 'Calibrate your Growth',
          image: '/src/assets/slides/ObrasDeMar_4.png',
          layout: {
            topLineTop: '157.21px',
            topLineColor: '#DBE9EE',
            topLineFontWeight: 400, // Fustat Regular
            mainLineTop: '187.21px',
            mainFontSize: '34.69px',
            buttonTop: '242.49px',
            linkBottom: '172.95px'
          }
        }
      ]
    }
  ];

  // 2. State Management
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isChangingProject, setIsChangingProject] = useState(false);

  const activeProject = projects[activeProjectIdx];

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleProjectChange = (index: number) => {
    if (index === activeProjectIdx || isChangingProject) return;
    
    setIsChangingProject(true);
    setTimeout(() => {
      setActiveProjectIdx(index);
      setActiveSlideIdx(0);
      if (scrollRef.current) scrollRef.current.scrollLeft = 0;
      setTimeout(() => {
        setIsChangingProject(false);
      }, 50);
    }, 400); // Fade out duration
  };

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
    <>
      {/* 16. Final Narrative Sequence (Previously Step 20) */}
      <section
        id="system"
        className="w-full flex flex-col justify-start px-7.5 overflow-hidden py-24 bg-[#0D111F]"
      >
        <div className="self-stretch flex flex-col justify-start items-start relative z-10 w-full pt-8 text-left">
          <StaggerReveal staggerDelay={80} baseDelay={100} rootMargin="0px" className="w-full">
            <div className="text-[#A5B4FC] text-2xl font-light font-['Fustat'] leading-6">
              After years building journeys,
            </div>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={500} rootMargin="0px" className="w-full mb-4">
            <div className="text-[#A5B4FC] text-2xl font-light font-['Fustat'] leading-6">
              one pattern became clear:
            </div>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={900} rootMargin="0px" className="w-full">
            <p className="text-white text-4xl font-normal font-['Fustat'] leading-[1.11]">
              When growth
            </p>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={1200} rootMargin="0px" className="w-full">
            <p className="text-white text-4xl font-normal font-['Fustat'] leading-[1.11]">
              reflects how buyers
            </p>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={1500} rootMargin="0px" className="w-full mb-3">
            <p className="text-white text-4xl font-normal font-['Fustat'] leading-[1.11]">
              <span className="italic-lato-word" style={{
                fontFamily: 'Lato, sans-serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}>actually</span>{' '}decide,
            </p>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={2000} rootMargin="0px" className="w-full mb-10">
            <div className="w-full text-[#C7D2FE] text-[56px] font-normal font-['Fustat'] leading-[54.59px]">
              Scale stops depending on effort.
            </div>
          </StaggerReveal>

          <StaggerReveal staggerDelay={80} baseDelay={2500} rootMargin="0px" className="w-full flex flex-col">
            <p className="text-[#FCFAF3] text-[33.5px] font-light font-['Fustat'] leading-tight mb-12">
              That's where leverage replaces grind.
            </p>
            <div className="w-full border-t border-[#FCFAF3]/10" />
          </StaggerReveal>
        </div>
      </section>

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
        <div id="in-practice" className="mt-[51px] self-stretch flex flex-col justify-start items-center gap-8 w-full">
          <div className="self-stretch text-center text-zinc-600 text-xl font-normal font-['Fustat']">
            This is how the system takes shape:
          </div>

          <div className="flex flex-col items-center gap-6 w-full px-5">
            {/* Main Card Container with Fixed Background Image */}
            <div 
              className="w-full max-w-95 h-129.25 rounded-[40px] transition-colors duration-500 relative overflow-hidden shadow-2xl"
              style={{ backgroundColor: `${activeProject.bgColor}F2` }} // F2 for 95% opacity
            >
              {/* Background Image Layer with Cross-fade */}
              {activeProject.slides.map((slide: any, idx: number) => (
                <div 
                  key={`${activeProject.id}-${idx}`}
                  className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out pointer-events-none z-0"
                  style={{ opacity: activeSlideIdx === idx ? 1 : 0 }}
                >
                  {slide.image && (
                    <>
                      <img 
                        src={resolveAsset(slide.image)} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                      />
                      <div 
                        className="absolute inset-0" 
                        style={{ background: 'linear-gradient(to bottom, #000000, #8B8CFB)', opacity: 0.6 }} 
                      />
                    </>
                  )}
                </div>
              ))}

              {/* Horizontal Scroll Container (Slides) */}
              <div 
                data-horizontal-drag
                ref={scrollRef}
                onScroll={syncSlideIndex}
                className={`relative z-10 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full overscroll-x-contain transition-all duration-400 ease-out ${
                  isChangingProject ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                }`}
                style={{ scrollbarWidth: 'none' }}
              >
                {activeProject.slides.map((slide, i) => (
                  <div 
                    key={i}
                    className="w-full min-w-full h-full snap-start snap-always shrink-0 px-4 py-14 relative flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    {slide.type === 'title-context' && (
                      <>
                        {/* Title Block */}
                        <div className="absolute top-7.75 left-0 right-0 inline-flex flex-col justify-end items-center gap-1 px-4">
                          <div className="flex flex-col justify-start items-center w-full">
                            <div className="self-stretch text-center justify-start text-white text-lg font-medium font-['Fustat'] leading-5 whitespace-pre-line">{slide.name}</div>
                            <div className="w-full text-center justify-start text-slate-200 text-xl font-extralight font-['Fustat'] leading-tight whitespace-pre-line">{slide.description}</div>
                          </div>
                        </div>

                        {/* Context Block */}
                        <div className="absolute bottom-[38.82px] left-0 right-0 inline-flex justify-center items-end gap-1 px-4">
                          <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                            <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                              <div className="w-20 self-stretch text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">{slide.pill}</div>
                            </div>
                            <div className="w-full text-center justify-start text-white text-[20px] font-normal font-['Lato'] leading-tight whitespace-pre-line">
                              {slide.content}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {slide.type === 'intervention' && (
                      <div className="absolute top-6.5 left-0 right-0 inline-flex justify-center items-end gap-1 px-1">
                        <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                          <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                            <div className="text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">{slide.pill}</div>
                          </div>
                          <div className="w-full text-center justify-start text-white text-[19.5px] font-normal font-['Lato'] leading-tight whitespace-pre-line">
                            {slide.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {slide.type === 'outcome' && (
                      <div className="absolute bottom-[38.82px] left-0 right-0 inline-flex justify-center items-end gap-1 px-1">
                        <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                          <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                            <div className="text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">{slide.pill}</div>
                          </div>
                          <div className="w-full text-center justify-start text-white text-xl font-normal font-['Lato'] leading-tight whitespace-pre-line">
                            {slide.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {slide.type === 'cta' && (
                      <div className="absolute inset-0 w-full h-full flex flex-col items-center">
                        {/* Top Text */}
                        <div 
                          className="absolute text-slate-200 font-light font-['Fustat'] leading-none text-center w-full px-4"
                          style={{ 
                            top: (slide as any).layout?.topLineTop || '123.72px', 
                            fontSize: '21.3px',
                            fontWeight: (slide as any).layout?.topLineFontWeight,
                            color: (slide as any).layout?.topLineColor
                          }}
                        >
                          {slide.topLine}
                        </div>

                        {/* Main Line */}
                        <div 
                          className="absolute text-white font-normal font-['Fustat'] leading-none text-center w-full px-4"
                          style={{ 
                            top: (slide as any).layout?.mainLineTop || '153.72px', 
                            fontSize: (slide as any).layout?.mainFontSize || '39.69px' 
                          }}
                        >
                          {slide.mainLine}
                        </div>
                        
                        {/* CTA Button */}
                        <button 
                          onClick={() => window.open('#', '_blank')}
                          className="absolute w-72 h-15 bg-white rounded-[50px] shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                          style={{ 
                            top: (slide as any).layout?.buttonTop || '275.98px' 
                          }}
                        >
                          <span className="text-slate-900 font-medium font-['Fustat']" style={{ fontSize: '18.75px' }}>
                            {slide.ctaText}
                          </span>
                          <div className="absolute right-6 translate-x-1/2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                              <line x1="7" y1="17" x2="17" y2="7"></line>
                              <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                          </div>
                        </button>

                        {/* Next Project Link */}
                        <button 
                          onClick={() => {
                            const nextIdx = (activeProjectIdx + 1) % projects.length;
                            handleProjectChange(nextIdx);
                          }}
                          className="absolute text-slate-200 font-extralight font-['Fustat'] text-center w-full active:opacity-70 transition-opacity"
                          style={{ 
                            bottom: (slide as any).layout?.linkBottom || '139.46px', 
                            fontSize: '18.75px' 
                          }}
                        >
                          Go to next project →
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
                  onClick={() => handleProjectChange(idx)}
                  className={`flex items-center justify-center transition-all duration-500 transform ${
                    activeProjectIdx === idx ? 'grayscale-0 scale-105' : 'grayscale opacity-40 hover:opacity-70'
                  }`}
                >
                  <img 
                    src={resolveAsset(proj.logo)} 
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
    </>
  );
}
