import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Close, Menu } from './icons'
import logoLight from '../../assets/logo/logo-light.svg'

const LINKS = [
  { label: 'Головна', href: '#top' },
  { label: 'Доходність', href: '#returns' },
  { label: 'Гарантії', href: '#guarantees' },
  { label: 'Ціни', href: '#pricing' },
  { label: 'Контакти', href: '#contacts' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="nav"
      data-scrolled={scrolled}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label="Trading.com.ua — на головну">
          <img src={logoLight} alt="Trading.com.ua" className="nav__logo" width={147} height={36} />
          <span className="nav__tagline">
            №1 автоматична торгівля
            <br />
            акціями по алгоритмам
          </span>
        </a>

        <nav className="nav__links" aria-label="Основна навігація">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href="#" className="btn btn--outline btn--sm">
            Вхід
          </a>
          <a href="#" className="btn btn--primary btn--sm">
            Спробувати Trading
          </a>
        </div>

        <button
          className="nav__burger"
          type="button"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#" className="btn btn--primary btn--block" onClick={() => setOpen(false)}>
              Спробувати Trading <ArrowRight size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
