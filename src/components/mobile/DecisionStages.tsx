import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { saveScrollAnchor } from "../../utils/scrollRestore";
import { StaggerReveal } from "../shared/StaggerReveal";

const STAGES = [
  "Awareness depth",
  "Problem clarity",
  "Solution familiarity",
  "Channel context",
  "Evaluation mode",
  "Risk sensitivity",
  "Intent strength",
  "Acquisition source",
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
          <h2 className="tracking-tight leading-[1.05]">
            <span
              style={{
                fontFamily: "Fustat",
                fontWeight: 600,
                fontSize: "38.91px",
                color: "#1A1A2E",
              }}
            >
              Direct your focus <br />
              to where buyers
            </span>
            <br />
            <span
              style={{
                fontFamily: "Lato",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: "38.91px",
                color: "#8B8CFB",
              }}
            >
              actually
            </span>
            <span
              style={{
                fontFamily: "Fustat",
                fontWeight: 600,
                fontSize: "38.91px",
                color: "#1A1A2E",
              }}
            >
              {" "}
              decide.
            </span>
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
                width: "190.94px",
                height: "52px",
                backgroundColor: "rgba(235, 234, 248, 0.7)",
                backdropFilter: "blur(14.7px)",
                WebkitBackdropFilter: "blur(14.7px)",
                borderWidth: "0.2px",
                borderStyle: "solid",
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
            Every market has its own decision logic.
          </p>
          <p
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "18px",
              color: "#191432",
              lineHeight: "1.2",
            }}
          >
            Where we start depends on where growth is getting stuck.
          </p>
        </StaggerReveal>
      </div>

      {/* Stage 1 Container */}
      <div className="w-full px-[17.5px] pb-0 flex flex-col pt-24 bg-[#FCFAF3]">
        {/* Stage Header */}
        <div className="flex flex-col gap-2 mb-0.75">
          <span
            style={{
              fontFamily: "Lato",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "17.07px",
              color: "#7A71A5",
            }}
          >
            Stage 1 — Calibration Sprint
          </span>
          <h3
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "25px",
              color: "#000000",
              lineHeight: "1.15",
            }}
          >
            When growth is moving, but <br />
            it still feels scattered.
          </h3>
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-0 mb-4.5">
          <p
            style={{
              fontFamily: "Lato",
              fontWeight: 300,
              fontSize: "17.07px",
              color: "#171425",
              lineHeight: "1.21",
            }}
          >
            You’ve tested angles, launched campaigns, <br />
            optimized metrics.
          </p>
          <p
            style={{
              fontFamily: "Lato",
              fontWeight: 500,
              fontSize: "17.07px",
              color: "#171425",
              lineHeight: "1.21",
            }}
          >
            But the repeatable logic hasn’t fully <br />
            surfaced yet.
          </p>
        </div>

        {/* Lists Wrapper */}
        <div className="flex flex-col gap-4.5">
          <CollapsibleList
            title="What we clarify:"
            type="bullet"
            items={[
              "The cohort worth prioritizing",
              "The entry point that matches their intent",
              "The narrative that makes your offer click",
              "The journey that reveals signal and removes friction.",
            ]}
          />

          <CollapsibleList
            title="What this enables:"
            type="check"
            items={[
              "Market-backed clarity on what's actually moving the needle",
              "A validated direction the team can confidently scale",
              "Conversion journeys engineered around real buyer behavior",
              "A unified decision logic to leverage across teams",
            ]}
            initialCount={1}
          />
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <Link
            to="/contact"
            className="w-full flex items-center justify-center bg-[#1A1A2E] px-4 rounded-full h-[59.56px]"
            onClick={() => {
              saveScrollAnchor();
              localStorage.setItem("selectedTier", "Stage 1");
            }}
          >
            <span
              style={{
                fontFamily: "Fustat",
                fontWeight: 500,
                fontSize: "18.75px",
                color: "#FFFFFF",
              }}
            >
              Calibrate your Growth →
            </span>
          </Link>
          <span
            style={{
              fontFamily: "Lato",
              fontWeight: 300,
              fontSize: "14.56px",
              color: "#0A0B26",
              opacity: 0.9,
              paddingBottom: "77.44px",
            }}
          >
            Build once. Scale deliberately.
          </span>
        </div>
      </div>

      {/* Stage 2 Container */}
      <div className="w-full px-[17.5px] pt-[86.56px] pb-0 flex flex-col bg-[#1A1A2E]">
        {/* Stage Header */}
        <div className="flex flex-col gap-2 mb-0.75">
          <span
            style={{
              fontFamily: "Lato",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "17.07px",
              color: "#D2D2FF",
            }}
          >
            Stage 2 — Expansion Architecture
          </span>
          <h3
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "25px",
              color: "#FFFFFF",
              lineHeight: "1.15",
            }}
          >
            When the direction is clear, <br />
            but scale demands deeper <br />
            execution.
          </h3>
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-0 mb-4.5">
          <p
            style={{
              fontFamily: "Lato",
              fontWeight: 300,
              fontSize: "17.07px",
              color: "#FFFFFF",
              lineHeight: "1.21",
            }}
          >
            The direction is proven.
          </p>
          <p
            style={{
              fontFamily: "Lato",
              fontWeight: 500,
              fontSize: "17.07px",
              color: "#FFFFFF",
              lineHeight: "1.21",
            }}
          >
            Now it needs to be activated for scale <br />
            across your highest-leverage surfaces.
          </p>
        </div>

        {/* Lists Wrapper */}
        <div className="flex flex-col gap-4.5">
          <CollapsibleList
            title="We operationalize it through:"
            type="bullet"
            theme="dark"
            items={[
              "Upgrading your key assets for scale",
              "Optimizing acquisition around proven signals",
              "Reinforcing conversion systems for expansion and efficiency",
              "Embedding narrative cohesion across Product, Marketing, and Sales",
            ]}
          />

          <CollapsibleList
            title="Depending on where scale is bottlenecked, this can extend to:"
            type="dash"
            theme="dark"
            items={[
              "Website restructuring",
              "Landing ecosystems",
              "Campaign systems",
              "Sales enablement",
              "Product narrative alignment",
            ]}
          />

          <CollapsibleList
            title="What this enables:"
            type="check"
            theme="dark"
            items={[
              "Structural alignment across critical channels and surfaces",
              "Systems designed to convert and scale",
              "Cohesive execution across disciplines",
              "Structural capacity to expand what works",
              "Growth that compounds instead of resets",
            ]}
            initialCount={1}
          />
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <Link
            to="/contact"
            className="w-full flex items-center justify-center bg-[#8B8CFB] px-4 rounded-full h-[59.56px]"
            onClick={() => {
              saveScrollAnchor();
              localStorage.setItem("selectedTier", "Stage 2");
            }}
          >
            <span
              style={{
                fontFamily: "Fustat",
                fontWeight: 600,
                fontSize: "18.75px",
                color: "#171425",
              }}
            >
              Scale What Works →
            </span>
          </Link>
          <span
            style={{
              fontFamily: "Lato",
              fontWeight: 300,
              fontSize: "14.56px",
              color: "#FFFFFF",
              opacity: 0.9,
            }}
          >
            Design the system that scales.
          </span>
        </div>

        {/* Secondary CTA Card */}
        <div 
          className="mt-8 mb-12 pt-[67.91px] pb-[67.91px] w-full rounded-[28.96px] flex flex-col items-center text-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #E0E7FF 0%, #E1E0FF 100%)",
          }}
        >
          <h2
            className="mb-2.25 px-2"
            style={{
              fontFamily: "Fustat",
              fontWeight: 600,
              fontSize: "40.18px",
              color: "#191432",
              lineHeight: "1.05",
            }}
          >
            Not sure where <br />
            you stand?
          </h2>

          <div className="flex flex-col gap-3 mb-4 w-full px-2">
            <p
              style={{
                fontFamily: "Fustat",
                fontWeight: 300,
                fontSize: "clamp(16px, 4.5vw, 19px)",
                color: "#191432",
                whiteSpace: "nowrap",
                letterSpacing: "-0.02em",
              }}
            >
              We’ll pinpoint it in one focused session.
            </p>
            <p
              style={{
                fontFamily: "Fustat",
                fontWeight: 500,
                fontSize: "clamp(17px, 4.8vw, 20px)",
                color: "#191432",
                lineHeight: "1.2",
                letterSpacing: "-0.03em",
              }}
            >
              <span className="whitespace-nowrap">You’ll leave with a clear starting point</span><br />
              <span className="whitespace-nowrap">and the right path to scale.</span>
            </p>
          </div>

          <div className="w-full px-[30.37px] mb-2.5">
            <Link
              to="/contact"
              onClick={saveScrollAnchor}
            className="w-full flex items-center justify-center bg-brand-hero-body rounded-full h-[59.56px]"
            >
              <span
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 500,
                  fontSize: "18.75px",
                  color: "#FFFFFF",
                }}
              >
                Direct your Growth →
              </span>
            </Link>
          </div>
          
          <span
            className="px-2"
            style={{
              fontFamily: "Lato",
              fontWeight: 300,
              fontSize: "14.56px",
              color: "#191627",
              opacity: 0.8,
            }}
          >
            No obligation. Just alignment.
          </span>
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

function CollapsibleList({
  title,
  items,
  type = "bullet",
  initialCount = 2,
  theme = "light",
}: {
  title: string;
  items: string[];
  type?: "bullet" | "check" | "dash";
  initialCount?: number;
  theme?: "light" | "dark";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const textColor = theme === "dark" ? "#FFFFFF" : "#171425";

  return (
    <div className="flex flex-col gap-[2px]">
      <h4
        style={{
          fontFamily: "Lato",
          fontWeight: 600,
          fontSize: "17.07px",
          color: textColor,
        }}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-0">
        {items.slice(0, initialCount).map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span
              className="shrink-0 mt-[2px]"
              style={{
                fontFamily: "Lato",
                fontWeight: 400,
                fontSize: "17.07px",
                color: textColor,
              }}
            >
              {type === "bullet" ? "•" : type === "check" ? "✓" : "–"}
            </span>
            <div className="flex-1 flex items-start gap-1">
              <p
                style={{
                  fontFamily: "Lato",
                  fontWeight: 300,
                  fontSize: "17.07px",
                  color: textColor,
                  lineHeight: "1.21",
                }}
              >
                {item}
                {!isOpen && idx === initialCount - 1 && "..."}
              </p>
              {!isOpen && idx === initialCount - 1 && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-[3px] shrink-0"
                >
                  <ChevronDown size={14} color={theme === "dark" ? "#FFFFFF" : "#ACA9BE"} />
                </button>
              )}
            </div>
          </div>
        ))}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden flex flex-col gap-0"
            >
              {items.slice(initialCount).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span
                    className="shrink-0 mt-[2px]"
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 400,
                      fontSize: "17.07px",
                      color: textColor,
                    }}
                  >
                    {type === "bullet" ? "•" : type === "check" ? "✓" : "–"}
                  </span>
                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 300,
                      fontSize: "17.07px",
                      color: textColor,
                      lineHeight: "1.21",
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
