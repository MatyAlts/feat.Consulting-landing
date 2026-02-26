import MobileNavbar from '../components/mobile/Navbar'
import MobileHero from '../components/mobile/Hero'
import MobileServices from '../components/mobile/Services'
import MobileAbout from '../components/mobile/About'
import MobileContact from '../components/mobile/Contact'
import MobileFooter from '../components/mobile/Footer'
import MobileHighImpact from '../components/mobile/HighImpact'
import StickyFooter from '../components/mobile/StickyFooter'

export default function MobileLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FCFAF3]">
      <MobileNavbar />
      {/*
        <main> es el contenedor de scroll libre (normal scroll).
        El snap-scroll vive en el div interno .snap-container.
        Cuando el snap container llega al final (Step 20), el scroll
        encadena a <main> y el usuario continúa libremente por HighImpact.
      */}
      <main className="flex-1 overflow-y-auto h-full">
        {/* Zona snap: Hero + Services */}
        <div className="snap-container scroll-smooth hide-scrollbar">
          <section className="snap-start snap-always min-h-screen bg-[#FCFAF3]">
            <MobileHero />
          </section>
          <MobileServices />
        </div>

        {/* Zona de scroll libre */}
        <MobileHighImpact />
        <section className="min-h-screen">
          <MobileAbout />
        </section>
        <section className="min-h-screen">
          <MobileContact />
        </section>
        <section>
          <MobileFooter />
        </section>
      </main>
      <StickyFooter />
    </div>
  )
}
