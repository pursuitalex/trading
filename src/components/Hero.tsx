import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { fadeUp } from '../lib/motion'
import { AccountCard } from './AccountCard'
import ibkrLogo from '../../assets/logo/ibkr-logo.svg'
import pinIcon from '../../assets/pin.svg'
import purseIcon from '../../assets/purse-icon.svg'
import checkIcon from '../../assets/check-icon.svg'

const BULLETS = [
  'Ваші акції і кошти зберігаються на InteractiveBrokers',
  'Автоматично ведемо ними алгоритмічну торгівлю',
  'Алгоритми розроблені компанією SoftGroup',
]

const RAISE = -70 // lift the floating cards up by 70px
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  // The section reveals top→bottom first; only then do its elements appear.
  const [revealed, setRevealed] = useState(false)

  // Reveal wipe: animate the bottom inset 100% → 0% (numeric value → clip-path string each
  // frame). Driving a number is reliable where animating the raw clip-path string is not.
  const revealPct = useMotionValue(100)
  const clipPath = useTransform(revealPct, (v) => `inset(0% 0% ${v}% 0%)`)
  useEffect(() => {
    if (reduce) {
      revealPct.set(0)
      setRevealed(true)
      return
    }
    const controls = animate(revealPct, 0, {
      duration: 0.75,
      ease: EASE,
      onComplete: () => setRevealed(true),
    })
    const t = setTimeout(() => setRevealed(true), 1100) // safety: never leave content hidden
    return () => {
      controls.stop()
      clearTimeout(t)
    }
  }, [reduce, revealPct])

  // Pointer offset from hero centre (px), smoothed by a spring for fluid parallax.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 16, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 50, damping: 16, mass: 0.6 })

  // The account card reacts only weakly — it sits "deepest".
  const cardX = useTransform(sx, (v) => v * 0.02)
  const cardY = useTransform(sy, (v) => v * 0.02)

  // Floating cards react strongly — faster and further than the card. + RAISE lifts them 70px.
  const ibkrX = useTransform(sx, (v) => v * 0.045)
  const ibkrY = useTransform(sy, (v) => v * 0.045 + RAISE)
  const wallX = useTransform(sx, (v) => v * 0.06)
  const wallY = useTransform(sy, (v) => v * 0.06 + RAISE)
  const insX = useTransform(sx, (v) => v * 0.075)
  const insY = useTransform(sy, (v) => v * 0.075 + RAISE)

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce || !heroRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    mx.set(e.clientX - (r.left + r.width / 2))
    my.set(e.clientY - (r.top + r.height / 2))
  }
  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.section
      className="hero"
      id="top"
      ref={heroRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ clipPath }}
    >
      {/* Animated shader background — drifts independently of the cursor (ambient vibe only) */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-inner">
          <div className="hero__base anim-hue" />
          <span className="hero__blob anim-blob" style={{ width: 620, height: 620, top: -160, right: -80, background: 'radial-gradient(circle, rgba(71,95,250,0.55), transparent 65%)' }} />
          <span className="hero__blob anim-blob" style={{ width: 520, height: 520, bottom: -200, left: -60, background: 'radial-gradient(circle, rgba(31,59,135,0.7), transparent 65%)', animationDelay: '-7s' }} />
          <span className="hero__blob anim-blob" style={{ width: 460, height: 460, top: '30%', left: '45%', background: 'radial-gradient(circle, rgba(118,178,255,0.32), transparent 60%)', animationDelay: '-3s' }} />
          <div className="hero__grid anim-grid" />
        </div>
      </div>

      <div className="container hero__inner">
        {/* Left — copy: appears after the section reveal; headline → bullets → buttons */}
        <div className="hero__copy">
          <motion.h1
            className="hero__title"
            initial="hidden"
            animate={revealed ? 'show' : 'hidden'}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
          >
            <motion.span className="hword hl-sky" variants={fadeUp}>
              Автоматична
            </motion.span>{' '}
            <motion.span className="hword" variants={fadeUp}>
              торгівля
            </motion.span>{' '}
            <motion.span className="hword" variants={fadeUp}>
              акціями
            </motion.span>{' '}
            <motion.span className="hword" variants={fadeUp}>
              по
            </motion.span>{' '}
            <motion.span className="hword" variants={fadeUp}>
              алгоритмам
            </motion.span>{' '}
            <motion.span className="hword" variants={fadeUp}>
              із
            </motion.span>{' '}
            <motion.span className="hword" variants={fadeUp}>
              доходністю
            </motion.span>{' '}
            <motion.span className="hword hl-frame" variants={fadeUp}>
              <i className="hl-corner hl-corner--tl" />
              <i className="hl-corner hl-corner--tr" />
              <i className="hl-corner hl-corner--bl" />
              <i className="hl-corner hl-corner--br" />
              <span className="hl-green">45%+ річних</span>
            </motion.span>
          </motion.h1>

          <motion.ul
            className="hero__bullets"
            initial="hidden"
            animate={revealed ? 'show' : 'hidden'}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.45 } } }}
          >
            {BULLETS.map((b) => (
              <motion.li key={b} variants={fadeUp}>
                <img src={pinIcon} alt="" className="hero__pin" width={13} height={13} />
                {b}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 1.0, ease: EASE }}
          >
            <a href="#" className="btn btn--outline">
              Демо-кабінет
            </a>
            <a href="#" className="btn btn--light">
              Реєстрація
            </a>
          </motion.div>
        </div>

        {/* Right — account card + parallax floating cards */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
        >
          <motion.div className="hero__card-wrap" style={{ x: cardX, y: cardY }}>
            <AccountCard start={revealed} />
          </motion.div>

          {/* Floating cards — lifted 70px, parallax-reactive */}
          <motion.div
            className="float float--wallet"
            style={{ x: wallX, y: wallY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.55, delay: 0.55, ease: EASE }}
          >
            <span className="float__badge">
              <img src={purseIcon} alt="" />
            </span>
            <p>Купуємо лідерів росту та продаємо аутсайдерів 24/7, поки ви займаєтесь своїми справами</p>
          </motion.div>

          <motion.div
            className="float float--ibkr"
            style={{ x: ibkrX, y: ibkrY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.55, delay: 0.7, ease: EASE }}
          >
            <img src={ibkrLogo} alt="Interactive Brokers" width={120} height={41} />
          </motion.div>

          <motion.div
            className="float float--insured"
            style={{ x: insX, y: insY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.55, delay: 0.85, ease: EASE }}
          >
            <span className="float__badge">
              <img src={checkIcon} alt="" />
            </span>
            <p>
              Акції і кошти застраховані на суму до <strong>500.000$</strong>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
