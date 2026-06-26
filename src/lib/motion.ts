import type { Variants } from 'framer-motion'

/**
 * Shared framer-motion presets.
 * Durations follow ui-ux-pro-max rules: 150–300ms micro, ≤500ms entrances,
 * ease-out for entering, staggered reveals 40–60ms apart, transform/opacity only.
 * Reduced-motion is handled globally via <MotionConfig reducedMotion="user">.
 */

export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}

/** Pattern: blur-sharpen + slight rise — premium reveal, great for headings. */
export const fadeBlur: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeOut },
  },
}

/** Pattern: slide in from the left — for side-anchored copy. */
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -34 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
}

/** Parent that staggers its direct children (use with fadeUp items). */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

/** Named reveal patterns for the <Reveal variant="…"> wrapper. */
export const revealVariants = { fadeUp, fadeBlur, fadeIn, scaleIn, fadeRight } as const
export type RevealVariant = keyof typeof revealVariants

/** Standard in-view viewport config: animate once, slightly before fully visible. */
export const viewportOnce = { once: true, margin: '-80px' } as const

/** Hover lift for interactive cards (paired with whileHover/whileTap). */
export const hoverLift = {
  whileHover: { y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } },
  whileTap: { scale: 0.99 },
} as const
