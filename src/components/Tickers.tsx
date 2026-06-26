import { motion } from 'framer-motion'
import { viewportOnce } from '../lib/motion'
import { useMarqueeSpeed } from '../lib/marquee'
import sp500 from '../../assets/tickers/sp500.svg'
import nasdaq from '../../assets/tickers/nasdaq.svg'
import russell from '../../assets/tickers/russell2000.svg'
import gold from '../../assets/tickers/gold.svg'
import dowjones from '../../assets/tickers/dowjones.svg'
import bitcoin from '../../assets/tickers/bitcoin.svg'
import usdUah from '../../assets/tickers/usd-uah.svg'
import eurUah from '../../assets/tickers/eur-uah.svg'
import './Tickers.css'

type Ticker = { icon: string; name: string; price: string; change: string; up: boolean }

const TICKERS: Ticker[] = [
  { icon: sp500, name: 'S&P 500', price: '6,715.25 $', change: '+1.26%', up: true },
  { icon: nasdaq, name: 'Nasdaq 100', price: '22,351.53 $', change: '+1.12%', up: true },
  { icon: russell, name: 'Russell 2000', price: '2,510.72 $', change: '+1.24%', up: true },
  { icon: gold, name: 'Gold', price: '5,020.70 $', change: '-0.81%', up: false },
  { icon: dowjones, name: 'Dow Jones', price: '46,933.60 $', change: '+0.63%', up: true },
  { icon: bitcoin, name: 'Bitcoin USD', price: '73,109.00 $', change: '+0.38%', up: true },
  { icon: usdUah, name: 'USD/UAH', price: '44.14 ₴', change: '-0.06%', up: false },
  { icon: eurUah, name: 'EUR/UAH', price: '50.61 ₴', change: '+0.1%', up: true },
]

function TickerCard({ t }: { t: Ticker }) {
  return (
    <div className="ticker">
      <img className="ticker__icon" src={t.icon} alt="" width={36} height={36} />
      <div className="ticker__text">
        <span className="ticker__name">{t.name}</span>
        <span className="ticker__quote">
          <span className="ticker__price">{t.price}</span>
          <span className={`ticker__change${t.up ? '' : ' down'}`}>{t.change}</span>
        </span>
      </div>
    </div>
  )
}

export function Tickers() {
  // Two identical copies so the track loops seamlessly (translateX -50% = exactly one copy).
  const loop = [...TICKERS, ...TICKERS]
  const marquee = useMarqueeSpeed() // hover → 50% speed
  return (
    <motion.section
      className="section ticker-section"
      aria-label="Курси та котирування"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="ticker-marquee"
        ref={marquee.ref}
        onMouseEnter={marquee.onMouseEnter}
        onMouseLeave={marquee.onMouseLeave}
      >
        <div className="ticker-marquee__track" aria-hidden="true">
          {loop.map((t, i) => (
            <TickerCard key={i} t={t} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
