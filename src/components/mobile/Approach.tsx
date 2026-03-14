import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


function FadeInBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animations earlier
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -20% 0px",
      },
    );

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
        transform: "none",
      }}
    >
      {children}
    </div>
  );
}

export default function MobileApproach({
  onStepChange: _onStepChange,
}: {
  onStepChange?: (step: number) => void;
}) {
  const navigate = useNavigate();

  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  /* ── Services Carousel (Vertical-to-Horizontal) Logic ── */
  useEffect(() => {
    let rafId: number | null = null;

    const updatePosition = () => {
      rafId = null;
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
      const calculatedIdx = Math.min(
        numCards - 1,
        Math.floor(progress * (numCards - 0.1)),
      );
      setActiveCardIdx(calculatedIdx);

      // Apply transform directly without transition for maximum smoothness
      row.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
    };

    const handleScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(updatePosition);
    };

    const main = document.querySelector("main");
    main?.addEventListener("scroll", handleScroll, { passive: true });
    // Run once for initial state
    updatePosition();

    return () => {
      main?.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);


  return (
    <>
      {/* ── New Section: Direction Clear ── */}
      <div
        id="impact"
        className="w-full pb-40 px-0 -mt-0.5 relative z-0"
        style={{
          background:
            "linear-gradient(to bottom, #1A1A2E 0%, #171425 23%, #FCFAF3 65%, #FCFAF3 100%)",
        }}
      >
        <div style={{ paddingTop: "80px" }} className="flex flex-col">
          <div className="mb-[60vh] px-7.5">
            <FadeInBlock delay={100}>
              <h2
                className="text-white font-light font-['Fustat'] leading-[1.1]"
                style={{ fontSize: "37.18px" }}
              >
                When direction <br />
                is clear,
              </h2>
            </FadeInBlock>
          </div>

          <div className="w-full flex justify-end pr-[19.5px] mb-[60vh]">
            <FadeInBlock delay={100}>
              <h2
                className="text-white font-normal font-['Fustat'] leading-[1.1] text-right"
                style={{ fontSize: "37.18px" }}
              >
                growth stops <br />
                depending <br />
                on effort.
              </h2>
            </FadeInBlock>
          </div>

          <div className="mt-40 px-0">
            <div className="mb-[80vh] pl-[21.5px]">
              <FadeInBlock delay={100}>
                <h3
                  className="font-medium font-['Fustat'] leading-[1.1] mb-[13px]"
                  style={{ color: "#FFFFFF", fontSize: "50.18px" }}
                >
                  Finally Moving <br />
                  Forward
                </h3>
                <p
                  className="font-light font-['Fustat'] leading-tight mb-[40px]"
                  style={{ color: "#BBBCF1", fontSize: "22.05px" }}
                >
                  Alignment replaces debate.
                </p>
                <p
                  className="font-medium font-['Fustat'] leading-tight text-white"
                  style={{ fontSize: "22.05px" }}
                >
                  Less rework. Fewer loops.
                  <br />
                  More forward motion.
                </p>
              </FadeInBlock>
            </div>

            <div className="mb-[80vh] pl-[21.5px]">
              <FadeInBlock delay={100}>
                <h3
                  className="font-medium font-['Fustat'] leading-[1.1] mb-[13px]"
                  style={{ color: "#191432", fontSize: "50.18px" }}
                >
                  Focus where <br />
                  It Matters
                </h3>
                <p
                  className="font-light font-['Fustat'] leading-tight mb-[40px]"
                  style={{ color: "#191432", fontSize: "22.05px" }}
                >
                  Allocation follows validated <br />
                  traction.
                </p>
                <p
                  className="font-medium font-['Fustat'] leading-tight"
                  style={{ color: "#191432", fontSize: "22.05px" }}
                >
                  No more scattered bets.
                  <br />
                  Double down on what works.
                </p>
              </FadeInBlock>
            </div>

            <div className="pb-0">
              <div className="pl-[21.5px] mb-10">
                <FadeInBlock delay={100}>
                  <h3
                    className="font-medium font-['Fustat'] leading-[1.1] mb-[13px]"
                    style={{ color: "#191432", fontSize: "50.18px" }}
                  >
                    Let It Work as <br />
                    One
                  </h3>
                  <p
                    className="font-light font-['Fustat'] leading-tight mb-[17px]"
                    style={{ color: "#191432", fontSize: "22.05px" }}
                  >
                    Product, Marketing, and Sales <br />
                    pull in the same direction.
                  </p>
                  <p
                    className="font-normal font-['Fustat'] leading-tight mb-[40.44px]"
                    style={{ color: "#191432", fontSize: "22.05px" }}
                  >
                    No more resets. What works <br />
                    scales.
                  </p>
                </FadeInBlock>
              </div>

              <FadeInBlock delay={100}>
                <div className="w-full px-[19px] flex justify-center text-left">
                  <div
                    className="w-full h-[162px] rounded-[22px] overflow-hidden relative border-[0.5px] border-[#191432]"
                    style={{ backgroundColor: "rgba(25, 20, 50, 0.05)" }}
                  >
                    <div className="absolute inset-0 pt-4 overflow-hidden pointer-events-none">
                      <div className="flex flex-col gap-3 pl-[26px] animate-marquee-vertical">
                        {[
                          "Landing ecosystems",
                          "Positioned homepage",
                          "Conversion architecture",
                          "Sales narrative",
                          "ICP refinement",
                          "Messaging system",
                          "Audience segmentation",
                          "Channel prioritization",
                          "Campaign systems",
                          "Acquisition experiments",
                          "Ad frameworks",
                          "Email sequences",
                          "Onboarding flows",
                          "Offer architecture",
                          "Product framing",
                          "Pitch deck refinement",
                          "GTM roadmap",
                          "Strategic brief",
                        ].map((word, idx) => (
                          <span
                            key={`v1-${idx}`}
                            className="font-['Fustat'] font-extralight text-[22.05px] text-black shrink-0"
                          >
                            {word}
                          </span>
                        ))}
                        {[
                          "Landing ecosystems",
                          "Positioned homepage",
                          "Conversion architecture",
                          "Sales narrative",
                          "ICP refinement",
                          "Messaging system",
                          "Audience segmentation",
                          "Channel prioritization",
                          "Campaign systems",
                          "Acquisition experiments",
                          "Ad frameworks",
                          "Email sequences",
                          "Onboarding flows",
                          "Offer architecture",
                          "Product framing",
                          "Pitch deck refinement",
                          "GTM roadmap",
                          "Strategic brief",
                        ].map((word, idx) => (
                          <span
                            key={`v2-${idx}`}
                            className="font-['Fustat'] font-extralight text-[22.05px] text-black shrink-0"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInBlock>

              <FadeInBlock delay={150}>
                <div className="w-full mt-[36px] text-right pr-[21px]">
                  <button
                    onClick={() => navigate("/contact")}
                    className="underline font-['Fustat'] font-light text-[22.05px] border-none bg-transparent p-0 cursor-pointer outline-none active:opacity-70 transition-opacity"
                    style={{ color: "#191432" }}
                  >
                    Let’s get to work →
                  </button>
                </div>
              </FadeInBlock>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Section: Strategy meets Execution ── */}
      <motion.div
        className="w-full mt-0"
        style={{
          background:
            "linear-gradient(to bottom, #171425 0%, #0C1831 30%, #021B30 100%)",
        }}
      >
        <div
          style={{ paddingTop: "160px" }}
          className="pl-[21px] text-left flex flex-col"
        >
          <FadeInBlock delay={100}>
            <p
              className="text-white font-light font-['Fustat'] leading-tight mb-[13px]"
              style={{ fontSize: "22.05px" }}
            >
              This only works if the thinking and <br />
              the building move together.
            </p>
            <h2
              className="text-white font-medium font-['Fustat'] leading-[1.1]"
              style={{ fontSize: "45.18px" }}
            >
              Where Strategy <br />
              Meets Execution.
            </h2>
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
                  text: (
                    <>
                      Some teams need clarity at the narrative layer. Others at
                      the funnel, product, or sales motion.
                      {"\n"}But the starting point is always the same:
                      {"\n"}
                      <span className="font-['Lato']">
                        how buyers actually decide.
                      </span>
                      {"\n"}We intervene where leverage actually lives.
                    </>
                  ),
                },
                {
                  supra: "Focused Calibration",
                  title: "Decisive by \nDesign",
                  text: (
                    <>
                      We focus on{" "}
                      <span className="font-['Lato']">
                        the decisions that unlock leverage first.
                      </span>
                      {"\n"}In{" "}
                      <span className="font-['Lato']">
                        a focused two-week sprint,
                      </span>{" "}
                      we cut through what’s blocking scale, so you can redirect
                      with confidence and move without losing ground.
                    </>
                  ),
                },
                {
                  supra: "Clear Direction",
                  title: "Shared \nConviction.",
                  text: (
                    <>
                      Whether you come in with a clear perspective or we shape
                      the path forward together, all{" "}
                      <span className="font-['Lato']">
                        strategic calls are made deliberately
                      </span>{" "}
                      — and{" "}
                      <span className="font-['Lato']">
                        carried through to execution.
                      </span>
                      {"\n"}So teams can move with total focus, and traction
                      continues to build.
                    </>
                  ),
                },
                {
                  supra: "Coordinated Execution",
                  title: "One Team. \nAll Surfaces.",
                  text: (
                    <>
                      Strategy, design, UX, media, and development{" "}
                      <span className="font-['Lato']">move in sync,</span>{" "}
                      whether inside your team, ours, or both.
                      {"\n"}
                      <span className="font-['Lato']">
                        No fragmentation. Just coordinated execution.
                      </span>
                    </>
                  ),
                },
                {
                  supra: "Embedded Capability",
                  title: "Transferable \nSystems.",
                  text: (
                    <>
                      What we build{" "}
                      <span className="font-['Lato']">
                        becomes part of your company as part of how your team
                        operates,
                      </span>{" "}
                      long after our collaboration ends.
                    </>
                  ),
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="shrink-0 border-[0.4px] border-[#E8E7E3]"
                  style={{
                    width: "327.03px",
                    borderRadius: "6.84px",
                    background:
                      "linear-gradient(to right, #182431 0%, #08141F 100%)",
                    padding: "36.14px 29.3px",
                  }}
                >
                  <p
                    className="font-['LatoExtraLight'] text-[20px] leading-tight mb-4"
                    style={{ color: "#D6D6F0" }}
                  >
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
              style={{ marginTop: "41.83px" }}
            >
              {[0, 1, 2, 3, 4].map((i) => {
                const isActive = activeCardIdx === i;
                return (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: isActive ? "10.56px" : "8.34px",
                      height: isActive ? "10.56px" : "8.34px",
                      backgroundColor: isActive ? "#5B5CA9" : "#2D344E",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CTA Container with Smooth Background Transition ── */}
        <div
          className="w-full relative pt-[121.11px] pb-24"
          style={{
            background:
              "linear-gradient(to bottom, #021B30 0%, #FCFAF3 200px, #FCFAF3 100%)",
          }}
        >
          {/* The CTA Card */}
          <div className="relative z-10 px-4">
            <div
              className="w-full rounded-[30.34px] relative overflow-hidden flex flex-col items-center text-center"
              style={{
                height: "358.35px",
                background: "linear-gradient(225deg, #D2D3FF 0%, #DBE9EE 100%)",
                border: "0.2px solid #000000",
              }}
            >
              <p
                className="font-['Fustat'] font-light"
                style={{
                  fontSize: "21.3px",
                  color: "#171425",
                  marginTop: "67.91px",
                  lineHeight: "1",
                }}
              >
                When direction gets serious,
              </p>
              <h2
                className="font-['Fustat'] font-medium"
                style={{
                  fontSize: "39.69px",
                  color: "#171425",
                  marginTop: "1px",
                  lineHeight: "1.05",
                }}
              >
                Scaling becomes <br /> obvious.
              </h2>

              <button
                onClick={() => navigate("/contact")}
                className="rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                style={{
                  marginTop: "15.98px",
                  width: "320px",
                  height: "67.43px",
                  backgroundColor: "#191432",
                }}
              >
                <span
                  className="text-white font-['Fustat'] font-normal"
                  style={{ fontSize: "18.75px" }}
                >
                  Start the conversation →
                </span>
              </button>

              <p
                className="font-['Lato'] font-light"
                style={{
                  marginTop: "10px",
                  fontSize: "14.56px",
                  color: "#191432",
                  opacity: 0.8,
                }}
              >
                No commitment required.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
