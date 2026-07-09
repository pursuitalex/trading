import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CtaLive } from './CtaLive'
import { CountUp, Reveal, SectionHead } from './primitives'
import { useMarqueeSpeed } from '../lib/marquee'
import { easeOut, viewportOnce } from '../lib/motion'
import {
  ArrowRight,
  BarChart,
  Calendar,
  Check,
  ChevronDown,
  Info,
  ShieldCheck,
  Sparkle,
  Star,
  TrendingUp,
  Wallet,
} from './icons'
import smallSign from '../../assets/logo/small-sign.svg'
import './Pricing.css'

/* ---------- Data ---------- */
const TICKER = [
  'Перші 6 місяців безкоштовно',
  'До $10 000 — завжди безкоштовно',
  'Комісія лише від чистого прибутку',
  'Оплата раз на 3 місяці',
  'Готівка · крипто · банківський переказ',
  'Гарантія захисту вкладених коштів',
]

const FREE = [
  {
    icon: Sparkle,
    value: 6,
    unit: ' місяців',
    title: 'Безкоштовно на старті',
    text: 'Перші шість місяців торгуємо безкоштовно — незалежно від суми на рахунку.',
  },
  {
    icon: Star,
    value: 10000,
    unit: '',
    prefix: 'до $',
    title: 'Завжди безкоштовно',
    text: 'Рахунки із сумою до $10 000 ми торгуємо безкоштовно завжди — незалежно від тривалості періоду.',
  },
]

/* Tier data drives the bar chart 1:1 — one series (commission %), so one
   consistent fill for every bar (see the dataviz note in the component). */
const TIERS = [
  { range: '10–50 тис. $', pct: 15 },
  { range: '51–100 тис. $', pct: 20 },
  { range: '101–500 тис. $', pct: 25 },
  { range: '501–999 тис. $', pct: 30 },
  { range: '1 млн $+', pct: 35, top: true },
]
const TIER_MAX = 35

const BILLING = [
  {
    icon: TrendingUp,
    title: 'Лише від чистого прибутку',
    text: 'Відсоток береться від різниці між сумою на початку періоду і сумою через 3 місяці.',
  },
  {
    icon: Calendar,
    title: 'Оплата раз на 3 місяці',
    text: 'Комісія нараховується й сплачується щоквартально — за фактичним результатом.',
  },
  {
    icon: Wallet,
    title: 'Зручні способи оплати',
    text: 'Готівка, криптовалюта або банківський переказ — на ваш вибір.',
  },
]

const GUARANTEE_FACTS = [
  {
    title: 'Імовірність < 1%',
    text: 'На нашу думку, ймовірність такої ситуації менша за 1% — ми проговорюємо її для вашого спокою.',
  },
  {
    title: 'Термін — 1 рік',
    text: 'Компенсація через рік від запиту на повернення, щоб ми мали час відіграти нестачу.',
  },
  {
    title: 'Нотаріально від $10k',
    text: 'Для сум від $10 000 можливе нотаріальне засвідчення гарантій із повною юридичною силою.',
  },
]

/* ---------- Hero visual: quarterly bill mockup ----------
   Same glass-card / live-pulse / head-body-foot language as the other
   pages' hero illustrations, applied to an original "your invoice"
   mockup — the most direct way to show "you pay $0" concretely. */
function PricingCard() {
  return (
    <div className="pr-bill">
      <div className="pr-bill__head">
        <span className="pr-bill__title">Комісія за квартал</span>
        <span className="pr-bill__live">
          <i className="pulse-dot" aria-hidden="true" />
          Перші 6 місяців
        </span>
      </div>

      <div className="pr-bill__body">
        <div className="pr-bill__row">
          <span>Прибуток за квартал</span>
          <strong className="num">
            $<CountUp to={3200} duration={1.6} delay={0.5} />
          </strong>
        </div>
        <div className="pr-bill__row">
          <span>Ваша комісія (0%)</span>
          <strong className="num pr-bill__zero">0 $</strong>
        </div>
        <div className="pr-bill__divider" />
        <div className="pr-bill__row pr-bill__row--total">
          <span>До сплати</span>
          <strong className="num pr-bill__zero">0 $</strong>
        </div>
      </div>

      <div className="pr-bill__foot">
        <div className="pr-bill__val">
          <span>Безкоштовно до</span>
          <strong className="num">
            $<CountUp to={10000} duration={1.6} delay={0.6} />
          </strong>
        </div>
        <span className="pr-bill__badge">
          <Check size={14} />
          Без прихованих платежів
        </span>
      </div>
    </div>
  )
}

/* ---------- Tier chart: animated bar chart of the commission schedule ----------
   One series (commission %), so one consistent fill for every bar — color
   would miscode ordinal tiers as categorical identity. The top tier is
   called out with a ring + badge instead, since that's what's actually
   special about it (negotiable), echoing the compound-interest chart on
   the Дохідність page (same scaleY-on-scroll bar technique). */
function TierChart() {
  return (
    <div className="pr-chart" role="img" aria-label="Стовпчикова діаграма: комісія зростає від 15% до 35% залежно від суми на рахунку">
      {TIERS.map((t, i) => (
        <div className={`pr-chart__col${t.top ? ' pr-chart__col--top' : ''}`} key={t.range}>
          {t.top && <span className="pr-chart__flag">Можлива знижка</span>}
          <motion.span
            className="pr-chart__value num"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.35 }}
          >
            {t.pct}%
          </motion.span>
          <div className="pr-chart__track">
            <motion.div
              className="pr-chart__bar"
              style={{ height: `${(t.pct / TIER_MAX) * 100}%` }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: easeOut }}
            />
          </div>
          <span className="pr-chart__range">{t.range}</span>
        </div>
      ))}
    </div>
  )
}

export function Pricing() {
  const marquee = useMarqueeSpeed()
  const loop = [...TICKER, ...TICKER, ...TICKER, ...TICKER]

  return (
    <>
      <Navbar />
      <main className="pricing">
        {/* ============ Hero (dark) ============ */}
        <section className="pr-hero">
          <div className="pr-hero__bg" aria-hidden="true">
            <div className="pr-hero__grid anim-grid" />
          </div>
          <div className="container pr-hero__inner">
            <div className="pr-hero__copy">
              <motion.span
                className="pr-hero__badge"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <BarChart size={15} />
                Ціни
              </motion.span>
              <motion.h1
                className="pr-hero__title"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
              >
                Платите лише
                <br />
                за прибуток
              </motion.h1>
              <motion.div
                className="pr-hero__figure"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
              >
                <span className="pr-hero__num num">0%</span>
                <span className="pr-hero__num-cap">
                  комісія на старті —
                  <br />
                  торгуємо безкоштовно
                </span>
              </motion.div>
              <motion.p
                className="pr-hero__lead"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              >
                Ми заробляємо тільки тоді, коли заробляєте ви. Комісія — це відсоток від чистого
                прибутку, який ми принесли на ваш рахунок.
              </motion.p>
            </div>

            <motion.div
              className="pr-hero__visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
            >
              <PricingCard />
            </motion.div>
          </div>

          <motion.a
            className="pr-hero__scroll"
            href="#pr-01"
            aria-label="До тарифів"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ChevronDown size={20} />
          </motion.a>
        </section>

        {/* ============ Marquee ============ */}
        <section className="pr-marquee-sec" aria-label="Умови коротко">
          <div
            className="pr-marquee"
            ref={marquee.ref}
            onMouseEnter={marquee.onMouseEnter}
            onMouseLeave={marquee.onMouseLeave}
          >
            <div className="pr-marquee__track" aria-hidden="true">
              {loop.map((p, i) => (
                <span className="pr-marquee__item" key={i}>
                  <img
                    src={smallSign}
                    className="pr-marquee__sign"
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

        {/* ============ 01 · Free conditions ============ */}
        <section className="section" id="pr-01">
          <div className="container">
            <SectionHead num="01" title="Безкоштовні умови" />
            <div className="pr-free">
              {FREE.map((f, i) => {
                const Icon = f.icon
                return (
                  <Reveal className="pr-free-card" variant="fadeUp" delay={i * 0.08} key={f.title}>
                    <div className="pr-free-card__head">
                      <span className="pr-free-card__icon">
                        <Icon size={20} />
                      </span>
                      <span className="pr-free-card__tag">Безкоштовно</span>
                    </div>
                    <span className="pr-free-card__big num">
                      {f.prefix}
                      <CountUp to={f.value} duration={1.4} />
                      {f.unit}
                    </span>
                    <h3 className="pr-free-card__title">{f.title}</h3>
                    <p className="pr-free-card__text">{f.text}</p>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ 02 · Tiers (bar chart) ============ */}
        <section className="section">
          <div className="container">
            <SectionHead
              num="02"
              title="Скільки коштують наші послуги"
              sub="Вартість залежить від суми на вашому рахунку IBKR і береться у відсотках від чистого прибутку."
            />
            <Reveal className="pr-tiers" variant="fadeUp">
              <TierChart />
              <p className="pr-note">
                <Info size={15} />
                Комісія сплачується від чистого прибутку за квартал — різниці між сумою на початку
                періоду та сумою через 3 місяці.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ 03 · Billing ============ */}
        <section className="section">
          <div className="container">
            <SectionHead num="03" title="Як і коли відбувається оплата" />
            <div className="pr-billing">
              {BILLING.map((b, i) => {
                const Icon = b.icon
                return (
                  <Reveal className="pr-billing-card" variant="fadeUp" delay={i * 0.08} key={b.title}>
                    <span className="pr-icon">
                      <Icon size={22} />
                    </span>
                    <h3 className="pr-billing-card__title">{b.title}</h3>
                    <p>{b.text}</p>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ 04 · Guarantee (featured navy, shared shell) ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="feature-card" variant="fadeUp">
              <span className="feature-card__grid" aria-hidden="true" />
              <div className="feature-card__head">
                <span className="feature-card__badge">
                  <ShieldCheck size={13} />
                  У всіх тарифах
                </span>
              </div>
              <h2 className="feature-card__title">Гарантія захисту вкладених коштів</h2>
              <p className="pr-guarantee__lead">
                У найгіршому випадку ми компенсуємо різницю, щоб сума на вашому рахунку ніколи не
                була меншою за всі ваші особисті вкладення за весь період.
              </p>
              <div className="pr-guarantee__facts">
                {GUARANTEE_FACTS.map((g) => (
                  <div className="pr-fact" key={g.title}>
                    <h4>{g.title}</h4>
                    <p>{g.text}</p>
                  </div>
                ))}
              </div>
              <Link to="/guarantees" className="pr-guarantee__link">
                Детальніше про гарантії
                <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ CTA — shared live-candlestick banner (see CtaLive) ============ */}
        <CtaLive
          title="Порахуйте свій прибуток"
          subtitle="Подивіться історичну дохідність стратегії на обраному періоді або одразу створіть акаунт."
          secondary={{ label: 'Дивитись дохідність', to: '/returns' }}
          primary={{ label: 'Створити акаунт', to: '/register' }}
        />
      </main>
      <Footer />
    </>
  )
}
