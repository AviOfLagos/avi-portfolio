import type { Metadata } from 'next'
import { WorkCollectionLd, BreadcrumbLd } from '@/components/StructuredData'
import { VENTURES, ARCHIVE } from '@/lib/content'
import { VentureList } from '@/components/VentureList'
import { ArchiveRow } from '@/components/ArchiveRow'
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
    images: ['/opengraph-image.png'],
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
          {ARCHIVE.map((a, i) => (
            <FadeUp key={a.name} delay={i * 0.04}>
              <ArchiveRow entry={a} />
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  )
}
