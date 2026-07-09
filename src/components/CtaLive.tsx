import { Link } from 'react-router-dom'
import { Reveal } from './primitives'
import { Rocket } from './icons'
import ctaCoin from '../../assets/how-to-start/cta-coin.webp'
import './CtaLive.css'

/* Scattered candlestick chart behind the coin — positions taken from Figma
   6672:6691 (x/y in px within the 267×150 visual). `up` picks the rising tint. */
const CANDLES: { x: number; y: number; h: number; up: 0 | 1 }[] = [
  { x: 0, y: 90, h: 31, up: 0 },
  { x: 11, y: 68, h: 31, up: 1 },
  { x: 22, y: 72, h: 38, up: 0 },
  { x: 33, y: 46, h: 46, up: 1 },
  { x: 44, y: 68, h: 37, up: 0 },
  { x: 55, y: 39, h: 46, up: 1 },
  { x: 66, y: 53, h: 27, up: 0 },
  { x: 77, y: 40, h: 32, up: 1 },
  { x: 88, y: 29, h: 47, up: 1 },
  { x: 99, y: 46, h: 35, up: 0 },
  { x: 110, y: 46, h: 25, up: 0 },
  { x: 121, y: 28, h: 35, up: 1 },
  { x: 132, y: 8, h: 55, up: 1 },
  { x: 143, y: 35, h: 51, up: 0 },
  { x: 154, y: 52, h: 28, up: 0 },
  { x: 165, y: 35, h: 36, up: 1 },
  { x: 176, y: 37, h: 23, up: 0 },
  { x: 187, y: 0, h: 52, up: 1 },
  { x: 198, y: 16, h: 47, up: 1 },
  { x: 209, y: 32, h: 37, up: 0 },
  { x: 220, y: 16, h: 69, up: 1 },
  { x: 231, y: 53, h: 26, up: 0 },
  { x: 242, y: 29, h: 43, up: 1 },
  { x: 253, y: 13, h: 33, up: 1 },
]

type CtaLiveProps = {
  title?: string
  subtitle?: string
  /** solid (primary) button */
  primary?: { label: string; to: string }
  /** ghost (secondary) button */
  secondary?: { label: string; to: string }
}

/* Shared live-candlestick CTA banner. The design lives here once; each page
   passes its own copy via props (defaults below are the how-to-start wording). */
export function CtaLive({
  title = 'Готові почати з упевненістю?',
  subtitle = 'Подивіться історичну дохідність стратегії або одразу створіть акаунт.',
  primary = { label: 'Створити акаунт', to: '/register' },
  secondary = { label: 'Дивитись дохідність', to: '/returns' },
}: CtaLiveProps = {}) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-live" variant="fadeUp">
          <div className="cta-live__head">
            {/* Live candlestick chart with the brand coin floating in front */}
            <div className="cta-live__visual" aria-hidden="true">
              <div className="cta-live__candles">
                {CANDLES.map((c, i) => (
                  <span
                    key={i}
                    className={`cta-live__cndl cta-live__cndl--${c.up ? 'up' : 'dn'}`}
                    style={{
                      left: `${c.x}px`,
                      top: `${c.y + 10}px`,
                      height: `${Math.max(c.h - 20, 2)}px`,
                      animationDelay: `${(-i * 0.17).toFixed(2)}s`,
                    }}
                  />
                ))}
              </div>
              <img className="cta-live__coin" src={ctaCoin} alt="" width={138} height={138} />
            </div>

            <div className="cta-live__heading">
              <h2 className="cta-live__title">{title}</h2>
              <p className="cta-live__sub">{subtitle}</p>
            </div>

            <div className="cta-live__btns">
              <Link to={secondary.to} className="cta-live__btn cta-live__btn--ghost">
                {secondary.label}
              </Link>
              <Link to={primary.to} className="cta-live__btn cta-live__btn--solid">
                <Rocket size={20} />
                {primary.label}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
