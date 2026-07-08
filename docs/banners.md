# Сюжетні банер-блоки

Реєстр ілюстрованих банерів сайту. Кожен банер — **темна navy-картка** з full-bleed 3D-ілюстрацією, що показує **сенс тексту** (а не бренд), + копірайт, накладений у порожній лівій зоні зображення.

Патерн верстки — `.grt-ib` / `.grt-inc` (див. `src/components/Guarantees.css`): `img` як фон, `.__scrim` для читабельності тексту, `.__copy` оверлеєм зліва, кеглі через `cqw` (container queries), тож текст масштабується разом із карткою.

> Цей файл — місце, куди складаємо описи наступних аналогічних кейсів. Для нового банера скопіюй шаблон у кінці.

---

## Спільний рецепт ілюстрації

- **Стиль:** преміальний 3D-рендер, синьо-неоновий tech-look (референс — банери про кібербезпеку зі щитом). Глянцевий хром + матове скло, м'яке rim-світло, концентричні неонові кільця, легкі свічки/графік, floating-частинки, боке.
- **Палітра:** глибокий navy `#0f153c → #172861`, акцент — блакитний неон; зелений тільки для «прибутку/зростання». Тримаємось синьої айдентики сайту (бренд-марка синя, не фіолетова).
- **Композиція:** формат **21:9**, символ у **правій** третині, **ліві ~60% — чистий порожній navy** під текст.
- **Адаптив (як у §01 `.grt-ib`):** 3 рендери — **desktop** (21:9), **tablet** (~1.86:1), **mobile** (портрет ~0.72:1, чистий простір ЗВЕРХУ) — свап через `<picture>` на `(max-width:900px)` і `(max-width:560px)`. На мобільному портретний рендер стає **фоном** (`object-fit:cover; object-position:center bottom`), копірайт іде **в потоці зверху** (тому банер росте по вертикалі з кількістю контенту), а зверху — градієнт із **кольору верху картинки → у прозорість**.
- **Правила:**
  - жодного тексту/цифр/літер на самому зображенні;
  - символ = **сенс копірайту** (щит=захист, рукостискання=співпраця, терези=рівна вигода…);
  - лого/монета бренду — це окремий елемент айдентики, а не сюжет банера.
- **Пайплайн:** `images_generate` → модель **`imagen-nano-banana-2`** (Nano Banana Pro), `21:9`, `2k` → за потреби `images_upscale` (Magnific) → експорт у `assets/guarantees/<name>.webp` (sharp, ~2400px, q80).

---

## Кейси

### 05 · Наші інтереси збігаються з вашими  — сторінка «Гарантії»
- **Блок:** `Guarantees.tsx` §05 (клас `.grt-inc`).
- **Сенс тексту:** взаємовигідна співпраця — «Ми отримуємо комісію **лише від вашого прибутку**… це однаково вигідно і вам, і нам».
- **Символ:** рукостискання, що переходить у висхідний графік = партнерство, яке зростає.
- **Копірайт у блоці:** чип «Комісія лише від прибутку» + абзац + два чипи зі стрілкою зростання: «Вам → більший прибуток», «Нам → частка від зростання».
- **Ассети (3 брейкпоінти, свап через `<picture>`):**
  - **desktop** `assets/guarantees/incentive-handshake.webp` (2400×1018) — копірайт зліва;
  - **tablet** `assets/guarantees/handshake-tablet.webp` (1400×752), `media="(max-width:900px)"` — копірайт зліва;
  - **mobile** `assets/guarantees/handshake-mobile.webp` (821×1144, портрет), `media="(max-width:560px)"` — рендер як фон (прив'язаний донизу), копірайт у потоці зверху (висота росте з контентом), градієнт `#1c2e4e → прозорість`.
- **Модель / параметри:** `imagen-nano-banana-2`, `21:9`, `2k`.
- **Промпт:**
  > Premium 3D concept illustration for a fintech website card, ultra-wide. On the RIGHT side of the frame: two hands meeting in a confident business handshake, stylized and rendered in glossy blue-chrome and translucent frosted glass with soft neon-blue rim lighting (clean stylized surfaces, NOT photoreal skin). A glowing blue upward trend arrow and a few thin rising candlestick bars emerge from the handshake and curve upward to the right, symbolizing a partnership that grows profit. Faint concentric neon-blue energy rings and light particles glow behind the handshake. The LEFT two-thirds of the frame is deep, clean, EMPTY dark-navy space (from #0f153c to #172861) with only a soft glow — reserved for text, absolutely no objects on the left. Cinematic studio lighting, depth of field, ultra-detailed, octane render, 8k. Absolutely no text, no words, no letters, no numbers, no watermark.
- **Альтернативи (не взяті):** дві переплетені стрілки вгору; терези з рівними зеленими свічками (точно під «однаково вигідно»).

---

## Шаблон нового кейсу

```md
### NN · <Заголовок секції>  — сторінка «<Сторінка>»
- **Блок:** <файл/клас>.
- **Сенс тексту:** <що каже копірайт>.
- **Символ:** <що на ілюстрації і чому = сенс>.
- **Копірайт у блоці:** <чипи / абзац>.
- **Ассет:** assets/…/<name>.webp (<розмір>).
- **Модель / параметри:** imagen-nano-banana-2, 21:9, 2k.
- **Промпт:**
  > <повний промпт>
- **Альтернативи (не взяті):** <…>
```
