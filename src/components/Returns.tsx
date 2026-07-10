import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Calculator, type CalcConfig } from './Calculator'
import { VirtualTrades } from './VirtualTrades'
import { CountUp, Reveal, SectionHead } from './primitives'
import { useMarqueeSpeed } from '../lib/marquee'
import { easeOut, viewportOnce } from '../lib/motion'
import {
  ArrowUpRight,
  BarChart,
  Calendar,
  ChevronDown,
  Check,
  Eye,
  HelpCircle,
  Mail,
  Search,
  Send,
  TrendingUp,
  Wallet,
} from './icons'
import smallSign from '../../assets/logo/small-sign.svg'
import creditArt1 from '../../assets/returns/pic-1.png'
import creditArt2 from '../../assets/returns/pic-2.png'
import './Returns.css'

/* Credit-leverage illustration candidates (assets/returns).
   Swap the index to try the other: 0 = cascading scales (pic-1), 1 = lever (pic-2). */
const CREDIT_ART = [creditArt1, creditArt2][0]

/* ---------- Hero visual: animated "trading terminal" card ----------
   Illustrates exactly what the page shows: the portfolio curve draws
   itself, buy/sell markers fire along it (like the entry-point
   scenarios below), the portfolio value counts up, +45%/yr badge. */
const HERO_LINE =
  'M0 252 C40 244 60 250 90 232 S140 208 170 214 S220 178 250 186 S300 138 330 146 S380 96 410 104 S450 60 480 44'
const HERO_AREA = `${HERO_LINE} L480 300 L0 300 Z`
const HERO_MARKS: { x: number; y: number; kind: 'buy' | 'sell'; label?: string }[] = [
  { x: 90, y: 232, kind: 'buy', label: 'Купівля' },
  { x: 250, y: 186, kind: 'sell', label: 'Продаж' },
  { x: 330, y: 146, kind: 'buy' },
  { x: 410, y: 104, kind: 'sell' },
]

function HeroChart() {
  return (
    <div className="rt-hchart">
      <div className="rt-hchart__head">
        <span className="rt-hchart__title">Портфель · Interactive Brokers</span>
        <span className="rt-hchart__live">
          <i className="pulse-dot" aria-hidden="true" />
          Алгоритм працює
        </span>
      </div>

      <div className="rt-hchart__plot">
        <svg viewBox="0 0 480 300" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="rtHeroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6ef2b0" stopOpacity="0.26" />
              <stop offset="1" stopColor="#6ef2b0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rtHeroLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7f97e8" />
              <stop offset="1" stopColor="#6ef2b0" />
            </linearGradient>
          </defs>
          {[60, 120, 180, 240].map((y) => (
            <line key={y} x1="0" x2="480" y1={y} y2={y} className="rt-hchart__grid" />
          ))}
          <motion.path
            d={HERO_AREA}
            fill="url(#rtHeroFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          />
          <motion.path
            d={HERO_LINE}
            fill="none"
            stroke="url(#rtHeroLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: easeOut, delay: 0.5 }}
          />
        </svg>
        {HERO_MARKS.map((m) => (
          <motion.span
            key={m.x}
            className={`rt-hchart__mark rt-hchart__mark--${m.kind}`}
            style={{ left: `${(m.x / 480) * 100}%`, top: `${(m.y / 300) * 100}%` }}
            initial={{ scale: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, x: '-50%', y: '-50%' }}
            transition={{
              delay: 0.5 + (m.x / 480) * 2,
              type: 'spring',
              stiffness: 320,
              damping: 18,
            }}
          >
            {m.label && <em>{m.label}</em>}
          </motion.span>
        ))}
        <motion.span
          className="rt-hchart__enddot"
          style={{ left: '100%', top: `${(44 / 300) * 100}%` }}
          initial={{ scale: 0, x: '-50%', y: '-50%' }}
          animate={{ scale: 1, x: '-50%', y: '-50%' }}
          transition={{ delay: 2.5, type: 'spring', stiffness: 300, damping: 16 }}
          aria-hidden="true"
        />
      </div>

      <div className="rt-hchart__foot">
        <div className="rt-hchart__val">
          <span>Вартість портфеля</span>
          <strong className="num">
            <CountUp to={14500} duration={2.2} delay={0.6} locale="en-US" /> $
          </strong>
        </div>
        <span className="rt-hchart__badge">
          <TrendingUp size={14} />
          +45% за рік
        </span>
      </div>
    </div>
  )
}

/* ---------- Returns chart — interactive period preview ----------
   White card, blue→violet line drawn with the same pathLength mechanic as the
   hero chart. The 3m / 6m / 1y switcher swaps the path (keyed remount redraws
   the line), the month axis and the end-of-line % badge — visually proving the
   caption's point: the longer you wait, the more convincing the growth. */
type GraphPeriod = {
  key: '3m' | '6m' | '1y'
  label: string
  pct: number
  endY: number
  /* dashed S&P 500 comparison line */
  spPct: number
  spEndY: number
  sp: string
  months: string[]
  line: string
}
const GRAPH_PERIODS: GraphPeriod[] = [
  {
    key: '3m',
    label: '3 міс.',
    pct: 9,
    endY: 204,
    spPct: 3,
    spEndY: 244,
    sp: 'M0 258 C40 258 60 257 90 256 S140 253 170 254 S220 251 250 252 S300 249 330 250 S380 247 410 248 S450 245 480 244',
    months: ['Січ', 'Лют', 'Бер'],
    line: 'M0 258 C40 261 60 251 90 254 S140 241 170 247 S220 233 250 239 S300 225 330 231 S380 217 410 223 S450 207 480 204',
  },
  {
    key: '6m',
    label: '6 міс.',
    pct: 19,
    endY: 146,
    spPct: 6,
    spEndY: 230,
    sp: 'M0 258 C40 257 60 258 90 254 S140 250 170 252 S220 246 250 248 S300 240 330 242 S380 236 410 236 S450 232 480 230',
    months: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер'],
    line: 'M0 258 C40 253 60 257 90 246 S140 230 170 236 S220 208 250 214 S300 188 330 194 S380 168 410 172 S450 150 480 146',
  },
  {
    key: '1y',
    label: '1 рік',
    pct: 45,
    endY: 48,
    spPct: 12,
    spEndY: 202,
    sp: 'M0 258 C40 256 60 257 90 252 S140 246 170 248 S220 238 250 240 S300 228 330 230 S380 216 410 218 S450 206 480 202',
    months: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
    line: 'M0 258 C40 250 60 254 90 238 S140 214 170 220 S220 182 250 190 S300 142 330 148 S380 98 410 106 S450 62 480 48',
  },
]

function ReturnsGraph() {
  const [period, setPeriod] = useState<GraphPeriod['key']>('1y')
  const p = GRAPH_PERIODS.find((g) => g.key === period)!
  // Observe the full-size plot (not the tiny/def'd animated bits) and drive every
  // animation off that flag with `animate` — so a missed IntersectionObserver on a
  // 0-size or non-rendered element can't leave the line/badges stuck at their start.
  const plotRef = useRef<HTMLDivElement>(null)
  const drawn = useInView(plotRef, { once: true, margin: '-80px' })
  return (
    <Reveal className="rt-graph" variant="fadeUp">
      <div className="rt-graph__head">
        <span className="rt-graph__label">Графік дохідності</span>
        <div className="rt-graph__seg" role="group" aria-label="Період графіка">
          {GRAPH_PERIODS.map((g) => (
            <button
              key={g.key}
              type="button"
              className="rt-graph__seg-btn"
              aria-pressed={period === g.key}
              onClick={() => setPeriod(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rt-graph__legend" aria-hidden="true">
        <span className="rt-graph__lg">
          <i className="rt-graph__lg-algo" />
          Наш алгоритм
        </span>
        <span className="rt-graph__lg">
          <i className="rt-graph__lg-sp" />
          S&amp;P 500
        </span>
      </div>

      <div className="rt-graph__plot" ref={plotRef}>
        <div className="rt-graph__canvas" aria-hidden="true">
          {/* static grid layer */}
          <svg viewBox="0 0 480 300" preserveAspectRatio="none">
            {[60, 120, 180, 240].map((y) => (
              <line key={y} x1="0" x2="480" y1={y} y2={y} className="rt-graph__grid" />
            ))}
          </svg>
          {/* data layer — continuous strokes revealed by a left→right wipe.
             (No dash-based pathLength draw: dasharray + non-scaling-stroke on a
             stretched viewBox renders the line broken in Chromium.) */}
          <div className="rt-graph__wipe">
            <svg viewBox="0 0 480 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rtGraphLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#475ffa" />
                  <stop offset="1" stopColor="#9e78ff" />
                </linearGradient>
                <linearGradient id="rtGraphFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7a5fff" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#7a5fff" stopOpacity="0" />
                </linearGradient>
                {/* left→right reveal via a growing SVG clip rect — a reliable SVG
                   attribute animation (unlike CSS clip-path), driven by `drawn`. */}
                <clipPath id={`rtGraphReveal-${p.key}`}>
                  <motion.rect
                    key={p.key}
                    x="0"
                    y="0"
                    height="300"
                    initial={{ width: 0 }}
                    animate={{ width: drawn ? 480 : 0 }}
                    transition={{ duration: 1.3, ease: easeOut, delay: 0.15 }}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#rtGraphReveal-${p.key})`}>
                <path d={`${p.line} L480 300 L0 300 Z`} fill="url(#rtGraphFill)" />
                <path d={p.sp} className="rt-graph__spline" />
                <path
                  d={p.line}
                  fill="none"
                  stroke="url(#rtGraphLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
          <motion.span
            key={`d-${p.key}`}
            className="rt-graph__dot"
            style={{ left: '100%', top: `${(p.endY / 300) * 100}%` }}
            initial={{ scale: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: drawn ? 1 : 0, x: '-50%', y: '-50%' }}
            transition={{ delay: 1.35, type: 'spring', stiffness: 300, damping: 16 }}
          />
          <motion.span
            key={`p-${p.key}`}
            className="rt-graph__pct num"
            style={{ left: '100%', top: `${(p.endY / 300) * 100}%` }}
            initial={{ opacity: 0, scale: 0.8, x: '-108%', y: '-140%' }}
            animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0.8, x: '-108%', y: '-140%' }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 280, damping: 18 }}
          >
            +{p.pct}%
          </motion.span>
          <motion.span
            key={`s-${p.key}`}
            className="rt-graph__sp-pct num"
            style={{ left: '100%', top: `${(p.spEndY / 300) * 100}%` }}
            initial={{ opacity: 0, x: '-106%', y: '-50%' }}
            animate={{ opacity: drawn ? 1 : 0, x: '-106%', y: '-50%' }}
            transition={{ delay: 1.6, duration: 0.35 }}
          >
            S&amp;P 500 · +{p.spPct}%
          </motion.span>
        </div>
        <motion.div
          key={`m-${p.key}`}
          className="rt-graph__months"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {p.months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </motion.div>
      </div>

      <p className="rt-graph__note">
        Запустіть віртуальні торги і чекайте. Дивитися на результати потрібно{' '}
        <button
          type="button"
          className="rt-graph__phrase"
          aria-pressed={period === '3m'}
          onClick={() => setPeriod('3m')}
        >
          мінімум через три місяці
        </button>
        ,{' '}
        <button
          type="button"
          className="rt-graph__phrase"
          aria-pressed={period === '6m'}
          onClick={() => setPeriod('6m')}
        >
          бажано через пів року
        </button>
        ,{' '}
        <button
          type="button"
          className="rt-graph__phrase"
          aria-pressed={period === '1y'}
          onClick={() => setPeriod('1y')}
        >
          краще через рік
        </button>{' '}
        — акціям потрібен час, щоб вирости в ціні.
      </p>
    </Reveal>
  )
}

/* ---------- Data ---------- */
const PRINCIPLES = [
  'Не day-trading',
  'Реінвестування прибутку',
  'Однакові правила і алгоритми',
  'Купуємо потенціал росту',
  'Продаємо з прибутком',
  '45%+ на рік',
  'Кількість угод невелика',
]

const TRUST = [
  {
    icon: BarChart,
    title: 'Дані достовірні',
    text: 'Стратегія торгується на історичних даних, дані достовірні, алгоритми актуальні.',
  },
  {
    icon: Search,
    title: 'Деталізація в офісі',
    text: 'При потребі, при відвідуванні нашого офісу (інформація не на загал), ми можемо показати деталізовано будь-які ці торги на архівних даних — які акції, коли та за якою ціною купувалися і продавалися, графіки тощо.',
  },
  {
    icon: Eye,
    title: 'Все видно при реальних торгах',
    text: 'При реальних торгах на вашому акаунті ви будете бачити всю цю інформацію.',
  },
]

type TlEvent = { t: string; label: string }
const SCENARIOS: { tag: string; events: TlEvent[] }[] = [
  {
    tag: 'Старт сьогодні',
    events: [
      { t: 'День 0', label: 'Купівля: компанії 1-2-3-4-5-6-12-x' },
      { t: '+1 місяць', label: 'Продаж 1 → купівля 345' },
      { t: '+1,5 місяця', label: 'Продаж 3 → купівля 1204' },
      { t: '+4 місяці', label: 'Продаж 12 → купівля 75' },
    ],
  },
  {
    tag: 'Старт завтра',
    events: [
      { t: 'День 0', label: 'Купівля: компанії 45-3056-895-7-18-479' },
      { t: '+2 тижні', label: 'Продаж 895 → купівля 1106' },
      { t: '+1,5 місяця', label: 'Продаж 45 → купівля 725' },
      { t: '+5 місяців', label: 'Продаж 725 → купівля 4839' },
    ],
  },
]

/* Compound interest: 1.03^m for 12 months (final +42.6% vs simple +36%) */
const COMPOUND = Array.from({ length: 12 }, (_, i) => Math.pow(1.03, i + 1))
const COMPOUND_MAX = COMPOUND[11] - 1 // 0.4258
const COMP_TOP = 0.5 // chart ceiling → headroom above the 42.6% peak for its label
const COMP_TICKS = [0.1, 0.2, 0.3, 0.4] // y-axis scale marks (10–40%)

/* ---------- Scenario timeline (draw-on-scroll) ---------- */
function ScenarioTimeline({ tag, events, index }: { tag: string; events: TlEvent[]; index: number }) {
  return (
    <Reveal className="rt-tl" variant="fadeUp" delay={index * 0.08}>
      <span className="rt-tl__tag">{tag}</span>
      <div className="rt-tl__area">
        <div className="rt-tl__linewrap" style={{ '--n': events.length } as CSSProperties} aria-hidden="true">
          <motion.div
            className="rt-tl__linefill"
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={viewportOnce}
            transition={{ duration: 1.5, ease: easeOut, delay: 0.2 + index * 0.15 }}
          />
        </div>
        <div className="rt-tl__row" style={{ '--n': events.length } as CSSProperties}>
          {events.map((e, i) => {
            const frac = i / (events.length - 1)
            return (
              <div className="rt-tl__event" key={e.t}>
                <motion.span
                  className="rt-tl__dot"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={viewportOnce}
                  transition={{
                    delay: 0.2 + index * 0.15 + frac * 1.5,
                    type: 'spring',
                    stiffness: 320,
                    damping: 20,
                  }}
                />
                <motion.div
                  className="rt-tl__meta"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.35 + index * 0.15 + frac * 1.5, duration: 0.4 }}
                >
                  <span className="rt-tl__time">{e.t}</span>
                  <span className="rt-tl__label">{e.label}</span>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}

export function Returns() {
  const marquee = useMarqueeSpeed()
  const calcConfig = useMemo<CalcConfig>(() => {
    const max = new Date()
    max.setHours(0, 0, 0, 0)
    max.setDate(max.getDate() - 1) // yesterday
    const min = new Date(2020, 0, 1)
    let start = new Date(max)
    start.setFullYear(start.getFullYear() - 3) // default: a 3-year window
    if (start < min) start = new Date(min)
    return {
      sectionId: 'returns-calc',
      heading: {
        title: 'Перевірте дохідність на своєму періоді',
        subtitle:
          'Треба вибрати період мінімум довжиною в рік, у діапазоні дат від 01.01.2020 до вчорашньої дати.',
      },
      annualRate: 0.45,
      reinvestAffectsCalc: true,
      totalLabel: 'Загальна сума за обраний період',
      dateMin: min,
      dateMax: max,
      minPeriodMonths: 12,
      defaultStart: start,
      defaultEnd: max,
    }
  }, [])

  const loop = [...PRINCIPLES, ...PRINCIPLES, ...PRINCIPLES, ...PRINCIPLES]

  return (
    <>
      <Navbar />
      <main className="rt">
        {/* ============ 01 · Hero (dark) ============ */}
        <section className="rt-hero">
          <div className="rt-hero__bg" aria-hidden="true">
            <div className="rt-hero__grid anim-grid" />
          </div>
          <div className="container rt-hero__inner">
            <div className="rt-hero__copy">
              <motion.span
                className="rt-hero__badge"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <TrendingUp size={15} />
                Дохідність
              </motion.span>
              <motion.h1
                className="rt-hero__title"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
              >
                Реальні цифри стратегії
                <br />
                на реальних даних
              </motion.h1>
              <motion.div
                className="rt-hero__figure"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
              >
                <span className="rt-hero__num num">
                  <CountUp to={45} duration={1.8} delay={0.4} />
                  %+
                </span>
                <span className="rt-hero__num-cap">
                  на рік — незалежно
                  <br />
                  від дати старту
                </span>
              </motion.div>
              <motion.p
                className="rt-hero__lead"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              >
                Тут можна ознайомитись з дохідністю нашої актуальної стратегії торгів на історичних
                (минулих) даних цін на акції на різних періодах.
              </motion.p>
            </div>

            <motion.div
              className="rt-hero__visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
            >
              <HeroChart />
            </motion.div>
          </div>

          <motion.a
            className="rt-hero__scroll"
            href="#returns-calc"
            aria-label="До калькулятора"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ChevronDown size={20} />
          </motion.a>
        </section>

        {/* ============ 02 · Calculator (reused) ============ */}
        <Calculator config={calcConfig} />

        {/* ============ 03 · Principles marquee ============ */}
        <section className="rt-marquee-sec" aria-label="Принципи стратегії">
          <div
            className="rt-marquee"
            ref={marquee.ref}
            onMouseEnter={marquee.onMouseEnter}
            onMouseLeave={marquee.onMouseLeave}
          >
            <div className="rt-marquee__track" aria-hidden="true">
              {loop.map((p, i) => (
                <span className="rt-marquee__item" key={i}>
                  <img
                    src={smallSign}
                    className="rt-marquee__sign"
                    width={18}
                    height={18}
                    alt=""
                    aria-hidden="true"
                  />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 04 (01) · Trust ============ */}
        <section className="section">
          <div className="container">
            <SectionHead num="01" title="Достовірність і прозорість" />
            <div className="rt-trust">
              {TRUST.map((t, i) => {
                const Icon = t.icon
                return (
                  <Reveal className="rt-trust-card" variant="fadeUp" delay={i * 0.08} key={t.title}>
                    <span className="rt-icon">
                      <Icon size={24} />
                    </span>
                    <h3 className="rt-trust-card__title">{t.title}</h3>
                    <p className="rt-trust-card__text">{t.text}</p>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ 05 (02) · Entry-point scenarios ============ */}
        <section className="section">
          <div className="container">
            <SectionHead
              num="02"
              title="Чому дохідність залежить від точки входу"
              sub="Залежно від точки входу (дати початку торгів) виходять різні дохідності. Умовні приклади:"
            />
            <div className="rt-scenarios">
              {SCENARIOS.map((s, i) => (
                <ScenarioTimeline key={s.tag} tag={s.tag} events={s.events} index={i} />
              ))}
            </div>
            <Reveal className="rt-scenarios__note" variant="fadeUp">
              <p>
                Тобто дата початку торгів визначає всю подальшу майбутню торгівлю, яка буде не схожа в
                плані дат/акцій на торгівлю такою ж сумою, яку почали б через день чи в будь-який
                інший день.
              </p>
            </Reveal>

            <div className="rt-concl">
              <Reveal className="rt-concl__statement" variant="fadeBlur">
                <p className="rt-concl__big">
                  Визначити достеменно, в який день краще почати, неможливо — але незалежно від дати
                  початку це буде дохідність <span className="rt-concl__hl">45%+ на рік</span>
                </p>
              </Reveal>
              <div className="rt-concl__cards">
                <Reveal className="rt-concl-card" variant="fadeUp">
                  <span className="rt-icon rt-icon--sm">
                    <TrendingUp size={20} />
                  </span>
                  <h3 className="rt-concl-card__title">Однакові правила й алгоритми</h3>
                  <p className="rt-concl-card__text">
                    В усій торгівлі застосовуються однакові правила й алгоритми:
                  </p>
                  <div className="rt-concl-card__rules">
                    <span className="rt-rule rt-rule--buy">
                      <ArrowUpRight size={15} />
                      Купуються акції, які мають більший потенціал до росту
                    </span>
                    <span className="rt-rule rt-rule--sell">
                      <Wallet size={15} />
                      Продаються (з прибутком) ті, які вже мають менший потенціал для росту
                    </span>
                  </div>
                </Reveal>
                <Reveal className="rt-concl-card" variant="fadeUp" delay={0.08}>
                  <span className="rt-icon rt-icon--sm">
                    <Calendar size={20} />
                  </span>
                  <h3 className="rt-concl-card__title">Це не Day-trading</h3>
                  <p className="rt-concl-card__text">
                    Кількість угод на місяць невелика — потрібен час, щоб акції виростали в ціні.
                    Наша торгівля — це не Day-trading (щоденний денний трейдинг).
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 06 (03) · Credit leverage (navy) ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="feature-card rt-credit" variant="fadeUp">
              <span className="feature-card__grid" aria-hidden="true" />
              <div className="rt-credit__grid2">
                <div className="rt-credit__copy">
                  <span className="feature-card__badge">Важливо</span>
                  <h2 className="feature-card__title">Кредитне плече 1:2</h2>
                  <p>
                    За бажанням в Interactive Brokers можна і бажано взяти кредит для торгів під
                    приблизно 6% річних. Кредит надається в будь-якому обсязі, що не перевищує ваші
                    особисті кошти: якщо ви вклали $1&nbsp;000 — можете взяти ще до $1&nbsp;000
                    кредиту і відповідно збільшити дохідність відносно вкладених коштів.
                  </p>
                  <div className="rt-credit__formula num" aria-label="45 відсотків мінус 6 відсотків — приблизно плюс 39 відсотків додатково">
                    <span>45%+</span>
                    <span className="rt-credit__op">−</span>
                    <span>6%</span>
                    <span className="rt-credit__op">≈</span>
                    <span className="rt-credit__res">+39%</span>
                  </div>
                  <p className="rt-credit__fine">
                    У всіх розрахунках і прикладах це кредитне плече 1:2 не враховується.
                  </p>
                </div>
                <div className="rt-credit__art">
                  <img src={CREDIT_ART} alt="Кредитне плече 1:2 — важіль, що підсилює дохідність" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 07 (04) · Compound interest ============ */}
        <section className="section">
          <div className="container">
            <SectionHead num="04" title="Так працює складний відсоток" />
            <div className="rt-comp">
              <Reveal className="rt-comp__viz" variant="fadeUp">
                <div className="rt-comp__chart" role="img" aria-label="12 стовпчиків місяців: складний відсоток зростає до +42.6% проти +36% простого">
                  {/* y-axis scale */}
                  {COMP_TICKS.map((t) => (
                    <div className="rt-comp__gl" key={t} style={{ bottom: `${(t / COMP_TOP) * 100}%` }}>
                      <span>{Math.round(t * 100)}%</span>
                    </div>
                  ))}
                  {/* simple-interest reference at 36% — label kept left, over the short bars */}
                  <div className="rt-comp__simple" style={{ bottom: `${(0.36 / COMP_TOP) * 100}%` }}>
                    <span className="rt-comp__simple-lbl">простий % · +36%</span>
                  </div>
                  {/* compound peak at 42.6% — where the tallest bar tops out */}
                  <motion.div
                    className="rt-comp__peak"
                    style={{ bottom: `${(COMPOUND_MAX / COMP_TOP) * 100}%` }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={viewportOnce}
                    transition={{ delay: 1, duration: 0.4 }}
                  >
                    <span className="rt-comp__peak-lbl num">+42.6%</span>
                  </motion.div>
                  {COMPOUND.map((v, i) => (
                    <div className="rt-comp__col" key={i}>
                      <motion.div
                        className="rt-comp__bar"
                        style={{ height: `${((v - 1) / COMP_TOP) * 100}%` }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={viewportOnce}
                        transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: easeOut }}
                      />
                      <span className="rt-comp__m">{i + 1}</span>
                    </div>
                  ))}
                </div>
                <span className="rt-comp__axis">12 місяців · 3% на місяць · реінвест</span>
              </Reveal>

              <div className="rt-comp__qa">
                <Reveal className="rt-qa__row" variant="fadeUp">
                  <span className="rt-qa__badge rt-qa__badge--q">
                    <HelpCircle size={15} />
                    Питання
                  </span>
                  <p>
                    Чому, умовно, щомісячна дохідність указана, наприклад, 3%, а в рік при цій
                    дохідності — 42%? Якщо 3% скласти 12 разів (12 місяців), буде 36%, а не 42%.
                  </p>
                </Reveal>
                <Reveal className="rt-qa__row" variant="fadeUp" delay={0.1}>
                  <span className="rt-qa__badge rt-qa__badge--a">
                    <Check size={15} />
                    Відповідь
                  </span>
                  <p>
                    У наших розрахунках усі кошти одразу реінвестуються (зароблені 3% одразу йдуть у
                    роботу при наступній закупівлі), тому відсотки треба не додавати, а множити:
                    100% × 1.03 × 1.03 × 1.03 … і так 12 разів = 142% (42% річних). Так працює
                    складний відсоток — відсотки з вкладення плюс відсотки з відсотків.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 08 (05) · Verify on virtual trades ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="head-center" variant="fadeBlur">
              <h2 className="head-center__title">
                Як перевірити, чи дійсно наші стратегії дохідні
              </h2>
              <p className="head-center__sub">На прикладі віртуальних торгів.</p>
            </Reveal>
            <div className="rt-verify-a">
              <ReturnsGraph />
              <Reveal className="rt-tip" variant="fadeUp" delay={0.05}>
                <span className="rt-icon rt-icon--sm">
                  <Eye size={20} />
                </span>
                <div className="rt-tip__body">
                  <span className="rt-tip__k">Підказка</span>
                  <p>
                    До моменту торгів реальними коштами, при потребі, при відвідуванні нашого офісу
                    (інформація не на загал), ми можемо відкрити всі ваші дані по ваших віртуальних
                    торгах на вашому акаунті для підтвердження дохідності.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <VirtualTrades />

        {/* Notifications */}
        <section className="section">
          <div className="container">
            <Reveal className="rt-notify" variant="fadeUp">
              <div className="rt-notify__mock" aria-hidden="true">
                <div className="rt-noti rt-noti--mail">
                  <span className="rt-noti__icon">
                    <Mail size={16} />
                  </span>
                  <div className="rt-noti__body">
                    <span className="rt-noti__from">Trading.com.ua</span>
                    <span className="rt-noti__text">Звіт про дохідність за квартал</span>
                  </div>
                  <span className="rt-noti__pct num">+9.7%</span>
                </div>
                <div className="rt-noti rt-noti--tg">
                  <span className="rt-noti__icon">
                    <Send size={16} />
                  </span>
                  <div className="rt-noti__body">
                    <span className="rt-noti__from">Telegram</span>
                    <span className="rt-noti__text">Ваш портфель за 3 місяці</span>
                  </div>
                  <span className="rt-noti__pct num">+10.2%</span>
                </div>
              </div>
              <div className="rt-notify__copy">
                <h3 className="rt-notify__title">Звіт про дохідність — раз на три місяці</h3>
                <p>
                  За вашим бажанням ви можете отримувати повідомлення раз на три місяці про
                  дохідність на електронну пошту та/або в Телеграм (задається в налаштуваннях).
                </p>
                <div className="rt-notify__chips">
                  <span className="rt-notify__chip">
                    <Mail size={15} />
                    Email
                  </span>
                  <span className="rt-notify__chip">
                    <Send size={15} />
                    Telegram
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
