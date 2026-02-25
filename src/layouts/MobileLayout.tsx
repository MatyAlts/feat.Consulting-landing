import MobileNavbar from '../components/mobile/Navbar'
import MobileHero from '../components/mobile/Hero'
import MobileServices from '../components/mobile/Services'
import MobileAbout from '../components/mobile/About'
import MobileContact from '../components/mobile/Contact'
import MobileFooter from '../components/mobile/Footer'
import StickyFooter from '../components/mobile/StickyFooter'

export default function MobileLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden snap-container bg-[#FCFAF3]">
      <MobileNavbar />
      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth h-full">
        <section className="snap-start snap-always min-h-screen bg-[#FCFAF3]">
          <MobileHero />
        </section>

        <MobileServices />

        <section className="snap-start snap-always min-h-screen">
          <MobileAbout />
        </section>
        <section className="snap-start snap-always min-h-screen">
          <MobileContact />
        </section>
        <section className="snap-start snap-always">
          <MobileFooter />
        </section>
      </main>
      <StickyFooter />
    </div>
  )
}
