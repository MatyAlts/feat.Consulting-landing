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

export default function DecisionStages() {
  return (
    <section className="w-full flex flex-col items-center pt-32 pb-32 bg-[#FCFAF3] overflow-hidden">
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
