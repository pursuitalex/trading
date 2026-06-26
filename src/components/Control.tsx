import { motion } from 'framer-motion'
import { Reveal } from './primitives'
import { viewportOnce } from '../lib/motion'
import dashboard from '../../assets/dashboard.png'
import opActivity from '../../assets/op-activity.svg'
import opBuy from '../../assets/op-buy.svg'
import opProfit from '../../assets/op-profit.svg'
import './Control.css'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Op = { type: 'buy' | 'profit'; action: string; ticker: string; sub: string; time: string }
const OPS: Op[] = [
  { type: 'buy', action: 'Buy', ticker: '$NVDA', sub: '@ $890.12', time: '2 хв тому' },
  { type: 'profit', action: 'Profit Taken', ticker: '$AMD', sub: '+4.2%', time: '15 хв тому' },
  { type: 'buy', action: 'Buy', ticker: '$META', sub: '@ $495.30', time: '40 хв тому' },
  { type: 'profit', action: 'Profit Taken', ticker: '$GOOGL', sub: '+2.8%', time: '1 год тому' },
  { type: 'buy', action: 'Buy', ticker: '$MSFT', sub: '@ $412.55', time: '2 год тому' },
  { type: 'profit', action: 'Profit Taken', ticker: '$GOOGL', sub: '+2.8%', time: '1 год тому' },
]

export function Control() {
  return (
    <section className="section control" id="control">
      <div className="container">
        <Reveal className="calc__head" variant="fadeBlur">
          <h2 className="calc__title">Ваш капітал під повним контролем</h2>
          <p className="calc__subtitle">Інтерфейсу для моніторингу вашого портфеля в реальному часі</p>
        </Reveal>

        <div className="control__grid">
          <motion.div
            className="control__dash"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <img src={dashboard} alt="Дашборд портфеля: капітал, динаміка та поточні позиції" />
          </motion.div>

          <motion.div
            className="control__ops"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <div className="control__ops-inner">
              <div className="control__ops-head">
              <span className="control__ops-title">
                <img src={opActivity} alt="" width={16} height={16} />
                Останні операції
              </span>
              <span className="control__ops-badge">Оновлюється</span>
            </div>
            <ul className="control__ops-list">
              {OPS.map((op, i) => (
                <li className="control__op" key={i}>
                  <span className={`control__op-ic control__op-ic--${op.type}`}>
                    <img src={op.type === 'buy' ? opBuy : opProfit} alt="" width={20} height={20} />
                  </span>
                  <div className="control__op-body">
                    <span className="control__op-line">
                      <strong>{op.action}</strong>
                      <span className="control__op-ticker">{op.ticker}</span>
                    </span>
                    <span className="control__op-sub">{op.sub}</span>
                  </div>
                  <span className="control__op-time">{op.time}</span>
                </li>
              ))}
            </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
