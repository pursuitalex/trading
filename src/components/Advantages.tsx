import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CtaLive } from './CtaLive'
import { CountUp, Reveal } from './primitives'
import { useMarqueeSpeed } from '../lib/marquee'
import { easeOut, viewportOnce } from '../lib/motion'
import {
  Sparkle,
  TrendingUp,
  Wallet,
  Globe,
  Landmark,
  Check,
  ChevronDown,
  ShieldCheck,
} from './icons'
import smallSign from '../../assets/logo/small-sign.svg'
import './Advantages.css'

/* ---------- Data ---------- */
const TICKER = [
  '45%+ річних',
  'Кошти у валюті',
  'Активи за кордоном',
  'Вивід будь-коли',
  '×3 до S&P 500',
  'Ризики ≈ 0',
  'Керування зі смартфона',
  'Захист від девальвації',
]

const CORE = [
  {
    icon: Wallet,
    title: 'Кошти доступні будь-коли',
    text: 'Продати всі акції в адмінпанелі IB — кілька хвилин у робочі години; переказ на ваш рахунок — теж кілька хвилин, кошти надходять наступного дня.',
  },
  {
    icon: Globe,
    title: 'Кошти у валюті',
    text: 'Капітал зберігається у валюті — захищений від знецінення гривні.',
  },
  {
    icon: Landmark,
    title: 'Кошти за кордоном',
    text: 'Активи зберігаються за кордоном, у надійній міжнародній юрисдикції.',
  },
]

/* Yield comparison — one series (annual %), the top tier called out by accent,
   not a different hue (dataviz: special point via emphasis, same series color). */
const BARS = [
  { label: 'Ми', value: '45%+', pct: 100, accent: true },
  { label: 'S&P 500', value: '≈15%', pct: 33 },
  { label: 'Золото', value: '≈10%', pct: 22 },
  { label: 'Нерухомість', value: '≈8%', pct: 18 },
  { label: 'Вклад', value: '≈5%', pct: 11 },
]

const COMPARISONS = [
  { label: 'Готівка (USD)', their: '−3% / рік', note: 'Долар знецінюється ≈ −3%, євро ≈ −2.3% щороку.' },
  { label: 'Валютний вклад', their: 'до 5% / рік' },
  { label: 'Гривневий вклад', their: 'до 16% / рік', note: 'Гривня девальвує до долара ≈ 8% / рік.' },
  { label: 'Золото', their: 'до 10% / рік' },
  { label: 'Нерухомість', their: '≈ 8% / рік' },
  { label: 'Власний бізнес', their: 'високі ризики', note: 'У нас ризики ≈ 0, без витрат часу, вивід будь-коли.' },
  { label: 'S&P 500, buy & hold', their: '≈ 15% / рік' },
  { label: 'Торгуєте самі', their: '2–6 год / день', note: 'Без людського фактору, великих ризиків і потреби глибоко розбиратись.' },
]

const CRISIS = [
  'Ви можете будь-коли за лічені хвилини вручну продати всі акції та вивести кошти — ціна акцій падає поступово, а не за хвилини.',
  'Під час кризи майже всі інші активи теж знеціняться — приблизно так само або більше.',
  'Криза може настати за рік, а може й через 15+ років.',
]

/* ---------- Hero visual: yield-comparison columns ----------
   Same vector language as the other pages' hero illustrations (glass card,
   live pulse, staggered grow-in) applied to an original shape — our bar
   towering over the alternatives, which is exactly this page's argument. */
function CompareBars() {
  return (
    <div className="adv-bars">
      <div className="adv-bars__head">
        <span className="adv-bars__title">Дохідність за рік</span>
        <span className="adv-bars__live">
          <i className="pulse-dot" aria-hidden="true" />
          Наша стратегія
        </span>
      </div>
      <div className="adv-bars__chart" role="img" aria-label="Порівняння річної дохідності: наша стратегія 45%+ проти альтернатив">
        {BARS.map((b, i) => (
          <div className={`adv-bars__col${b.accent ? ' adv-bars__col--ours' : ''}`} key={b.label}>
            <span className="adv-bars__val num">{b.value}</span>
            <div className="adv-bars__track">
              <motion.div
                className="adv-bars__bar"
                style={{ height: `${b.pct}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: easeOut }}
              />
            </div>
            <span className="adv-bars__label">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Advantages() {
  const marquee = useMarqueeSpeed()
  const loop = [...TICKER, ...TICKER, ...TICKER, ...TICKER]

  return (
    <>
      <Navbar />
      <main className="adv">
        {/* ============ Hero (dark) ============ */}
        <section className="adv-hero">
          <div className="adv-hero__bg" aria-hidden="true">
            <div className="adv-hero__grid anim-grid" />
          </div>
          <div className="container adv-hero__inner">
            <div className="adv-hero__copy">
              <motion.span
                className="adv-hero__badge"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <Sparkle size={15} />
                Переваги
              </motion.span>
              <motion.h1
                className="adv-hero__title"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
              >
                Вигідніше
                <br />
                за будь-яку альтернативу
              </motion.h1>
              <motion.div
                className="adv-hero__figure"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
              >
                <span className="adv-hero__num num">
                  <CountUp to={45} duration={1.6} delay={0.4} />%+
                </span>
                <span className="adv-hero__num-cap">
                  річних — проти ≈ 15% у S&amp;P 500
                  <br />і −3% у готівки
                </span>
              </motion.div>
              <motion.p
                className="adv-hero__lead"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              >
                Звичайний безготівковий рахунок в Interactive Brokers — з тією відмінністю, що кошти
                на ньому постійно зростають, зберігаються у валюті й за кордоном.
              </motion.p>
            </div>

            <motion.div
              className="adv-hero__visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
            >
              <CompareBars />
            </motion.div>
          </div>

          <motion.a
            className="adv-hero__scroll"
            href="#adv-01"
            aria-label="До переваг"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ChevronDown size={20} />
          </motion.a>
        </section>

        {/* ============ Marquee ============ */}
        <section className="adv-marquee-sec" aria-label="Коротко про переваги">
          <div
            className="adv-marquee"
            ref={marquee.ref}
            onMouseEnter={marquee.onMouseEnter}
            onMouseLeave={marquee.onMouseLeave}
          >
            <div className="adv-marquee__track" aria-hidden="true">
              {loop.map((p, i) => (
                <span className="adv-marquee__item" key={i}>
                  <img
                    src={smallSign}
                    className="adv-marquee__sign"
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

        {/* ============ 01 · Key advantages (bento) ============ */}
        <section className="section" id="adv-01">
          <div className="container">
            <Reveal className="head-center" variant="fadeBlur">
              <h2 className="head-center__title">Ключові переваги</h2>
              <p className="head-center__sub">
                Головні причини, чому цей рахунок вигідніший за звичні способи зберігати гроші.
              </p>
            </Reveal>
            <div className="adv-bento">
              <Reveal className="adv-bento__feature" variant="fadeUp">
                <span className="adv-icon">
                  <TrendingUp size={24} />
                </span>
                <div className="adv-bento__feature-body">
                  <span className="adv-bento__stat num">
                    <CountUp to={45} duration={1.6} />%+
                  </span>
                  <div>
                    <h3 className="adv-bento__title">Велика дохідність</h3>
                    <p className="adv-bento__text">
                      Цільовий показник стратегії — 45%+ річних на історичних даних. Кратно більше за
                      будь-яку поширену альтернативу.
                    </p>
                  </div>
                </div>
              </Reveal>
              <div className="adv-bento__row">
                {CORE.map((c) => {
                  const Icon = c.icon
                  return (
                    <Reveal className="adv-bento__card" variant="fadeUp" key={c.title}>
                      <span className="adv-icon">
                        <Icon size={22} />
                      </span>
                      <h3 className="adv-bento__title">{c.title}</h3>
                      <p className="adv-bento__text">{c.text}</p>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============ Statement (editorial pull-quote) ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="adv-quote" variant="fadeBlur">
              <p>
                По суті це звичайний безготівковий рахунок — з тією відмінністю, що кошти на ньому{' '}
                <span className="adv-quote__hl">постійно зростають</span>. Ваше джерело доходу, яким
                зручно керувати просто зі смартфона.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ 02 · Better than alternatives ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="head-center" variant="fadeBlur">
              <h2 className="head-center__title">Вигідніше за інші варіанти</h2>
              <p className="head-center__sub">
                Орієнтовне порівняння річної дохідності з поширеними альтернативами.
              </p>
            </Reveal>
            <div className="adv-compare">
              <Reveal className="adv-compare__anchor" variant="fadeUp">
                <span className="adv-compare__anchor-label">Наша стратегія</span>
                <strong className="adv-compare__anchor-val num">
                  <CountUp to={45} duration={1.6} />%+
                </strong>
                <span className="adv-compare__anchor-cap">річних, на історичних даних</span>
              </Reveal>
              <ul className="adv-compare__list">
                {COMPARISONS.map((c, i) => (
                  <motion.li
                    className="adv-compare__row"
                    key={c.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.04 * i, duration: 0.45, ease: easeOut }}
                  >
                    <div className="adv-compare__row-top">
                      <span className="adv-compare__name">{c.label}</span>
                      <span className="adv-compare__val">{c.their}</span>
                    </div>
                    {c.note && <p className="adv-compare__note">{c.note}</p>}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============ 03 · Crisis (featured navy card) ============ */}
        <section className="section">
          <div className="container">
            <Reveal className="feature-card adv-crisis" variant="fadeUp">
              <span className="feature-card__grid" aria-hidden="true" />
              <div className="feature-card__head">
                <span className="feature-card__badge">
                  <ShieldCheck size={13} />
                  Ризик під контролем
                </span>
              </div>
              <h2 className="feature-card__title">А якщо настане світова криза?</h2>
              <p className="adv-crisis__intro">Так, така ймовірність існує. Але вона під контролем:</p>

              <div className="adv-crisis__grid">
                <ul className="adv-crisis__points">
                  {CRISIS.map((p) => (
                    <li key={p}>
                      <span className="adv-crisis__check">
                        <Check size={14} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="adv-crisis__example">
                  <span className="adv-crisis__example-tag">Приклад</span>
                  <p>
                    Криза настане за 2 роки. До того моменту ви вже заробите 95%+. Ціна акцій впаде
                    умовно вдвічі (хоча ви зможете продати раніше) — ви вийдете в нуль, а наступного
                    року заробите вже 45%+. В інших активах втрати були б значно більшими.
                  </p>
                </div>
              </div>

              <p className="adv-crisis__concl">
                Головна перевага рішення — висока дохідність, яка покриває всі можливі теоретичні
                збитки.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ CTA — shared live-candlestick banner (see CtaLive) ============ */}
        <CtaLive
          title="Порахуйте свою вигоду"
          subtitle="Подивіться історичну дохідність стратегії на обраному періоді або створіть акаунт."
        />
      </main>
      <Footer />
    </>
  )
}
