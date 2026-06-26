import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check, Info, TrendingUp } from './icons'
import { CountUp, Reveal } from './primitives'
import { viewportOnce } from '../lib/motion'
import arrowGrowth from '../../assets/arrow-growth.svg'
import './Calculator.css'

const PRESETS = [1000, 5000, 10000, 25000, 50000]
const RATE = 0.08
const YEARS = 5

const usd = (v: number, dec = 0) =>
  v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })

type Result = { total: number; profit: number; growth: number }

/* ---- Date picker ---- */
const MONTHS_UK = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
]
const WEEKDAYS_UK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const pad = (n: number) => String(n).padStart(2, '0')
const fmtDate = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`

function DatePicker({
  value,
  onChange,
  ariaLabel,
}: {
  value: Date
  onChange: (d: Date) => void
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1))
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isSel = (d: number) =>
    value.getFullYear() === year && value.getMonth() === month && value.getDate() === d

  return (
    <div className="datepicker" ref={wrapRef}>
      <button
        type="button"
        className="calc-input"
        onClick={() => {
          setView(new Date(value.getFullYear(), value.getMonth(), 1))
          setOpen((o) => !o)
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${ariaLabel}: ${fmtDate(value)}`}
      >
        <Calendar size={20} />
        {fmtDate(value)}
      </button>

      {open && (
        <div className="dp-pop" role="dialog">
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Попередній місяць">
              <ChevronLeft size={18} />
            </button>
            <span className="dp-title">
              {MONTHS_UK[month]} {year}
            </span>
            <button type="button" className="dp-nav" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Наступний місяць">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="dp-grid dp-week">
            {WEEKDAYS_UK.map((w) => (
              <span key={w} className="dp-wd">
                {w}
              </span>
            ))}
          </div>
          <div className="dp-grid">
            {cells.map((d, i) =>
              d === null ? (
                <span key={`e${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  className={`dp-day${isSel(d) ? ' selected' : ''}`}
                  onClick={() => {
                    onChange(new Date(year, month, d))
                    setOpen(false)
                  }}
                >
                  {d}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---- Bottom historical chart (static, animated draw) ---- */
const MAXY = 4500
const Y_TICKS = [4000, 3000, 2000, 1000, 0]
const X_TICKS = [0, 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700]
const CHART: number[] = (() => {
  const n = 132
  const out: number[] = []
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647), seed / 2147483647)
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    let base = 1820 + Math.pow(t, 1.42) * 1950
    if (t > 0.9) base += (t - 0.9) * 3200
    const wob = Math.sin(i * 0.5) * 55 + Math.sin(i * 0.15) * 105
    out.push(Math.max(1200, base + wob + (rnd() - 0.5) * 150))
  }
  return out
})()

function HistoryChart() {
  const W = 1000
  const H = 300
  const pts = CHART.map((v, i) => ({ x: (i / (CHART.length - 1)) * W, y: H - (v / MAXY) * H }))
  const line = 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')
  const area = `${line} L${W} ${H} L0 ${H} Z`

  return (
    <div className="calc-chart">
      <div className="calc-chart__yaxis">
        {Y_TICKS.map((t) => (
          <span key={t} style={{ top: `${(1 - t / MAXY) * 100}%` }}>
            {t === 0 ? '0' : `${t / 1000}K`}
          </span>
        ))}
      </div>
      <div className="calc-chart__plot">
        <svg className="calc-chart__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="calcFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1c69e3" stopOpacity="0.16" />
              <stop offset="1" stopColor="#1c69e3" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Y_TICKS.map((t) => {
            const y = H - (t / MAXY) * H
            return <line key={t} x1="0" x2={W} y1={y} y2={y} className="calc-chart__grid" />
          })}
          <motion.path
            d={area}
            fill="url(#calcFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.path
            d={line}
            className="calc-chart__line"
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="calc-chart__xaxis">
          {X_TICKS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Calculator() {
  const [amount, setAmount] = useState(10000)
  const [reinvest, setReinvest] = useState(true)
  const [result, setResult] = useState<Result | null>(null)
  const [calcId, setCalcId] = useState(0)
  const [startDate, setStartDate] = useState(() => new Date(2024, 10, 6)) // 06.11.2024
  const [endDate, setEndDate] = useState(() => new Date(2026, 5, 4)) // 04.06.2026

  const calculate = () => {
    const total = amount * Math.pow(1 + RATE, YEARS)
    setResult({ total, profit: total - amount, growth: (total / amount - 1) * 100 })
    setCalcId((n) => n + 1)
  }

  return (
    <section className="section calc" id="calculator">
      <div className="container">
        <Reveal className="calc__head" variant="fadeBlur">
          <h2 className="calc__title">Розрахуйте прогнозований прибуток</h2>
          <p className="calc__subtitle">
            На історичних минулих данних цін на акції по нашим актуальним алгоритмам. Введіть лише
            одну цифру, щоб побачити магію алготрейдингу
          </p>
        </Reveal>

        <div className="calc__grid">
          {/* Params card */}
          <motion.div
            className="calc-card calc-params"
            initial={{ opacity: 0, x: -34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="calc-params__head">
              <h3>Параметри розрахунку</h3>
              <p>Оберіть або введіть суму інвестиції</p>
            </div>

            <div className="calc-params__body">
              <div className="calc-dates">
                <div className="calc-field">
                  <span className="calc-label">Дата початку торгів</span>
                  <DatePicker value={startDate} onChange={setStartDate} ariaLabel="Дата початку торгів" />
                </div>
                <div className="calc-field">
                  <span className="calc-label">Дата завершення торгів</span>
                  <DatePicker value={endDate} onChange={setEndDate} ariaLabel="Дата завершення торгів" />
                </div>
              </div>

              <div className="calc-field">
                <span className="calc-label">Сума інвестиції ($)</span>
                <div className="calc-chips">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`calc-chip${amount === p ? ' active' : ''}`}
                      onClick={() => setAmount(p)}
                    >
                      {usd(p)} $
                    </button>
                  ))}
                </div>
                <div className="calc-combo">
                  <input
                    className="calc-combo__input"
                    inputMode="numeric"
                    value={usd(amount)}
                    onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
                    aria-label="Сума інвестиції"
                  />
                  <span className="calc-combo__suffix">$</span>
                  <ChevronDown size={16} className="calc-combo__chev" />
                </div>
              </div>

              <button type="button" className="calc-check" onClick={() => setReinvest((v) => !v)}>
                <span className={`calc-check__box${reinvest ? ' on' : ''}`}>{reinvest && <Check size={12} />}</span>
                <span className="calc-check__label">Реінвестувати прибуток</span>
                <span className="calc-check__hint">— прибуток автоматично реінвестується в стратегію</span>
              </button>

              <button type="button" className="calc-submit" onClick={calculate}>
                Розрахувати по історичним даним
              </button>
            </div>
          </motion.div>

          {/* Result card */}
          <motion.div
            className="calc-card calc-result"
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="calc-result__head">
              <h3>Результат інвестування</h3>
              <span className="calc-result__icon">
                <TrendingUp size={18} />
              </span>
            </div>

            <div className="calc-result__body">
              <div className="calc-result__total">
                <span className="calc-result__muted">Загальна сума через 5 років</span>
                <strong className="num">
                  {result ? (
                    <>
                      <CountUp key={`t${calcId}`} to={result.total} decimals={2} locale="en-US" /> $
                    </>
                  ) : (
                    '0.0 $'
                  )}
                </strong>
              </div>

              <div className="calc-result__split">
                <div>
                  <span className="calc-result__muted">Прибуток</span>
                  <span className="calc-result__profit num">
                    <span>
                      {result ? (
                        <>
                          +<CountUp key={`p${calcId}`} to={result.profit} decimals={2} locale="en-US" /> $
                        </>
                      ) : (
                        '-.-- $'
                      )}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="calc-result__muted">Приріст</span>
                  <span className="calc-result__growth num">
                    <span>
                      {result ? (
                        <>
                          +<CountUp key={`g${calcId}`} to={result.growth} decimals={1} locale="en-US" />%
                        </>
                      ) : (
                        '+-.--%'
                      )}
                    </span>
                    <span className="calc-result__growth-badge">
                      <img src={arrowGrowth} alt="" width={12} height={12} />
                    </span>
                  </span>
                </div>
              </div>

              <div className="calc-result__rows">
                <div>
                  <span className="calc-result__muted">Початковий депозит</span>
                  <strong className="num">{usd(amount, 2)} $</strong>
                </div>
                <div>
                  <span className="calc-result__muted">Ставка</span>
                  <span className="num">8% / рік</span>
                </div>
                <div>
                  <span className="calc-result__muted">Тип</span>
                  <span>Складний %</span>
                </div>
              </div>

              <div className="calc-result__note">
                <Info size={16} />
                <p>
                  Розрахунки є приблизними та не гарантують фактичної прибутковості. Проконсультуйтеся
                  з фінансовим консультантом.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Historical chart — slides down out of the form after "Розрахувати" */}
        {result && (
          <div className="calc-history-wrap">
            {/* Pointer arrow — temporarily disabled (kept here, do NOT delete; re-enable later)
            <svg className="calc-arrow" viewBox="0 0 130 145" fill="none" aria-hidden="true">
              <defs>
                <mask id="calcArrowReveal" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="145">
                  <motion.path
                    d="M92 14 C128 52, 120 104, 36 126"
                    stroke="#fff"
                    strokeWidth={9}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                  />
                </mask>
              </defs>
              <path
                d="M92 14 C128 52, 120 104, 36 126"
                className="calc-arrow__line"
                mask="url(#calcArrowReveal)"
              />
              <motion.path
                d="M53 132 L36 126 L48 112"
                className="calc-arrow__head"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28, delay: 1.25 }}
              />
            </svg>
            */}

            {/* Clip + downward slide: the card unfolds from the top and the content
                slides down, so the chart reads as emerging out of the form above. */}
            <motion.div
              className="calc-history-reveal"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ y: '-100%', opacity: 0.5 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="calc-card calc-history">
                  <div className="calc-history__row">
                    <div className="calc-history__figures">
                      <div className="calc-history__col">
                        <span className="calc-history__muted">U45298745</span>
                        <span className="calc-history__big num">4,377.81</span>
                      </div>
                      <div className="calc-history__col">
                        <span className="calc-history__muted">Change (All)</span>
                        <span className="calc-history__change num">
                          3,143.56
                          <span className="calc-history__pct">+131.1%</span>
                        </span>
                      </div>
                    </div>
                    <div className="calc-history__col calc-history__col--end">
                      <span className="calc-history__muted">Кінцева вартість</span>
                      <span className="calc-history__final num">$57 764</span>
                    </div>
                  </div>
                  <HistoryChart />
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
