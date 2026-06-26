import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Info, User } from './icons'
import { fadeBlur, fadeUp, stagger, viewportOnce } from '../lib/motion'
import seamlessLoop from '../../assets/video/seamless-loop.mp4'
import tradingMark from '../../assets/trading-mark.png'
import './VirtualTrades.css'

const PRESETS = [1000, 5000, 10000, 25000, 50000, 100000]
const usd = (v: number) => v.toLocaleString('en-US')
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function VirtualTrades() {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // The looping background plays only while the section is on screen — it starts as you
  // scroll down to it and pauses once it leaves (and never autoplays for reduced-motion).
  const inView = useInView(cardRef, { margin: '-15% 0px -15% 0px' })

  const [amount, setAmount] = useState(10000)
  const [reinvest, setReinvest] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (reduce || !inView) {
      v.pause()
      return
    }
    v.play().catch(() => {
      /* autoplay may be blocked; muted+playsInline should allow it */
    })
  }, [inView, reduce])

  return (
    <section className="section vt-section" id="virtual-trades">
      <div className="container">
        <motion.div
          className="vt"
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Seamless looping video background — plays on scroll into view */}
          <video
            ref={videoRef}
            className="vt__video"
            src={seamlessLoop}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          {/* Left→right darkening so the copy stays legible over the video */}
          <div className="vt__overlay" aria-hidden="true" />

          {/* Left — copy */}
          <motion.div
            className="vt__head"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <motion.img
              src={tradingMark}
              alt=""
              className="vt__mark"
              width={110}
              height={110}
              variants={fadeUp}
            />
            <motion.h2 className="vt__title" variants={fadeBlur}>
              Почати безкоштовні віртуальні торги
            </motion.h2>
            <motion.p className="vt__lead" variants={fadeUp}>
              Зареєструйтеся, введіть суму — програма автоматично почне торгувати акціями на цю суму.
              Ви дізнаєтеся скільки могли б отримати без жодного ризику для реальних коштів.
            </motion.p>
            <motion.div className="vt__note" variants={fadeUp}>
              <Info size={20} className="vt__note-icon" />
              <p>
                Дохідність визначається на довгому часовому горизонті.{' '}
                <strong>
                  Раз на три місяці ми будемо надсилати вам звіт про стан портфелю та поточну
                  дохідність
                </strong>{' '}
                — на пошту або в телеграм, на ваш вибір.
              </p>
            </motion.div>
          </motion.div>

          {/* Right — registration form card (swaps to a success state on submit) */}
          <motion.div
            className="vt__form"
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!submitted ? (
                <motion.div
                  className="vt__form-inner"
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <h3 className="vt__form-title">Віртуальні торги</h3>

                  <div className="vt__field">
                    <span className="vt__label">Ввести суму ($)</span>

                    <div className="vt__pills">
                      {PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`vt__pill${amount === p ? ' active' : ''}`}
                          onClick={() => setAmount(p)}
                        >
                          {usd(p)} $
                        </button>
                      ))}
                    </div>

                    <div className="vt__combo">
                      <input
                        className="vt__combo-input"
                        inputMode="numeric"
                        placeholder="Або введіть свою суму"
                        value={amount > 0 ? usd(amount) : ''}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '')
                          setAmount(Number(digits) || 0)
                        }}
                        aria-label="Сума інвестиції"
                      />
                      <ChevronDown size={16} className="vt__combo-chev" />
                    </div>

                    <button
                      type="button"
                      className="vt__check"
                      onClick={() => setReinvest((v) => !v)}
                      aria-pressed={reinvest}
                    >
                      <span className={`vt__check-box${reinvest ? ' on' : ''}`}>
                        {reinvest && <Check size={12} />}
                      </span>
                      <span className="vt__check-label">Реінвестувати прибуток</span>
                    </button>
                  </div>

                  <div className="vt__cta">
                    <button type="button" className="vt__submit" onClick={() => setSubmitted(true)}>
                      Почати віртуальні торги
                    </button>
                    <p className="vt__caption">Від сьогодні, по нашим актуальним алгоритмам</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="vt__success"
                  key="success"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } }}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className="vt__success-badge"
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="38" height="38" fill="none" aria-hidden="true">
                      <motion.path
                        d="M5 13l4 4L19 7"
                        stroke="#fff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
                      />
                    </svg>
                  </motion.div>

                  <motion.h3 className="vt__success-title" variants={fadeUp}>
                    Віртуальні торги запущено!
                  </motion.h3>

                  <motion.p className="vt__success-text" variants={fadeUp}>
                    Ми активували алгоритмічну торгівлю
                    {amount > 0 ? (
                      <>
                        {' '}
                        на віртуальну суму <strong>{usd(amount)} $</strong>
                      </>
                    ) : (
                      ''
                    )}{' '}
                    за нашими актуальними стратегіями.
                  </motion.p>

                  <motion.div className="vt__success-note" variants={fadeUp}>
                    <User size={18} className="vt__success-note-icon" />
                    <p>Результати можна буде відслідковувати в особистому кабінеті.</p>
                  </motion.div>

                  <motion.div className="vt__success-actions" variants={fadeUp}>
                    <button type="button" className="vt__submit">
                      Перейти в особистий кабінет
                    </button>
                    <button
                      type="button"
                      className="vt__success-back"
                      onClick={() => setSubmitted(false)}
                    >
                      Змінити суму
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
