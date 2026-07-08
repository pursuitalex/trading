import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Burger, Close } from './icons'
import logoLight from '../../assets/logo/logo-light.svg'
import logoDark from '../../assets/logo/logo-dark.svg'

const LINKS: { label: string; to?: string; href?: string }[] = [
  { label: 'Дохідність', to: '/returns' },
  { label: 'Гарантії', to: '/guarantees' },
  { label: 'Переваги', to: '/advantages' },
  { label: 'Ціни', to: '/pricing' },
  { label: 'Як почати?', to: '/how-to-start' },
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

  // While the full-screen menu is open: lock body scroll + close on Escape.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

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
          <Burger />
        </button>
      </div>

      {/* Full-screen menu (Figma 6677:6878). Portaled to <body> so it escapes
          the header's transform and covers the viewport. Tablet reuses the same
          layout, proportionally enlarged (see .navmenu in App.css). */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="navmenu"
              role="dialog"
              aria-modal="true"
              aria-label="Меню"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="navmenu__inner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="navmenu__head">
                  <span className="navmenu__logo">
                    <img src={logoDark} alt="Trading.com.ua" width={147} height={36} />
                  </span>
                  <button
                    className="navmenu__close"
                    type="button"
                    aria-label="Закрити меню"
                    onClick={close}
                  >
                    <Close size={24} />
                  </button>
                </div>

                <div className="navmenu__divider" aria-hidden="true" />

                <nav className="navmenu__list" aria-label="Розділи сайту">
                  {LINKS.map((l, i) => {
                    const num = String(i + 1).padStart(2, '0')
                    const inner = (
                      <>
                        <span className="navmenu__num">{num}</span>
                        <span className="navmenu__label">{l.label}</span>
                        <ArrowUpRight className="navmenu__arrow" />
                      </>
                    )
                    return l.to ? (
                      <Link key={l.label} to={l.to} className="navmenu__item" onClick={close}>
                        {inner}
                      </Link>
                    ) : (
                      <a key={l.label} href={l.href} className="navmenu__item" onClick={close}>
                        {inner}
                      </a>
                    )
                  })}
                </nav>

                <div className="navmenu__buttons">
                  <Link to="/login" className="navmenu__btn navmenu__btn--outline" onClick={close}>
                    Вхід в акаунт
                  </Link>
                  <Link to="/register" className="navmenu__btn navmenu__btn--solid" onClick={close}>
                    Спробувати Trading
                  </Link>
                </div>

                <p className="navmenu__note">
                  Автоматизована торгівля на фондовому ринку США через рахунок IBKR
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </motion.header>
  )
}
