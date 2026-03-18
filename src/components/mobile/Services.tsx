import { useRef, useEffect, useState, type ReactNode } from "react";
import { ScrollRevealItem } from "../shared/ScrollRevealItem";
import { StaggeredCharacterText } from "../shared/StaggeredCharacterText";
import icon1 from "../../assets/icons/icon_1.png";
import icon2 from "../../assets/icons/icon_2.png";
import icon3 from "../../assets/icons/icon_3.png";
import logoBlanco from "../../assets/icons/LOGO BLANCO.svg";

interface MobileServicesProps {
  onStepChange?: (step: number) => void;
}

const DOUBLE_PHRASE_STAGE_ENTRIES = [2, 4, 6, 8, 11, 12, 14] as const;
const AUTO_REVEAL_DELAY_MS = 800;

interface StoryStageProps {
  id?: string;
  step?: number;
  color?: string;
  stageClassName?: string;
  stickyClassName?: string;
  sectionRef?: (el: HTMLElement | null) => void;
  children: ReactNode;
}

function StoryStage({
  id,
  step,
  color,
  stageClassName = "full-height",
  stickyClassName = "",
  sectionRef,
  children,
}: StoryStageProps) {
  return (
    <section
      id={id}
      data-step={step}
      data-color={color}
      ref={sectionRef}
      className={`relative story-snap-step ${stageClassName}`}
    >
      <div className={`full-height ${stickyClassName}`}>{children}</div>
    </section>
  );
}

export default function MobileServices({ onStepChange }: MobileServicesProps) {
  const [activeColor, setActiveColor] = useState("#FCFAF3");
  const [activeStep, setActiveStep] = useState(0);
  const [revealedSecondSteps, setRevealedSecondSteps] = useState<
    Record<number, boolean>
  >({});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Refs para medir la posición exacta de los textos

  const buildsTextRef = useRef<HTMLHeadingElement>(null); // "It builds gradually."
  const growingTextRef = useRef<HTMLParagraphElement>(null); // "Your brand is growing."
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  // Persistent tracking of section visibility ratios
  const ratiosRef = useRef<Map<number, { ratio: number; color: string | null }>>(
    new Map(),
  );

  useEffect(() => {
    const servicesContainer = document.querySelector(
      "[data-services-container]",
    ) as HTMLElement | null;
    const main = document.querySelector("main");

    const observer = new IntersectionObserver(
      (entries) => {
        // Update ratios for sections in this batch
        entries.forEach((entry) => {
          const stepIndexStr = entry.target.getAttribute("data-step");
          if (stepIndexStr !== null) {
            const stepIndex = Number(stepIndexStr);
            if (!Number.isNaN(stepIndex)) {
              ratiosRef.current.set(stepIndex, {
                ratio: entry.intersectionRatio,
                color: entry.target.getAttribute("data-color"),
              });
            }
          }
        });

        // Use the full state from ratiosRef to find candidates
        const candidates = Array.from(ratiosRef.current.entries())
          .map(([stepIndex, data]) => ({ stepIndex, ...data }))
          .filter((c) => c.ratio > 0);

        if (candidates.length === 0) return;

        // Find the "winner" (most visible section)
        const winner = candidates.reduce((best, current) =>
          current.ratio > best.ratio ? current : best,
        );

        // Find the the "next" section (immediate successor regardless of gaps)
        const nextStep = candidates
          .filter((c) => c.stepIndex > winner.stepIndex)
          .sort((a, b) => a.stepIndex - b.stepIndex)[0] || null;

        setActiveStep(winner.stepIndex);

        // Transition proactively to next color if it's emerging
        if (nextStep && nextStep.ratio > 0.1 && nextStep.color) {
          setActiveColor(nextStep.color);
        } else if (winner.color) {
          setActiveColor(winner.color);
        }
      },
      {
        root: main,
        threshold: [0.05, 0.15, 0.3, 0.5, 0.7, 0.9],
      },
    );

    // Observar todas las secciones
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    if (servicesContainer) observer.observe(servicesContainer);

    const containerObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Si salimos por arriba (hero), resetear
          if (entry.boundingClientRect.top > 0) {
            setActiveStep(-1);
            onStepChange?.(-1);
          }
        }
      },
      { root: main, threshold: 0 },
    );

    if (servicesContainer) containerObserver.observe(servicesContainer);

    return () => {
      observer.disconnect();
      containerObserver.disconnect();
    };
  }, [onStepChange]);

  useEffect(() => {
    if (activeStep < 0) return;
    if (
      !DOUBLE_PHRASE_STAGE_ENTRIES.includes(
        activeStep as (typeof DOUBLE_PHRASE_STAGE_ENTRIES)[number],
      )
    )
      return;
    if (revealedSecondSteps[activeStep]) return;

    const timer = window.setTimeout(() => {
      setRevealedSecondSteps((prev) => ({ ...prev, [activeStep]: true }));
    }, AUTO_REVEAL_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [activeStep, revealedSecondSteps]);

  useEffect(() => {
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  // Mide la posición exacta del texto relativa a su sección padre.
  useEffect(() => {
    const measure = () => {
      // Logic for measuring can be added here if needed
    };

    const t = setTimeout(measure, 150);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const getStepStyle = (step: number, delay: number = 0) => {
    const isActive = activeStep === step;
    const isPast = activeStep > step;

    return {
      opacity: isActive ? 1 : 0,
      filter: isActive ? "blur(0px)" : "blur(20px)",
      transform: isActive
        ? "translateY(0px)"
        : isPast
          ? "translateY(-60px)"
          : "translateY(40px)",
      transition: `all 600ms cubic-bezier(0, 0, 0.2, 1) ${delay}ms`,
    };
  };

  return (
    <div
      data-services-container
      className="transition-colors duration-500 ease-in-out"
      style={{
        background: activeColor,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {/* Sections 1-19 */}
      <>
        {/* 1. Frase Inicial (Step 0) */}
        <StoryStage
          id="direction"
          step={0}
          color="#FCFAF3"
          sectionRef={(el) => {
            sectionRefs.current[0] = el;
          }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-center px-4 justify-start overflow-hidden"
        >
          <div className="w-full">
            <h2
              className="text-narrative-title font-medium text-brand-dark leading-[1.05] tracking-tight text-left"
              style={getStepStyle(0)}
            >
              The strain doesn't appear overnight.
            </h2>
          </div>
        </StoryStage>

        {/* 2. Frase Derecha (Step 1) */}
        <StoryStage
          step={1}
          color="#010D17"
          sectionRef={(el) => {
            sectionRefs.current[1] = el;
            section1Ref.current = el;
          }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-center px-4 justify-end overflow-hidden relative"
        >
          <div className="w-full relative z-10">
            <h2
              ref={buildsTextRef}
              className="text-narrative-title font-medium text-white leading-[1.05] tracking-tight text-right"
              style={getStepStyle(1)}
            >
              It builds gradually.
            </h2>
          </div>
        </StoryStage>

        {/* Combo Blocks */}
        {[
          {
            t1: "Your brand is growing.",
            t2: (
              <>
                But it doesn't
                <br />
                feel as stable.
              </>
            ),
            start: 2,
          },
          {
            t1: "You're getting traction.",
            t2: (
              <>
                But the offer
                <br />
                still needs explanation.
              </>
            ),
            start: 4,
          },
          {
            t1: "Wins are happening.",
            t2: (
              <>
                But they're hard
                <br />
                to replicate.
              </>
            ),
            start: 6,
          },
          {
            t1: "Your team's moving fast.",
            t2: (
              <>
                But not always in
                <br />
                the same direction
              </>
            ),
            start: 8,
          },
        ].map((combo, i) => (
          <StoryStage
            key={i}
            step={combo.start}
            color="#010D17"
            sectionRef={(el) => {
              sectionRefs.current[combo.start] = el;
              sectionRefs.current[combo.start + 1] = el;
              if (i === 0) section2Ref.current = el as HTMLDivElement | null;
            }}
            stageClassName="full-height"
            stickyClassName="w-full flex items-center pl-[16%] pr-4 justify-start overflow-hidden relative"
            id={i === 3 ? "snap-end-trigger" : undefined}
          >
            <div className="w-full flex flex-col gap-2 text-left relative z-10">
              <p
                ref={i === 0 ? growingTextRef : null}
                className="tracking-tight"
                style={{
                  fontSize: "var(--text-narrative-small)",
                  fontWeight: "400",
                  color: "#D6D6F0",
                  ...getStepStyle(
                    activeStep === combo.start ? combo.start : -2,
                    0,
                  ),
                }}
              >
                {combo.t1}
              </p>
              <h2
                className="leading-[1.05] tracking-tight"
                style={{
                  fontSize: "var(--text-narrative-medium)",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  ...getStepStyle(
                    activeStep === combo.start &&
                      revealedSecondSteps[combo.start]
                      ? combo.start
                      : -2,
                    100,
                  ),
                }}
              >
                {combo.t2}
              </h2>
            </div>
          </StoryStage>
        ))}

        {/* Step 10: Growth stalls */}
        <StoryStage
          step={10}
          color="#FFFFFF"
          sectionRef={(el) => {
            sectionRefs.current[10] = el;
          }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-start px-8 justify-start overflow-hidden pt-[60vh]"
        >
          <div className="w-full">
            <StaggeredCharacterText
              text={
                "Growth stalls\nwhen everyone is\nmoving, but\nnot in the same\ndirection."
              }
              className="tracking-tight text-left leading-[1.1]"
              style={{
                fontFamily: "Fustat",
                fontWeight: 400,
                fontSize: "37.18px",
                color: "#1A1A2E",
              }}
            />
          </div>
        </StoryStage>

        {/* Step 11: Activity multiplies */}
        <StoryStage
          step={11}
          color="#FFFFFF"
          sectionRef={(el) => {
            sectionRefs.current[11] = el;
          }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-start px-8 justify-start overflow-hidden pt-[50vh]"
        >
          <div className="w-full">
            <StaggeredCharacterText
              text="Activity multiplies."
              className="tracking-tight text-left leading-[1.1]"
              style={{
                fontFamily: "Fustat",
                fontWeight: 400,
                fontSize: "37.18px",
                color: "#1A1A2E",
              }}
            />
          </div>
        </StoryStage>

        {/* Step 12: But what was working... */}
        <StoryStage
          step={12}
          color="#FFFFFF"
          sectionRef={(el) => {
            sectionRefs.current[12] = el;
          }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-start px-8 justify-start overflow-hidden pt-[50vh]"
        >
          <div className="w-full">
            <StaggeredCharacterText
              text={"But what was working\nbecomes harder\nto see,"}
              className="tracking-tight text-left leading-[1.1]"
              style={{
                fontFamily: "Fustat",
                fontWeight: 400,
                fontSize: "29.18px",
                color: "#1A1A2E",
              }}
            />
          </div>
        </StoryStage>

        {/* Step 13: and even harder to scale */}
        <StoryStage
          step={13}
          color="#FFFFFF"
          sectionRef={(el) => {
            sectionRefs.current[13] = el;
          }}
          stageClassName="full-height"
          stickyClassName="w-full flex items-start px-8 justify-end overflow-hidden pt-[50vh]"
        >
          <div className="w-full">
            <StaggeredCharacterText
              text={"and even harder\nto scale."}
              align="right"
              className="tracking-tight text-right leading-[1.1]"
              style={{
                fontFamily: "Fustat",
                fontWeight: 400,
                fontSize: "29.18px",
                color: "#1A1A2E",
              }}
            />
          </div>
        </StoryStage>

        {/* Step 14: That's where feat comes in */}
        <StoryStage
          step={14}
          color="#020A30"
          sectionRef={(el) => {
            sectionRefs.current[14] = el;
          }}
          stageClassName="h-[120vh]"
          stickyClassName="w-full flex flex-col pt-[55vh] px-8 overflow-hidden relative"
        >
          <div className="w-full flex flex-col gap-8">
            <img
              src={logoBlanco}
              alt="feat logo"
              style={{ height: "32.77px", width: "auto" }}
              className="self-start"
            />
            <StaggeredCharacterText
              segments={[
                {
                  text: "feat helps companies\n",
                  style: { fontFamily: "Fustat", fontWeight: 300, fontSize: "35px", color: "#FCFAF3" }
                },
                {
                  text: "turn ",
                  style: { fontFamily: "Fustat", fontWeight: 500, fontSize: "35px", color: "#FCFAF3" }
                },
                {
                  text: "traction ",
                  style: { fontFamily: "Fustat", fontWeight: 500, fontSize: "35px", color: "#8B8CFB" }
                },
                {
                  text: "into\n",
                  style: { fontFamily: "Fustat", fontWeight: 500, fontSize: "35px", color: "#FCFAF3" }
                },
                {
                  text: "scalable growth.",
                  style: { fontFamily: "Fustat", fontWeight: 500, fontSize: "35px", color: "#8B8CFB" }
                }
              ]}
              align="left"
            />
          </div>
        </StoryStage>

        {/* Progressive reveal + visual hierarchy (Normal scroll section) */}
        <section
          id="strategy"
          data-step="16"
          data-color="#020A30"
          ref={(el) => {
            sectionRefs.current[16] = el;
          }}
          className="w-full flex flex-col px-5 pt-[5vh] pb-[20vh] gap-[15vh]"
          style={{ background: "#020A30" }}
        >
          {/* Item 1 */}
          <ScrollRevealItem>
            <div className="w-full flex flex-col gap-4">
              <img
                src={icon1}
                alt="Icon 1"
                className="w-10.5 h-10.5 object-contain"
                style={{ opacity: 0.09 }}
              />
              <div className="flex flex-col gap-2">
                <h3
                  className="tracking-tight text-left leading-[1.2]"
                  style={{
                    fontFamily: "Fustat",
                    fontWeight: 500,
                    fontSize: "25.3px",
                    color: "#FCFAF3",
                  }}
                >
                  Clarifying what’s actually driving decisions.
                </h3>
                <p
                  className="tracking-tight text-left leading-[1.3]"
                  style={{
                    fontFamily: "Lato",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "16px",
                    color: "#FCFAF3",
                    opacity: 0.8,
                  }}
                >
                  Where the value resonates most, and what makes choosing you
                  obvious.
                </p>
              </div>
            </div>
          </ScrollRevealItem>

          {/* Item 2 */}
          <ScrollRevealItem>
            <div className="w-full flex flex-col gap-4">
              <img
                src={icon2}
                alt="Icon 2"
                className="w-10.5 h-10.5 object-contain"
                style={{ opacity: 0.2 }}
              />
              <div className="flex flex-col gap-2">
                <h3
                  className="tracking-tight text-left leading-[1.2]"
                  style={{
                    fontFamily: "Fustat",
                    fontWeight: 500,
                    fontSize: "25.3px",
                    color: "#FCFAF3",
                  }}
                >
                  Aligning teams and execution around it.
                </h3>
                <p
                  className="tracking-tight text-left leading-[1.3]"
                  style={{
                    fontFamily: "Lato",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "16px",
                    color: "#FCFAF3",
                    opacity: 0.8,
                  }}
                >
                  Every action builds on the same decision logic.
                </p>
              </div>
            </div>
          </ScrollRevealItem>

          {/* Item 3 */}
          <ScrollRevealItem>
            <div className="w-full flex flex-col gap-4">
              <img
                src={icon3}
                alt="Icon 3"
                className="w-10.5 h-10.5 object-contain"
                style={{ opacity: 0.3 }}
              />
              <div className="flex flex-col gap-2">
                <h3
                  className="tracking-tight text-left leading-[1.2]"
                  style={{
                    fontFamily: "Fustat",
                    fontWeight: 500,
                    fontSize: "25.3px",
                    color: "#FCFAF3",
                  }}
                >
                  Expanding what proves itself.
                </h3>
                <p
                  className="tracking-tight text-left leading-[1.3]"
                  style={{
                    fontFamily: "Lato",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "16px",
                    color: "#FCFAF3",
                    opacity: 0.8,
                  }}
                >
                  What works becomes the standard across the entire experience.
                </p>
              </div>
            </div>
          </ScrollRevealItem>
        </section>

        {/* Scale behavior section */}
        <section
          id="scale-behavior"
          data-step="17"
          data-color="#626472"
          ref={(el) => {
            sectionRefs.current[17] = el;
          }}
          className="w-full flex flex-col px-5 pt-[10vh] pb-[20vh] gap-[12vh]"
          style={{ background: "linear-gradient(to bottom, #626472, #FCFAF3)" }}
        >
          {/* Header */}
          <ScrollRevealItem>
            <div className="w-full flex flex-col items-start gap-1">
              <span
                style={{
                  fontFamily: "Lato",
                  fontWeight: 100,
                  fontSize: "23px",
                  color: "#FFFFFF",
                  fontStyle: "italic",
                }}
              >
                because
              </span>
              <h2
                className="tracking-tight text-left leading-[1.1]"
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 400,
                  fontSize: "35px",
                  color: "#FFFFFF",
                }}
              >
                When growth is built <br />
                around real buyer <br />
                behavior,
              </h2>
            </div>
          </ScrollRevealItem>

          {/* Scale stops... */}
          <ScrollRevealItem>
            <div className="w-full flex justify-end pr-2">
              <h2
                className="tracking-tight text-right leading-[1.05]"
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 400,
                  fontSize: "54.59px",
                  color: "#010101",
                  maxWidth: "90%",
                }}
              >
                Scale stops <br />
                depending <br />
                on effort.
              </h2>
            </div>
          </ScrollRevealItem>

          {/* Sometimes direction */}
          <ScrollRevealItem>
            <div className="w-full flex justify-start pl-2">
              <p
                className="tracking-tight text-left leading-[1.2]"
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "25px",
                  color: "#000000",
                  maxWidth: "75%",
                }}
              >
                Sometimes that means <br />
                sharpening direction.
              </p>
            </div>
          </ScrollRevealItem>

          {/* Sometimes surfaces */}
          <ScrollRevealItem>
            <div className="w-full flex justify-end pr-2">
              <p
                className="tracking-tight text-right leading-[1.2]"
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "25px",
                  color: "#000000",
                  maxWidth: "80%",
                }}
              >
                Sometimes it means <br />
                extending what already <br />
                works across key surfaces.
              </p>
            </div>
          </ScrollRevealItem>

          {/* Work adapts */}
          <ScrollRevealItem>
            <div className="w-full flex justify-center text-center mt-4">
              <h2
                className="tracking-tight leading-[1.1]"
                style={{
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "36.85px",
                  color: "#000000",
                }}
              >
                The work adapts to <br />
                where scale needs <br />
                support.
              </h2>
            </div>
          </ScrollRevealItem>
        </section>
      </>
    </div>
  );
}
