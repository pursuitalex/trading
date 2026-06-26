import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { CountUp } from './primitives'
import growthIcon from '../../assets/growth.svg'

const RANGES = ['7D', 'MTD', 'YTD', '1Y', 'All']
const MAX_Y = 4000
const Y_TICKS = [4000, 3000, 2000, 1000, 0] // top → bottom
const VW = 1000
const VH = 280

/** Deterministic jagged upward equity series — looks like the original noisy stock line. */
const DATA: number[] = (() => {
  const n = 120
  const out: number[] = []
  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    let base = 980 + Math.pow(t, 1.55) * 1850
    if (t > 0.86) base += (t - 0.86) * 6200 // steep final spike
    const wobble = Math.sin(i * 0.55) * 48 + Math.sin(i * 0.16) * 95
    const noise = (rnd() - 0.5) * 120
    out.push(Math.max(720, base + wobble + noise))
  }
  return out
})()

function fmt(v: number) {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 })
}
function tickLabel(v: number) {
  return v === 0 ? '0' : `${v / 1000}K`
}

export function AccountCard({ start = true }: { start?: boolean }) {
  const reduce = useReducedMotion()
  const [revealed, setRevealed] = useState(false)
  const [hi, setHi] = useState<number | null>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  // Single source of truth for the draw: the line's pathLength is bound to it,
  // and the dot is positioned from the same value — so they can never drift apart.
  const draw = useMotionValue(0)

  // Reveal once the section is ready (`start`). The numbers count up *together* with
  // the line drawing + dot running (simultaneous "growth").
  useEffect(() => {
    if (start) setRevealed(true)
  }, [start])

  // Drive the draw when started: animate `draw` 0→1; the dot follows the exact tip every frame.
  useEffect(() => {
    if (!start) return
    const path = lineRef.current
    const dot = dotRef.current
    if (!path || !dot) return
    if (reduce) {
      draw.set(1)
      return
    }
    const total = path.getTotalLength()
    const unsub = draw.on('change', (p) => {
      const pt = path.getPointAtLength(p * total)
      dot.style.left = `${(pt.x / VW) * 100}%`
      dot.style.top = `${(pt.y / VH) * 100}%`
      dot.style.opacity = p > 0.002 && p < 0.998 ? '1' : '0'
    })
    const controls = animate(draw, 1, {
      duration: 1.6,
      delay: 0.35,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => {
      unsub()
      controls.stop()
    }
  }, [start, reduce, draw])

  const { line, area } = useMemo(() => {
    const n = DATA.length
    const pts = DATA.map((v, i) => ({
      x: (i / (n - 1)) * VW,
      y: VH - (v / MAX_Y) * VH,
    }))
    const line = 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')
    const areaPath = `${line} L${VW} ${VH} L0 ${VH} Z`
    return { line, area: areaPath }
  }, [])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!revealed || !plotRef.current) return
    const r = plotRef.current.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    setHi(Math.round(frac * (DATA.length - 1)))
  }

  const reveal = (delay = 0) =>
    ({
      initial: { opacity: 0, y: 8 },
      animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
      transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
    }) as const

  const hoverVal = hi != null ? DATA[hi] : null
  const hoverXPct = hi != null ? (hi / (DATA.length - 1)) * 100 : 0
  const hoverYPct = hoverVal != null ? (1 - hoverVal / MAX_Y) * 100 : 0
  const nearestTick =
    hoverVal != null ? Y_TICKS.reduce((a, b) => (Math.abs(b - hoverVal) < Math.abs(a - hoverVal) ? b : a)) : null

  return (
    <div className="card">
      {/* Row 1 — appears after the line grows */}
      <motion.div className="card__row1" {...reveal(0)}>
        <div className="card__figures">
          <div className="card__col">
            <span className="card__muted">U45298745</span>
            <span className="card__balance num">
              <CountUp to={4377.81} decimals={2} locale="en-US" play={revealed} delay={0.35} />
            </span>
          </div>
          <div className="card__col">
            <span className="card__muted">Change (All)</span>
            <span className="card__change num">
              <CountUp to={3143.56} decimals={2} locale="en-US" play={revealed} delay={0.35} />
              <img src={growthIcon} alt="" width={24} height={24} />
            </span>
          </div>
        </div>
        <div className="card__tabs">
          <button className="card__tab card__tab--active" type="button">
            Value
          </button>
          <button className="card__tab" type="button">
            Performance
          </button>
        </div>
      </motion.div>

      {/* Chart */}
      <div className="card__chart">
        <div
          className="card__plot"
          ref={plotRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHi(null)}
        >
          <svg className="card__svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="cardArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0F77FF" stopOpacity="0.16" />
                <stop offset="1" stopColor="#0F77FF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines — appear after the line */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {Y_TICKS.map((t) => {
                const y = VH - (t / MAX_Y) * VH
                return <line key={t} x1="0" x2={VW} y1={y} y2={y} className="card__gridline" />
              })}
            </motion.g>

            {/* Area — fades in after the line */}
            <motion.path
              d={area}
              fill="url(#cardArea)"
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />

            {/* The growth line — draws FIRST, before everything else */}
            <motion.path
              ref={lineRef}
              d={line}
              className="card__line"
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw }}
            />

            {/* Hover vertical guide (dot/tooltip are HTML overlays below, kept round) */}
            {hi != null && hoverVal != null && (
              <line
                className="card__vline"
                x1={(hoverXPct / 100) * VW}
                x2={(hoverXPct / 100) * VW}
                y1="0"
                y2={VH}
              />
            )}
          </svg>

          {/* Dot that travels along the line while it draws on load */}
          <span ref={dotRef} className="card__drawdot" />

          {/* Y-axis labels (right) — highlight the one matching the hovered value */}
          <motion.div
            className="card__yaxis"
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {Y_TICKS.map((t) => (
              <span
                key={t}
                className={`card__ytick${nearestTick === t ? ' active' : ''}`}
                style={{ top: `${(1 - t / MAX_Y) * 100}%` }}
              >
                {tickLabel(t)}
              </span>
            ))}
          </motion.div>

          {/* Hover overlays: horizontal guide, dot on the line, tooltip, Y-axis value badge */}
          {hi != null && hoverVal != null && (
            <>
              <div className="card__hline" style={{ top: `${hoverYPct}%` }} />
              <span className="card__hdot" style={{ left: `${hoverXPct}%`, top: `${hoverYPct}%` }} />
              <div className="card__ybadge" style={{ top: `${hoverYPct}%` }}>
                {fmt(hoverVal)}
              </div>
              <div className="card__htip" style={{ left: `${hoverXPct}%`, top: `${hoverYPct}%` }}>
                ${fmt(hoverVal)}
              </div>
            </>
          )}
        </div>

        {/* Time range — appears after the line */}
        <motion.div className="card__range" {...reveal(0.05)}>
          {RANGES.map((r) => (
            <button key={r} className={`card__range-item${r === 'All' ? ' active' : ''}`} type="button">
              {r}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
