import { Link } from 'react-router-dom'
import { ArrowRight } from './icons'
import logoDark from '../../assets/logo/logo-dark.svg'
import './PagesIndex.css'

const PAGES = [
  { to: '/', title: 'Головна', desc: 'Лендинг: hero, калькулятор, віртуальні торги, кейси, FAQ, CTA' },
  { to: '/returns', title: 'Дохідність', desc: 'Калькулятор дохідності на історичних даних за обраний період' },
  { to: '/guarantees', title: 'Гарантії', desc: 'Захист капіталу, страхування SIPC/Lloyd’s, гарантія вкладень' },
  { to: '/advantages', title: 'Переваги', desc: 'Порівняння з готівкою, вкладами, нерухомістю, S&P 500 тощо' },
  { to: '/pricing', title: 'Ціни', desc: 'Тарифи, безкоштовні умови, комісія від чистого прибутку' },
  { to: '/how-to-start', title: 'Як почати', desc: '5 кроків до старту + корисна інформація (ліміти, податки)' },
  { to: '/contacts', title: 'Контакти', desc: 'Контактна інформація та форма звернення' },
  { to: '/login', title: 'Вхід', desc: 'Сторінка авторизації' },
  { to: '/register', title: 'Реєстрація', desc: 'Сторінка реєстрації + вхід через Google' },
]

export function PagesIndex() {
  return (
    <main className="idx">
      <div className="idx__inner">
        <header className="idx__head">
          <img src={logoDark} alt="Trading.com.ua" height={34} className="idx__logo" />
          <h1 className="idx__title">Прев'ю сторінок</h1>
          <p className="idx__lead">Оберіть сторінку для перегляду.</p>
        </header>

        <div className="idx__grid">
          {PAGES.map((p) => (
            <Link to={p.to} className="idx-card" key={p.to}>
              <div className="idx-card__top">
                <h2 className="idx-card__title">{p.title}</h2>
                <span className="idx-card__arrow">
                  <ArrowRight size={18} />
                </span>
              </div>
              <span className="idx-card__path">{p.to}</span>
              <p className="idx-card__desc">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
