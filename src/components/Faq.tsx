import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from './primitives'
import { ChevronDown, HelpCircle } from './icons'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'
import './Faq.css'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type QA = { q: string; a: string }

// Answers are written to match the messaging used elsewhere on the page
// (IBKR safety, API-only access, risk management) — the Figma node ships
// only the collapsed questions.
const FAQS: QA[] = [
  {
    q: 'Чи може сервіс зняти мої кошти з рахунку Interactive Brokers?',
    a: 'Ні. Ви надаєте алгоритму доступ виключно до виконання торгових операцій через захищений API. У нас немає технічної можливості вивести кошти або переказати їх на інший рахунок — гроші завжди залишаються на вашому особистому рахунку в Interactive Brokers.',
  },
  {
    q: 'Яка реальна безпека мого капіталу в США?',
    a: 'Interactive Brokers (NASDAQ: IBKR) — публічна компанія з капіталом понад $12 млрд, діяльність якої регулюють SEC та FINRA. Ваші активи додатково захищені страхуванням SIPC на суму до $500,000. Це один із найвищих стандартів безпеки на світовому ринку.',
  },
  {
    q: 'Що станеться, якщо ринок почне стрімко падати?',
    a: 'Алгоритм працює за чіткою системою управління ризиками: автоматично обмежує розмір позицій і фіксує збитки за наперед визначеними рівнями. Стратегія розрахована саме на волатильні ринки — мета не вгадати напрямок, а контролювати ризик у будь-яких умовах.',
  },
  {
    q: "Чи потрібно мені тримати комп'ютер увімкненим?",
    a: 'Ні. Алгоритм працює автономно на наших серверах 24/7 і взаємодіє з вашим рахунком напряму через API. Ви можете будь-коли вимкнути комп’ютер чи телефон — торгівля продовжиться без вашої участі.',
  },
  {
    q: 'Яка мінімальна сума для старту і чому?',
    a: 'Рекомендований старт — від $10,000. Ця сума дозволяє алгоритму коректно розподіляти капітал між позиціями та дотримуватися правил ризик-менеджменту. З меншим депозитом ефективність диверсифікації знижується.',
  },
  {
    q: 'Як працює оподаткування в Україні?',
    a: 'Дохід від інвестицій оподатковується за ставкою 18% ПДФО та 5% військового збору. Декларацію подають самостійно раз на рік за результатами отриманого прибутку. Радимо проконсультуватися з податковим консультантом щодо вашої ситуації.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <Reveal className="faq__head" variant="fadeUp">
          <span className="faq__badge">
            <HelpCircle size={16} />
            FAQ
          </span>
          <h2 className="faq__title">
            Розвіюємо сумніви: Все, що ви хотіли запитати про{' '}
            <span className="faq__accent">Алготрейдинг</span>
          </h2>
        </Reveal>

        <motion.div
          className="faq__list"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.div className="faq__item" key={i} variants={fadeUp}>
                <button
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="faq__q-text">{item.q}</span>
                  <span className="faq__chev" data-open={isOpen}>
                    <ChevronDown size={24} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq__answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <p className="faq__answer">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
