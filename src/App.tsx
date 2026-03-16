import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useViewport } from './hooks/useViewport'
import { useViewportHeight } from './hooks/useViewportHeight'
import MobileLayout from './layouts/MobileLayout'
import DesktopLayout from './layouts/DesktopLayout'
import DesktopContactPage from './components/desktop/Contact'
import Loading from './components/shared/Loading'

export default function App() {
  const { isDesktop } = useViewport()
  const [isLoading, setIsLoading] = useState(true)
  useViewportHeight()

  return (
    <BrowserRouter>
      <Loading onComplete={() => setIsLoading(false)} />
      <Routes>
        <Route 
          path="/" 
          element={isDesktop ? <DesktopLayout key={`home-desktop-${isLoading}`} /> : <MobileLayout key={`home-mobile-${isLoading}`} />} 
        />
        <Route 
          path="/strategy" 
          element={<Navigate to="/#strategy" replace />} 
        />
        <Route 
          path="/contact" 
          element={isDesktop ? <DesktopContactPage /> : <MobileLayout key={`contact-${isLoading}`} showForm />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
