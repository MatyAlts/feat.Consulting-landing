import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useViewport } from './hooks/useViewport'
import { useViewportHeight } from './hooks/useViewportHeight'
import MobileLayout from './layouts/MobileLayout'
import DesktopLayout from './layouts/DesktopLayout'
import Loading from './components/shared/Loading'

export default function App() {
  const { isDesktop } = useViewport()
  const [isLoading, setIsLoading] = useState(true)
  const [desktopIntroRequested, setDesktopIntroRequested] = useState(false)
  useViewportHeight()
  const shouldShowLoading = isDesktop ? desktopIntroRequested && isLoading : isLoading

  return (
    <BrowserRouter>
      {shouldShowLoading && <Loading onComplete={() => setIsLoading(false)} />}
      <Routes>
        <Route 
          path="/" 
          element={
            isDesktop
              ? (
                <DesktopLayout
                  key="home-desktop"
                  onDesktopIntroTrigger={() => {
                    setIsLoading(true)
                    setDesktopIntroRequested(true)
                  }}
                />
              )
              : <MobileLayout key={`home-mobile-${isLoading}`} />
          } 
        />
        <Route 
          path="/strategy" 
          element={<Navigate to="/#strategy" replace />} 
        />
        <Route 
          path="/contact" 
          element={isDesktop ? <DesktopLayout key="contact" showForm /> : <MobileLayout key={`contact-${isLoading}`} showForm />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
