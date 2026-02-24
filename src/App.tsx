import { useViewport } from './hooks/useViewport'
import MobileLayout from './layouts/MobileLayout'
import DesktopLayout from './layouts/DesktopLayout'

export default function App() {
  const { isDesktop } = useViewport()

  return isDesktop ? <DesktopLayout /> : <MobileLayout />
}
