import type { Metadata } from 'next'
import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { notFound } from 'next/navigation'
import { POSTS } from '@/lib/posts'
import { PERSON } from '@/lib/content'
import { Reveal, FadeUp } from '@/components/motion-primitives'
import { ArticleLd, BreadcrumbLd } from '@/components/StructuredData'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = POSTS.find((x) => x.slug === slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/writing/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url: `/writing/${p.slug}`,
      type: 'article',
      publishedTime: p.date,
      authors: [PERSON.name],
      tags: [p.tag],
      images: ['/opengraph-image.png'],
    },
  }
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = POSTS.findIndex((x) => x.slug === slug)
  if (index === -1) notFound()

  const p = POSTS[index]
  const next = POSTS[(index + 1) % POSTS.length]

  return (
    <article className="narrow article" style={{ paddingBottom: '4rem' }}>
      <ArticleLd title={p.title} description={p.excerpt} slug={p.slug} date={p.date} />
      <BreadcrumbLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/writing' },
          { name: p.title, path: `/writing/${p.slug}` },
        ]}
      />
      <Link className="mono" href="/writing" style={{ display: 'inline-block' }}>
        ← All writing
      </Link>

      <h1 className="article__title">
        <Reveal>{p.title}</Reveal>
      </h1>

      <div className="mono" style={{ marginBottom: '3rem' }}>
        {new Date(p.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        · {p.readingTime} · {p.tag}
        {p.draft && <span className="badge">Draft</span>}
      </div>

      {p.body.map((block, i) => (
        <FadeUp key={i} delay={0.02 * i}>
          {typeof block === 'string' ? (
            <p>{block}</p>
          ) : block.type === 'h2' ? (
            <h2 className="article__subhead">{block.text}</h2>
          ) : block.type === 'quote' ? (
            <blockquote className="pullquote">
              {block.text}
              {block.cite && <cite className="mono">{block.cite}</cite>}
            </blockquote>
          ) : block.type === 'list' ? (
            <ul className="article__list">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <Figure id={block.figure} caption={block.caption} />
          )}
        </FadeUp>
      ))}

      <Link className="next-project" href={`/writing/${next.slug}`}>
        <div>
          <div className="mono" style={{ marginBottom: '0.6rem' }}>Next post</div>
          <div className="next-project__name" style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2rem)' }}>
            {next.title}
          </div>
        </div>
        <span className="venture__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
          </svg>
        </span>
      </Link>
    </article>
  )
}
