import DesktopNavbar from '../components/desktop/Navbar'
import DesktopHero from '../components/desktop/Hero'
import DesktopServices from '../components/desktop/Services'
import DesktopAbout from '../components/desktop/About'
import DesktopContact from '../components/desktop/Contact'
import DesktopFooter from '../components/desktop/Footer'

export default function DesktopLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <DesktopNavbar />
      <main>
        <DesktopHero />
        <DesktopServices />
        <DesktopAbout />
        <DesktopContact />
      </main>
      <DesktopFooter />
    </div>
  )
}
