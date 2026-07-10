import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Reveal } from './primitives'
import { Rocket } from './icons'
import { viewportOnce } from '../lib/motion'
import rocket3d from '../../assets/rocket-3d.png'
import './Cta.css'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Cta() {
  return (
    <section className="section cta" id="start">
      <div className="container">
        <div className="cta__card">
          <div className="cta__grid" aria-hidden="true" />
          <div className="cta__glow" aria-hidden="true" />

          <div className="cta__head">
            <motion.img
              className="cta__rocket"
              src={rocket3d}
              alt=""
              width={180}
              height={227}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE }}
            />

            <Reveal className="cta__heading" variant="fadeUp" delay={0.05}>
              <h2 className="cta__title">
                Почніть заробляти на технологічній перевазі вже сьогодні
              </h2>
              <p className="cta__subtitle">
                Приєднуйтесь до спільноти розумних інвесторів. Налаштування алгоритму на вашому
                рахунку Interactive Brokers <b>займає менше 15 хвилин</b>.
              </p>
            </Reveal>

            <Reveal className="cta__btn-wrap" variant="fadeUp" delay={0.15}>
              <Link to="/register" className="cta__btn">
                <Rocket size={18} />
                <span>Запустити Алготрейдинг</span>
              </Link>
            </Reveal>

            <Reveal className="cta__perks" variant="fadeUp" delay={0.2}>
              <span>Без передоплат</span>
              <span className="cta__sep" aria-hidden="true">
                •
              </span>
              <span>Без кредитних карток</span>
              <span className="cta__sep" aria-hidden="true">
                •
              </span>
              <span>Тільки ваш IBKR</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
