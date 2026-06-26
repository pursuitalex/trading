import { motion } from 'framer-motion'
import { stagger, viewportOnce } from '../lib/motion'
import { BarChart, Bot, Globe, Layers, Repeat, Wallet } from './icons'
import { GlassCard, Reveal, Sparkline } from './primitives'

const FEATURES = [
  {
    icon: Bot,
    title: 'Автоторгівля за алгоритмами',
    desc: 'Готові стратегії або власні правила. Бот виконує угоди 24/7 без емоцій, ребалансує портфель і фіксує прибуток.',
    span: true,
  },
  {
    icon: Repeat,
    title: 'Миттєві перекази та виведення',
    desc: 'Поповнення карткою за секунди, виведення без прихованих комісій.',
  },
  {
    icon: BarChart,
    title: 'Аналітика в реальному часі',
    desc: 'Дохідність, ризик і просадка по кожній стратегії наживо.',
  },
  {
    icon: Layers,
    title: 'API для розробників',
    desc: 'REST та WebSocket для власних ботів і інтеграцій.',
  },
  {
    icon: Wallet,
    title: 'Мультивалютний рахунок',
    desc: 'USD, EUR і UAH в одному гаманці з вигідним курсом.',
  },
  {
    icon: Globe,
    title: 'Доступ до 50+ ринків',
    desc: 'Акції, ETF та індекси США і Європи в один тап.',
  },
]

export function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <Reveal className="section__head center">
          <span className="eyebrow">
            <span className="dot" /> Можливості платформи
          </span>
          <h2 className="h-section" style={{ marginTop: '1rem' }}>
            Усе для керування капіталом<br />
            <span className="text-gradient">в одному застосунку</span>
          </h2>
        </Reveal>

        <motion.div className="features-grid" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <GlassCard key={f.title} className={`feature ${f.span ? 'feature--wide' : ''}`} interactive>
                <span className="feature__icon">
                  <Icon size={22} />
                </span>
                <h3 className="feature__title">{f.title}</h3>
                <p className="feature__desc">{f.desc}</p>
                {f.span && (
                  <div className="feature__visual">
                    <div className="feature__strategy">
                      <span>Momentum US</span>
                      <Sparkline up width={84} height={28} />
                      <strong className="text-green num">+18,2%</strong>
                    </div>
                    <div className="feature__strategy">
                      <span>Dividend Core</span>
                      <Sparkline up width={84} height={28} />
                      <strong className="text-green num">+9,4%</strong>
                    </div>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
