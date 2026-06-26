import { useCallback, useRef } from 'react'

/**
 * Slow a CSS marquee to `factor` of its speed while hovered, smoothly.
 *
 * Changing `animation-duration` on hover would re-scale the timeline and make the
 * track jump, so instead we drive the running CSS animation's `playbackRate` through
 * the Web Animations API — that changes speed from the current position with no jump.
 *
 * Put the returned `ref` on the marquee wrapper whose FIRST child is the animated
 * track, and spread the hover handlers on the same element.
 */
export function useMarqueeSpeed(factor = 0.5) {
  const ref = useRef<HTMLDivElement>(null)

  const setRate = useCallback((rate: number) => {
    const track = ref.current?.firstElementChild
    track?.getAnimations().forEach((a) => {
      a.playbackRate = rate
    })
  }, [])

  const onMouseEnter = useCallback(() => setRate(factor), [setRate, factor])
  const onMouseLeave = useCallback(() => setRate(1), [setRate])

  return { ref, onMouseEnter, onMouseLeave }
}
