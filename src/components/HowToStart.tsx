import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CtaLive } from './CtaLive'
import { CountUp, Reveal } from './primitives'
import { useMarqueeSpeed } from '../lib/marquee'
import { easeOut } from '../lib/motion'
import {
  Rocket,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  Landmark,
  Wallet,
  Repeat,
  Bolt,
  Layers,
} from './icons'
import smallSign from '../../assets/logo/small-sign.svg'
import './HowToStart.css'

/* ---------- Data ---------- */
const TICKER = [
  '5 кроків до старту',
  'Мінімум $100 для початку',
  'IBKR + платіжні системи',
  'Тестовий платіж перед стартом',
  'Податок лише з чистого прибутку',
  'Пільга до $250 000 у воєнний стан',
]

const STEPS = [
  {
    icon: Landmark,
    title: 'Відкрийте рахунок в Interactive Brokers',
    text: 'Зареєструйтеся на InteractiveBrokers.co.uk — саме там реєструються клієнти з Європи, зокрема з України.',
    notes: ['InteractiveBrokers.com — для клієнтів зі США та інших регіонів.'],
  },
  {
    icon: Wallet,
    title: 'Зареєструйтеся в платіжних системах',
    text: 'Створіть акаунт у Wise.com та/або Genome.eu, Transfergo.com, Zen.com — через них кошти підуть за кордон.',
    notes: [
      'Звичайні SWIFT/Wire-перекази за кордон для фізосіб з України заборонені (виняток — лікування, навчання, аліменти, з документальним підтвердженням).',
      'Wise приймає лише картки Mastercard (номер починається на 5) — такі є в Укргазбанку, ПриватБанку, ПУМБ та інших.',
    ],
  },
  {
    icon: Repeat,
    title: 'Налаштуйте ланцюжок поповнення',
    text: 'Відкрийте валютні картки (USD/EUR) у додатках українських банків. Внесіть на них кошти → поповніть платіжну систему оплатою картки на її сайті (як в інтернет-магазині, не SWIFT) → надішліть SEPA-переказ у євро в Interactive Brokers → конвертуйте євро в USD уже в IB.',
    notes: ['Спершу зробіть тестовий платіж (наприклад, $100), щоб перевірити кожну ланку ланцюжка.'],
  },
  {
    icon: Bolt,
    title: 'Підключіть рахунок до Trading.com.ua',
    text: 'Зареєструйтеся в Trading.com.ua, підключіть рахунок Interactive Brokers — і наша система автоматично почне торгувати акціями на вашому рахунку.',
    notes: [],
  },
  {
    icon: Layers,
    title: 'Якщо у вас уже є акції в IB',
    text: 'Алгоритм розпоряджається лише доступними коштами та купленими на них акціями. Ваші наявні акції він запам’ятовує і ніколи не чіпає.',
    notes: [
      'Щоб задіяти наявні акції — продайте їх в адмінпанелі Interactive Brokers: алгоритм побачить вільні кошти й почне торгувати на власний розсуд.',
    ],
  },
]

type InfoItem = { q: string; a: ReactNode }
const INFO: InfoItem[] = [
  {
    q: 'Ліміти на конвертацію та перекази (НБУ)',
    a: (
      <>
        <p>
          Конвертувати гривню у валюту онлайн можна на суму до <strong>50 000 грн/міс</strong> в
          одному банку. Для більших сум поповнюйте валютну картку готівкою в касі банку.
        </p>
        <p>
          Ліміт на покупки за кордоном (поповнення платіжних систем) — <strong>100 000 грн/міс</strong>{' '}
          з одного банку (з усіх його карток). Для більших обсягів використовуйте картки різних
          банків — в обласному центрі зазвичай 20+ банків.
        </p>
        <p>
          Для дуже великих обсягів — відкриття рахунку за кордоном, перевезення готівки через кордон і
          поповнення на місці, далі SEPA-переказ у Interactive Brokers.
        </p>
      </>
    ),
  },
  {
    q: 'Підтвердження походження коштів',
    a: (
      <>
        <p>
          Від певного обсягу Interactive Brokers може запитати про походження коштів. Підійде довідка
          про доходи або довідка про продаж майна (з нотаріально засвідченим перекладом англійською).
        </p>
        <p>
          <strong>Приклад.</strong> Оформлення купівлі-продажу нерухомості в межах родини (прізвища та
          місця прописки покупця і продавця мають відрізнятися): кошти фактично не сплачуються, а
          договір пояснює походження. Якщо нерухомість була у власності понад 3 роки — податки
          мінімальні.
        </p>
        <p>
          Довідка про продаж майна підходить і для Interactive Brokers, і для митниці при
          декларуванні, і для закордонного банку при внесенні коштів.
        </p>
      </>
    ),
  },
  {
    q: 'Перевезення коштів і виїзд за кордон',
    a: (
      <>
        <p>
          До <strong>$10 000 / €10 000</strong> на особу можна перевозити без декларування; понад —
          лише з декларуванням і документами про походження коштів.
        </p>
        <p>
          Якщо у вас немає можливості перетинати кордон — це може зробити дружина чи мати, відкривши
          всі рахунки на себе, і надіслати кошти на свій рахунок в Interactive Brokers або вам у
          платіжну систему, звідки ви поповните власний рахунок IB.
        </p>
      </>
    ),
  },
]

/* ---------- Hero visual: setup / money-flow card ----------
   Same glass-card / live-pulse / head-body-foot language as the other
   pages' hero illustrations, applied to an original shape — a vertical
   connection chain instead of a chart or rings. Dashed line draws top
   to bottom (same pathLength technique as the entry-point scenarios),
   each node popping in with a spring as the line reaches it. */
const FLOW_NODES = ['Банківська картка', 'Платіжна система', 'SEPA-переказ', 'Interactive Brokers']

function SetupFlowCard() {
  const n = FLOW_NODES.length
  return (
    <div className="how-flow">
      <div className="how-flow__head">
        <span className="how-flow__title">Шлях підключення</span>
        <span className="how-flow__live">
          <i className="pulse-dot" aria-hidden="true" />
          Крок за кроком
        </span>
      </div>

      <div className="how-flow__body">
        <div className="how-flow__linewrap" aria-hidden="true">
          <motion.div
            className="how-flow__linefill"
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{ duration: 1.6, ease: easeOut, delay: 0.2 }}
          />
        </div>
        {FLOW_NODES.map((label, i) => {
          const frac = i / (n - 1)
          const isLast = i === n - 1
          return (
            <div className={`how-flow__node${isLast ? ' how-flow__node--last' : ''}`} key={label}>
              <motion.span
                className="how-flow__dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + frac * 1.6, type: 'spring', stiffness: 320, damping: 18 }}
              />
              <motion.span
                className="how-flow__label"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + frac * 1.6, duration: 0.35 }}
              >
                {label}
              </motion.span>
            </div>
          )
        })}
      </div>

      <div className="how-flow__foot">
        <div className="how-flow__val">
          <span>Час на підключення</span>
          <strong className="num">
            <CountUp to={15} duration={1.2} delay={0.6} /> хв
          </strong>
        </div>
        <span className="how-flow__badge">
          <ShieldCheck size={14} />
          Тестовий платіж $100
        </span>
      </div>
    </div>
  )
}

/* One step in the path. Its own in-view flag drives the reveal and reports up,
   so the connecting line can extend to the next node the moment it appears. */
function HowStep({
  step,
  index,
  onReveal,
}: {
  step: (typeof STEPS)[number]
  index: number
  onReveal: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  useEffect(() => {
    if (inView) onReveal(index)
  }, [inView, index, onReveal])

  const Icon = step.icon
  const reversed = index % 2 === 1
  const illustration = (
    <motion.div
      className="how-path__illustration"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span className="how-path__icon">
        <Icon size={26} />
      </span>
    </motion.div>
  )
  const card = (
    <motion.div
      className="how-path__card"
      initial={{ opacity: 0, x: reversed ? -26 : 26 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: reversed ? -26 : 26 }}
      transition={{ delay: 0.18, duration: 0.5, ease: easeOut }}
    >
      <h3 className="how-path__title">{step.title}</h3>
      <p className="how-path__text">{step.text}</p>
      {step.notes.map((n) => (
        <p className="how-path__note" key={n}>
          {n}
        </p>
      ))}
    </motion.div>
  )
  return (
    <div className="how-path__row" ref={ref}>
      {reversed ? card : illustration}
      <motion.span
        className="how-path__node"
        initial={{ scale: 0 }}
        animate={{ scale: inView ? 1 : 0 }}
        transition={{ delay: 0.12, type: 'spring', stiffness: 320, damping: 18 }}
      >
        {index + 1}
      </motion.span>
      {reversed ? illustration : card}
    </div>
  )
}

export function HowToStart() {
  const [open, setOpen] = useState<number | null>(0)
  const marquee = useMarqueeSpeed()
  const loop = [...TICKER, ...TICKER, ...TICKER, ...TICKER]

  // Steps reveal on scroll trigger — each row fires its own in-view flag as it
  // scrolls up (see HowStep), so they appear evenly and only while on screen.
  // The connecting line is driven off the furthest-revealed step: the moment a
  // step appears, the line extends forward to the next node, staying in
  // lock-step with the reveals instead of chasing the raw scroll position.
  const [maxRevealed, setMaxRevealed] = useState(-1)
  const onReveal = useCallback((i: number) => {
    setMaxRevealed((m) => (i > m ? i : m))
  }, [])
  const lineTargetPct =
    maxRevealed < 0 ? 0 : (Math.min(maxRevealed + 1, STEPS.length - 1) / (STEPS.length - 1)) * 100

  return (
    <>
      <Navbar />
      <main className="how">
        {/* ============ Hero (dark) ============ */}
        <section className="how-hero">
          <div className="how-hero__bg" aria-hidden="true">
            <div className="how-hero__grid anim-grid" />
          </div>
          <div className="container how-hero__inner">
            <div className="how-hero__copy">
              <motion.span
                className="how-hero__badge"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <Rocket size={15} />
                Як почати?
              </motion.span>
              <motion.h1
                className="how-hero__title"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
              >
                Запустіть алготрейдинг
                <br />
                за 5 кроків
              </motion.h1>
              <motion.div
                className="how-hero__figure"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
              >
                <span className="how-hero__num num">
                  $<CountUp to={100} duration={1.4} delay={0.4} />
                </span>
                <span className="how-hero__num-cap">
                  мінімальна сума,
                  <br />
                  щоб почати
                </span>
              </motion.div>
              <motion.p
                className="how-hero__lead"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              >
                Для старту потрібен відкритий рахунок в Interactive Brokers із коштами — навіть від
                мінімальних $100. Поповнювати чи виводити кошти можна будь-коли.
              </motion.p>
            </div>

            <motion.div
              className="how-hero__visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
            >
              <SetupFlowCard />
            </motion.div>
          </div>

          <motion.a
            className="how-hero__scroll"
            href="#how-01"
            aria-label="До кроків"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ChevronDown size={20} />
          </motion.a>
        </section>

        {/* ============ Marquee ============ */}
        <section className="how-marquee-sec" aria-label="Коротко про старт">
          <div
            className="how-marquee"
            ref={marquee.ref}
            onMouseEnter={marquee.onMouseEnter}
            onMouseLeave={marquee.onMouseLeave}
          >
            <div className="how-marquee__track" aria-hidden="true">
              {loop.map((p, i) => (
                <span className="how-marquee__item" key={i}>
                  <img
                    src={smallSign}
                    className="how-marquee__sign"
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

        {/* ============ 01 · Steps ============ */}
        <section className="section" id="how-01">
          <div className="container">
            <Reveal className="head-center" variant="fadeBlur">
              <h2 className="head-center__title">5 кроків до старту</h2>
              <p className="head-center__sub">
                Ми не приймаємо ваші кошти на свої рахунки — усе зберігається на вашому рахунку в
                Interactive Brokers.
              </p>
            </Reveal>
            <div className="how-path">
              <div className="how-path__linewrap" aria-hidden="true">
                <motion.div
                  className="how-path__linefill"
                  initial={{ height: '0%' }}
                  animate={{ height: `${lineTargetPct}%` }}
                  transition={{ duration: 0.5, ease: easeOut }}
                />
              </div>
              {STEPS.map((s, i) => (
                <HowStep key={s.title} step={s} index={i} onReveal={onReveal} />
              ))}
            </div>
          </div>
        </section>

        {/* ============ 02 · Taxes + martial-law exemption (featured, shared shell) ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="feature-card" variant="fadeUp">
              <span className="feature-card__grid" aria-hidden="true" />
              <div className="feature-card__head">
                <span className="feature-card__badge">
                  <ShieldCheck size={13} />
                  Пільга воєнного стану
                </span>
              </div>
              <h2 className="feature-card__title">Податки та обмін інформацією (CRS)</h2>

              <div className="how-tax__grid">
                <div className="how-tax__copy">
                  <p>
                    Ваш рахунок буде в <strong>InteractiveBrokers.co.uk</strong> (Англія). Англія бере
                    участь в обміні податковою інформацією <strong>CRS</strong> (Common Reporting
                    Standard — автоматичний обмін даними про фінансові рахунки між податковими
                    органами країн), тож українська податкова знатиме про доходи.
                  </p>
                  <p>
                    Дохід від торгівлі акціями оподатковується як інвестиційний прибуток: загальна
                    ставка <strong>19,5%</strong> (18% ПДФО + 1,5% військовий збір) — і лише з{' '}
                    <strong>чистого прибутку</strong> (різниці між ціною продажу та купівлі акцій). В
                    Interactive Brokers є вся потрібна звітність у зручному для української податкової
                    форматі.
                  </p>
                </div>
                <div className="how-tax__stat">
                  <span className="how-tax__stat-label">
                    Поріг звільнення від автоматичних податків
                  </span>
                  <strong className="how-tax__stat-value num">
                    $<CountUp to={250000} duration={1.8} />
                  </strong>
                  <span className="how-tax__stat-note">
                    станом на 31 грудня, на період дії воєнного стану — понад цю суму рішення про
                    сплату податків залишається за вами.
                  </span>
                </div>
              </div>

              <blockquote className="how-quote">
                «…не вважається податковою інформацією… інформація… яка стосується фінансового
                рахунку громадянина України… якщо сукупний залишок або вартість усіх фінансових
                рахунків, власником яких є одна особа — громадянин України, не перевищує еквівалент
                250 тисяч доларів США станом на 31 грудня календарного року, який припадає на період
                дії воєнного стану…» (п. 53-1.4 ПКУ)
              </blockquote>
              <a
                className="how-law-link"
                href="https://zakon.rada.gov.ua/laws/show/2755-17#n21378"
                target="_blank"
                rel="noreferrer"
              >
                Джерело: zakon.rada.gov.ua
                <ArrowUpRight size={14} />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ============ Useful info — heading left · accordion right (~2/3) ============ */}
        <section className="section">
          <div className="container">
            <div className="how-info">
              <div className="how-info__head">
                <h2 className="section-head__title">Корисна інформація</h2>
                <p className="section-head__sub">
                  Практичні нюанси щодо переказів і документів для клієнтів з України.
                </p>
              </div>
              <div className="how-acc">
                {INFO.map((it, i) => {
                  const isOpen = open === i
                  return (
                    <div className="how-acc__item" key={it.q}>
                      <button
                        className="how-acc__q"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : i)}
                      >
                        <span>{it.q}</span>
                        <span className="how-acc__chev" data-open={isOpen}>
                          <ChevronDown size={22} />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            className="how-acc__a-wrap"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="how-acc__a">{it.a}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA — live candlestick banner (Figma 6672:6691) ============ */}
        <CtaLive />
      </main>
      <Footer />
    </>
  )
}
