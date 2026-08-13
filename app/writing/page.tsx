import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS } from '@/lib/posts'
import { Reveal, FadeUp } from '@/components/motion-primitives'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on product, AI and running distributed teams.',
}

export default function WritingPage() {
  return (
    <>
      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal>Writing</Reveal>
        </h1>
        <p className="page-head__lede">
          Notes on building product, working with AI, and running teams across too many time zones.
          Mostly things I had to learn the expensive way.
        </p>
      </section>

      <section className="section--tight container" style={{ paddingBottom: '5rem' }}>
        {POSTS.map((p, i) => (
          <FadeUp key={p.slug} delay={i * 0.05}>
            <Link className="post-row" href={`/writing/${p.slug}`}>
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
      </section>
    </>
  )
}
