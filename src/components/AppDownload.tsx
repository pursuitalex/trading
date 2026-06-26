import { motion } from 'framer-motion'
import { stagger, viewportOnce } from '../lib/motion'
import { Apple, Bolt, Check, PlayStore } from './icons'
import { CountUp, EquityChart, Reveal, Stars } from './primitives'

const PERKS = [
  'Push-сповіщення про кожну угоду та зміну балансу',
  'Поповнення й виведення прямо зі смартфона',
  'Face ID та офлайн-перегляд портфеля',
]

export function AppDownload() {
  return (
    <section className="section app" id="app">
      <div className="container app__inner">
        {/* Phone mockup */}
        <motion.div
          className="app__phone-wrap"
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -4 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="phone">
            <div className="phone__notch" />
            <div className="phone__screen">
              <div className="phone__statusbar">
                <span>9:41</span>
                <span className="phone__bolt">
                  <Bolt size={13} />
                </span>
              </div>
              <span className="acct__label">Баланс</span>
              <div className="phone__balance num">
                $<CountUp to={48377.81} decimals={2} />
              </div>
              <span className="phone__delta text-green num">+71,8% за рік</span>
              <div className="phone__chart">
                <EquityChart height={120} />
              </div>
              <div className="phone__actions">
                <span className="phone__btn phone__btn--primary">Поповнити</span>
                <span className="phone__btn">Вивести</span>
              </div>
              <div className="phone__row">
                <span>Автоторгівля</span>
                <span className="phone__toggle">
                  <span className="phone__toggle-dot" />
                </span>
              </div>
            </div>
          </div>
          <span className="glow app__phone-glow" aria-hidden="true" />
        </motion.div>

        {/* Copy */}
        <Reveal className="app__copy">
          <span className="eyebrow">
            <span className="dot" /> Мобільний застосунок
          </span>
          <h2 className="h-section" style={{ marginTop: '1rem' }}>
            Керуйте інвестиціями <span className="text-gradient">зі смартфона</span>
          </h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            Повноцінний кабінет у кишені: відкривайте угоди, керуйте алгоритмами та
            виводьте кошти будь-коли. iOS і Android.
          </p>

          <motion.ul className="app__perks" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            {PERKS.map((p) => (
              <motion.li key={p} variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }}>
                <span className="hero__check">
                  <Check size={14} />
                </span>
                {p}
              </motion.li>
            ))}
          </motion.ul>

          <div className="app__stores">
            <a href="#" className="store">
              <Apple size={26} />
              <span>
                <small>Завантажити в</small>
                <strong>App Store</strong>
              </span>
            </a>
            <a href="#" className="store">
              <PlayStore size={24} />
              <span>
                <small>Доступно в</small>
                <strong>Google Play</strong>
              </span>
            </a>
          </div>

          <div className="app__rating">
            <Stars value={5} />
            <span className="text-muted">
              <strong className="num">4.9</strong> · понад <strong className="num">18 000</strong> відгуків
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
