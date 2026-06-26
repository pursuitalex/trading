import { Reveal } from './primitives'
import { BarChart, Calendar, TrendingUp, User, Wallet } from './icons'
import { useMarqueeSpeed } from '../lib/marquee'
import './Cases.css'

const QUOTE =
  'Найбільше вразило те, що підключення зайняло рівно 15 хвилин через Zoom-консультацію. Я просто згенерував API-ключ, вставив його в кабінет і забув. Тепер раз на тиждень заходжу подивитися на нові закриті угоди в Telegram.'

type Case = {
  num: number
  title: string
  pct: string
  profit: string
  start: string
  period: string
  name: string
  date: string
}
const CASES: Case[] = [
  { num: 1, title: 'Масштабування капіталу', pct: '+34.2%', profit: '+3,420 $', start: '10,000 $', period: '6 місяців', name: 'Олександр М.', date: 'Вересень — Лютий' },
  { num: 2, title: 'Стабільність на волатильному ринку', pct: '+34.2%', profit: '+3,420 $', start: '10,000 $', period: '6 місяців', name: 'Олександр М.', date: 'Вересень — Лютий' },
  { num: 1, title: 'Масштабування капіталу', pct: '+34.2%', profit: '+3,420 $', start: '10,000 $', period: '6 місяців', name: 'Олександр М.', date: 'Вересень — Лютий' },
]

function CaseCard({ c }: { c: Case }) {
  return (
    <article className="case">
      <div className="case__top">
        <div className="case__top-head">
          <h3 className="case__title">{c.title}</h3>
          <span className="case__num">Кейс #{c.num}</span>
        </div>
        <div className="case__stat">
          <div className="case__profit">
            <div className="case__profit-col">
              <span className="case__profit-badge">
                <TrendingUp size={12} />
                {c.pct}
              </span>
              <div className="case__profit-main">
                <span className="case__profit-label">чистого прибутку</span>
                <strong className="case__profit-value">{c.profit}</strong>
              </div>
            </div>
            <svg className="case__spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="caseSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#00bc7d" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#00bc7d" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 37 C18 35 30 31 48 24 S82 7 100 2 L100 40 L0 40 Z" fill="url(#caseSpark)" />
              <path d="M0 37 C18 35 30 31 48 24 S82 7 100 2" fill="none" stroke="#00bc7d" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="case__meta">
            <div className="case__meta-item">
              <span className="case__meta-label">
                <Wallet size={14} />
                Старт
              </span>
              <strong className="case__meta-value">{c.start}</strong>
            </div>
            <div className="case__meta-item">
              <span className="case__meta-label">
                <Calendar size={14} />
                Період
              </span>
              <strong className="case__meta-value">{c.period}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="case__quote">
        <div className="case__author">
          <span className="case__avatar">
            <User size={20} />
          </span>
          <div className="case__author-meta">
            <strong className="case__name">{c.name}</strong>
            <span className="case__verified">
              <i className="case__dot" />
              Верифікований клієнт IBKR
            </span>
          </div>
        </div>
        <p className="case__text">{QUOTE}</p>
        <span className="case__date">{c.date}</span>
      </div>
    </article>
  )
}

export function Cases() {
  const marquee = useMarqueeSpeed() // hover → 50% speed
  return (
    <section className="section cases" id="cases">
      <div className="container">
        <div className="cases__head">
          <Reveal className="cases__intro" variant="fadeUp">
            <span className="cases__badge">
              <BarChart size={16} />
              Кейси клієнтів
            </span>
            <h2 className="cases__title">
              Реальні рахунки.
              <br />
              Реальні цифри.
            </h2>
            <p className="cases__lead">
              Подивіться, як працює алгоритм на рахунках наших клієнтів. Кожен кейс — це реальна
              історія капіталізації на Interactive Brokers.
            </p>
          </Reveal>

          <Reveal className="cases__cta" variant="fadeUp" delay={0.1}>
            <p className="cases__cta-title">
              Хочете стати наступним
              <br />
              успішним кейсом?
            </p>
            <div className="cases__cta-btns">
              <a href="#" className="cases__btn cases__btn--outline">
                Демо-кабінет
              </a>
              <a href="#" className="cases__btn cases__btn--solid">
                Реєстрація
              </a>
            </div>
          </Reveal>
        </div>

      </div>

      <div
        className="cases__marquee"
        ref={marquee.ref}
        onMouseEnter={marquee.onMouseEnter}
        onMouseLeave={marquee.onMouseLeave}
      >
        <div className="cases__track">
          {[...CASES, ...CASES].map((c, i) => (
            <CaseCard c={c} key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
