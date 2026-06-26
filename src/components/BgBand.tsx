import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { CircleCheck, CircleX, User } from './icons'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'
import iconFind from '../../assets/img-icons/icon-find.png'
import iconFlash from '../../assets/img-icons/icon-flash.png'
import iconGrowth from '../../assets/img-icons/icon-growth.png'
import miniLogo from '../../assets/mini-logo.svg'
import './BgBand.css'

const STEPS = [
  {
    icon: iconFind,
    tag: 'Selection',
    title: 'Сканування',
    text: 'Алгоритм щоденно фільтрує фондовий ринок США, обираючи топ-акції з найсильнішою висхідною динамікою. Ми купуємо лише те, що вже зростає.',
  },
  {
    icon: iconFlash,
    tag: 'Execution',
    title: 'Автоматичне виконання',
    text: "Через API-зв'язок система миттєво відкриває позиції на вашому рахунку Interactive Brokers. Швидкість реакції — частки секунди.",
  },
  {
    icon: iconGrowth,
    tag: 'Exit Strategy',
    title: 'Ребалансування',
    text: 'Як тільки акція втрачає темп або починає дешевшати — алгоритм миттєво фіксує прибуток і перекладає кошти в нових лідерів ринку.',
  },
]

// Lines are "drawn" from the text down to the icons; nodes pop once a line reaches them.
const LINE_PATHS = [
  'M489.6 2 L489.6 93',
  'M489.6 2 V5 C489.6 22.67 475.94 37 458.27 37 H45.62 C27.95 37 13.62 51.33 13.62 69 V93',
  'M489.6 2 V5 C489.6 22.67 504.6 37 522.27 37 H933.72 C951.39 37 965.72 51.33 965.72 69 V93',
]
const NODE_X = [13.62, 489.6, 965.72]
const LINE_EASE: [number, number, number, number] = [0.45, 0, 0.2, 1]
const NODE_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

const COMPARE_FEATURES = [
  {
    emoji: '🛡️',
    title: 'Автоматичний Stop-Loss',
    text: 'Система автоматично закриває позицію при найменшому відхиленні від заданих параметрів безпеки.',
  },
  {
    emoji: '💎',
    title: 'Тільки High-Liquidity активи',
    text: 'Алгоритм працює виключно з акціями великих капіталізованих компаній (Blue Chips). Ніякого ризикового «сміття» чи неліквідних паперів.',
  },
  {
    emoji: '👥',
    title: 'Multi-Account Management',
    text: 'Керуйте декількома рахунками Interactive Brokers з одного інтерфейсу. Ідеальне рішення для розподілу капіталу або управління бізнесом.',
  },
]
const COMPARE_ROWS = [
  { feature: 'Швидкість реакції', human: 'Хвилини/Години', algo: 'Мілісекунди' },
  { feature: 'Емоційний фактор', human: 'Страх, жадібність, надія', algo: '0% (суха математика)' },
  { feature: 'Обсяг даних', human: '5-10 компаній', algo: 'Весь ринок (S&P 500 / Russell 2000)' },
  { feature: 'Час роботи', human: '4-6 годин на день', algo: '24/7 моніторинг' },
]

/**
 * Final screen (Figma 6501:6310 bg + 6506:6455 content). A fixed blue gradient
 * layer crossfades in with scroll so the body background appears to change, and
 * the "Як працює наш алгоритм" content fades/staggers in as you reach it.
 */
export function BgBand() {
  const progress = useMotionValue(0)

  useEffect(() => {
    const update = () => {
      const head = document.querySelector('.algo__head')
      const next = document.querySelector('.control')
      if (!head) return
      const vh = window.innerHeight
      const hr = head.getBoundingClientRect()
      const headCentre = hr.top + hr.height / 2
      // fade in as the heading rises to the middle of the viewport…
      const fadeIn = (vh - headCentre) / (vh / 2)
      // …then fade out quickly as the next section enters from the bottom (top: vh → 0.5·vh)
      const nextTop = next ? next.getBoundingClientRect().top : vh * 2
      const fadeOut = (nextTop - vh * 0.5) / (vh * 0.5)
      progress.set(Math.min(fadeIn, fadeOut))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [progress])

  // Fully opaque by the time the heading reaches the middle; fades back out as the section leaves.
  const bgOpacity = useTransform(progress, [0, 1], [0, 1])

  return (
    <>
      <motion.div className="bgfade" style={{ opacity: bgOpacity }} aria-hidden="true">
        <div className="bgfade__grid" />
      </motion.div>

      <section className="section algo" aria-label="Як працює наш алгоритм">
        <motion.div
          className="container algo__inner"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div className="algo__head" variants={fadeUp}>
            <h2 className="algo__title">Як працює наш алгоритм</h2>
            <p className="algo__lead">
              Забудьте про емоції та суб'єктивні прогнози. Система аналізує тисячі акцій у реальному
              часі, слідуючи за капіталом великих гравців.
            </p>
          </motion.div>

          <svg
            className="algo__lines"
            viewBox="13.62 0 952.1 96"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* a top→bottom wipe that reveals the dashed lines as they "draw" */}
              <mask id="algoReveal" maskUnits="userSpaceOnUse">
                <motion.rect
                  x="0"
                  y="0"
                  width="980"
                  fill="#fff"
                  initial={{ height: 0 }}
                  whileInView={{ height: 96 }}
                  viewport={viewportOnce}
                  transition={{ duration: 1, ease: LINE_EASE }}
                />
              </mask>
            </defs>
            <g mask="url(#algoReveal)">
              {LINE_PATHS.map((d, i) => (
                <path key={i} className="algo__line" d={d} />
              ))}
            </g>
            {NODE_X.map((cx, i) => (
              <motion.circle
                key={i}
                className="algo__node"
                cx={cx}
                cy="93"
                r="6.5"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, delay: 1, ease: NODE_EASE }}
              />
            ))}
          </svg>

          <motion.div className="algo__steps" variants={stagger}>
            {STEPS.map(({ icon, tag, title, text }) => (
              <motion.div className="algo-card" key={tag} variants={fadeUp}>
                <span className="algo-card__icon">
                  <img src={icon} alt="" width={48} height={48} />
                </span>
                <div className="algo-card__body">
                  <div className="algo-card__heading">
                    <span className="algo-card__tag">{tag}</span>
                    <h3 className="algo-card__title">{title}</h3>
                  </div>
                  <p className="algo-card__text">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="compare" variants={fadeUp}>
            <aside className="compare__aside">
              <h3 className="compare__aside-title">
                Технологічний захист
                <br />
                вашого капіталу
              </h3>
              <ul className="compare__features">
                {COMPARE_FEATURES.map((f) => (
                  <li key={f.title}>
                    <span className="compare__emoji">{f.emoji}</span>
                    <p>
                      <strong>{f.title}</strong>
                      <br />
                      {f.text}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="compare__table-wrap">
              <div className="compare__table">
                <div className="compare__row compare__row--head">
                  <span className="compare__cell compare__cell--feat">Характеристика</span>
                  <span className="compare__cell compare__cell--col">
                    <span className="compare__hicon compare__hicon--human">
                      <User size={18} />
                    </span>
                    Людина-трейдер
                  </span>
                  <span className="compare__cell compare__cell--col">
                    <span className="compare__hicon compare__hicon--algo">
                      <img src={miniLogo} alt="" width={34} height={34} />
                    </span>
                    Наш Алгоритм
                  </span>
                </div>
                {COMPARE_ROWS.map((r) => (
                  <div className="compare__row" key={r.feature}>
                    <span className="compare__cell compare__cell--feat">{r.feature}</span>
                    <span className="compare__cell compare__cell--human">
                      <CircleX className="compare__no" size={20} />
                      {r.human}
                    </span>
                    <span className="compare__cell compare__cell--algo">
                      <span className="compare__yes">
                        <CircleCheck size={20} />
                        {r.algo}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
