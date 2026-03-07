export default function MobileHero() {
  return (
    <section
      id="hero"
      className="bg-[#FCFAF3] flex flex-col justify-start px-5 overflow-hidden"
      style={{
        minHeight: '100dvh',
        paddingTop: 'clamp(80px, 16dvh, 136px)',
        paddingBottom: 'clamp(40px, 8dvh, 64px)'
      }}
    >
      <div className="flex flex-col">
        {/* Headline + subtítulo */}
        <div className="flex flex-col">
          <div className="overflow-hidden will-change-transform">
            <h1 className="text-hero-title font-medium text-brand-hero-title leading-[1.05] tracking-tight animate-text-reveal-up">
              Scaling isn’t<br />
              about pushing<br />
              harder.
            </h1>
          </div>
          <div className="overflow-hidden will-change-transform">
            <p className="text-hero-subtitle text-brand-hero-subtitle leading-tight font-medium animate-text-reveal-up [animation-delay:1500ms]">
              It’s about matching<br />
              how your market decides.
            </p>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col gap-6" style={{ marginTop: 'clamp(64px, 13dvh, 108px)' }}>
          <div className="overflow-hidden will-change-transform">
            <p className="text-hero-body text-brand-hero-body leading-[1.3] animate-text-reveal-up [animation-delay:3000ms]">
              <span className="font-light">feat. builds </span>
              <span className="font-normal">custom journeys </span><br />
              <span className="font-light">around </span>
              <span className="font-normal">real buyer behavior</span>
            </p>
          </div>
          <div className="overflow-hidden will-change-transform">
            <p className="text-hero-body text-brand-hero-body leading-[1.3] animate-text-reveal-up [animation-delay:4200ms]">
              <span className="font-light">and turns them into </span><br />
              <span className="font-normal">repeatable growth.</span>
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="overflow-hidden will-change-transform pb-4" style={{ marginTop: 'clamp(32px, 5dvh, 48px)' }}>
          <div className="animate-text-reveal-up [animation-delay:4200ms]">
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
