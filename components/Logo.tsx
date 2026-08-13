/**
 * Brand marks. Both are Sora outlines converted to paths, so they never wait on
 * a webfont and never reflow — the wordmark inherits `currentColor` for the
 * letters and takes the accent from `--accent`.
 */

const AVI_PATH =
  'M13 0 254 -730H519L769 0H599L397 -617L449 -596H320L374 -617L177 0ZM196 -181 246 -317H532L583 -181Z M931 0 767 -548H932L1086 0ZM981 0V-133H1142V0ZM1040 0 1173 -548H1327L1185 0Z M1418 0V-548H1578V0ZM1345 -430V-548H1578V-430ZM1480 -602Q1435 -602 1413.5 -625.5Q1392 -649 1392 -685Q1392 -722 1413.5 -745.5Q1435 -769 1480 -769Q1525 -769 1546.5 -745.5Q1568 -722 1568 -685Q1568 -649 1546.5 -625.5Q1525 -602 1480 -602Z'

const BRACE_L_PATH =
  'M308 182Q226 182 175 133Q124 84 124 -6V-190Q124 -221 105 -237.5Q86 -254 56 -254V-344Q86 -344 105 -360.5Q124 -377 124 -408V-588Q124 -678 175 -727Q226 -776 308 -776H330V-700H308Q264 -700 240 -672.5Q216 -645 216 -592V-418Q216 -366 192 -337.5Q168 -309 122 -303V-295Q168 -289 192 -261Q216 -233 216 -180V-2Q216 51 240 78.5Q264 106 308 106H330V182Z'

const BRACE_R_PATH =
  'M68 182Q150 182 201 133Q252 84 252 -6V-190Q252 -221 271 -237.5Q290 -254 320 -254V-344Q290 -344 271 -360.5Q252 -377 252 -408V-588Q252 -678 201 -727Q150 -776 68 -776H46V-700H68Q112 -700 136 -672.5Q160 -645 160 -592V-418Q160 -366 184 -337.5Q208 -309 254 -303V-295Q208 -289 184 -261Q160 -233 160 -180V-2Q160 51 136 78.5Q112 106 68 106H46V182Z'

const A_PATH =
  'M404 0V-162H377V-338Q377 -380 357 -401Q337 -422 293 -422Q271 -422 235 -421Q199 -420 161 -418Q123 -416 92 -414V-549Q115 -551 146 -553Q177 -555 210 -556Q243 -557 272 -557Q356 -557 413.5 -533Q471 -509 501 -460.5Q531 -412 531 -336V0ZM229 14Q170 14 125.5 -7Q81 -28 56 -67.5Q31 -107 31 -162Q31 -222 62 -260.5Q93 -299 149 -317.5Q205 -336 278 -336H395V-247H277Q235 -247 212.5 -226.5Q190 -206 190 -171Q190 -138 212.5 -117.5Q235 -97 277 -97Q304 -97 325.5 -106.5Q347 -116 361 -139Q375 -162 377 -203L415 -163Q410 -106 387.5 -67Q365 -28 325.5 -7Q286 14 229 14Z'

type MarkProps = { size?: number; className?: string }

/** The `{a}` plate — lime ground, ink letter. Same artwork as the favicon. */
export function LogoMark({ size = 28, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Avi"
    >
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <g fill="var(--bg)">
        <path d={BRACE_L_PATH} transform="translate(14.3 39.75) scale(0.0261)" />
        <path d={A_PATH} transform="translate(25.6 38.18) scale(0.02277)" />
        <path d={BRACE_R_PATH} transform="translate(39.89 39.75) scale(0.0261)" />
      </g>
    </svg>
  )
}

/** The `Avi.` wordmark. Letters follow `currentColor`, the full stop is the accent. */
export function LogoWordmark({ height = 22, className }: { height?: number; className?: string }) {
  return (
    <svg
      height={height}
      width={(1913 / 860) * height}
      viewBox="-20 -800 1913 860"
      className={className}
      role="img"
      aria-label="Avi."
    >
      <path d={AVI_PATH} fill="currentColor" />
      <rect x="1723" y="-150" width="150" height="150" fill="var(--accent)" />
    </svg>
  )
}
