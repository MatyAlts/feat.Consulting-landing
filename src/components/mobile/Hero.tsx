export default function MobileHero() {
  return (
    <section
      id="hero"
      className="snap-start snap-always bg-[#FCFAF3] flex flex-col justify-start px-5 pt-34 pb-16"
      style={{ minHeight: 'calc(var(--real-vh, 1dvh) * 100)' }}
    >
      <div className="flex flex-col">
        {/* Headline + subtítulo */}
        <div className="flex flex-col">
          <div className="overflow-hidden">
            <h1 className="text-hero-title font-medium text-brand-hero-title leading-[1.05] tracking-tight animate-text-reveal-up">
              Scaling isn’t<br />
              about pushing<br />
              harder.
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-hero-subtitle text-brand-hero-subtitle leading-tight font-medium animate-text-reveal-up [animation-delay:300ms]">
              It’s about matching<br />
              how your market decides.
            </p>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="mt-25.75 flex flex-col gap-6">
          <div className="overflow-hidden">
            <p className="text-hero-body text-brand-hero-body leading-[1.3] animate-text-reveal-up [animation-delay:600ms]">
              <span className="font-light">feat. builds </span>
              <span className="font-normal">custom journeys </span><br />
              <span className="font-light">around </span>
              <span className="font-normal">real buyer behavior</span>
            </p>
          </div>
          <div className="overflow-hidden">
            <p className="text-hero-body text-brand-hero-body leading-[1.3] animate-text-reveal-up [animation-delay:900ms]">
              <span className="font-light">and turns them into </span><br />
              <span className="font-normal">repeatable growth.</span>
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 overflow-hidden pb-4">
          <div className="animate-text-reveal-up [animation-delay:1200ms]">
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
