import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Cover } from '@/components/Cover'
import { Outcome } from '@/components/Outcome'
import { notFound } from 'next/navigation'
import { VENTURES } from '@/lib/content'
import { Reveal, FadeUp } from '@/components/motion-primitives'
import { CaseStudyLd, BreadcrumbLd } from '@/components/StructuredData'

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
  return {
    title: v.name,
    description: v.oneLiner,
    alternates: { canonical: `/work/${v.slug}` },
    openGraph: {
      title: `${v.name}, ${v.tag}`,
      description: v.desc,
      url: `/work/${v.slug}`,
      type: 'article',
      ...(v.cover ? { images: [{ url: v.cover }] } : {}),
    },
  }
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = VENTURES.findIndex((x) => x.slug === slug)
  if (index === -1) notFound()

  const v = VENTURES[index]
  const next = VENTURES[(index + 1) % VENTURES.length]

  return (
    <>
      <CaseStudyLd slug={v.slug} />
      <BreadcrumbLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: v.name, path: `/work/${v.slug}` },
        ]}
      />
      <section className="container case-hero">
        <Link className="mono" href="/work" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          ← All work
        </Link>
        <div className="case-hero__bar" style={{ background: v.color }} />
        <h1 className="case-hero__title">
          <Reveal>{v.name}</Reveal>
        </h1>
        <p className="page-head__lede">{v.desc}</p>

        <Cover
          className="case-hero__media"
          slug={v.slug}
          color={v.color}
          glyph={v.glyph}
          src={v.cover}
          alt={v.cover ? `${v.name} product interface` : ''}
          width={1440}
          height={900}
          sizes="(max-width: 900px) 100vw, 1240px"
          priority
        />

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
            <div className="mono">Platform</div>
            <div className="case-meta__value">{v.platform}</div>
          </div>
          <div className="case-meta__cell">
            <div className="mono">Niche</div>
            <div className="case-meta__value">{v.niche}</div>
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
                <Outcome key={o.label} value={o.value} label={o.label} color={v.color} />
              ))}
            </div>
          </div>
        </FadeUp>

        {v.gallery && v.gallery.length > 0 && (
          <FadeUp>
            <div className="case-section">
              <h2>Inside the product</h2>
              <div className="shots">
                {v.gallery.map((shot) => (
                  <figure className="shot" key={shot.src}>
                    <Image
                      src={shot.src}
                      alt={`${v.name} — ${shot.caption}`}
                      width={1440}
                      height={900}
                      sizes="(max-width: 760px) 100vw, 50vw"
                    />
                    <figcaption className="mono">{shot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </FadeUp>
        )}

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
