import Link from 'next/link'
import { Cover } from '@/components/Cover'
import { POSTS, EXTERNAL_POSTS } from '@/lib/posts'
import { mediumImageFor } from '@/app/resources/data'
import { ExternalMark } from './ExternalMark'

/**
 * Server-rendered: the writing tab is a list of links with no interaction
 * beyond navigation, so it stays out of the client bundle and is passed into
 * the tab shell as a child.
 */
export function WritingPanel() {
  const live = POSTS
  const external = [...EXTERNAL_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="rpanel">
      <div className="rpanel__head">
        <h2 className="rpanel__title">Articles here</h2>
        <span className="mono">{live.length} pieces</span>
      </div>

      <div className="post-list">
        {live.map((p) => (
          <Link className="post-row" href={`/writing/${p.slug}`} key={p.slug}>
            <Cover
              className="post-row__thumb"
              slug={p.slug}
              color="#c8ff3e"
              width={128}
              height={80}
              sizes="128px"
            />
            <div>
              <h3 className="post-row__title">
                {p.title}
                {p.draft && <span className="badge">Draft</span>}
              </h3>
              <p className="post-row__excerpt">{p.excerpt}</p>
            </div>
            <div className="archive__side">
              <div className="mono">{p.tag}</div>
              <div className="mono" style={{ marginTop: '0.4rem' }}>
                {p.readingTime}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rpanel__head rpanel__head--spaced">
        <h2 className="rpanel__title">Published elsewhere</h2>
        <span className="mono">{external.length} articles</span>
      </div>

      <div className="post-list">
        {external.map((p) => {
          const image = mediumImageFor(p)
          return (
            <a
              className="post-row post-row--ext"
              href={p.url}
              key={p.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Cover
                className="post-row__thumb"
                slug={p.url}
                color="#c8ff3e"
                src={image}
                alt=""
                width={128}
                height={80}
                sizes="128px"
              />
              <div>
                <h3 className="post-row__title">
                  {p.title}
                  <ExternalMark where={`on ${p.platform}`} />
                </h3>
                <p className="post-row__excerpt">{p.excerpt}</p>
                <p className="rpanel__leaving mono">
                  {p.platform}
                  {p.canonical ? ' · original' : ''}
                </p>
              </div>
              <div className="archive__side">
                <div className="mono">{p.tag}</div>
                <div className="mono" style={{ marginTop: '0.4rem' }}>
                  {new Date(p.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
