import { MotionConfig } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Calculator } from './components/Calculator'
import { VirtualTrades } from './components/VirtualTrades'
import { Tickers } from './components/Tickers'
import { BgBand } from './components/BgBand'
import { Control } from './components/Control'
import { WhyIbkr } from './components/WhyIbkr'
import { Cases } from './components/Cases'
import { Faq } from './components/Faq'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'
import './App.css'

export default function App() {
  // reducedMotion="user" makes framer-motion respect the OS "reduce motion" setting.
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <Calculator />
        <VirtualTrades />
        <Tickers />
        <BgBand />
        <Control />
        <WhyIbkr />
        <Cases />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </MotionConfig>
  )
}
