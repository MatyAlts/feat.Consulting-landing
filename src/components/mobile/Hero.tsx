export default function MobileHero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-[#FCFAF3] flex flex-col justify-start px-5 pt-[175px] pb-16"
    >
      <div className="flex flex-col">
        {/* Headline + subtítulo */}
        <div className="flex flex-col gap-4">
          <h1 className="text-hero-title font-medium text-brand-dark leading-[1.05] tracking-tight opacity-0 animate-fade-in-up">
            Scaling isn’t about pushing harder.
          </h1>
          <p className="text-hero-subtitle text-brand-muted leading-tight font-medium opacity-0 animate-fade-in-up [animation-delay:300ms]">
            It’s about direction.
          </p>
        </div>

        {/* Cuerpo */}
        <p className="mt-24 text-hero-body text-brand-dark leading-[1.3] font-normal opacity-0 animate-fade-in-up [animation-delay:600ms]">
          feat.Consulting helps companies{" "}
          <strong className="font-extrabold">
            turn what’s already working
          </strong>{" "}
          into repeatable growth.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-[83px] animate-bounce-slow text-brand-dark">
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
    </section>
  );
}
