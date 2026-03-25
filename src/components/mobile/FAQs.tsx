import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveScrollAnchor } from "../../utils/scrollRestore";
import { motion, AnimatePresence } from "framer-motion";
import loadingFt from "../../assets/icons/loading ft.png";
import flechaIcon from "../../assets/icons/flecha.svg";

const words = ["Positioning", "Funnel", "UX", "Narrative", "Growth"];

const faqs = [
  {
    question: "How is this different from hiring an agency or an internal team?",
    answer: (
      <>
        Agencies are brought in to deliver specific outputs.
        {"\n"}Internal hires are responsible for specific roles.
        {"\n\n"}feat’s work focuses on clarifying the growth decision the company should organize around in order to scale.
        {"\n\n"}Then product, messaging, acquisition, and sales are aligned to reinforce that direction.
        {"\n\n"}So instead of disconnected improvements, the company builds a{" "}
        <span className="font-semibold">coordinated system for growth</span>.
      </>
    ),
  },
  {
    question: "Is this strategy work or execution?",
    answer: (
      <>
        Both.
        {"\n\n"}Our work begins by clarifying the decision that should guide growth.
        {"\n"}But that decision only matters if it is{" "}
        <span className="font-semibold">tested and applied in the real experience</span>.
        {"\n\n"}That’s why our process moves quickly from direction to market signal, and from signal to coordinated execution.
        {"\n\n"}Strategy and execution move together, so what is learned{" "}
        <span className="font-semibold">immediately informs what gets built next</span>.
      </>
    ),
  },
  {
    question: "How long does the process typically take?",
    answer: (
      <>
        The initial calibration sprint takes two weeks.
        {"\n\n"}From there, the timeline depends on <span className="font-semibold">what the company is trying to unlock</span> and how much of the next stage needs to be activated across product, messaging, acquisition, or sales.
        {"\n\n"}What changes from one engagement to another is the scope of activation.
        {"\n"}What stays constant is that the work moves faster once the direction is clear.
      </>
    ),
  },
  {
    question: "Do we need to pause current initiatives to work with you?",
    answer: (
      <>
        On the contrary.
        {"\n\n"}In most cases, the work builds directly on what the team is already doing: campaigns, product improvements, sales conversations, or new initiatives.
        {"\n\n"}<span className="font-semibold">Those efforts already generate valuable signal.</span>
        {"\n\n"}We help interpret that signal, clarify the decision behind growth, and structure the next steps around it.
        {"\n\n"}Our process doesn’t interrupt momentum. It further directs it.
      </>
    ),
  },
  {
    question: "How do you decide where to focus the work?",
    answer: (
      <>
        Growth can slow down in different places.
        {"\n\n"}Sometimes the constraint sits in <span className="font-semibold">acquisition</span>: attracting the right audience.
        {"\n"}Sometimes in <span className="font-semibold">consideration</span>: helping people understand the value.
        {"\n"}Other times in <span className="font-semibold">conversion</span> or <span className="font-semibold">sales alignment</span>: helping them commit.
        {"\n\n"}Our first step is identifying <span className="font-semibold">where the decision path is breaking.</span>
        {"\n"}We do that by combining signal from campaigns, product usage, sales conversations, and analytics with targeted experiments.
        {"\n\n"}From there, the work adapts to that stage: whether that means refining sources of interest, restructuring the experience, clarifying the narrative, or aligning sales teams.
        {"\n\n"}The goal stays the same:
        {"\n"}<span className="font-semibold">make the right decision visible.</span>
      </>
    ),
  },
  {
    question: "What if we already have a strong hypothesis about what should work?",
    answer: (
      <>
        That’s exactly where the work becomes most valuable.
        {"\n\n"}Founders and teams often arrive with strong instincts about what should work.
        {"\n"}Instead of debating opinions, we pressure-test the strongest ideas in the market.
        {"\n\n"}Your hypotheses are part of the process. Our aim is to turn conviction into scalable proof.
      </>
    ),
  },
  {
    question: "What happens after the two-week sprint?",
    answer: (
      <>
        The sprint clarifies where growth should focus and what direction deserves investment.
        {"\n\n"}From there, teams usually either:
        {"\n\n"}• continue working with us to activate the strategy across key touchpoints, or
        {"\n"}• implement the direction internally with their own team.
        {"\n\n"}Either way, the company moves forward with a <span className="font-semibold">validated decision and a clear plan for execution</span>.
      </>
    ),
  },
  {
    question: "What happens after the engagement ends?",
    answer: (
      <>
        The goal is to cultivate independence.
        {"\n\n"}The thinking and systems we install become part of how your team operates, so they can continue applying them across new initiatives and opportunities.
        {"\n\n"}Many teams keep building on the same logic long after the project ends.
      </>
    ),
  },
  {
    question: "What types of companies benefit most from this approach?",
    answer: (
      <>
        This work tends to be most useful for companies that are already seeing traction but feel that growth is becoming harder to scale.
        {"\n\n"}Often the team is already running campaigns, improving the product, or investing in marketing and sales, but the signals are fragmented and the next direction isn’t obvious.
        {"\n\n"}That’s where our process helps.
        {"\n\n"}By clarifying the decision that should guide growth, the company can focus its efforts and extend what is already working.
      </>
    ),
  },
  {
    question: "What layer of growth does feat specialize on?",
    answer: (
      <>
        This work we do sits in a category sometimes described as <span className="font-semibold">Decision Design</span> or <span className="font-semibold">Decision Architecture</span>.
        {"\n\n"}The focus is on <span className="font-semibold">the decision layer behind growth</span>: the direction that product, messaging, acquisition, conversion, and sales should reinforce.
        {"\n\n"}Once that decision is clear, teams can move from <span className="font-semibold">signal → decision → coordinated execution.</span>
        {"\n\n"}So instead of optimizing isolated initiatives, the company builds <span className="font-semibold">a system where what works carries across the experience.</span>
      </>
    ),
  },
  {
    question: "Why does the approach adapt so well to different growth challenges?",
    answer: (
      <>
        Because the work always starts with the same objective:
        {"\n"}<span className="font-semibold">designing the decision path around how people actually decide.</span>
        {"\n\n"}From there, the intervention adapts to the situation.
        {"\n"}Sometimes the obstacle sits in <span className="font-semibold">awareness</span>.
        {"\n"}Sometimes in <span className="font-semibold">how the value is understood</span>.
        {"\n"}Sometimes in <span className="font-semibold">acquisition, conversion,</span> or <span className="font-semibold">sales</span>.
        {"\n\n"}The approach combines <span className="font-semibold">UX thinking with market validation</span>, so strategy moves directly into execution, iteration, and expansion.
        {"\n\n"}What stays constant is the goal:
        {"\n"}<span className="font-semibold underline">make the right decision obvious, then extend what proves itself.</span>
      </>
    ),
  },
  {
    question: "How does this approach unlock scale?",
    answer: (
      <>
        As companies grow, they expand into new channels, campaigns, and initiatives.
        {"\n\n"}Activity increases.
        {"\n"}Data increases.
        {"\n"}Teams increase.
        {"\n\n"}But this is often when <span className="font-semibold">what originally worked starts to become blurry.</span>
        {"\n"}Signal gets scattered across product, marketing, and sales.
        {"\n\n"}feat’s role is to translate that signal into a clear decision the company can organize around:
        {"\n"}<span className="font-semibold">signal → decision → coordinated execution.</span>
        {"\n\n"}That’s when growth becomes scalable again.
      </>
    ),
  },
  {
    question: "What do teams actually gain from this?",
    answer: (
      <>
        Teams walk away with more than assets or campaigns.
        {"\n\n"}They gain a clear growth logic that aligns product, marketing, and sales around the same direction.
        {"\n\n"}That logic becomes something the team can continue applying across new initiatives, surfaces, and opportunities.
        {"\n\n"}Execution becomes a consequence of clarity — not the other way around.
      </>
    ),
  }
];

export default function MobileFAQs() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 2800); // 2.8s for a smooth rotation feel
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="faqs" className="w-full">
      <div className="bg-[#FCFAF3]">
        <div className="pl-[21px] pr-5">
          <p
            className="font-['Fustat'] font-normal text-[#48435D]"
            style={{
              fontSize: "16.21px",
              paddingTop: "127.98px",
              marginBottom: "1px",
            }}
          >
            The practical details.
          </p>

          <h2
            className="font-['Fustat'] font-medium leading-[1.05] text-[#171425]"
            style={{
              fontSize: "clamp(36px, 11.5vw, 48px)",
            }}
          >
            Frequently <br /> Asked Questions
          </h2>

          <p
            className="font-['Fustat'] font-light text-[#191432] leading-[1.3]"
            style={{ fontSize: "var(--text-hero-body)", marginTop: "13px" }}
          >
            This isn’t a traditional consulting engagement; it’s a structural growth intervention.
            <br />
            <br />
            Here’s what most teams want clarified before moving forward.
          </p>
        </div>
        <div className="mt-[19.12px] flex flex-col gap-4 px-[15px]">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="w-full bg-[#FFFEFE] overflow-hidden transition-colors duration-300"
                style={{
                  border: "0.2px solid #191432",
                  borderRadius: "8px",
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={`w-full flex items-center text-left pl-[16.48px] pr-6 outline-none transition-colors duration-300 ${isOpen ? "bg-[#191432]" : "bg-transparent"}`}
                  style={{ minHeight: "3.5rem" }}
                >
                  <span
                    className={`font-['Fustat'] font-normal flex-1 transition-colors duration-300`}
                    style={{
                      fontSize: "17px",
                      color: isOpen ? "#FFFFFF" : "#191432",
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`ml-2 text-2xl font-light transition-colors duration-300`}
                    style={{ color: isOpen ? "#FFFFFF" : "#191432" }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div
                    className="pl-[16.48px] pr-[16.48px] pt-6 pb-8 font-['Fustat'] font-light text-[#191432] whitespace-pre-line bg-[#F0F3F4]"
                    style={{ fontSize: "16px", lineHeight: "1.4" }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-4" /> {/* 16px spacer after FAQs */}
      </div>

      {/* background transition and CTA section */}
      <div className="relative">
        {/* Background layer: half cream, half dark blue */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div className="h-[50%] w-full bg-[#FCFAF3]" />
          <div className="h-[50%] w-full bg-[#021B30]" />
        </div>

        {/* content layer */}
        <div className="relative z-10 px-[15px]">
          <div
            className="w-full bg-[#FFFFFF] flex flex-col items-center text-center px-6 pb-12 shadow-xl"
            style={{
              border: "0.2px solid #191432",
              borderRadius: "19.97px",
            }}
          >
            <h2
              className="font-['Fustat'] font-semibold text-[#191432] leading-tight"
              style={{
                fontSize: "clamp(32px, 10vw, 42px)",
                marginTop: "clamp(36px, 6dvh, 56px)",
              }}
            >
              Have a specific <br /> question?
            </h2>

            <p
              className="font-['Fustat'] font-light text-[#191432] leading-snug"
              style={{ fontSize: "21.3px", marginTop: "0px" }}
            >
              If something isn’t covered <br /> above, you can ask us directly.
            </p>

            <button
              onClick={() => {
                saveScrollAnchor();
                localStorage.removeItem("selectedTier");
                navigate("/contact");
              }}
              className="w-full max-w-[325px] flex items-center justify-center rounded-full active:scale-[0.98] transition-transform shadow-sm"
              style={{
                backgroundColor: "#8B8CFB",
                minHeight: "3.75rem",
                marginTop: "15.98px",
              }}
            >
              <span
                className="text-[#191432] font-['Fustat'] font-medium"
                style={{ fontSize: "18.75px" }}
              >
                Get in touch →
              </span>
            </button>

            <p
              className="font-['Lato'] font-extralight text-[#191432]"
              style={{ fontSize: "14.56px", marginTop: "10px" }}
            >
              Clarity first. Decisions later.
            </p>
          </div>
        </div>
      </div>

      {/* Dark background section for footer elements */}
      <div className="bg-[#021B30] pb-32">
        <div className="flex flex-col items-start px-[19px]">
          <img
            src={loadingFt}
            alt="feat. logo"
            className="w-[82px] object-contain"
            style={{ marginTop: "clamp(80px, 14dvh, 120px)" }}
          />

          <h2
            className="text-white font-['Fustat'] font-light leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(36px, 12vw, 50px)", marginTop: "29px" }}
          >
            It’s time to <br />
            optimize your <br />
            <div className="relative h-[1.2em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[wordIdx]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="font-normal block"
                  style={{ color: "#A3A8F7" }}
                >
                  {words[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h2>

          <div style={{ marginTop: "29px" }}>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                saveScrollAnchor();
                localStorage.removeItem("selectedTier");
                navigate("/contact");
              }}
              className="flex items-center text-white font-['Fustat'] font-light tracking-tight group"
              style={{ fontSize: "23px" }}
            >
              <span className="underline underline-offset-[6px] decoration-white/30 group-hover:decoration-white transition-colors">
                Let’s make it perform
              </span>
              <img
                src={flechaIcon}
                alt=""
                className="w-[14px] h-[14px] inline-block"
                style={{
                  marginLeft: "5.8px",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </a>
          </div>

          <div style={{ marginTop: "clamp(120px, 27dvh, 240px)" }}>
            <p
              className="font-['Fustat'] font-light"
              style={{ fontSize: "20.61px", color: "#D2D2FF" }}
            >
              feat. partners globally.
            </p>
            <p
              className="font-['Fustat'] font-extralight"
              style={{ fontSize: "17px", color: "#D2D2FF" }}
            >
              Across markets, stages, and time zones.
            </p>

            <div
              className="flex items-center"
              style={{ marginTop: "37px", gap: "37px" }}
            >
              <a
                href="mailto:hi@feat.consulting"
                className="font-['Fustat'] font-extralight underline underline-offset-[4px] decoration-[#D2D2FF]/30 hover:decoration-[#D2D2FF] transition-colors"
                style={{ fontSize: "16.32px", color: "#D2D2FF" }}
              >
                hi@feat.consulting
              </a>
              <a
                href="https://www.linkedin.com/company/feat-consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Fustat'] font-extralight underline underline-offset-[4px] decoration-[#D2D2FF]/30 hover:decoration-[#D2D2FF] transition-colors"
                style={{ fontSize: "16.32px", color: "#D2D2FF" }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
