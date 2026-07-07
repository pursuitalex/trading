import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Reveal } from './primitives'
import { Sparkle, TrendingUp, Wallet, Globe, Landmark, Check, ArrowRight } from './icons'
import './Advantages.css'

const CORE = [
  {
    icon: TrendingUp,
    title: 'Велика дохідність',
    text: 'Цільовий показник стратегії — 45%+ річних на історичних даних.',
  },
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

const COMPARISONS = [
  { title: 'Зберігання готівки', theirLabel: 'Готівка (USD)', their: '−3% / рік', note: 'Долар знецінюється ≈ −3%, євро ≈ −2.3% щороку.' },
  { title: 'Валютний банківський вклад', theirLabel: 'Валютний вклад', their: 'до 5% / рік' },
  { title: 'Гривневий банківський вклад', theirLabel: 'Гривневий вклад', their: 'до 16% / рік', note: 'Гривня девальвує до долара ≈ 8% / рік.' },
  { title: 'Банківські метали', theirLabel: 'Золото', their: 'до 10% / рік' },
  { title: 'Нерухомість', theirLabel: 'Нерухомість', their: '≈ 8% / рік' },
  { title: 'Власний бізнес', theirLabel: 'Бізнес', their: 'високі ризики', note: 'У нас ризики ≈ 0, без витрат часу, виведення коштів будь-коли.' },
  { title: 'Купив і тримай (S&P 500)', theirLabel: 'S&P 500, buy & hold', their: '≈ 15% / рік' },
  { title: 'Самостійна торгівля', theirLabel: 'Торгуєте самі', their: '2–6 год / день', note: 'Без людського фактору, великих ризиків і потреби глибоко розбиратись.' },
]

const CRISIS = [
  'Ви можете будь-коли за лічені хвилини вручну продати всі акції та вивести кошти — ціна акцій падає поступово, а не за хвилини.',
  'Під час кризи майже всі інші активи теж знеціняться — приблизно так само або більше.',
  'Криза може настати за рік, а може й через 15+ років.',
]

export function Advantages() {
  return (
    <>
      <Navbar onLight />
      <main className="advantages">
        {/* Intro */}
        <section className="section adv__intro-sec">
          <div className="container">
            <Reveal className="adv__intro" variant="fadeUp">
              <span className="adv__badge">
                <Sparkle size={16} />
                Переваги
              </span>
              <h1 className="adv__title">Чому це вигідно</h1>
              <p className="adv__lead">
                Загальні переваги брокерського рахунку в Interactive Brokers разом з алгоритмічною
                торгівлею на ньому.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Core advantages */}
        <section className="section">
          <div className="container">
            <div className="adv-core">
              {CORE.map((c) => {
                const Icon = c.icon
                return (
                  <Reveal className="adv-core-card" variant="fadeUp" key={c.title}>
                    <span className="adv-icon">
                      <Icon size={24} />
                    </span>
                    <h2 className="adv-core-card__title">{c.title}</h2>
                    <p className="adv-core-card__text">{c.text}</p>
                  </Reveal>
                )
              })}
            </div>

            <Reveal className="adv-statement" variant="fadeUp">
              <p>
                По суті це звичайний безготівковий рахунок — з тією відмінністю, що кошти на ньому
                <strong> постійно зростають</strong>. Ваше джерело доходу, яким зручно керувати просто
                зі смартфона.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Comparisons */}
        <section className="section">
          <div className="container">
            <Reveal className="adv__head" variant="fadeUp">
              <h2 className="adv__h2">Вигідніше за інші варіанти</h2>
              <p className="adv__sub">
                Орієнтовне порівняння річної дохідності з поширеними альтернативами.
              </p>
            </Reveal>

            <div className="adv-vs-grid">
              {COMPARISONS.map((c) => (
                <Reveal className="adv-vs" variant="fadeUp" key={c.title}>
                  <span className="adv-vs__title">{c.title}</span>
                  <div className="adv-vs__row adv-vs__row--ours">
                    <span>Наша стратегія</span>
                    <strong>45%+ / рік</strong>
                  </div>
                  <div className="adv-vs__row adv-vs__row--theirs">
                    <span>{c.theirLabel}</span>
                    <strong>{c.their}</strong>
                  </div>
                  {c.note && <p className="adv-vs__note">{c.note}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Crisis */}
        <section className="section">
          <div className="container">
            <Reveal className="adv-crisis" variant="fadeUp">
              <h2 className="adv-crisis__title">А якщо настане світова криза?</h2>
              <p className="adv-crisis__intro">Так, така ймовірність існує. Але вона під контролем:</p>
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
                  умовно вдвічі (хоча ви зможете продати раніше) — ви вийдете в нуль, а наступного року
                  заробите вже 45%+. В інших активах втрати були б значно більшими.
                </p>
              </div>
              <p className="adv-crisis__concl">
                Головна перевага рішення — висока дохідність, яка покриває всі можливі теоретичні
                збитки.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container adv-cta">
            <h2 className="adv-cta__title">Порахуйте свою вигоду</h2>
            <p className="adv-cta__text">
              Подивіться історичну дохідність стратегії на обраному періоді або створіть акаунт.
            </p>
            <div className="adv-cta__btns">
              <Link to="/returns" className="adv-cta__btn adv-cta__btn--outline">
                Дивитись дохідність
              </Link>
              <Link to="/register" className="adv-cta__btn adv-cta__btn--solid">
                Створити акаунт
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
