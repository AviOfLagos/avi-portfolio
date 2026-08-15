import type { Metadata } from 'next'
import { BreadcrumbLd } from '@/components/StructuredData'
import Link from 'next/link'
import { Cover } from '@/components/Cover'
import { Subscribe } from '@/components/Subscribe'
import { POSTS, EXTERNAL_POSTS } from '@/lib/posts'
import { Reveal, FadeUp } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on product, AI and running distributed teams.',
  alternates: { canonical: '/writing' },
  openGraph: {
    title: 'Writing',
    description: 'Notes on product, AI and running distributed teams.',
    url: '/writing',
  },
}

export default function WritingPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'Writing', path: '/writing' }]} />
      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal><HoverLetters text="Writing" /></Reveal>
        </h1>
        <p className="page-head__lede">
          Notes on building product, working with AI, and running teams across too many time zones.
          Mostly things I had to learn the expensive way.
        </p>
      </section>

      <section className="section--tight container" style={{ paddingBottom: '5rem' }}>
        <div className="post-list">
        {POSTS.map((p, i) => (
          <FadeUp key={p.slug} delay={i * 0.05}>
            <Link className="post-row" href={`/writing/${p.slug}`}>
              <Cover
                className="post-row__thumb"
                slug={p.slug}
                color="#c8ff3e"
                width={128}
                height={80}
                sizes="128px"
              />
              <div>
                <h2 className="post-row__title">
                  {p.title}
                  {p.draft && <span className="badge">Draft</span>}
                </h2>
                <p className="post-row__excerpt">{p.excerpt}</p>
              </div>
              <div className="archive__side">
                <div className="mono">{p.tag}</div>
                <div className="mono" style={{ marginTop: '0.4rem' }}>{p.readingTime}</div>
              </div>
            </Link>
          </FadeUp>
        ))}
        </div>
      </section>

      <section className="section--tight container" style={{ paddingBottom: '5rem' }}>
        <div className="section__head">
          <h2 className="section__title">
            <Reveal as="div">Published elsewhere</Reveal>
          </h2>
          <span className="mono">{EXTERNAL_POSTS.length} articles</span>
        </div>
        <div className="post-list">
          {EXTERNAL_POSTS.map((p, i) => (
            <FadeUp key={p.url} delay={i * 0.04}>
              <a className="post-row post-row--external" href={p.url} target="_blank" rel="noreferrer">
                <div>
                  <h3 className="post-row__title">
                    {p.title}
                    <span className="badge badge--platform">{p.platform}</span>
                  </h3>
                  <p className="post-row__excerpt">{p.excerpt}</p>
                </div>
                <div className="archive__side">
                  <div className="mono">{p.tag}</div>
                  <div className="mono" style={{ marginTop: '0.4rem' }}>
                    {new Date(p.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section container">
        <Subscribe />
      </section>
    </>
  )
}
