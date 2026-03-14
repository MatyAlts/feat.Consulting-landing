import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Map all assets in /src/assets for dynamic lookup
const assetModules = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const resolveAsset = (path: string) => {
  // If it's already a resolved URL (starts with data: or http), return it
  if (
    path.startsWith("data:") ||
    path.startsWith("http") ||
    path.startsWith("blob:")
  )
    return path;
  // Look up in the glob map
  return (assetModules[path] as any) || path;
};

interface MobileDecisionStageProps {
  onStepChange?: (step: number) => void;
}

export default function MobileDecisionStage({
  onStepChange,
}: MobileDecisionStageProps) {
  const navigate = useNavigate();
  // No longer resetting scroll to 0 here to allow MobileLayout to restore the position
  // when returning from the contact form.


  // 1. Data Definitions
  const projects = [
    {
      id: "iscp",
      name: "ISCP",
      logo: "/src/assets/logos/ISCP.png",
      bgColor: "#3B070B",
      slides: [
        {
          type: "title-context",
          name: "ISCP",
          description: "Global membership-based\norganization",
          pill: "Context",
          content: "Institutional brand.\nNo coherent conversion journey.",
          image: "/src/assets/slides/ICSP_1.png",
        },
        {
          type: "intervention",
          pill: "Our Intervention",
          content:
            "Installed a stage-aware entry layer. Structured three intent-based tiers. Let behavior shape the message.",
          image: "/src/assets/slides/ICSP_2.png",
        },
        {
          type: "outcome",
          pill: "The Outcome",
          content:
            "Behavior clarified positioning.\nThe ecosystem was rebuilt around\nproven demand.",
          image: "/src/assets/slides/ICSP_3.png",
        },
        {
          type: "cta",
          topLine: "Direction made visible.",
          mainLine: "Scale made deliberate.",
          ctaText: "Calibrate your Growth",
          image: "/src/assets/slides/ICSP_4.png",
          layout: {
            topLineTop: "123.72px",
            mainLineTop: "153.72px",
            mainFontSize: "39.69px",
            buttonTop: "275.98px",
            linkBottom: "139.46px",
          },
        },
      ],
    },
    {
      id: "mobybots",
      name: "MobyBots",
      logo: "/src/assets/logos/MobyBots.png",
      bgColor: "#1E293B",
      slides: [
        {
          type: "title-context",
          name: "MobyBots",
          description:
            "Advanced analytics product scaling\nbeyond founder-led sales",
          pill: "Context",
          content:
            "Early traction. Expansion friction.\nNew buyers were skeptical.",
          image: "/src/assets/slides/MobyBots_1.png",
        },
        {
          type: "intervention",
          pill: "Our Intervention",
          content:
            "Shifted from outcome-led to pain-led\npositioning.\nValidated demand with fake-door\ntesting.\nLet real behavior redirect the roadmap.",
          image: "/src/assets/slides/MobyBots_2.png",
        },
        {
          type: "outcome",
          pill: "The Outcome",
          content:
            "Signal clarified real buyer intent.\nProduct, sales, and fundraising aligned\naround proven pull.",
          image: "/src/assets/slides/MobyBots_3.png",
        },
        {
          type: "cta",
          topLine: "Find the pull worth scaling.",
          mainLine: "Scale from there.",
          ctaText: "Calibrate your Growth",
          image: "/src/assets/slides/MobyBots_4.png",
          layout: {
            topLineTop: "157.21px",
            mainLineTop: "187.21px",
            mainFontSize: "34.69px",
            buttonTop: "242.49px",
            linkBottom: "172.95px",
          },
        },
      ],
    },
    {
      id: "doinglobal",
      name: "doinGlobal",
      logo: "/src/assets/logos/doinGlobal.png",
      bgColor: "#0F172A",
      slides: [
        {
          type: "title-context",
          name: "doinGlobal",
          description:
            "Professional education platform\nin a fast–evolving market",
          pill: "Context",
          content:
            "Strong program. Low resonance.\nThe positioning assumed awareness\nthat wasn’t there.",
          image: "/src/assets/slides/doinGlobal_1.png",
        },
        {
          type: "intervention",
          pill: "Our Intervention",
          content:
            "Mapped awareness depth before\nrestructuring the offer.\nReordered the journey around how\nprospects actually move.",
          image: "/src/assets/slides/doinGlobal_2.png",
        },
        {
          type: "outcome",
          pill: "The Outcome",
          content:
            "Alignment replaced explanation.\nThe problem became undeniable.\nThe offer stopped feeling educational,\nand started feeling necessary.",
          image: "/src/assets/slides/doinGlobal_3.png",
        },
        {
          type: "cta",
          topLine: "Don’t explain the offer.",
          mainLine: "Reveal the necessity.",
          ctaText: "Calibrate your Growth",
          image: "/src/assets/slides/doinGlobal_4.png",
          layout: {
            topLineTop: "143px",
            topLineFontWeight: 400, // Fustat Regular
            mainLineTop: "173px",
            mainFontSize: "34.69px",
            buttonTop: "228.28px",
            linkBottom: "187.16px",
          },
        },
      ],
    },
    {
      id: "obrasdemar",
      name: "Obras de Mar",
      logo: "/src/assets/logos/ObrasDeMar.png",
      bgColor: "#134E4A",
      slides: [
        {
          type: "title-context",
          name: "Obras de Mar",
          description: "Asset–heavy developer with\ncomplex buyer journey",
          pill: "Context",
          content:
            "High consideration cycle.\nLow structural alignment.\n\nBuyers were navigating touchpoints\ninstead, not progressing.",
          image: "/src/assets/slides/ObrasDeMar_1.png",
        },
        {
          type: "intervention",
          pill: "Our Intervention",
          content:
            "Installed a stage-aligned growth\narchitecture.\n\nRe-architected acquisition, landing,\nsales, and events around a common\nbuyer progression.",
          image: "/src/assets/slides/ObrasDeMar_2.png",
        },
        {
          type: "outcome",
          pill: "The Outcome",
          content:
            "From scattered touchpoints\nto structured journeys.\n\nSales stopped compensating.\nThe path did the work.",
          image: "/src/assets/slides/ObrasDeMar_3.png",
        },
        {
          type: "cta",
          topLine: "Don’t push harder.",
          mainLine: "Build the system.",
          ctaText: "Calibrate your Growth",
          image: "/src/assets/slides/ObrasDeMar_4.png",
          layout: {
            topLineTop: "157.21px",
            topLineColor: "#DBE9EE",
            topLineFontWeight: 400, // Fustat Regular
            mainLineTop: "187.21px",
            mainFontSize: "34.69px",
            buttonTop: "242.49px",
            linkBottom: "172.95px",
          },
        },
      ],
    },
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
      behavior: "smooth",
    });
    setActiveSlideIdx(index);
  };

  const nextSlide = () =>
    goToSlide((activeSlideIdx + 1) % activeProject.slides.length);
  const prevSlide = () =>
    goToSlide(
      (activeSlideIdx - 1 + activeProject.slides.length) %
        activeProject.slides.length,
    );

  // Auto-rotation disabled per user request

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
      { threshold: 0.1 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onStepChange]);

  return (
    <>


      <section ref={sectionRef} className="bg-[#FCFAF3] py-20 overflow-hidden">
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-2.5 w-full">

          {/* System Takes Shape Section (Redesigned) */}
          <div
            id="in-practice"
            className="w-full flex flex-col items-center"
          >
            {/* Logo Grid at Top */}
            <div className="w-full flex justify-center gap-11.25 mb-1.5">
              {/* Column 1: ISCP & doinGlobal */}
              <div className="flex flex-col items-center gap-[-8px]">
                {[0, 2].map((idx) => (
                  <button
                    key={projects[idx].id}
                    onClick={() => handleProjectChange(idx)}
                    style={{ width: "96.34px", height: "60.2px" }}
                    className={`flex items-center justify-center transition-all duration-500 transform ${
                      activeProjectIdx === idx
                        ? "grayscale-0 scale-105 opacity-100"
                        : "grayscale opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img
                      src={resolveAsset(projects[idx].logo)}
                      alt={projects[idx].name}
                      className="max-h-full w-auto object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Column 2: MobyBots & Obras de Mar */}
              <div className="flex flex-col items-center gap-[-8px]">
                {[1, 3].map((idx) => (
                  <button
                    key={projects[idx].id}
                    onClick={() => handleProjectChange(idx)}
                    style={{ width: "128.73px", height: "59.59px" }}
                    className={`flex items-center justify-center transition-all duration-500 transform ${
                      activeProjectIdx === idx
                        ? "grayscale-0 scale-105 opacity-100"
                        : "grayscale opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img
                      src={resolveAsset(projects[idx].logo)}
                      alt={projects[idx].name}
                      className="max-h-full w-auto object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center w-full px-5">
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
                      <img
                        src={resolveAsset(slide.image)}
                        alt=""
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                      />
                    )}
                  </div>
                ))}

                {/* Horizontal Scroll Container (Slides) */}
                <div
                  data-horizontal-drag
                  ref={scrollRef}
                  onScroll={syncSlideIndex}
                  className={`relative z-10 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full overscroll-x-contain transition-all duration-400 ease-out ${
                    isChangingProject
                      ? "opacity-0 scale-95 blur-sm"
                      : "opacity-100 scale-100 blur-0"
                  }`}
                  style={{ scrollbarWidth: "none" }}
                >
                  {activeProject.slides.map((slide, i) => (
                    <div
                      key={i}
                      className="w-full min-w-full h-full snap-start snap-always shrink-0 px-4 py-14 relative flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                      {slide.type === "title-context" && (
                        <>
                          {/* Title Block */}
                          <div className="absolute top-7.75 left-0 right-0 inline-flex flex-col justify-end items-center gap-1 px-4">
                            <div className="flex flex-col justify-start items-center w-full">
                              <div className="self-stretch text-center justify-start text-white text-lg font-medium font-['Fustat'] leading-5 whitespace-pre-line">
                                {slide.name}
                              </div>
                              <div className="w-full text-center justify-start text-slate-200 text-xl font-extralight font-['Fustat'] leading-tight whitespace-pre-line">
                                {slide.description}
                              </div>
                            </div>
                          </div>

                          {/* Context Block */}
                          <div className="absolute bottom-[38.82px] left-0 right-0 inline-flex justify-center items-end gap-1 px-4">
                            <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                              <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                                <div className="w-20 self-stretch text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">
                                  {slide.pill}
                                </div>
                              </div>
                              <div className="w-full text-center justify-start text-white text-[20px] font-normal font-['Lato'] leading-tight whitespace-pre-line">
                                {slide.content}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {slide.type === "intervention" && (
                        <div className="absolute top-6.5 left-0 right-0 inline-flex justify-center items-end gap-1 px-1">
                          <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                            <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                              <div className="text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">
                                {slide.pill}
                              </div>
                            </div>
                            <div className="w-full text-center justify-start text-white text-[19.5px] font-normal font-['Lato'] leading-tight whitespace-pre-line">
                              {slide.content}
                            </div>
                          </div>
                        </div>
                      )}

                      {slide.type === "outcome" && (
                        <div className="absolute bottom-[38.82px] left-0 right-0 inline-flex justify-center items-end gap-1 px-1">
                          <div className="inline-flex flex-col justify-start items-center gap-2 w-full">
                            <div className="px-4 py-px rounded-[20px] outline-[0.50px] outline-offset-[-0.50px] outline-slate-200 inline-flex justify-center items-center gap-2.5">
                              <div className="text-center justify-start text-slate-200 text-xl font-light font-['Fustat']">
                                {slide.pill}
                              </div>
                            </div>
                            <div className="w-full text-center justify-start text-white text-xl font-normal font-['Lato'] leading-tight whitespace-pre-line">
                              {slide.content}
                            </div>
                          </div>
                        </div>
                      )}

                      {slide.type === "cta" && (
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center">
                          {/* Top Text */}
                          <div
                            className="absolute text-slate-200 font-light font-['Fustat'] leading-none text-center w-full px-4"
                            style={{
                              top:
                                (slide as any).layout?.topLineTop || "123.72px",
                              fontSize: "21.3px",
                              fontWeight: (slide as any).layout
                                ?.topLineFontWeight,
                              color: (slide as any).layout?.topLineColor,
                            }}
                          >
                            {slide.topLine}
                          </div>

                          {/* Main Line */}
                          <div
                            className="absolute text-white font-normal font-['Fustat'] leading-none text-center w-full px-4"
                            style={{
                              top:
                                (slide as any).layout?.mainLineTop ||
                                "153.72px",
                              fontSize:
                                (slide as any).layout?.mainFontSize ||
                                "39.69px",
                            }}
                          >
                            {slide.mainLine}
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => {
                              localStorage.removeItem("selectedTier");
                              navigate("/contact");
                            }}
                            className="absolute w-72 h-15 bg-white rounded-[50px] shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                            style={{
                              top:
                                (slide as any).layout?.buttonTop || "275.98px",
                            }}
                          >
                            <span
                              className="text-slate-900 font-medium font-['Fustat']"
                              style={{ fontSize: "18.75px" }}
                            >
                              {slide.ctaText}
                            </span>
                            <div className="absolute right-6 translate-x-1/2">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-60"
                              >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                              </svg>
                            </div>
                          </button>

                          {/* Next Project Link */}
                          <button
                            onClick={() => {
                              const nextIdx =
                                (activeProjectIdx + 1) % projects.length;
                              handleProjectChange(nextIdx);
                            }}
                            className="absolute text-slate-200 font-extralight font-['Fustat'] text-center w-full active:opacity-70 transition-opacity"
                            style={{
                              bottom:
                                (slide as any).layout?.linkBottom || "139.46px",
                              fontSize: "18.75px",
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
              <div className="flex items-center gap-6 mt-2.75 mb-10">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                  aria-label="Previous slide"
                >
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path
                      d="M7 1L2 6L7 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div className="flex gap-2 items-center">
                  {activeProject.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`rounded-full transition-all duration-300 ${
                        activeSlideIdx === i
                          ? "bg-indigo-400 w-[11.75px] h-[11.75px]"
                          : "bg-zinc-300 w-[9.14px] h-[9.14px]"
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
                    <path
                      d="M1 1L6 6L1 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>


            </div>
          </div>
        </div>
      </section>
    </>
  );
}
