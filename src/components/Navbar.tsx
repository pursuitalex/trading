import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Close, Menu } from './icons'
import logoLight from '../../assets/logo/logo-light.svg'
import logoDark from '../../assets/logo/logo-dark.svg'

const LINKS: { label: string; to?: string; href?: string }[] = [
  { label: 'Дохідність', to: '/returns' },
  { label: 'Гарантії', to: '/guarantees' },
  { label: 'Переваги', to: '/advantages' },
  { label: 'Ціни', to: '/pricing' },
  { label: 'Як почати', to: '/how-to-start' },
  { label: 'Контакти', to: '/contacts' },
]

export function Navbar({ onLight = false }: { onLight?: boolean }) {
  // Past the first screen the bar morphs into a floating white pill
  // (Figma node 6575:7396). Trigger ~one-third down the first viewport so
  // the change kicks in early as the reader starts leaving the first screen.
  const [floating, setFloating] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > window.innerHeight * 0.33)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <motion.header
      className={`nav${onLight ? ' nav--on-light' : ''}`}
      data-floating={floating}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="Trading.com.ua — на головну">
          {/* Both marks stacked; CSS crossfades light↔dark by state. */}
          <span className="nav__logo">
            <img
              src={logoLight}
              alt="Trading.com.ua"
              className="nav__logo-img"
              width={147}
              height={36}
            />
            <img
              src={logoDark}
              alt=""
              aria-hidden="true"
              className="nav__logo-img nav__logo-img--dark"
              width={147}
              height={36}
            />
          </span>
          <span className="nav__tagline">
            №1 автоматична торгівля
            <br />
            акціями по алгоритмам
          </span>
        </Link>

        <nav className="nav__links" aria-label="Основна навігація">
          {LINKS.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="nav__actions">
          <Link to="/login" className="btn btn--outline btn--sm">
            Вхід
          </Link>
          <Link to="/register" className="btn btn--primary btn--sm">
            Спробувати Trading
          </Link>
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
            {LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ),
            )}
            <Link
              to="/register"
              className="btn btn--primary btn--block"
              onClick={() => setOpen(false)}
            >
              Спробувати Trading <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
