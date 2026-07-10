import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './DesignSystem.css'

/* ============================================================
   /design-system — living style guide.
   Renders the REAL site classes wherever possible (so it always
   reflects the true styles) and catalogs the inconsistencies the
   audit surfaced, ready for the unify + refactor phase.
   ============================================================ */

type Tok = [name: string, hex: string, note?: string]

/* ---------- token palette (src/index.css :root) ---------- */
const COLOR_GROUPS: { title: string; tokens: Tok[]; dark?: boolean }[] = [
  {
    title: 'Page & Ink',
    tokens: [
      ['--page-bg', '#f5f7ff', 'Page background'],
      ['--ink', '#0c0e18', 'Primary text'],
      ['--ink-2', '#5b646f', 'Secondary text'],
      ['--ink-3', '#6a707e', 'Chart axis grey'],
    ],
  },
  {
    title: 'Brand',
    tokens: [
      ['--brand', '#0f77ff', 'Blue-500 accent'],
      ['--brand-btn', '#475ffa', 'CTA button'],
      ['--brand-btn-hover', '#3346e0', 'CTA hover'],
      ['--purple', '#ceb0fa', 'Purple-100'],
      ['--sky', '#aacfff', 'Headline accent'],
    ],
  },
  {
    title: 'Finance',
    tokens: [
      ['--green', '#00914b', 'Positive'],
      ['--green-1', '#6ef2b0', 'Gradient start'],
      ['--green-2', '#a5ffd2', 'Gradient end'],
      ['--mint', '#dbffed', 'Dashed frame'],
      ['--red', '#d81222', 'Negative'],
    ],
  },
  {
    title: 'Navy — hero gradient',
    dark: true,
    tokens: [
      ['--navy-1', '#0f153c'],
      ['--navy-2', '#172861'],
      ['--navy-3', '#1f3b87'],
      ['--navy-4', '#2f4fa5'],
      ['--navy-5', '#2d4893'],
    ],
  },
  {
    title: 'Card & Chip',
    tokens: [
      ['--card', '#ffffff', 'Surface'],
      ['--card-border', '#e5e7eb', 'Border'],
      ['--chip-bg', '#ecf3ff', 'Chip bg'],
      ['--chip-text', '#193cb8', 'Chip text'],
    ],
  },
]

/* ---------- off-token colours found in the wild (inconsistency) ---------- */
const OFFTOKEN: { group: string; note: string; sw: string[][] }[] = [
  {
    group: 'Greys / inks',
    note: '7 near-identical darks → collapse to ~3 ink steps',
    sw: [
      ['#4a4d61', '', 'subtitle grey · ~30 uses'],
      ['#3f4356', '', 'Guarantees / Returns copy'],
      ['#3a3f55', '', 'form labels'],
      ['#2b3350', '', 'marquee items'],
      ['#1a1e35', '', '~10 uses'],
      ['#1d213a', '', 'outline-btn text · many'],
      ['#09081a', '', 'gradient title start ×5'],
    ],
  },
  {
    group: 'Blues',
    note: '#1c69e3 is a de-facto accent used dozens of times, yet isn’t a token',
    sw: [
      ['#1c69e3', '', 'accent · dozens of uses'],
      ['#0b33b4', '', 'light badge text ×6'],
      ['#193cb8', '', '= --chip-text, hardcoded'],
      ['#1c45b3', '', 'icon text'],
      ['#0d41b9', '', 'icon gradient'],
    ],
  },
  {
    group: 'Greens',
    note: '~12 distinct greens → collapse to positive / light / gradient',
    sw: [
      ['#00a35c'], ['#00a656'], ['#009966'], ['#00bc7d'],
      ['#047857'], ['#459f49'], ['#007a55'], ['#34d399'], ['#8ff7c6'],
    ],
  },
  {
    group: 'Reds',
    note: '4 reds → one error + one down-red',
    sw: [
      ['#d81222', '', '= --red'],
      ['#e0445b', '', 'form errors'],
      ['#c8324a', '', 'calc error'],
      ['#d41b5a', '', 'ticker down'],
    ],
  },
  {
    group: 'Light borders',
    note: '7 near-identical light greys → 1–2 border tokens',
    sw: [
      ['#e5e7eb', '', '= --card-border'],
      ['#e8e9eb', '', 'dividers'],
      ['#e0e5eb', '', 'calc / vt inputs'],
      ['#dbe0ea', '', 'ct / auth inputs'],
      ['#e0e6ff', '', 'case border'],
      ['#e6e9f2'], ['#f0f2f7'],
    ],
  },
]

/* ---------- radii in use (no scale) ---------- */
const RADII = [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 22, 24, 28, 30, 40]

/* ---------- distinct shadows (no scale) ---------- */
const SHADOWS: { label: string; css: string; note: string }[] = [
  { label: 'button glow', css: '0 8px 24px -8px rgba(71,95,250,.6)', note: '.btn--primary' },
  { label: 'button glow · CTA', css: '0 12px 30px rgba(71,95,250,.45)', note: '.cta__btn' },
  {
    label: 'card · low',
    css: '0 1px 1.5px rgba(0,0,0,.04), 0 10px 30px -16px rgba(8,16,45,.12)',
    note: 'standard white card',
  },
  { label: 'card · mid', css: '0 24px 60px -24px rgba(15,21,60,.55)', note: '.feature-card' },
  { label: 'card · high', css: '0 24px 60px -20px rgba(8,16,45,.45)', note: 'hero .card' },
  { label: 'glass', css: '0 30px 60px -30px rgba(4,10,35,.8)', note: 'glass hero panel' },
]

/* ---------- duplicated buttons (live-rendered to show the drift) ---------- */
const SOLID_DUPES = [
  { cls: 'btn btn--primary', src: '.btn--primary · index.css' },
  { cls: 'cta__btn', src: '.cta__btn · Cta.css' },
  { cls: 'cta-live__btn cta-live__btn--solid', src: '.cta-live__btn--solid · CtaLive.css' },
  { cls: 'ct-submit', src: '.ct-submit · Contacts.css' },
  { cls: 'footer__btn footer__btn--solid', src: '.footer__btn--solid · Footer.css' },
]
const OUTLINE_DUPES = [
  { cls: 'footer__btn footer__btn--outline', src: 'border #686a7b · Footer.css' },
  { cls: 'cta-live__btn cta-live__btn--ghost', src: 'border #e8e9eb · CtaLive.css' },
  { cls: 'cases__btn cases__btn--outline', src: 'border #686a7b · Cases.css' },
]

/* ---------- refactor plan (top consolidation opportunities) ---------- */
const REFACTOR: [what: string, state: string, target: string][] = [
  ['Buttons', 'висоти зведено → 52 / 48 / 44 · класи ще дублюються (~12 файлів)', 'One .btn system: primary / light / outline / ghost + sizes'],
  ['White card', '~16 copies · radii 18/20/24 · shadow α .10/.12/.16', 'One .card + radius & elevation tokens'],
  ['Eyebrow badge', '8 copies (light ×3, dark ×5)', 'Two shared classes: .eyebrow--light / --dark'],
  ['Green status pill', '4 copies', 'One .pill--live'],
  ['Glass hero panel', '5 identical copies', 'One .glass-panel'],
  ['Squircle icon', '7 copies (only size differs)', 'One .icon-tile + --size var'],
  ['Text input', 'ct-input ≡ auth-input; calc/vt 90% same', 'One .input (+ error state)'],
  ['Amount chip / checkbox', '2 copies each', 'One .chip / one .checkbox'],
  ['Gradient title', '5 copies, 4 different stop pairs', 'One .title-gradient'],
  ['Marquee', '7 implementations', 'One .marquee'],
  ['Colours', '~40 off-token literals', 'Extend the token palette; replace literals'],
  ['Radii', '≈24 discrete values', '5-step scale: 8 / 12 / 16 / 24 / pill'],
  ['Shadows', '20+ bespoke', '4–5 step elevation scale'],
]

const TOC: [id: string, label: string, warn?: boolean][] = [
  ['colors', 'Кольори'],
  ['offtoken', 'Off-token кольори', true],
  ['type', 'Типографіка'],
  ['radii', 'Радіуси', true],
  ['shadows', 'Тіні', true],
  ['buttons', 'Кнопки', true],
  ['cards', 'Картки'],
  ['badges', 'Бейджі / пілюлі'],
  ['inputs', 'Поля форм'],
  ['other', 'Інші елементи'],
  ['refactor', 'План рефакторингу'],
]

/* ---------- small helpers ---------- */
function Swatch({ hex, name, note, dark }: { hex: string; name?: string; note?: string; dark?: boolean }) {
  return (
    <div className="ds-sw">
      <div className="ds-sw__chip" data-dark={dark || undefined} style={{ background: hex }} />
      <div className="ds-sw__meta">
        {name && <code className="ds-sw__name">{name}</code>}
        <span className="ds-sw__hex">{hex}</span>
        {note && <span className="ds-sw__note">{note}</span>}
      </div>
    </div>
  )
}

function Warn({ children }: { children: ReactNode }) {
  return (
    <p className="ds-warn">
      <span className="ds-warn__ico" aria-hidden="true">
        ⚠
      </span>
      <span>{children}</span>
    </p>
  )
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="ds-section">
      <h2 className="ds-h2">
        <span className="ds-h2__n">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Icon() {
  /* generic glyph for the squircle-icon demo */
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15l5-5 3 3 4-6 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DesignSystem() {
  return (
    <main className="ds">
      {/* ---- header ---- */}
      <header className="ds-hero">
        <div className="ds-hero__wrap">
          <span className="ds-kicker">Internal · /design-system</span>
          <h1 className="ds-title">Дизайн-система</h1>
          <p className="ds-lead">
            Живий довідник стилів Trading.com.ua — рендериться реальними класами сайту. Позначки{' '}
            <span className="ds-flag">⚠</span> — місця, де стилі розійшлися; їх зводимо до єдиних
            токенів/компонентів під час рефакторингу.
          </p>
          <Link to="/pages" className="ds-back">
            ← Всі сторінки
          </Link>
        </div>
      </header>

      <div className="ds-shell">
        {/* ---- sticky TOC ---- */}
        <nav className="ds-toc" aria-label="Розділи">
          <ul>
            {TOC.map(([id, label, warn]) => (
              <li key={id}>
                <a href={`#${id}`}>
                  {label}
                  {warn && <span className="ds-toc__warn">⚠</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- content ---- */}
        <div className="ds-main">
          {/* ============ COLORS ============ */}
          <Section id="colors" n="01" title="Кольори — токени">
            <p className="ds-p">
              Джерело: <code>:root</code> у <code>src/index.css</code>. Це єдина санкціонована палітра.
            </p>
            {COLOR_GROUPS.map((g) => (
              <div key={g.title} className="ds-group">
                <h3 className="ds-h3">{g.title}</h3>
                <div className="ds-swatches">
                  {g.tokens.map(([name, hex, note]) => (
                    <Swatch key={name} hex={hex} name={name} note={note} dark={g.dark} />
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* ============ OFF-TOKEN ============ */}
          <Section id="offtoken" n="02" title="Off-token кольори">
            <Warn>
              ~40 літералів кольору поза палітрою. Нижче — згруповані за родиною; праворуч від кожної
              групи — ціль зведення.
            </Warn>
            {OFFTOKEN.map((g) => (
              <div key={g.group} className="ds-group">
                <h3 className="ds-h3">
                  {g.group}
                  <span className="ds-h3__note">{g.note}</span>
                </h3>
                <div className="ds-swatches">
                  {g.sw.map(([hex, , note], i) => (
                    <Swatch key={hex + i} hex={hex} note={note} />
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* ============ TYPOGRAPHY ============ */}
          <Section id="type" n="03" title="Типографіка">
            <div className="ds-group">
              <h3 className="ds-h3">Родини</h3>
              <div className="ds-type-fam">
                <div className="ds-card ds-type-fam__col">
                  <span className="ds-type-fam__tag">--font-display · Onest</span>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.02em' }}>
                    Заголовки Aa Бб 0123
                  </p>
                  <span className="ds-mut">Weights 400 / 500 / 600 / 700</span>
                </div>
                <div className="ds-card ds-type-fam__col">
                  <span className="ds-type-fam__tag">--font-body · Inter</span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', lineHeight: 1.6 }}>
                    Основний текст Aa Бб 0123 — використовується для абзаців, UI та підписів.
                  </p>
                  <span className="ds-mut">Weights 400 / 500 / 600</span>
                </div>
              </div>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">Заголовки (h1–h4 · Onest 600)</h3>
              <div className="ds-card ds-stack">
                <h1 style={{ fontSize: '3rem' }}>Heading 1 — 48</h1>
                <h2 style={{ fontSize: '2.25rem' }}>Heading 2 — 36</h2>
                <h3 style={{ fontSize: '1.6rem' }}>Heading 3 — 26</h3>
                <h4 style={{ fontSize: '1.25rem' }}>Heading 4 — 20</h4>
                <p className="ds-mut">letter-spacing −0.02em · line-height 1.1</p>
              </div>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">Градієнтний заголовок</h3>
              <div className="ds-card">
                <span className="ds-grad-title">Почніть заробляти на технологічній перевазі</span>
                <Warn>
                  5 копій цього прийому з 4 різними парами стопів (20%/95%, 20%/92%, 21%/78%…) → один{' '}
                  <code>.title-gradient</code>.
                </Warn>
              </div>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">
                <code>.section-head</code> — спільний хедер сторінок
              </h3>
              <div className="ds-card">
                <div className="section-head">
                  <span className="section-head__num">01</span>
                  <div className="section-head__copy">
                    <h2 className="section-head__title">Заголовок секції</h2>
                    <p className="section-head__sub">
                      Підзаголовок із поясненням. Використовується на Returns, Guarantees та інших
                      внутрішніх сторінках для консистентності.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ============ RADII ============ */}
          <Section id="radii" n="04" title="Радіуси">
            <Warn>
              ≈24 різні значення border-radius на сайті. Пропонована шкала: <b>8 / 12 / 16 / 24 / pill</b>.
            </Warn>
            <div className="ds-radii">
              {RADII.map((r) => (
                <div key={r} className="ds-radii__item">
                  <div className="ds-radii__box" style={{ borderRadius: `${r}px` }} />
                  <span>{r}px</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ============ SHADOWS ============ */}
          <Section id="shadows" n="05" title="Тіні / глибина">
            <Warn>
              20+ унікальних тіней без системи. Пропоную 4–5-крокову шкалу elevation.
            </Warn>
            <div className="ds-shadows">
              {SHADOWS.map((s) => (
                <div key={s.label} className="ds-shadows__item">
                  <div className="ds-shadows__box" style={{ boxShadow: s.css }} />
                  <b>{s.label}</b>
                  <span className="ds-mut">{s.note}</span>
                  <code className="ds-shadows__css">{s.css}</code>
                </div>
              ))}
            </div>
          </Section>

          {/* ============ BUTTONS ============ */}
          <Section id="buttons" n="06" title="Кнопки">
            <div className="ds-group">
              <h3 className="ds-h3">Канонічна система — .btn</h3>
              <div className="ds-card ds-btnrow">
                <button className="btn btn--primary">Primary</button>
                <button className="btn btn--primary btn--sm">Primary · sm</button>
              </div>
              <div className="ds-navy ds-btnrow">
                <button className="btn btn--light">Light</button>
                <button className="btn btn--outline">Outline</button>
                <span className="ds-navy__tag">на navy-фоні</span>
              </div>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">
                Ті ж «solid» кнопки з різних файлів <span className="ds-h3__note">висоти зведено до 52/48/44 · класи ще різні</span>
              </h3>
              <div className="ds-card ds-dupes">
                {SOLID_DUPES.map((b) => (
                  <div key={b.cls} className="ds-dupe">
                    <span className={b.cls}>Кнопка</span>
                    <code className="ds-dupe__src">{b.src}</code>
                  </div>
                ))}
              </div>
              <Warn>
                ~20 реалізацій кнопок across 12 файлів. Зводимо до одного <code>.btn</code> з варіантами.
              </Warn>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">
                «Outline на світлому» <span className="ds-h3__note">три різні сірі бордери</span>
              </h3>
              <div className="ds-card ds-dupes">
                {OUTLINE_DUPES.map((b) => (
                  <div key={b.cls} className="ds-dupe">
                    <span className={b.cls}>Кнопка</span>
                    <code className="ds-dupe__src">{b.src}</code>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ============ CARDS ============ */}
          <Section id="cards" n="07" title="Картки">
            <div className="ds-group">
              <h3 className="ds-h3">
                <code>.feature-card</code> — спільна navy-картка
              </h3>
              <div className="feature-card ds-fc">
                <div className="feature-card__grid" />
                <div className="feature-card__head">
                  <span className="feature-card__badge">
                    <span className="pulse-dot" />
                    Featured
                  </span>
                </div>
                <h3 className="feature-card__title">Стандартний акцентний блок</h3>
                <p style={{ marginTop: 12, color: '#cfe0ff' }}>
                  Один shell для всіх «featured» блоків — Returns, Guarantees, Pricing…
                </p>
              </div>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">
                Стандартна біла картка <span className="ds-h3__note">≈16 копій цього рецепту</span>
              </h3>
              <div className="ds-card">
                <b>Біла картка</b>
                <p className="ds-mut" style={{ marginTop: 8 }}>
                  bg #fff · border rgba(224,229,235,.7) · shadow low
                </p>
              </div>
              <Warn>
                Той самий рецепт продубльовано ~16 разів із радіусами 18/20/24px і тінню з α .10/.12/.16 →
                один <code>.card</code> + токени радіуса й тіні.
              </Warn>
            </div>
          </Section>

          {/* ============ BADGES ============ */}
          <Section id="badges" n="08" title="Бейджі / пілюлі / чипи">
            <div className="ds-group">
              <h3 className="ds-h3">
                «Eyebrow» — світла родина <span className="ds-h3__note">.ct__badge / .faq__badge / .cases__badge</span>
              </h3>
              <div className="ds-card ds-btnrow">
                <span className="ds-eyebrow-l">Зв’яжіться з нами</span>
              </div>
            </div>
            <div className="ds-group">
              <h3 className="ds-h3">
                «Eyebrow» — темна родина <span className="ds-h3__note">×5 hero-сторінок</span>
              </h3>
              <div className="ds-navy ds-btnrow">
                <span className="ds-eyebrow-d">Гарантії</span>
              </div>
            </div>
            <div className="ds-group">
              <h3 className="ds-h3">
                Green live-pill <span className="ds-h3__note">×4 копії</span>
              </h3>
              <div className="ds-navy ds-btnrow">
                <span className="ds-pill-live">
                  <span className="pulse-dot" />
                  Алгоритм активний
                </span>
              </div>
              <Warn>8 копій eyebrow-бейджа (3 світлі + 5 темних) і 4 копії live-pill → 3 спільні класи.</Warn>
            </div>
          </Section>

          {/* ============ INPUTS ============ */}
          <Section id="inputs" n="09" title="Поля форм">
            <div className="ds-card ds-forms">
              <label className="ds-field">
                <span className="ds-field__label">Звичайне поле</span>
                <input className="ct-input" placeholder="you@example.com" defaultValue="" />
              </label>
              <label className="ds-field">
                <span className="ds-field__label">Стан фокуса (імітація)</span>
                <input className="ct-input ds-input--focus" defaultValue="Активне поле" readOnly />
              </label>
              <label className="ds-field">
                <span className="ds-field__label">Помилка</span>
                <input className="ct-input ct-input--err" defaultValue="Некоректне значення" readOnly />
                <span style={{ color: '#e0445b', fontSize: '.75rem' }}>Перевірте це поле</span>
              </label>
              <label className="ds-field">
                <span className="ds-field__label">Textarea</span>
                <textarea className="ct-input ct-textarea" rows={3} defaultValue="" placeholder="Повідомлення" />
              </label>
              <div className="ds-field">
                <span className="ds-field__label">Amount chips</span>
                <div className="ds-btnrow" style={{ padding: 0 }}>
                  <span className="ds-chip">$1 000</span>
                  <span className="ds-chip is-active">$5 000</span>
                  <span className="ds-chip">$10 000</span>
                </div>
              </div>
            </div>
            <Warn>
              <code>.ct-input</code> ≡ <code>.auth-input</code> байт-у-байт; <code>.calc-input</code> /{' '}
              <code>.vt__combo-input</code> — на 90% ті самі; focus-ring α .16 проти .15 → один <code>.input</code>.
            </Warn>
          </Section>

          {/* ============ OTHER ============ */}
          <Section id="other" n="10" title="Інші елементи">
            <div className="ds-group">
              <h3 className="ds-h3">Squircle-іконка</h3>
              <div className="ds-card ds-btnrow">
                <span className="ds-squircle">
                  <Icon />
                </span>
                <span className="ds-squircle" style={{ width: 46, height: 46, borderRadius: 14 }}>
                  <Icon />
                </span>
                <span className="ds-squircle" style={{ width: 64, height: 64, borderRadius: 20 }}>
                  <Icon />
                </span>
              </div>
              <Warn>7 переоголошень (відрізняються лише розміром) → один .icon-tile + --size.</Warn>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">Live-індикатор · .pulse-dot</h3>
              <div className="ds-card ds-btnrow">
                <span className="pulse-dot" />
                <span className="ds-mut">спільний, у index.css (але подекуди перевигадано вручну)</span>
              </div>
            </div>

            <div className="ds-group">
              <h3 className="ds-h3">Каталог для зведення</h3>
              <ul className="ds-list">
                <li>Marquee-стрічки — 7 реалізацій з ідентичним translateX(−25%).</li>
                <li>Glass hero-панель — 5 однакових копій.</li>
                <li>Timeline / stepper — dashed-конектор + radial-dot, 5 варіантів.</li>
                <li>Bar-chart — 3 різні радіуси стовпців (8/8/3, 6/6/2, 7/7/0).</li>
                <li>Accordion — bottom-border (FAQ) проти boxed-card (how-to-start).</li>
              </ul>
            </div>
          </Section>

          {/* ============ REFACTOR ============ */}
          <Section id="refactor" n="11" title="План рефакторингу">
            <p className="ds-p">Топ можливостей зведення — від найбільшого дублювання до найменшого.</p>
            <div className="ds-tablewrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Елемент</th>
                    <th>Поточний стан</th>
                    <th>Ціль</th>
                  </tr>
                </thead>
                <tbody>
                  {REFACTOR.map(([what, state, target]) => (
                    <tr key={what}>
                      <td>
                        <b>{what}</b>
                      </td>
                      <td className="ds-mut">{state}</td>
                      <td>{target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </main>
  )
}
