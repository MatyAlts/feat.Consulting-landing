export default function MobileHero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-[#FCFAF3] flex flex-col justify-start px-5 pt-32 pb-16"
    >
      <div className="flex flex-col gap-24">
        {/* Headline + subtítulo */}
        <div className="flex flex-col gap-4">
          <h1
            className="text-hero-title font-medium text-brand-dark leading-[1.05] tracking-tight"
          >
            Scaling isn’t about pushing harder.
          </h1>
          <p
            className="text-hero-subtitle text-brand-muted leading-tight font-medium"
          >
            It’s about direction.
          </p>
        </div>

        {/* Cuerpo */}
        <p className="text-hero-body text-brand-dark leading-[1.3] font-normal">
          feat.Consulting helps companies{' '}
          <strong className="font-extrabold">
            turn what’s already working
          </strong>{' '}
          into repeatable growth.
        </p>
      </div>
    </section>
  )
}
