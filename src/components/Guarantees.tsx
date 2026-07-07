import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CountUp, Reveal, SectionHead } from './primitives'
import { useMarqueeSpeed } from '../lib/marquee'
import { easeOut } from '../lib/motion'
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Globe,
  Info,
  Layers,
  Lock,
  Repeat,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
} from './icons'
import smallSign from '../../assets/logo/small-sign.svg'
import ibDesktop from '../../assets/guarantees/ib-desktop.webp'
import ibTablet from '../../assets/guarantees/ib-tablet.webp'
import ibMobile from '../../assets/guarantees/ib-mobile.webp'
import './Guarantees.css'

/* ---------- Data ---------- */
const TICKER = [
  'Кошти на вашому рахунку в IB',
  'Захист SIPC до $500 000',
  'Додатково Lloyd’s of London до $30 000 000',
  'Доступ лише для торгівлі',
  'Гарантія від програшу вкладених коштів',
  'Наші інтереси збігаються з вашими',
]

const INSURANCE = [
  {
    icon: ShieldCheck,
    title: 'Захист SIPC',
    amount: 'до $500 000',
    text: 'Цінні папери та готівка застраховані Корпорацією із захисту інвесторів у цінні папери (SIPC). До $250 000 із цієї суми покривається у вигляді готівкових коштів.',
  },
  {
    icon: Globe,
    title: 'Lloyd’s of London',
    amount: 'до $30 000 000',
    text: 'Додатковий захист від дефолту брокера через синдикат Lloyd’s of London — до $30 млн на рахунок (ліміт $900 000 на неінвестовану готівку).',
  },
  {
    icon: Layers,
    title: 'Роздільне зберігання',
    amount: 'Segregation',
    text: 'Клієнтські активи відокремлені від коштів компанії. У разі банкрутства брокера ваші акції та облігації переводяться до депозитарію іншого брокера.',
  },
]

const ACCESS = [
  'Виведення коштів можливе лише на банківський рахунок, відкритий на ваше ім’я — це правило Interactive Brokers.',
  'Ви можете відключити нас від торгів будь-якої миті в адмінпанелі Interactive Brokers.',
  'Щотижня IB надсилає вам у застосунок запит на підтвердження дозволу на торги — ви можете просто не підтверджувати його.',
]

const FEATURE_DETAILS = [
  {
    icon: Info,
    title: 'Імовірність < 1%',
    text: 'На нашу думку, ймовірність такої ситуації менша за 1%, але ми проговорюємо її для вашого спокою.',
  },
  {
    icon: Calendar,
    title: 'Термін — 1 рік',
    text: 'Компенсація через рік від запиту на повернення, щоб ми мали час відіграти нестачу. Приклад: ви втратили 10%, ми повернули їх за місяць, а за наступні 3 місяці рахунок усе одно виріс би на +18%.',
  },
  {
    icon: Check,
    title: 'Нотаріальне засвідчення',
    text: 'Для сум від $10 000 можливе нотаріальне засвідчення наших гарантій і зобов’язань — із повною юридичною силою.',
  },
  {
    icon: User,
    title: 'Особиста зустріч',
    text: 'За потреби — особиста зустріч із керівником проєкту в офісі Trading.com.ua в м. Рівне.',
  },
]

/* ---------- Hero visual: layered "protection shield" ----------
   Same drawing technique as the Returns hero chart (motion pathLength,
   staggered spring pop-ins, glass card, live pulse) applied to an
   original shape fitting this page's theme — concentric rings instead
   of a line chart. */
const RINGS = [
  { r: 128, color: '#7f97e8', label: 'Interactive Brokers', delay: 0.3, dur: 1.1 },
  { r: 96, color: '#a6c4f0', label: 'SIPC · $500 000', delay: 1.5, dur: 0.9 },
  { r: 64, color: '#6ef2b0', label: 'Lloyd’s · $30 000 000', delay: 2.5, dur: 0.7 },
]

function GuaranteeShield() {
  return (
    <div className="grt-shield">
      <div className="grt-shield__head">
        <span className="grt-shield__title">Захист вашого капіталу</span>
        <span className="grt-shield__live">
          <i className="pulse-dot" aria-hidden="true" />
          Захист активний
        </span>
      </div>

      <div className="grt-shield__body">
        <div className="grt-shield__rings">
          <svg viewBox="0 0 300 300" aria-hidden="true">
            {RINGS.map((r) => (
              <motion.circle
                key={r.r}
                cx="150"
                cy="150"
                r={r.r}
                fill="none"
                stroke={r.color}
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: r.dur, ease: easeOut, delay: r.delay }}
              />
            ))}
          </svg>
          <motion.span
            className="grt-shield__center"
            initial={{ scale: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, x: '-50%', y: '-50%' }}
            transition={{ delay: 3.3, type: 'spring', stiffness: 280, damping: 16 }}
          >
            <Lock size={24} />
          </motion.span>
        </div>

        <ul className="grt-shield__legend">
          {RINGS.map((r) => (
            <motion.li
              key={r.r}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: r.delay + r.dur, duration: 0.4 }}
            >
              <span className="grt-shield__dot" style={{ background: r.color }} />
              {r.label}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="grt-shield__foot">
        <div className="grt-shield__val">
          <span>Максимальний захист</span>
          <strong className="num">
            <CountUp to={30000000} duration={2.4} delay={0.6} locale="en-US" /> $
          </strong>
        </div>
        <span className="grt-shield__badge">
          <ShieldCheck size={14} />
          SIPC + Lloyd’s
        </span>
      </div>
    </div>
  )
}

/* ---------- Guarantee 03 visual: access-permission mockup ----------
   Non-standard block — an app-permission mockup instead of another
   text+icon card, since it illustrates "you control access" far more
   directly than prose. Toggle slides on once scrolled into view. */
function AccessMockup() {
  return (
    <Reveal className="grt-access" variant="fadeUp" delay={0.1}>
      <div className="grt-access__head">
        <span className="grt-access__brand">
          <i className="pulse-dot" aria-hidden="true" />
          Interactive Brokers
        </span>
      </div>
      <div className="grt-access__row">
        <div className="grt-access__row-copy">
          <strong>Дозвіл на торгівлю</strong>
          <span>Trading.com.ua</span>
        </div>
        <span className="grt-access__toggle" aria-hidden="true">
          <motion.span
            className="grt-access__knob"
            initial={{ x: 2 }}
            whileInView={{ x: 20 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
          />
        </span>
      </div>
      <div className="grt-access__row grt-access__row--muted">
        <div className="grt-access__row-copy">
          <strong>Щотижневе підтвердження</strong>
          <span>Автоматичний запит від IB</span>
        </div>
        <span className="grt-access__repeat">
          <Repeat size={16} />
        </span>
      </div>
      <p className="grt-access__note">Ви можете вимкнути доступ будь-якої миті.</p>
    </Reveal>
  )
}

export function Guarantees() {
  const marquee = useMarqueeSpeed()
  const loop = [...TICKER, ...TICKER, ...TICKER, ...TICKER]

  return (
    <>
      <Navbar />
      <main className="grt">
        {/* ============ Hero (dark) ============ */}
        <section className="grt-hero">
          <div className="grt-hero__bg" aria-hidden="true">
            <div className="grt-hero__grid anim-grid" />
          </div>
          <div className="container grt-hero__inner">
            <div className="grt-hero__copy">
              <motion.span
                className="grt-hero__badge"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <ShieldCheck size={15} />
                Гарантії
              </motion.span>
              <motion.h1
                className="grt-hero__title"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
              >
                Ваш капітал під
                <br />
                надійним захистом
              </motion.h1>
              <motion.div
                className="grt-hero__figure"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
              >
                <span className="grt-hero__num num">
                  <CountUp to={100} duration={1.6} delay={0.4} />%
                </span>
                <span className="grt-hero__num-cap">
                  ваші кошти завжди
                  <br />
                  залишаються вашими
                </span>
              </motion.div>
              <motion.p
                className="grt-hero__lead"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              >
                Ми побудували роботу так, щоб ваші кошти завжди залишалися вашими — на вашому
                рахунку, застраховані та під вашим контролем. Ось як саме.
              </motion.p>
            </div>

            <motion.div
              className="grt-hero__visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
            >
              <GuaranteeShield />
            </motion.div>
          </div>

          <motion.a
            className="grt-hero__scroll"
            href="#grt-01"
            aria-label="До гарантій"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ChevronDown size={20} />
          </motion.a>
        </section>

        {/* ============ Principles marquee ============ */}
        <section className="grt-marquee-sec" aria-label="Наші гарантії коротко">
          <div
            className="grt-marquee"
            ref={marquee.ref}
            onMouseEnter={marquee.onMouseEnter}
            onMouseLeave={marquee.onMouseLeave}
          >
            <div className="grt-marquee__track" aria-hidden="true">
              {loop.map((p, i) => (
                <span className="grt-marquee__item" key={i}>
                  <img
                    src={smallSign}
                    className="grt-marquee__sign"
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

        {/* ============ 01 · IB custody ============ */}
        <section className="section" id="grt-01">
          <div className="container">
            <SectionHead num="01" title="Активи на вашому рахунку в Interactive Brokers" />
            <Reveal className="grt-ib" variant="fadeUp">
              <picture className="grt-ib__bg">
                <source srcSet={ibMobile} media="(max-width: 560px)" />
                <source srcSet={ibTablet} media="(max-width: 900px)" />
                <img src={ibDesktop} alt="" aria-hidden="true" />
              </picture>
              <div className="grt-ib__copy">
                <h3 className="grt-ib__title">
                  Усі ваші акції та кошти зберігаються на вашому особистому рахунку
                </h3>
                <p className="grt-ib__text">
                  Interactive Brokers (IB) — один із найбільших і найнадійніших брокерів світу. Ми не
                  зберігаємо ваші кошти й не маємо до них прямого доступу.
                </p>
                <div className="grt-ib__tickers">
                  <div className="grt-ib__ticker">
                    <span className="grt-ib__ticker-label">Активних клієнтських рахунків</span>
                    <strong className="grt-ib__ticker-val grt-ib__ticker-val--red num">
                      <CountUp to={4.85} decimals={2} duration={1.6} /> млн
                    </strong>
                  </div>
                  <div className="grt-ib__ticker">
                    <span className="grt-ib__ticker-label">Активів клієнтів на зберіганні</span>
                    <strong className="grt-ib__ticker-val grt-ib__ticker-val--green num">
                      $<CountUp to={870} duration={1.6} delay={0.1} /> млрд
                    </strong>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 02 · Insurance ============ */}
        <section className="section">
          <div className="container">
            <SectionHead num="02" title="Акції та кошти застраховані" />
            <div className="grt-insure">
              {INSURANCE.map((it, i) => {
                const Icon = it.icon
                return (
                  <Reveal className="grt-insure-card" variant="fadeUp" delay={i * 0.08} key={it.title}>
                    <span className="grt-insure-card__icon">
                      <Icon size={20} />
                    </span>
                    <span className="grt-insure-card__amount">{it.amount}</span>
                    <h3 className="grt-insure-card__title">{it.title}</h3>
                    <p>{it.text}</p>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ 03 · Access only (mockup + checklist) ============ */}
        <section className="section">
          <div className="container">
            <SectionHead
              num="03"
              title="Доступ лише до торгівлі — не до виведення коштів"
              sub="Ви надаєте нам доступ виключно для здійснення торгів. Повного доступу до рахунку в нас немає — а отже, немає й технічної можливості вивести ваші кошти."
            />
            <div className="grt-verify-a">
              <Reveal className="grt-verify-a__copy" variant="fadeUp">
                <ul className="grt-points">
                  {ACCESS.map((p) => (
                    <li key={p}>
                      <span className="grt-points__check">
                        <Check size={14} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <AccessMockup />
            </div>
          </div>
        </section>

        {/* ============ 04 · Loss protection (featured, navy) ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="feature-card" variant="fadeUp">
              <span className="feature-card__grid" aria-hidden="true" />
              <div className="feature-card__head">
                <span className="feature-card__badge">
                  <Star size={13} />
                  Головна гарантія
                </span>
                <span className="section-head__num section-head__num--light" aria-hidden="true">
                  04
                </span>
              </div>
              <h2 className="feature-card__title">Гарантія захисту особисто вкладених коштів</h2>
              <div className="grt-credit__grid2">
                <div className="grt-credit__copy">
                  <p>
                    У найгіршому випадку ми компенсуємо різницю, щоб сума на вашому рахунку ніколи не
                    була меншою за всі ваші особисті вкладення за весь період.
                  </p>
                  <p className="grt-credit__how">
                    Від загальної суми на рахунку віднімається весь зароблений нами для вас прибуток.
                    Якщо результат виявиться меншим за ваші вкладення — ми компенсуємо нестачу.
                  </p>
                </div>
                <div className="grt-feature__details">
                  {FEATURE_DETAILS.map((d) => {
                    const Icon = d.icon
                    return (
                      <div className="grt-detail" key={d.title}>
                        <span className="grt-detail__icon">
                          <Icon size={16} />
                        </span>
                        <div>
                          <h4>{d.title}</h4>
                          <p>{d.text}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 05 · Aligned incentives ============ */}
        <section className="section">
          <div className="container">
            <SectionHead num="05" title="Наші інтереси збігаються з вашими" />
            <Reveal className="grt-card grt-card--incentive" variant="fadeUp">
              <span className="grt-icon">
                <TrendingUp size={26} />
              </span>
              <p className="grt-card__text">
                Ми отримуємо комісію лише від вашого прибутку. Тому ми максимально зацікавлені
                збільшувати його — це однаково вигідно і вам, і нам.
              </p>
              <span className="grt-pill">Комісія лише від прибутку</span>
            </Reveal>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="section">
          <div className="container grt-cta">
            <h2 className="grt-cta__title">Готові почати з упевненістю?</h2>
            <p className="grt-cta__text">
              Подивіться історичну дохідність стратегії або одразу створіть акаунт.
            </p>
            <div className="grt-cta__btns">
              <Link to="/returns" className="grt-cta__btn grt-cta__btn--outline">
                Дивитись дохідність
              </Link>
              <Link to="/register" className="grt-cta__btn grt-cta__btn--solid">
                Створити акаунт
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
