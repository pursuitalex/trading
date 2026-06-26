import { MotionConfig } from 'framer-motion'
import { Routes, Route } from 'react-router-dom'
import { Landing } from './components/Landing'
import { AuthPage } from './components/AuthPage'
import './App.css'

export default function App() {
  // reducedMotion="user" makes framer-motion respect the OS "reduce motion" setting.
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </MotionConfig>
  )
}
