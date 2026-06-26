import { Reveal } from './primitives'
import footerLogo from '../../assets/logo/footer-logo.svg'
import './Footer.css'

const NAV = ['Головна', 'Доходність', 'Гарантії', 'Ціни', 'Контакти']
const LEGAL = ['Політика конфіденційності', 'Умови використання', 'Cookies']

export function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="container">
        <Reveal className="footer__inner" variant="fadeUp">
          {/* nav */}
          <nav className="footer__nav" aria-label="Навігація у футері">
            {NAV.map((l) => (
              <a key={l} href="#" className="footer__nav-link">
                {l}
              </a>
            ))}
          </nav>

          {/* main row: brand + disclaimer */}
          <div className="footer__main">
            <div className="footer__brand">
              <div className="footer__logo">
                <img className="footer__logo-img" src={footerLogo} alt="Trading.com.ua" />
                <span className="footer__logo-tld">.com.ua</span>
              </div>
              <p className="footer__tagline">
                Автоматизована торгівля на фондовому ринку США через рахунок IBKR
              </p>
            </div>

            <div className="footer__disclaimer">
              <div className="footer__disc-head">
                <h3 className="footer__disc-title">Попередження про ризики</h3>
                <p className="footer__disc-text">
                  Торгівля на фондовому ринку пов&apos;язана з високим рівнем ризику. Минулі
                  результати алгоритму не є гарантією майбутніх прибутків. Доходність 40-80% є
                  цільовим показником стратегії, проте фактичний результат залежить від ринкової
                  кон&apos;юнктури. Interactive Brokers LLC є незалежним брокером і не несе
                  відповідальності за роботу нашого алгоритму. Інвестуйте лише ті кошти, втрату яких
                  ви можете собі дозволити.
                </p>
              </div>
              <div className="footer__actions">
                <a href="#" className="footer__btn footer__btn--outline">
                  Вхід в аккаунт
                </a>
                <a href="#" className="footer__btn footer__btn--solid">
                  Спробувати Trading
                </a>
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div className="footer__bottom">
            <span className="footer__copy">© 2026 AlgoTrade. Всі права захищені.</span>
            <div className="footer__legal">
              {LEGAL.map((l) => (
                <a key={l} href="#" className="footer__legal-link">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
