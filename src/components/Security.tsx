import { motion } from 'framer-motion'
import { stagger, viewportOnce } from '../lib/motion'
import { Fingerprint, Landmark, Lock, ShieldCheck } from './icons'
import { GlassCard, Reveal } from './primitives'

const ITEMS = [
  {
    icon: Lock,
    title: 'Шифрування 256-біт',
    desc: 'Той самий стандарт, що й у банків. Дані й ключі захищені end-to-end.',
  },
  {
    icon: Landmark,
    title: 'Сегреговані рахунки',
    desc: 'Кошти зберігаються окремо в Interactive Brokers, а не на балансі компанії.',
  },
  {
    icon: Fingerprint,
    title: '2FA та біометрія',
    desc: 'Вхід за Face ID / відбитком і підтвердження кожної критичної дії.',
  },
  {
    icon: ShieldCheck,
    title: 'Регуляція SEC / FINRA',
    desc: 'Брокер під наглядом регуляторів США. Капітал застраховано SIPC до $500k.',
  },
]

const BADGES = ['Interactive Brokers', 'SIPC', 'FINRA', 'SEC', 'ISO 27001']

export function Security() {
  return (
    <section className="section security" id="security">
      <div className="security__glow glow" aria-hidden="true" />
      <div className="container security__inner">
        <Reveal className="security__copy">
          <span className="eyebrow">
            <span className="dot" /> Безпека та довіра
          </span>
          <h2 className="h-section" style={{ marginTop: '1rem' }}>
            Безпека <span className="text-gradient">банківського рівня</span>
          </h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            Ваші гроші та дані захищені на кожному рівні — від шифрування й
            двофакторної автентифікації до сегрегованого зберігання капіталу в
            регульованого брокера.
          </p>

          <div className="security__badges">
            {BADGES.map((b) => (
              <span className="chip" key={b}>
                {b}
              </span>
            ))}
          </div>
        </Reveal>

        <motion.div className="security__grid" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {ITEMS.map((it) => {
            const Icon = it.icon
            return (
              <GlassCard key={it.title} className="security__card" interactive>
                <span className="security__icon">
                  <Icon size={22} />
                </span>
                <h3 className="feature__title">{it.title}</h3>
                <p className="feature__desc">{it.desc}</p>
              </GlassCard>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
