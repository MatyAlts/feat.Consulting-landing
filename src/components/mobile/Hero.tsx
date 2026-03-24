interface MobileHeroProps {
  animateEntry?: boolean;
}

export default function MobileHero({ animateEntry = true }: MobileHeroProps) {
  const revealClass = animateEntry ? "animate-text-reveal-up" : "";
  return (
    <section
      id="hero"
      className="bg-[#FCFAF3] flex flex-col justify-start px-5 overflow-hidden"
      style={{
        minHeight: "100dvh",
        paddingTop: "clamp(80px, 8dvh, 136px)",
        paddingBottom: "clamp(40px, 8dvh, 64px)",
      }}
    >
      <div className="flex flex-col">
        {/* Headline + subtitle */}
        <div className="flex flex-col">
          <div className="overflow-hidden will-change-transform">
            <h1
              className={`text-hero-title font-medium text-brand-hero-title leading-[1.05] tracking-tight ${revealClass}`}
            >
              Scaling isn&apos;t
              <br />
              about pushing
              <br />
              harder.
            </h1>
          </div>
          <div className="overflow-hidden will-change-transform">
            <p
              className={`text-hero-subtitle text-brand-hero-subtitle leading-tight font-medium ${revealClass} ${animateEntry ? "[animation-delay:1200ms]" : ""}`}
            >
              It&apos;s about matching how
              <br />
              your customers decide.
            </p>
          </div>
        </div>

        {/* Body */}
        <div
          className="flex flex-col gap-6"
          style={{ marginTop: "clamp(64px, 13dvh, 108px)" }}
        >
          <div className="overflow-hidden will-change-transform">
            <p
              className={`text-hero-body text-brand-hero-body leading-[1.3] ${revealClass} ${animateEntry ? "[animation-delay:1900ms]" : ""}`}
            >
              <span className="font-light">feat. designs </span>
              <span className="font-normal">custom journeys </span>
              <br />
              <span className="font-light">around </span>
              <span className="font-normal">real buyer behavior</span>
            </p>
          </div>
          <div className="overflow-hidden will-change-transform">
            <p
              className={`text-hero-body text-brand-hero-body leading-[1.3] ${revealClass} ${animateEntry ? "[animation-delay:2600ms]" : ""}`}
            >
              <span className="font-light">and turns them into </span>
              <br />
              <span className="font-normal">repeatable growth.</span>
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="overflow-hidden will-change-transform pb-4"
          style={{ marginTop: "clamp(32px, 5dvh, 48px)" }}
        >
          <div
            className={`${revealClass} ${animateEntry ? "[animation-delay:2600ms]" : ""}`}
          >
            <div className="animate-bounce-slow text-brand-dark">
              <svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 1.5L9 8.5L16.5 1.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
