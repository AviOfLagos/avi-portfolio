import Image from 'next/image'

/**
 * Every venture and post gets a cover. If a real screenshot exists it wins;
 * otherwise we draw a deterministic one from the slug so the layout never has a
 * hole in it and nothing has to wait on an asset hand-off.
 */

type CoverProps = {
  slug: string
  color: string
  glyph?: string
  src?: string
  alt?: string
  width: number
  height: number
  priority?: boolean
  className?: string
  sizes?: string
}

/** FNV-1a, small, stable, and the same on the server and the client. */
function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function Generated({ slug, color, glyph, width, height }: Omit<CoverProps, 'src' | 'alt'>) {
  const seed = hash(slug)
  const pick = (n: number) => ((seed >> (n % 24)) & 255) / 255
  const angle = -35 + pick(1) * 70
  const step = 7 + Math.round(pick(3) * 9)

  const dots: string[] = []
  for (let y = step; y < height; y += step) {
    for (let x = step; x < width; x += step) {
      const t = ((x * 13 + y * 7 + seed) % 100) / 100
      if (t > 0.62) dots.push(`${x},${y},${(0.8 + t * 1.6).toFixed(2)}`)
    }
  }

  const bars = Array.from({ length: 3 }, (_, i) => ({
    x: Math.round(width * (0.1 + pick(i + 9) * 0.5)),
    y: Math.round(height * (0.15 + i * 0.28)),
    w: Math.round(width * (0.18 + pick(i + 2) * 0.4)),
    h: 2 + Math.round(pick(i + 5) * 4),
  }))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="cover__art" aria-hidden="true">
      <rect width={width} height={height} fill="#0d0d10" />
      <g transform={`rotate(${angle.toFixed(1)} ${width / 2} ${height / 2})`}>
        <g fill={color} opacity="0.5">
          {dots.map((d) => {
            const [cx, cy, r] = d.split(',')
            return <circle key={d} cx={cx} cy={cy} r={r} />
          })}
        </g>
        <g fill={color} opacity="0.85">
          {bars.map((b) => (
            <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} />
          ))}
        </g>
      </g>
      {glyph && (
        <text
          x={width - Math.max(8, width * 0.05)}
          y={height - Math.max(7, height * 0.07)}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={Math.max(10, height * 0.16)}
          fill={color}
        >
          {glyph}
        </text>
      )}
    </svg>
  )
}

export function Cover({ src, alt, className = '', sizes, priority, ...rest }: CoverProps) {
  return (
    <span
      className={`cover ${className}`}
      style={{ ['--cover-ratio' as string]: `${rest.width} / ${rest.height}` }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ''}
          width={rest.width}
          height={rest.height}
          sizes={sizes}
          priority={priority}
          className="cover__art"
        />
      ) : (
        <Generated {...rest} />
      )}
    </span>
  )
}
