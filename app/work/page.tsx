import type { Metadata } from 'next'
import { WorkCollectionLd, BreadcrumbLd } from '@/components/StructuredData'
import { VENTURES, ARCHIVE } from '@/lib/content'
import { VentureList } from '@/components/VentureList'
import { Reveal, FadeUp } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected product work, AI platforms, marketplaces and studio builds.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Work',
    description: 'Selected product work, AI platforms, marketplaces and studio builds.',
    url: '/work',
  },
}

export default function WorkPage() {
  return (
    <>
      <WorkCollectionLd />
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }]} />
      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal><HoverLetters text="Work" /></Reveal>
        </h1>
        <p className="page-head__lede">
          Products I owned end to end, from the first messy sketch to the thing in people&rsquo;s
          hands. Case studies for what I&rsquo;m building now, links for everything before it.
        </p>
      </section>

      <section className="section--tight container">
        <div className="section__head">
          <span className="mono">Current, case studies</span>
          <span className="mono">{VENTURES.length} projects</span>
        </div>
        <VentureList ventures={VENTURES} />
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Archive<span className="accent">.</span>
            </Reveal>
          </h2>
          <span className="mono">{ARCHIVE.length} earlier builds</span>
        </div>
        <div className="archive">
          {ARCHIVE.map((a, i) => {
            const inner = (
              <>
                <div>
                  <div className="archive__name">
                    {a.name}
                    {a.url && (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H8M17 7v9" />
                      </svg>
                    )}
                  </div>
                  <p className="archive__note">{a.note}</p>
                </div>
                <div className="archive__side">
                  <div className="mono">{a.tag}</div>
                  <div className="mono" style={{ marginTop: '0.4rem' }}>{a.year}</div>
                </div>
              </>
            )
            return (
              <FadeUp key={a.name} delay={i * 0.04}>
                {a.url ? (
                  <a className="archive__row" href={a.url} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="archive__row">{inner}</div>
                )}
              </FadeUp>
            )
          })}
        </div>
      </section>
    </>
  )
}
