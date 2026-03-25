import { useEffect } from "react";
import { motion } from "framer-motion";

function FadeInRow({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        y: { duration: 0.6, ease: "easeOut" },
        opacity: { duration: 0.9, ease: "easeOut" },
        filter: { duration: 0.4, ease: "easeOut" }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


import { StaggerReveal } from "../shared/StaggerReveal";
import stage1Img from "../../assets/stages/Stage 1.png";
import stage2Img from "../../assets/stages/Stage 2.png";

const STAGES = [
  "Where awareness is forming",
  "What problem is actually top-of-mind",
  "What alternatives buyers consider",
  "Where evaluation happens",
  "What proof buyers need",
  "Where trust builds",
  "What removes hesitation",
  "What triggers the decision",
];

export default function DecisionStages({ onStepChange }: { onStepChange?: (step: number) => void }) {
  useEffect(() => {
    const scrollContainer = document.querySelector('.story-snap-main');
    if (!scrollContainer || !onStepChange) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        onStepChange(30);
      }
    }, {
      root: scrollContainer,
      threshold: 0.1
    });

    const currentRef = document.getElementById('stages');
    if (currentRef) observer.observe(currentRef);

    return () => observer.disconnect();
  }, [onStepChange]);

  return (
    <section
      id="stages"
      className="w-full flex flex-col items-center pt-32 pb-0 overflow-hidden relative z-1 bg-[#FCFAF3]"
    >
      {/* Title */}
      <div className="w-full px-5 mb-[8px] text-center">
        <StaggerReveal staggerDelay={80}>
          <h2
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "38.91px",
              color: "#1A1A2E",
              lineHeight: "1",
            }}
          >
            Focus depends on where growth is getting stuck
          </h2>
        </StaggerReveal>
      </div>

      {/* Ticker Wrapper */}
      <div className="w-full relative py-4">
        {/* Infinite Scroll Container */}
        <div
          className="flex gap-[5px] animate-ticker-left"
          style={{ width: "max-content" }}
        >
          {/* First set of cards */}
          {[...STAGES, ...STAGES].map((stage, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center rounded-[12px] border-[#1A1A2E]"
              style={{
                width: "max-content",
                height: "52px",
                paddingLeft: "18px",
                paddingRight: "18px",
                backgroundColor: "rgba(235, 234, 248, 0.7)",
                backdropFilter: "blur(14.7px)",
                WebkitBackdropFilter: "blur(14.7px)",
                borderWidth: "0.2px",
                borderStyle: "solid",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 200,
                  fontSize: "17.82px",
                  color: "#191432",
                }}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="w-full px-5 mt-[10px] text-center">
        <StaggerReveal staggerDelay={80} baseDelay={400}>
          <p
            style={{
              fontFamily: "Fustat",
              fontWeight: 300,
              fontSize: "18px",
              color: "#191432",
              lineHeight: "1.2",
            }}
          >
            Once we see where decisions are forming,
          </p>
          <p
            style={{
              fontFamily: "Fustat",
              fontWeight: 300,
              fontSize: "18px",
              color: "#191432",
              lineHeight: "1.2",
            }}
          >
            the work becomes straightforward.
          </p>
        </StaggerReveal>
      </div>

      {/* Stage 1 Container */}
      <div className="w-full px-[17.5px] pb-16 flex flex-col pt-24 bg-[#FCFAF3]">
        {/* Stage Header */}
        <div className="flex flex-col gap-2 mb-[19px]">
          <FadeInRow><span
            style={{
              fontFamily: "Lato",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "22.3px",
              color: "#8B8CFB",
              lineHeight: "1.1",
            }}
          >
            Step 1 — The Direction
          </span></FadeInRow>
          <FadeInRow><h3
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "31px",
              color: "#1A1A2E",
              lineHeight: "1.2",
            }}
          >
            First we identify the decision that will unlock growth.
          </h3></FadeInRow>
        </div>

        {/* Narrative & Lists Wrapper */}
        <div className="flex flex-col gap-[20px]">
          <FadeInRow><p
            style={{
              fontFamily: "Lato",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "18px",
              color: "#06203C",
              lineHeight: "1.1",
            }}
          >
            Where should growth actually focus?
          </p></FadeInRow>

          <FadeInRow><div
            style={{
              fontFamily: "Fustat",
              fontSize: "18px",
              color: "#191432",
              lineHeight: "1.1",
            }}
          >
            <p style={{ fontWeight: 300 }} className="mb-0">Teams often come asking for a website, campaigns, or better UX.</p>
            <p style={{ fontWeight: 700 }}>But those are symptoms.</p>
          </div></FadeInRow>

          <div className="bg-[#171425] flex flex-col justify-center px-[23px] py-[15px] rounded-[10px]">
            <div className="flex flex-col gap-[5px] leading-[1.1]">
              <p
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "15.5px",
                  color: "#FFFFFF",
                }}
              >
                The real question is:
              </p>
              <FadeInRow><p
                style={{
                  fontFamily: "Lato",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#D2D2FF",
                }}
              >
                What decision should the business help its audience make?
              </p></FadeInRow>
            </div>
          </div>

          <div
            style={{
              fontFamily: "Fustat",
              fontSize: "18px",
              color: "#191432",
            }}
          >
            <FadeInRow>
              <p style={{ fontWeight: 700, lineHeight: "1.1", marginBottom: "7px" }}>Output</p>
            </FadeInRow>
            <div className="flex flex-col gap-[7px]">
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>The growth decision the company needs to make</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>The audience and moment where the decision forms</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>The narrative worth building around</span>
              </div></FadeInRow>
            </div>
          </div>

          {/* Image Component */}
          <FadeInRow><div className="w-full mt-4 flex justify-center items-center">
            <img src={stage1Img} alt="Stage 1 Diagram" className="w-full h-auto object-contain rounded-[12px]" />
          </div></FadeInRow>
        </div>
      </div>

      {/* Stage 2 Container */}
      <div className="w-full px-[17.5px] pb-24 flex flex-col pt-24 bg-[#FCFAF3]">
        {/* Stage Header */}
        <div className="flex flex-col gap-2 mb-[19px]">
          <FadeInRow><span
            style={{
              fontFamily: "Lato",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "22.3px",
              color: "#8B8CFB",
              lineHeight: "1.1",
            }}
          >
            Step 2 — The Proof
          </span></FadeInRow>
          <FadeInRow><h3
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "31px",
              color: "#1A1A2E",
              lineHeight: "1.2",
            }}
          >
            Then we validate that direction in the real market.
          </h3></FadeInRow>
        </div>

        {/* Narrative & Lists Wrapper */}
        <div className="flex flex-col gap-[20px]">
          <FadeInRow>
            <p
              style={{
                fontFamily: "Lato",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "18px",
                color: "#06203C",
                lineHeight: "1.1",
              }}
            >
              Does the market confirm this direction?
            </p>
          </FadeInRow>

          <FadeInRow><div
            style={{
              fontFamily: "Fustat",
              fontSize: "18px",
              color: "#191432",
              lineHeight: "1.1",
            }}
          >
            <p style={{ fontWeight: 300 }} className="mb-0">
              Before committing to large builds, we first confirm the direction through real market signal.
            </p>
          </div></FadeInRow>

          <div className="bg-[#171425] flex flex-col justify-center px-[23px] py-[15px] rounded-[10px]">
            <div className="flex flex-col gap-[5px] leading-[1.1]">
              <p
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "15.5px",
                  color: "#FFFFFF",
                }}
              >
                We validate it through:
              </p>
              <div
                style={{
                  fontFamily: "Lato",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "18px",
                  color: "#D2D2FF",
                }}
                className="flex flex-col gap-[9px] mt-1"
              >
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Landing pages</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Messaging tests</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">UX prototypes</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Paid traffic tests</span></div></FadeInRow>
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: "Fustat",
              fontSize: "18px",
              color: "#191432",
            }}
          >
            <FadeInRow>
              <p style={{ fontWeight: 700, lineHeight: "1.1", marginBottom: "7px" }}>Output</p>
            </FadeInRow>
            <div className="flex flex-col gap-[7px]">
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>Real-world signal on what actually drives engagement</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>Evidence the direction resonates with buyers</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>A validated path the team can confidently scale</span>
              </div></FadeInRow>
            </div>
          </div>

          {/* Image Component */}
          <FadeInRow><div className="w-full mt-4 flex justify-center items-center">
            <img src={stage2Img} alt="Stage 2 Diagram" className="w-full h-auto object-contain rounded-[12px]" />
          </div></FadeInRow>
        </div>
      </div>

      {/* Stage 3 Container */}
      <div className="w-full px-[17.5px] pb-24 flex flex-col pt-24 bg-[#FCFAF3]">
        {/* Stage Header */}
        <div className="flex flex-col gap-2 mb-[19px]">
          <FadeInRow><span
            style={{
              fontFamily: "Lato",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "22.3px",
              color: "#8B8CFB",
              lineHeight: "1.1",
            }}
          >
            Step 3 — The System
          </span></FadeInRow>
          <FadeInRow><h3
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "31px",
              color: "#1A1A2E",
              lineHeight: "1.2",
            }}
          >
            Once the signal is clear, we turn it into a growth system.
          </h3></FadeInRow>
        </div>

        {/* Narrative & Lists Wrapper */}
        <div className="flex flex-col gap-[20px]">
          <FadeInRow>
            <p
              style={{
                fontFamily: "Lato",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "18px",
                color: "#06203C",
                lineHeight: "1.1",
              }}
            >
              How do we turn that signal into repeatable growth?
            </p>
          </FadeInRow>

          <FadeInRow><div
            style={{
              fontFamily: "Fustat",
              fontSize: "18px",
              color: "#191432",
              lineHeight: "1.1",
            }}
          >
            <p style={{ fontWeight: 300 }} className="mb-0">
              Now execution becomes straightforward because the direction is validated.
            </p>
          </div></FadeInRow>

          <div className="bg-[#171425] flex flex-col justify-center px-[23px] py-[15px] rounded-[10px]">
            <div className="flex flex-col gap-[5px] leading-[1.1]">
              <p
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "15.5px",
                  color: "#FFFFFF",
                }}
              >
                Depending on where scale is bottlenecked, this can take the form of:
              </p>
              <div
                style={{
                  fontFamily: "Lato",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "18px",
                  color: "#D2D2FF",
                }}
                className="flex flex-col gap-[9px] mt-1"
              >
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Website restructuring</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Landing ecosystems</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Acquisition architecture</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Sales enablement</span></div></FadeInRow>
                <FadeInRow><div className="flex gap-2"><span className="shrink-0 mt-[2px]">•</span><span className="font-light leading-[1.2]">Product narrative alignment</span></div></FadeInRow>
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: "Fustat",
              fontSize: "18px",
              color: "#191432",
            }}
          >
            <FadeInRow>
              <p style={{ fontWeight: 700, lineHeight: "1.1", marginBottom: "7px" }}>Output</p>
            </FadeInRow>
            <div className="flex flex-col gap-[7px]">
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>Structural alignment across critical channels and surfaces</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>Conversion journeys engineered around buyer behavior</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>Structural capacity to expand what works</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>Growth that compounds instead of resets</span>
              </div></FadeInRow>
              <FadeInRow><div className="flex gap-2">
                <span style={{ fontWeight: 300, lineHeight: "1.1" }}>✓</span>
                <span style={{ lineHeight: "1.1" }}>
                  A scalable growth system built to <span style={{ fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>expand what works</span>
                </span>
              </div></FadeInRow>
            </div>
          </div>

          {/* Image Component */}
          <FadeInRow><div className="w-full mt-4 flex justify-center items-center">
            <img src={stage2Img} alt="Stage 3 Diagram" className="w-full h-auto object-contain rounded-[12px]" />
          </div></FadeInRow>
        </div>
      </div>

      <style>{`
        @keyframes ticker-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(calc(-50% - 2.5px), 0, 0); }
        }
        .animate-ticker-left {
          animation: ticker-left 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
