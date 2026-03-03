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
  useViewportHeight()

  return (
    <BrowserRouter>
      <Loading onComplete={() => setIsLoading(false)} />
      <Routes>
        <Route 
          path="/" 
          element={isDesktop ? <DesktopLayout key="home" /> : <MobileLayout key={`home-${isLoading}`} />} 
        />
        <Route 
          path="/strategy" 
          element={isDesktop ? <DesktopLayout key="strategy" showStrategy /> : <MobileLayout key={`strategy-${isLoading}`} showStrategy />} 
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
