import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveScrollAnchor } from "../../utils/scrollRestore";
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



  return (
    <>

      {/* ── New Section: Strategy meets Execution ── */}
      <motion.div
        className="w-full mt-0"
        style={{
          background:
            "linear-gradient(to bottom, #191432 0%, #0C1831 16%, #021B30 42%, #5D6D87 75%, #D5DAFA 93%, #D5DAFA 100%)",
        }}
      >
        <div
          style={{ paddingTop: "160px" }}
          className="pl-[21px] text-left flex flex-col"
        >
          <FadeInBlock delay={100}>
            <h2
              className="text-white font-medium font-['Fustat'] leading-[1.11] mb-[13px]"
              style={{ fontSize: "37.18px", maxWidth: "360px" }}
            >
              Clear direction. Confident execution.
            </h2>
            <p
              className="text-white font-light font-['Fustat'] leading-[1.14]"
              style={{ fontSize: "22.05px" }}
            >
              When the decision is set, scale stops depending on effort.
            </p>
          </FadeInBlock>
        </div>

        {/* ── Services Cards Accordion (Stacked) ── */}
        <div className="w-full mt-[52px] px-5 flex flex-col gap-4.25">
          {[
            {
              supra: "Rapid Validation",
              title: "Two weeks to \ncalibrate growth",
              text: (
                <>
                  In a focused sprint, we cut through what’s slowing growth and{" "}
                  <span className="font-['Lato'] font-bold">
                    pinpoint where your leverage actually lives.
                  </span>
                  {"\n\n"}
                  So your team can{" "}
                  <span className="font-['Lato'] font-bold">
                    redirect effort quickly
                  </span>{" "}
                  and{" "}
                  <span className="font-['Lato'] font-bold">
                    start scaling what works.
                  </span>
                </>
              ),
            },
            {
              supra: "Context-Awareness",
              title: "Adjust where \nit matters",
              text: (
                <>
                  Growth rarely breaks everywhere.
                  {"\n\n"}
                  Sometimes you’re{" "}
                  <span className="font-['Lato'] font-bold">
                    bringing traffic but it doesn’t convert
                  </span>
                  .{"\n"}
                  Sometimes the offer is strong but{" "}
                  <span className="font-['Lato'] font-bold">
                    buyers don’t fully grasp the value
                  </span>
                  .{"\n"}
                  Other times everything looks good{" "}
                  <span className="font-['Lato'] font-bold">
                    until the final call.
                  </span>
                  {"\n\n"}
                  So instead of rebuilding everything, we{" "}
                  <span className="font-['Lato'] font-bold">
                    target the constraint that’s blocking scale.
                  </span>
                </>
              ),
            },
            {
              supra: "Strategic Alignment",
              title: "Turn your instincts \ninto proof",
              text: (
                <>
                  Sometimes teams arrive with strong instincts about what should
                  work.
                  {"\n"}Our role is to{" "}
                  <span className="font-['Lato'] font-bold">
                    bring structure and strategic perspective
                  </span>{" "}
                  to pressure-test those ideas.
                  {"\n\n"}
                  Instead of debating perspectives,{" "}
                  <span className="font-['Lato'] font-bold">
                    we put the strongest hypotheses into practice
                  </span>
                  .{"\n\n"}
                  So what moves forward isn’t opinion; it’s{" "}
                  <span className="font-['Lato'] font-bold">
                    shared visibility into what’s working and why
                  </span>
                  .
                </>
              ),
            },
            {
              supra: "Coordinated Execution",
              title: "Tailor how \nit gets built",
              text: (
                <>
                  Once the direction is clear, the work moves into{" "}
                  <span className="font-['Lato'] font-bold">activation</span>.
                  {"\n\n"}
                  <span className="font-['Lato'] font-bold">
                    Execution adapts to your setup.
                  </span>
                  {"\n"}
                  If you have the internal team,{" "}
                  <span className="font-['Lato'] font-bold">
                    we work alongside them
                  </span>
                  .{"\n"}
                  If you need additional capacity,{" "}
                  <span className="font-['Lato'] font-bold">
                    we bring our specialists
                  </span>
                  .{"\n\n"}
                  Either way, the work stays{" "}
                  <span className="font-['Lato'] font-bold">
                    aligned with the strategy
                  </span>
                  , so every piece of execution{" "}
                  <span className="font-['Lato'] font-bold">
                    pushes the same decision forward.
                  </span>
                </>
              ),
            },
            {
              supra: "Embedded Capability",
              title: "Extend the insight \nacross the business",
              text: (
                <>
                  The validated direction becomes the foundation for how your team
                  operates:{" "}
                  <span className="font-['Lato'] font-bold">
                    aligning product, marketing, and sales
                  </span>{" "}
                  <span className="font-['Lato'] font-bold">
                    around the same goal.
                  </span>
                  {"\n\n"}
                  From there, the insight can be applied to{" "}
                  <span className="font-['Lato'] font-bold">
                    new initiatives, touchpoints, and opportunities
                  </span>
                  .{"\n\n"}
                  So{" "}
                  <span className="font-['Lato'] font-bold">
                    progress builds on a shared system,{" "}
                  </span>
                  whether you continue developing with feat or with your own team.
                </>
              ),
            },
          ].map((card, idx) => {
            const [isExpanded, setIsExpanded] = useState(idx === 0);

            return (
              <div
                key={idx}
                className="shrink-0 border-[0.7px] border-[#E8E7E3]/30 relative overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  borderRadius: "10px",
                  background:
                    "linear-gradient(to right, #182431 0%, #08141F 100%)",
                  padding: "0 22.5px", // Side padding
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex flex-col pr-6 relative pt-[15.33px]">
                  <p
                    className="font-['Lato'] font-normal text-[15.5px] leading-tight mb-2 opacity-40 mix-blend-screen"
                    style={{ color: "#E8E7E3" }}
                  >
                    {card.supra}
                  </p>
                  <h3 className="font-['Fustat'] font-light text-[32.5px] text-white leading-[1.1] whitespace-pre-line mb-2">
                    {card.title}
                  </h3>

                  {/* Toggle Icon aligned to Title - MOVED to bottom right below */}
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0,
                      marginTop: isExpanded ? 8 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="font-['Lato'] font-light text-[17.5px] text-[#E8E7E3]/60 leading-[1.11] whitespace-pre-line pb-[16.33px]">
                      {card.text}
                    </p>
                  </motion.div>

                  {/* Toggle Icon in bottom right */}
                  <div className="absolute bottom-[16.33px] right-0 translate-x-1.5">
                    <motion.div
                      className="text-[#E8E7E3] opacity-40 text-[20px] font-light leading-none"
                    >
                      {isExpanded ? "—" : "+"}
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA Redesign ── */}
        <div className="w-full relative pt-48 pb-24 px-4 flex flex-col items-center text-center">
          <FadeInBlock delay={100}>
            <p
              className="font-['Fustat'] font-light"
              style={{
                fontSize: "21.3px",
                color: "#171425",
                lineHeight: "1",
                marginBottom: "6px",
              }}
            >
              When direction gets serious,
            </p>
          </FadeInBlock>
          
          <FadeInBlock delay={400}>
            <h2
              className="font-['Fustat'] font-medium"
              style={{
                fontSize: "39.69px",
                color: "#171425",
                lineHeight: "1.13",
                marginBottom: "16px",
                maxWidth: "312px",
              }}
            >
              Scaling becomes obvious.
            </h2>
          </FadeInBlock>

          <FadeInBlock delay={700}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  saveScrollAnchor();
                  navigate("/contact");
                }}
                className="rounded-[51.74px] flex items-center justify-center transition-transform active:scale-95 border-[0.75px] border-[#1a1a2e]"
                style={{
                  width: "320px",
                  height: "67.43px",
                  backgroundColor: "#191432",
                  marginBottom: "10px",
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
                  fontSize: "14.56px",
                  color: "#191432",
                  opacity: 0.6,
                }}
              >
                No obligation. Just clarity
              </p>
            </div>
          </FadeInBlock>
        </div>
      </motion.div>
    </>
  );
}
