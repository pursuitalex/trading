import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Landing } from './components/Landing'
import { AuthPage } from './components/AuthPage'
import { Returns } from './components/Returns'
import { Guarantees } from './components/Guarantees'
import { Advantages } from './components/Advantages'
import { Pricing } from './components/Pricing'
import { HowToStart } from './components/HowToStart'
import { Contacts } from './components/Contacts'
import { PagesIndex } from './components/PagesIndex'
import { DesignSystem } from './components/DesignSystem'
import './App.css'

/**
 * Reset scroll to the top on every route change — react-router otherwise keeps
 * the previous scroll position (e.g. leaves you in the footer after navigating
 * from a long page).
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return // keep in-page anchor links working
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function App() {
  // reducedMotion="user" makes framer-motion respect the OS "reduce motion" setting.
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/guarantees" element={<Guarantees />} />
        <Route path="/advantages" element={<Advantages />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-to-start" element={<HowToStart />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/pages" element={<PagesIndex />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </MotionConfig>
  )
}
