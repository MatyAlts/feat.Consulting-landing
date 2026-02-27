import { useState } from 'react'
import { useViewport } from './hooks/useViewport'
import { useViewportHeight } from './hooks/useViewportHeight'
import MobileLayout from './layouts/MobileLayout'
import DesktopLayout from './layouts/DesktopLayout'
import Loading from './components/shared/Loading'

export default function App() {
  const { isDesktop } = useViewport()
  const [isLoading, setIsLoading] = useState(true)
  useViewportHeight()

  return (
    <>
      <Loading onComplete={() => setIsLoading(false)} />
      {isDesktop ? <DesktopLayout /> : <MobileLayout key={isLoading ? 'loading' : 'ready'} />}
    </>
  )
}
