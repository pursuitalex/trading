import { motion } from 'framer-motion'
import { stagger, viewportOnce } from '../lib/motion'
import { ArrowUpRight, Bot, Repeat, TrendingUp, Wallet } from './icons'
import { CountUp, GlassCard, Reveal } from './primitives'

const ALLOCATION = [
  { name: 'Акції США', pct: 58, color: 'var(--brand-400)' },
  { name: 'ETF та індекси', pct: 24, color: 'var(--green-400)' },
  { name: 'Готівка', pct: 12, color: 'var(--purple-400)' },
  { name: 'Облігації', pct: 6, color: '#FFC53D' },
]

const TX = [
  { icon: Wallet, title: 'Поповнення рахунку', meta: 'Visa •• 4921', amount: '+$2 000,00', positive: true },
  { icon: Bot, title: 'Алгоритм купив NVDA', meta: 'Стратегія «Momentum»', amount: '−$1 240,00', positive: false },
  { icon: TrendingUp, title: 'Дивіденди AAPL', meta: '14 акцій', amount: '+$32,60', positive: true },
  { icon: Repeat, title: 'Виведення на картку', meta: 'Миттєво · без комісії', amount: '−$500,00', positive: false },
]

export function AccountPreview() {
  return (
    <section className="section" id="account">
      <div className="container">
        <Reveal className="section__head">
          <span className="eyebrow">
            <span className="dot" /> Огляд рахунку
          </span>
          <h2 className="h-section" style={{ marginTop: '1rem' }}>
            Ваш капітал — <span className="text-gradient">як на долоні</span>
          </h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            Баланс, відкриті позиції, історія транзакцій і дохідність кожної стратегії —
            в єдиній панелі, що оновлюється в реальному часі.
          </p>
        </Reveal>

        <div className="account-grid">
          {/* Main dashboard */}
          <Reveal className="account-main glass">
            <div className="account-main__top">
              <div>
                <span className="acct__label">Вартість портфеля</span>
                <div className="acct__balance num">
                  $<CountUp to={48377.81} decimals={2} />
                </div>
                <span className="account-main__delta text-green num">
                  <ArrowUpRight size={16} /> +12,4% цього місяця
                </span>
              </div>
              <a href="#" className="btn btn--ghost btn--sm">
                Відкрити кабінет <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="alloc">
              <div className="alloc__bar">
                {ALLOCATION.map((a) => (
                  <motion.span
                    key={a.name}
                    className="alloc__seg"
                    style={{ width: `${a.pct}%`, background: a.color }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>
              <motion.ul className="alloc__legend" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
                {ALLOCATION.map((a) => (
                  <motion.li key={a.name} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                    <span className="alloc__dot" style={{ background: a.color }} />
                    {a.name}
                    <strong className="num">{a.pct}%</strong>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Reveal>

          {/* Transactions */}
          <Reveal className="account-tx glass" delay={0.1}>
            <div className="account-tx__head">
              <strong>Останні транзакції</strong>
              <a href="#">Усі</a>
            </div>
            <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
              {TX.map((t) => {
                const Icon = t.icon
                return (
                  <motion.li key={t.title} className="tx" variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }}>
                    <span className="tx__icon">
                      <Icon size={18} />
                    </span>
                    <div className="tx__body">
                      <span className="tx__title">{t.title}</span>
                      <span className="tx__meta">{t.meta}</span>
                    </div>
                    <span className={`tx__amount num ${t.positive ? 'text-green' : ''}`}>{t.amount}</span>
                  </motion.li>
                )
              })}
            </motion.ul>
          </Reveal>
        </div>

        {/* KPI row */}
        <motion.div className="kpi-row" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {[
            { v: 71.8, suf: '%', label: 'Середня дохідність за рік', dec: 1 },
            { v: 0.9, suf: ' сек', label: 'Виконання ордера', dec: 1 },
            { v: 24, suf: '/7', label: 'Алгоритми працюють', dec: 0 },
            { v: 0, suf: '₴', label: 'Комісія за виведення', dec: 0 },
          ].map((k) => (
            <GlassCard key={k.label} className="kpi" interactive>
              <strong className="kpi__value">
                <CountUp to={k.v} decimals={k.dec} suffix={k.suf} />
              </strong>
              <span className="kpi__label">{k.label}</span>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
