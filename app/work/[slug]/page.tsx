import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { VENTURES } from '@/lib/content'
import { Reveal, FadeUp } from '@/components/motion-primitives'

export function generateStaticParams() {
  return VENTURES.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const v = VENTURES.find((x) => x.slug === slug)
  if (!v) return {}
  return { title: v.name, description: v.oneLiner }
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = VENTURES.findIndex((x) => x.slug === slug)
  if (index === -1) notFound()

  const v = VENTURES[index]
  const next = VENTURES[(index + 1) % VENTURES.length]

  return (
    <>
      <section className="container case-hero">
        <Link className="mono" href="/work" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          ← All work
        </Link>
        <div className="case-hero__bar" style={{ background: v.color }} />
        <h1 className="case-hero__title">
          <Reveal>{v.name}</Reveal>
        </h1>
        <p className="page-head__lede">{v.desc}</p>

        <div className="case-meta">
          <div className="case-meta__cell">
            <div className="mono">Role</div>
            <div className="case-meta__value">{v.role}</div>
          </div>
          <div className="case-meta__cell">
            <div className="mono">Timeline</div>
            <div className="case-meta__value">{v.year}</div>
          </div>
          <div className="case-meta__cell">
            <div className="mono">Category</div>
            <div className="case-meta__value">{v.tag}</div>
          </div>
          <div className="case-meta__cell">
            <div className="mono">Live</div>
            <div className="case-meta__value">
              <a href={v.url} target="_blank" rel="noreferrer" style={{ color: v.color }}>
                {v.url.replace('https://', '')} ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '4rem' }}>
        <FadeUp>
          <div className="case-section">
            <h2>The problem</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.75, maxWidth: '68ch', color: '#d5d5d0' }}>
              {v.context}
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="case-section">
            <h2>What I did</h2>
            <ul className="case-list" style={{ maxWidth: '72ch' }}>
              {v.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="case-section">
            <h2>Where it landed</h2>
            <div className="outcomes">
              {v.outcomes.map((o) => (
                <div className="outcome" key={o.label} style={{ borderLeftColor: v.color }}>
                  <div className="outcome__value" style={{ color: v.color }}>
                    {o.value}
                  </div>
                  <div className="outcome__label">{o.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="case-section">
            <h2>Stack &amp; tools</h2>
            <div className="chips">
              {v.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>

        <Link className="next-project" href={`/work/${next.slug}`}>
          <div>
            <div className="mono" style={{ marginBottom: '0.6rem' }}>Next project</div>
            <div className="next-project__name">{next.name}</div>
          </div>
          <span className="venture__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
            </svg>
          </span>
        </Link>
      </section>
    </>
  )
}
