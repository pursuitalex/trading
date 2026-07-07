import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Reveal } from './primitives'
import { MapPin, Phone, Mail, Send, Paperclip, Close, CircleCheck } from './icons'
import './Contacts.css'

const CONTACTS = [
  { icon: MapPin, label: 'Адреса', value: 'Україна, м. Рівне, Майдан Незалежності, 3, 33000' },
  { icon: Phone, label: 'Телефон', value: '+38 (050) 200-60-00', href: 'tel:+380502006000' },
  { icon: Send, label: 'Telegram', value: '@trading.com.ua', href: 'https://t.me/trading.com.ua' },
  { icon: Mail, label: 'Email', value: 'info@trading.com.ua', href: 'mailto:info@trading.com.ua' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: '', phone: '', email: '', text: '' }

export function Contacts() {
  const [v, setV] = useState({ ...EMPTY })
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({})
  const [sent, setSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const field =
    (k: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setV((p) => ({ ...p, [k]: e.target.value }))
      if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
    }

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || [])
    if (list.length) setFiles((prev) => [...prev, ...list])
    e.target.value = ''
  }
  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const validate = () => {
    const er: Partial<typeof EMPTY> = {}
    if (!v.name.trim()) er.name = "Введіть ім'я"
    if (!v.phone.trim()) er.phone = 'Введіть телефон'
    if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) er.email = 'Некоректний email'
    if (!v.text.trim()) er.text = 'Введіть текст повідомлення'
    return er
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    // No backend in this demo — emulate a successful send.
    setSent(true)
  }

  const reset = () => {
    setV({ ...EMPTY })
    setFiles([])
    setErrors({})
    setSent(false)
  }

  return (
    <>
      <Navbar onLight />
      <main className="contacts">
        {/* Intro */}
        <section className="section ct__intro-sec">
          <div className="container">
            <Reveal className="ct__intro" variant="fadeUp">
              <span className="ct__badge">
                <Mail size={16} />
                Контакти
              </span>
              <h1 className="ct__title">Зв'яжіться з нами</h1>
              <p className="ct__lead">
                Маєте запитання чи хочете почати? Напишіть нам або завітайте до офісу — відповімо
                найближчим часом.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Info + form */}
        <section className="section">
          <div className="container ct__grid">
            {/* Left: contact info */}
            <Reveal className="ct-info" variant="fadeUp">
              <ul className="ct-info__list">
                {CONTACTS.map((c) => {
                  const Icon = c.icon
                  return (
                    <li className="ct-info__item" key={c.label}>
                      <span className="ct-info__icon">
                        <Icon size={20} />
                      </span>
                      <div className="ct-info__body">
                        <span className="ct-info__label">{c.label}</span>
                        {c.href ? (
                          <a
                            className="ct-info__value"
                            href={c.href}
                            target={c.href.startsWith('http') ? '_blank' : undefined}
                            rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                          >
                            {c.value}
                          </a>
                        ) : (
                          <span className="ct-info__value">{c.value}</span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              <p className="ct-info__note">
                Графік роботи офісу — у робочі години. За потреби можлива особиста зустріч із
                керівником проєкту.
              </p>
            </Reveal>

            {/* Right: form */}
            <Reveal className="ct-form-card" variant="fadeUp" delay={0.1}>
              {sent ? (
                <div className="ct-success">
                  <span className="ct-success__icon">
                    <CircleCheck size={48} />
                  </span>
                  <h2 className="ct-success__title">Дякуємо! Запит надіслано</h2>
                  <p className="ct-success__text">
                    Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.
                  </p>
                  <button type="button" className="ct-success__again" onClick={reset}>
                    Надіслати ще один запит
                  </button>
                </div>
              ) : (
                <form className="ct-form" onSubmit={onSubmit} noValidate>
                  <h2 className="ct-form__title">Надіслати запит</h2>

                  <div className="ct-field">
                    <label className="ct-field__label" htmlFor="ct-name">
                      Ім'я
                    </label>
                    <input
                      id="ct-name"
                      className={`ct-input${errors.name ? ' ct-input--err' : ''}`}
                      value={v.name}
                      onChange={field('name')}
                      autoComplete="name"
                      placeholder="Ваше ім'я"
                    />
                    {errors.name && <span className="ct-field__err">{errors.name}</span>}
                  </div>

                  <div className="ct-row">
                    <div className="ct-field">
                      <label className="ct-field__label" htmlFor="ct-phone">
                        Телефон
                      </label>
                      <input
                        id="ct-phone"
                        type="tel"
                        inputMode="tel"
                        className={`ct-input${errors.phone ? ' ct-input--err' : ''}`}
                        value={v.phone}
                        onChange={field('phone')}
                        autoComplete="tel"
                        placeholder="+380 00 000 00 00"
                      />
                      {errors.phone && <span className="ct-field__err">{errors.phone}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-field__label" htmlFor="ct-email">
                        Email
                      </label>
                      <input
                        id="ct-email"
                        type="email"
                        inputMode="email"
                        className={`ct-input${errors.email ? ' ct-input--err' : ''}`}
                        value={v.email}
                        onChange={field('email')}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                      {errors.email && <span className="ct-field__err">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label className="ct-field__label" htmlFor="ct-text">
                      Текст
                    </label>
                    <textarea
                      id="ct-text"
                      className={`ct-input ct-textarea${errors.text ? ' ct-input--err' : ''}`}
                      value={v.text}
                      onChange={field('text')}
                      rows={5}
                      placeholder="Ваше повідомлення…"
                    />
                    {errors.text && <span className="ct-field__err">{errors.text}</span>}
                  </div>

                  {/* Attachments */}
                  <div className="ct-attach">
                    <button
                      type="button"
                      className="ct-attach__btn"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Paperclip size={18} />
                      Прикріпити файли
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      hidden
                      onChange={onFiles}
                      aria-label="Прикріпити файли"
                    />
                    {files.length > 0 && (
                      <ul className="ct-files">
                        {files.map((f, i) => (
                          <li className="ct-file" key={`${f.name}-${i}`}>
                            <span className="ct-file__name">{f.name}</span>
                            <button
                              type="button"
                              className="ct-file__remove"
                              onClick={() => removeFile(i)}
                              aria-label={`Видалити ${f.name}`}
                            >
                              <Close size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button type="submit" className="ct-submit">
                    Надіслати запит
                    <Send size={18} />
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
