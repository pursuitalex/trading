import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { Calculator } from './Calculator'
import { VirtualTrades } from './VirtualTrades'
import { Tickers } from './Tickers'
import { BgBand } from './BgBand'
import { Control } from './Control'
import { WhyIbkr } from './WhyIbkr'
import { Cases } from './Cases'
import { Faq } from './Faq'
import { Cta } from './Cta'
import { Footer } from './Footer'

export function Landing() {
  return (
    <>
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
    </>
  )
}
