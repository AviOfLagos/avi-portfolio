import { SKILLS } from '@/lib/content'
import { FadeUp } from './motion-primitives'

/**
 * The toolkit grid. Items with a recognisable mark get a 16px logo; everything
 * else ("Roadmapping", "Acceptance criteria") stays a plain text chip. The
 * marks are local SVGs in public/icons, painted through a CSS mask so they
 * inherit currentColor and follow the chip's hover state.
 *
 * Only marks that survive being drawn at 16px are here. If a logo cannot be
 * made honestly recognisable at that size it is left out on purpose — a vague
 * blob next to a word is worse than the word alone.
 */
const MARKS: Record<string, string> = {
  Figma: 'figma',
  React: 'react',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  Tailwind: 'tailwind',
  MongoDB: 'mongodb',
  Docker: 'docker',
  Vercel: 'vercel',
  Notion: 'notion',
}

export function SkillChip({ label }: { label: string }) {
  const mark = MARKS[label]

  if (!mark) return <span className="chip">{label}</span>

  return (
    <span className="chip chip--mark">
      <span
        className="chip__mark"
        aria-hidden="true"
        style={{ '--mark': `url(/icons/${mark}.svg)` } as React.CSSProperties}
      />
      {label}
    </span>
  )
}

export function Toolkit() {
  return (
    <div className="card-grid">
      {SKILLS.map((g, i) => (
        <FadeUp key={g.group} delay={i * 0.05}>
          <div className="card" style={{ height: '100%' }}>
            <div className="mono" style={{ marginBottom: '1rem' }}>
              {g.group}
            </div>
            <div className="chips">
              {g.items.map((s) => (
                <SkillChip key={s} label={s} />
              ))}
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  )
}
