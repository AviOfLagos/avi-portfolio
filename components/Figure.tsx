/**
 * Diagrams for articles. Hand-drawn SVG rather than stock imagery: on a product
 * blog a picture of the actual argument beats a photograph of a laptop.
 * Referenced by id from a post's `figure` block.
 */

const MONO = 'var(--font-mono)'

function DocVsPrototype() {
  return (
    <svg viewBox="0 0 640 210" role="img" aria-label="Two timelines: writing the spec first spends most of the schedule arguing; prototyping first settles the argument early.">
      <g fontFamily={MONO} fontSize="11" fill="var(--muted)" letterSpacing="1.4">
        <text x="16" y="34">DOC FIRST</text>
        <text x="16" y="124">PROTOTYPE FIRST</text>
      </g>
      <g stroke="var(--line-strong)" strokeWidth="1">
        <path d="M16 54h608" />
        <path d="M16 144h608" />
      </g>
      <g fill="var(--muted)">
        <rect x="16" y="48" width="170" height="12" />
        <rect x="206" y="48" width="240" height="12" />
        <rect x="466" y="48" width="158" height="12" />
      </g>
      <g>
        <rect x="16" y="138" width="96" height="12" fill="var(--accent)" />
        <rect x="132" y="138" width="130" height="12" fill="var(--muted)" />
        <rect x="282" y="138" width="342" height="12" fill="var(--muted)" />
      </g>
      <g fontFamily={MONO} fontSize="10" fill="var(--muted)" letterSpacing="1">
        <text x="16" y="80">write spec</text>
        <text x="206" y="80">argue</text>
        <text x="466" y="80">build</text>
        <text x="16" y="170" fill="var(--accent)">build the disagreement</text>
        <text x="282" y="170">build properly</text>
      </g>
    </svg>
  )
}

function SearchVsStructure() {
  const steps = [
    { label: 'sign up', before: 100, after: 100 },
    { label: 'find the doc', before: 260, after: 60 },
    { label: 'first action', before: 120, after: 110 },
    { label: 'activated', before: 90, after: 80 },
  ]
  let beforeX = 0
  let afterX = 0
  return (
    <svg viewBox="0 0 640 220" role="img" aria-label="Onboarding time before and after: the time spent finding the right document collapses, the rest is unchanged.">
      <g fontFamily={MONO} fontSize="11" fill="var(--muted)" letterSpacing="1.4">
        <text x="16" y="34">BEFORE</text>
        <text x="16" y="120">AFTER</text>
      </g>
      {steps.map((s, i) => {
        const x = beforeX
        beforeX += s.before + 4
        return (
          <rect
            key={`b-${s.label}`}
            x={16 + x}
            y="46"
            width={s.before}
            height="16"
            fill={i === 1 ? 'var(--muted)' : 'rgba(242,242,239,0.18)'}
          />
        )
      })}
      {steps.map((s, i) => {
        const x = afterX
        afterX += s.after + 4
        return (
          <rect
            key={`a-${s.label}`}
            x={16 + x}
            y="132"
            width={s.after}
            height="16"
            fill={i === 1 ? 'var(--accent)' : 'rgba(242,242,239,0.18)'}
          />
        )
      })}
      <g fontFamily={MONO} fontSize="10" fill="var(--muted)" letterSpacing="1">
        <text x="16" y="84">the search problem was never the bottleneck</text>
        <text x="16" y="170" fill="var(--accent)">finding the doc: 260s → 60s</text>
        <text x="16" y="196">everything else: unchanged</text>
      </g>
    </svg>
  )
}

const FIGURES: Record<string, () => React.JSX.Element> = {
  'doc-vs-prototype': DocVsPrototype,
  'search-vs-structure': SearchVsStructure,
}

export function Figure({ id, caption }: { id: string; caption: string }) {
  const Draw = FIGURES[id]
  if (!Draw) return null
  return (
    <figure className="figure">
      <Draw />
      <figcaption className="mono">{caption}</figcaption>
    </figure>
  )
}
