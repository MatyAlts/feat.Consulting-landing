export default function MobileHero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-[#FCFAF3] flex flex-col justify-start px-5 pt-34 pb-16"
    >
      <div className="flex flex-col">
        {/* Headline + subtítulo */}
        <div className="flex flex-col">
          <h1 className="text-hero-title font-medium text-brand-hero-title leading-[1.05] tracking-tight opacity-0 animate-fade-in-up">
            Scaling isn’t<br />
            about pushing<br />
            harder.
          </h1>
          <p className="text-hero-subtitle text-brand-hero-subtitle leading-tight font-medium opacity-0 animate-fade-in-up [animation-delay:300ms]">
            It’s about matching<br />
            how your market decides.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="mt-25.75 flex flex-col gap-5.75 opacity-0 animate-fade-in-up [animation-delay:600ms]">
          <p className="text-hero-body text-brand-hero-body leading-[1.3]">
            <span className="font-light">feat. builds </span>
            <span className="font-normal">custom journeys </span><br />
            <span className="font-light">around </span>
            <span className="font-normal">real buyer behavior</span>
          </p>
          <p className="text-hero-body text-brand-hero-body leading-[1.3]">
            <span className="font-light">and turns them into </span><br />
            <span className="font-normal">repeatable growth.</span>
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 animate-bounce-slow text-brand-dark">
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
