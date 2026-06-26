import type { SVGProps } from 'react'

/**
 * Stroke-based SVG icon set (Lucide-style), currentColor driven.
 * No emoji used as icons — per ui-ux-pro-max `no-emoji-icons` rule.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
)

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
)

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
)

export const ShieldCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 4 6v6c0 5 3.4 7.6 8 9 4.6-1.4 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const Bolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </Svg>
)

export const Bot = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 8V4M9 2h6" />
    <circle cx="9.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
  </Svg>
)

export const BarChart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21h18" />
    <rect x="5" y="11" width="3.4" height="7" rx="1" />
    <rect x="10.3" y="7" width="3.4" height="11" rx="1" />
    <rect x="15.6" y="3" width="3.4" height="15" rx="1" />
  </Svg>
)

export const TrendingUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3 16 6-6 4 4 8-8" />
    <path d="M15 6h6v6" />
  </Svg>
)

export const Lock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4.5" y="10" width="15" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 15v2" />
  </Svg>
)

export const Landmark = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 9 5H3l9-5Z" />
    <path d="M5 10v8M10 10v8M14 10v8M19 10v8" />
    <path d="M3 21h18" />
  </Svg>
)

export const Fingerprint = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 11c0 4-1 6-2 8" />
    <path d="M8 8.5A4.5 4.5 0 0 1 16.5 11c0 4-.5 5.5-1.5 8" />
    <path d="M5 12a7 7 0 0 1 11-5.7" />
    <path d="M12 11c0 5-1.5 7-3 9" />
  </Svg>
)

export const Globe = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" />
  </Svg>
)

export const Wallet = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3" />
    <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
    <path d="M16 13.5h2.5" />
  </Svg>
)

export const Repeat = (p: IconProps) => (
  <Svg {...p}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
)

export const Layers = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </Svg>
)

export const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8.5 13.2 11l2.5 1-2.5 1L12 15.5 10.8 13l-2.5-1 2.5-1L12 8.5Z" fill="currentColor" stroke="none" />
  </Svg>
)

export const Star = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3Z"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
)

export const Menu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Svg>
)

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const Calendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 3v3M16 3v3" />
  </Svg>
)

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const Info = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5h.01" />
  </Svg>
)

export const Rocket = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </Svg>
)

export const HelpCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.4-2.7 4" />
    <path d="M12 17h.01" />
  </Svg>
)

export const User = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </Svg>
)

export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </Svg>
)

export const CircleX = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m14.5 9.5-5 5M9.5 9.5l5 5" />
  </Svg>
)

export const CircleCheck = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.4 12.4 2.6 2.6 4.6-5.2" />
  </Svg>
)

export const Apple = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M16 13.2c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 3 2.3 1.2-.1 1.6-.8 3-.8s1.8.8 3 .7c1.2 0 2-1.1 2.8-2.2.5-.8.9-1.6 1.1-2.4-2.4-.9-2.4-3.3-2.1-3.9Z" />
    <path d="M13.7 6.3c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.2Z" />
  </Svg>
)

export const PlayStore = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M4 3.3 13.4 12 4 20.7c-.5-.2-.8-.7-.8-1.4V4.7c0-.7.3-1.2.8-1.4Z" opacity=".9" />
    <path d="m15.2 10.2 2.9 1.6c.9.5.9 1.9 0 2.4l-2.9 1.6L12.4 14l2.8-3.8Z" />
    <path d="M5.2 2.9c.2 0 .5 0 .7.2l8.1 4.6-2.2 2.9L5.2 2.9Z" opacity=".7" />
    <path d="m5.9 20.9 6.6-7.6 2.2 2.9-8.1 4.6c-.2.1-.5.2-.7.1Z" opacity=".5" />
  </Svg>
)

export const Logo = ({ size = 28, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" {...p}>
    <rect width="32" height="32" rx="9" fill="url(#lg)" />
    <path
      d="M8 20.5 13 15l3.2 3.2L23 11"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M19 11h4v4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B91FF" />
        <stop offset="1" stopColor="#0A5BD6" />
      </linearGradient>
    </defs>
  </svg>
)
