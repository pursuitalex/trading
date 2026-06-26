import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Eye, EyeOff } from './icons'
import logoLight from '../../assets/logo/logo-light.svg'
import logoDark from '../../assets/logo/logo-dark.svg'
import './AuthPage.css'

type Mode = 'login' | 'register'

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || ''
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s()-]{6,}$/

const ASIDE_BULLETS = [
  'Автоматична торгівля акціями США 24/7',
  'Капітал лишається на вашому рахунку IBKR',
  'Налаштування за 15 хвилин',
]

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.7 34.6 27 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.6 5.6C41.9 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  )
}

type FieldProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  hint?: string
  autoComplete?: string
  placeholder?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  rightSlot?: ReactNode
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  autoComplete,
  placeholder,
  inputMode,
  rightSlot,
}: FieldProps) {
  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>
        {label}
        {hint && <span className="auth-field__hint"> — {hint}</span>}
      </label>
      <div className="auth-field__control">
        <input
          id={id}
          type={type}
          className={`auth-input${error ? ' auth-input--err' : ''}`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          inputMode={inputMode}
          aria-invalid={!!error}
        />
        {rightSlot}
      </div>
      {error && <span className="auth-field__error">{error}</span>}
    </div>
  )
}

const EMPTY = { name: '', email: '', phone: '', password: '', confirm: '' }

export function AuthPage({ mode }: { mode: Mode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [v, setV] = useState({ ...EMPTY })
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({})
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)

  const field = (k: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement>) => {
    setV((prev) => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const validate = () => {
    const er: Partial<typeof EMPTY> = {}
    if (isRegister && !v.name.trim()) er.name = "Введіть ім'я"
    if (!v.email.trim()) er.email = 'Введіть email'
    else if (!EMAIL_RE.test(v.email.trim())) er.email = 'Некоректний email'
    if (isRegister) {
      if (!v.phone.trim()) er.phone = 'Введіть телефон'
      else if (!PHONE_RE.test(v.phone.trim())) er.phone = 'Некоректний телефон'
    }
    if (!v.password) er.password = 'Введіть пароль'
    else if (v.password.length < 6) er.password = 'Мінімум 6 символів'
    if (isRegister) {
      if (!v.confirm) er.confirm = 'Повторіть пароль'
      else if (v.confirm !== v.password) er.confirm = 'Паролі не співпадають'
    }
    return er
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    // No backend in this demo — emulate success and return to the site.
    setBusy(true)
    setTimeout(() => {
      window.alert(
        isRegister ? `Реєстрація успішна. Вітаємо, ${v.name}!` : 'Вхід виконано. Раді бачити!',
      )
      navigate('/')
    }, 400)
  }

  // Google OAuth via a dependency-free implicit redirect. On return Google appends
  // #access_token=… to the URL — fetch the profile, then clean the hash.
  useEffect(() => {
    if (!window.location.hash.includes('access_token')) return
    const token = new URLSearchParams(window.location.hash.slice(1)).get('access_token')
    window.history.replaceState(null, '', window.location.pathname)
    if (!token) return
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((profile) => {
        window.alert(`Вітаємо, ${profile.name || profile.email}!`)
        navigate('/')
      })
      .catch(() => window.alert('Не вдалося отримати дані з Google.'))
  }, [navigate])

  const onGoogle = () => {
    if (!GOOGLE_CLIENT_ID) {
      window.alert(
        'Вхід через Google запрацює після додавання VITE_GOOGLE_CLIENT_ID ' +
          '(OAuth Client ID із Google Cloud Console).',
      )
      return
    }
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin + window.location.pathname,
      response_type: 'token',
      scope: 'openid email profile',
      include_granted_scopes: 'true',
      prompt: 'select_account',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__aside-grid" aria-hidden="true" />
        <div className="auth__aside-inner">
          <Link to="/" className="auth__aside-brand" aria-label="Trading.com.ua — на головну">
            <img src={logoLight} alt="Trading.com.ua" height={34} />
          </Link>
          <div className="auth__aside-copy">
            <h2 className="auth__aside-title">
              {isRegister ? (
                <>
                  Почніть заробляти на
                  <br />
                  технологічній перевазі
                </>
              ) : (
                <>
                  З поверненням до
                  <br />
                  Trading.com.ua
                </>
              )}
            </h2>
            <ul className="auth__aside-list">
              {ASIDE_BULLETS.map((b) => (
                <li key={b}>
                  <span className="auth__aside-check">
                    <Check size={14} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <p className="auth__aside-note">
            Ми не приймаємо ваші кошти на свої рахунки — ви відкриваєте власний акаунт у брокера
            Interactive Brokers.
          </p>
        </div>
      </aside>

      <main className="auth__main">
        <motion.div
          className="auth__card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" className="auth__brand-mobile" aria-label="На головну">
            <img src={logoDark} alt="Trading.com.ua" height={30} />
          </Link>

          <div className="auth__head">
            <h1 className="auth__title">{isRegister ? 'Створити акаунт' : 'Вхід в акаунт'}</h1>
            <p className="auth__subtitle">
              {isRegister
                ? 'Заповніть форму, щоб запустити алготрейдинг'
                : 'Увійдіть, щоб продовжити роботу з алгоритмом'}
            </p>
          </div>

          <button type="button" className="auth__google" onClick={onGoogle}>
            <GoogleIcon />
            Продовжити з Google
          </button>

          <div className="auth__divider">
            <span>або через email</span>
          </div>

          <form className="auth__form" onSubmit={onSubmit} noValidate>
            {isRegister && (
              <Field
                id="auth-name"
                label="Ім'я"
                value={v.name}
                onChange={field('name')}
                error={errors.name}
                autoComplete="name"
                placeholder="Ваше ім'я"
              />
            )}

            <Field
              id="auth-email"
              label="Email"
              type="email"
              inputMode="email"
              value={v.email}
              onChange={field('email')}
              error={errors.email}
              autoComplete="email"
              placeholder="you@example.com"
            />

            {isRegister && (
              <Field
                id="auth-phone"
                label="Телефон"
                type="tel"
                inputMode="tel"
                value={v.phone}
                onChange={field('phone')}
                error={errors.phone}
                autoComplete="tel"
                placeholder="+380 00 000 00 00"
              />
            )}

            <Field
              id="auth-password"
              label="Пароль"
              hint={isRegister ? 'мінімум 6 символів' : undefined}
              type={showPw ? 'text' : 'password'}
              value={v.password}
              onChange={field('password')}
              error={errors.password}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="••••••"
              rightSlot={
                <button
                  type="button"
                  className="auth-input__toggle"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Приховати пароль' : 'Показати пароль'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {isRegister && (
              <Field
                id="auth-confirm"
                label="Повторити пароль"
                type={showPw ? 'text' : 'password'}
                value={v.confirm}
                onChange={field('confirm')}
                error={errors.confirm}
                autoComplete="new-password"
                placeholder="••••••"
              />
            )}

            <button type="submit" className="auth__submit" disabled={busy}>
              {busy ? 'Зачекайте…' : isRegister ? 'Зареєструватися' : 'Увійти'}
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth__switch">
            {isRegister ? 'Вже маєте акаунт? ' : 'Ще немає акаунту? '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Увійти' : 'Зареєструватися'}
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
