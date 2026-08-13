import Link from 'next/link'
import { PERSON, VENTURES, STATS } from '@/lib/content'
import { POSTS } from '@/lib/posts'
import { Hero } from '@/components/Hero'
import { VentureList } from '@/components/VentureList'
import { Marquee, StatValue, Reveal, FadeUp, Magnetic } from '@/components/motion-primitives'

export default function Home() {
  return (
    <>
      <Hero />

      <Marquee
        items={[
          'Product Strategy', '·', 'AI Products', '·', 'Marketplaces', '·',
          'Zero to One', '·', 'From Lagos to the World', '·',
        ]}
      />

      <section className="section container" id="work">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Selected work<span className="accent">.</span>
            </Reveal>
          </h2>
          <Link className="mono" href="/work" style={{ textDecoration: 'underline' }}>
            View all {VENTURES.length + 7} projects →
          </Link>
        </div>
        <VentureList ventures={VENTURES} />
      </section>

      <section className="section container">
        <div style={{ display: 'grid', gap: '3rem' }}>
          <h2 className="big-type">
            <Reveal>I write the roadmap, prototype</Reveal>
            <Reveal delay={0.08}>
              the thing, <span className="dim">and keep engineering,</span>
            </Reveal>
            <Reveal delay={0.16}>
              <span className="dim">design and business pointed</span>
            </Reveal>
            <Reveal delay={0.24}>at the same outcome.</Reveal>
          </h2>
          <FadeUp>
            <div className="stats">
              {STATS.map((s) => (
                <div className="stat" key={s.label}>
                  <StatValue value={s.value} suffix={s.suffix} />
                  <div className="mono stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link className="cta-ghost" href="/about">
              More about how I work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
              </svg>
            </Link>
          </FadeUp>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Writing<span className="accent">.</span>
            </Reveal>
          </h2>
          <Link className="mono" href="/writing" style={{ textDecoration: 'underline' }}>
            All posts →
          </Link>
        </div>
        <div className="card-grid">
          {POSTS.slice(0, 3).map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <Link href={`/writing/${p.slug}`}>
                <article className="card" style={{ height: '100%' }}>
                  <div className="mono" style={{ marginBottom: '0.9rem' }}>
                    {p.tag} · {p.readingTime}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </article>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section container contact-hero">
        <h2 className="contact__title">
          <Reveal>Let&rsquo;s build</Reveal>
          <Reveal delay={0.1}>
            something <span className="accent">absurd</span>
          </Reveal>
        </h2>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Magnetic strength={0.45}>
            <a className="magnetic-cta" href={`mailto:${PERSON.email}`}>
              {PERSON.email}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
              </svg>
            </a>
          </Magnetic>
          <Link className="cta-ghost" href="/contact">
            Book a session
          </Link>
        </div>
      </section>
    </>
  )
}
