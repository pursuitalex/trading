import { motion } from 'framer-motion'
import { Reveal } from './primitives'
import { Lock } from './icons'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'
import iconGlobal from '../../assets/img-icons/icon-global.png'
import iconSecurity from '../../assets/img-icons/icon-security.png'
import iconLock from '../../assets/img-icons/icon-lock.png'
import iconDiscount from '../../assets/img-icons/icon-discount2.png'
import traderMarkW from '../../assets/img-icons/trader-mark-w.svg'
import ibkrMark from '../../assets/img-icons/ibkr-mark.svg'
import './WhyIbkr.css'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Feature = { icon: string; title: string; html: string }
const FEATURES: Feature[] = [
  {
    icon: iconGlobal,
    title: 'Публічна компанія зі США',
    html: '<b>Interactive Brokers (NASDAQ: IBKR)</b> — це фінансовий гігант з капіталом <b>понад $12 млрд</b>, діяльність якого суворо регулюється комісіями SEC та FINRA.',
  },
  {
    icon: iconSecurity,
    title: 'Страхування активів SIPC',
    html: 'Ваші цінні папери та готівкові кошти захищені державною корпорацією страхування інвесторів на суму <b>до $500,000</b>. Це стандарт безпеки американського ринку.',
  },
  {
    icon: iconLock,
    title: 'Безпечне підключення через API',
    html: 'Ви надаєте алгоритму доступ виключно до виконання торгових операцій. Ми не маємо технічної можливості вивести ваші кошти або переказати їх на інший рахунок.',
  },
  {
    icon: iconDiscount,
    title: 'Найнижчі комісії для алготрейдингу',
    html: 'Завдяки прямому доступу до бірж (Direct Market Access), ваші витрати на транзакції мінімальні, що дозволяє алгоритму закривати сотні прибуткових угод без зайвих втрат.',
  },
]

export function WhyIbkr() {
  return (
    <section className="section ibkr" id="why-ibkr">
      <div className="container">
        <Reveal className="calc__head" variant="fadeBlur">
          <h2 className="calc__title">
            Ваш капітал на платформі
            <br />
            брокера IBKR №1 у світі
          </h2>
          <p className="calc__subtitle">
            Ми не приймаємо ваші кошти на свої рахунки. Ви відкриваєте власний аккаунт у найбільшого
            американського брокера.
          </p>
        </Reveal>

        <div className="ibkr__grid">
          {/* Left — flow diagram */}
          <motion.div
            className="ibkr__diagram"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h3 className="ibkr__diagram-title">
              Ми не приймаємо ваші
              <br />
              кошти на свої рахунки
            </h3>

            <div className="ibkr__flow">
              <div className="ibkr__node">
                <span className="ibkr__badge ibkr__badge--trader">
                  <img src={traderMarkW} alt="" width={52} height={52} />
                </span>
                <span className="ibkr__node-label">Trader.com.ua</span>
              </div>

              <div className="ibkr__conn">
                <div className="ibkr__conn-track">
                  <span className="ibkr__dot ibkr__dot--b1" />
                  <span className="ibkr__dot ibkr__dot--b2" />
                  <span className="ibkr__dot ibkr__dot--b3" />
                  <span className="ibkr__dot ibkr__dot--g" />
                  <span className="ibkr__dot ibkr__dot--r" />
                  <span className="ibkr__conn-badge">
                    <Lock size={13} />
                    Encrypted API
                  </span>
                </div>
                <span className="ibkr__conn-label">Secure Connection</span>
              </div>

              <div className="ibkr__node">
                <span className="ibkr__badge ibkr__badge--ibkr">
                  <img src={ibkrMark} alt="" height={56} />
                </span>
                <span className="ibkr__node-label">Interactive Brokers</span>
              </div>
            </div>

            <p className="ibkr__note">
              Ви відкриваєте власний аккаунт у найбільшого американського брокера, а наш алгоритм
              лише допомагає йому працювати ефективніше.
            </p>
          </motion.div>

          {/* Right — 2×2 feature cards */}
          <motion.div
            className="ibkr__cards"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {FEATURES.map((f) => (
              <motion.div className="ibkr-card" key={f.title} variants={fadeUp}>
                <span className="ibkr-card__icon">
                  <img src={f.icon} alt="" width={48} height={48} />
                </span>
                <div className="ibkr-card__body">
                  <h3 className="ibkr-card__title">{f.title}</h3>
                  <p className="ibkr-card__text" dangerouslySetInnerHTML={{ __html: f.html }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
