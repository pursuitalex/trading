import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { fadeUp, hoverLift, revealVariants, type RevealVariant, viewportOnce } from '../lib/motion'
import { Star } from './icons'

/* ---------- SectionHead: big outlined number + gradient title ----------
   Shared "chapter heading" for numbered sections on inner pages (Дохідність,
   Гарантії, ...) — one implementation so the rhythm stays identical
   everywhere instead of drifting per-page copies. */
export function SectionHead({
  num,
  title,
  sub,
  light = false,
}: {
  num: string
  title: string
  sub?: string
  light?: boolean
}) {
  return (
    <Reveal className="section-head" variant="fadeUp">
      <span
        className={`section-head__num${light ? ' section-head__num--light' : ''}`}
        aria-hidden="true"
      >
        {num}
      </span>
      <div className="section-head__copy">
        <h2 className="section-head__title">{title}</h2>
        {sub && <p className="section-head__sub">{sub}</p>}
      </div>
    </Reveal>
  )
}

/* ---------- Reveal: scroll-triggered fade-up wrapper ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'fadeUp',
}: {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- GlassCard: glassmorphism surface (works inside stagger) ---------- */
export function GlassCard({
  children,
  className = '',
  interactive = false,
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
}) {
  return (
    <motion.div className={`glass ${className}`} variants={fadeUp} {...(interactive ? hoverLift : {})}>
      {children}
    </motion.div>
  )
}

/* ---------- CountUp: animated number, fires when scrolled into view ---------- */
export function CountUp({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  delay = 0,
  locale = 'uk-UA',
  play,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  locale?: string
  /** When provided, gates the count-up on this flag instead of viewport visibility. */
  play?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)
  const trigger = play !== undefined ? play : inView

  useEffect(() => {
    if (!trigger) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [trigger, to, duration, delay, reduce])

  const formatted = val.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className="num">
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

/* ---------- EquityChart: light-card area chart with animated line draw ---------- */
export function EquityChart({ height = 180 }: { height?: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const line =
    'M0 152 C40 144 70 146 100 118 S160 112 196 80 S256 86 292 52 S352 40 400 20'
  const area = `${line} L400 200 L0 200 Z`

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 200"
      width="100%"
      height={height}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F77FF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#0F77FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="eqLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F77FF" />
          <stop offset="1" stopColor="#00BFA6" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#eqFill)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      <motion.path
        d={line}
        stroke="url(#eqLine)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/* ---------- Sparkline: tiny inline trend ---------- */
export function Sparkline({ up = true, width = 64, height = 28 }: { up?: boolean; width?: number; height?: number }) {
  const d = up ? 'M2 22 L14 17 L24 19 L36 9 L48 12 L62 3' : 'M2 5 L14 9 L24 7 L36 16 L48 13 L62 24'
  return (
    <svg width={width} height={height} viewBox="0 0 64 28" fill="none" aria-hidden="true">
      <path
        d={d}
        stroke={up ? 'var(--green-400)' : 'var(--red-500)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------- Stars: rating row ---------- */
export function Stars({ value = 5 }: { value?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, color: '#FFC53D' }} aria-label={`Рейтинг ${value} з 5`}>
      {Array.from({ length: value }).map((_, i) => (
        <Star key={i} size={16} />
      ))}
    </span>
  )
}
