/**
 * Monochrome social marks, drawn to inherit `currentColor` so the footer can
 * tint them from --accent on hover without swapping assets. Each is built on a
 * 24-unit grid.
 */

type IconProps = { className?: string }

const svg = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  'aria-hidden': true as const,
  focusable: 'false' as const,
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="currentColor">
      <path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.17 9.05 7.57 10.52.55.1.76-.24.76-.53v-2.06c-3.08.67-3.73-1.3-3.73-1.3-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.67.08-.67 1.11.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.97-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.61 1.53.22 2.66.11 2.94.71.77 1.14 1.76 1.14 2.97 0 4.26-2.6 5.19-5.07 5.47.4.34.76 1.02.76 2.06v3.05c0 .29.2.64.77.53 4.4-1.47 7.56-5.62 7.56-10.52C23.1 5.33 18.27.5 12 .5z" />
    </svg>
  )
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.5c0-1.31-.03-3-1.9-3-1.9 0-2.2 1.42-2.2 2.9V21h-4z" />
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="currentColor">
      <path d="M17.53 3h3.2l-7 8 8.23 10h-6.44l-5.05-6.13L4.7 21H1.5l7.49-8.56L1.1 3h6.6l4.56 5.6zm-1.12 16.1h1.77L7.7 4.8H5.8z" />
    </svg>
  )
}

/** Figma's mark is five geometric shapes on a 3x2 grid — drawn, not traced. */
export function FigmaIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M8.5 2.75h3.5v4.5H8.5a2.25 2.25 0 0 1 0-4.5z" />
      <path d="M12 2.75h3.5a2.25 2.25 0 0 1 0 4.5H12z" />
      <path d="M8.5 7.25h3.5v4.5H8.5a2.25 2.25 0 0 1 0-4.5z" />
      <path d="M8.5 11.75h3.5v2.25a2.25 2.25 0 1 1-3.5-1.87z" />
      <circle cx="15.5" cy="9.5" r="2.25" />
    </svg>
  )
}

/** Medium's wordmark reduces to three ellipses of decreasing width. */
export function MediumIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="currentColor">
      <ellipse cx="6.8" cy="12" rx="6.3" ry="6.7" />
      <ellipse cx="17.2" cy="12" rx="3" ry="6.3" />
      <ellipse cx="22.4" cy="12" rx="1.1" ry="5.6" />
    </svg>
  )
}

export function DevToIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="currentColor">
      <path d="M2.4 4h19.2A2.4 2.4 0 0 1 24 6.4v11.2a2.4 2.4 0 0 1-2.4 2.4H2.4A2.4 2.4 0 0 1 0 17.6V6.4A2.4 2.4 0 0 1 2.4 4zm2.15 5.05v5.9h1.62c1.15 0 1.83-.7 1.83-1.9v-2.1c0-1.2-.68-1.9-1.83-1.9zm1.3 1.2h.32c.4 0 .6.24.6.72v2.06c0 .48-.2.72-.6.72h-.32zm4.02-1.2v5.9h3.06v-1.2h-1.76v-1.15h1.6v-1.2h-1.6v-1.15h1.76v-1.2zm3.9 0 1.5 5.9h1.6l1.5-5.9h-1.35l-.95 4.13-.95-4.13z" />
    </svg>
  )
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...svg} className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 7l8.1 6a1.5 1.5 0 0 0 1.8 0L21 7" />
    </svg>
  )
}

export const SOCIAL_ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  figma: FigmaIcon,
  medium: MediumIcon,
  devto: DevToIcon,
  email: MailIcon,
} as const

export type SocialKey = keyof typeof SOCIAL_ICONS
