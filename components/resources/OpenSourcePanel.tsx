'use client'

import type { OpenSourceProject } from '@/lib/open-source'
import { MasterDetail } from './MasterDetail'
import { ExternalMark } from './ExternalMark'

export function OpenSourcePanel({ projects }: { projects: OpenSourceProject[] }) {
  return (
    <div className="rpanel">
      <div className="rpanel__head">
        <h2 className="rpanel__title">Open source</h2>
        <span className="mono">{projects.length} repositories</span>
      </div>
      <p className="rpanel__lede">
        Hover or arrow through the list to preview a project. Enter opens the repository.
      </p>

      <MasterDetail
        items={projects}
        label="Open source projects"
        getId={(p) => p.slug}
        getHref={(p) => p.repo}
        renderRow={(p) => (
          <>
            <span className="md__row-main">
              <span className="md__row-title">{p.name}</span>
              <span className="md__row-sub">{p.tagline}</span>
            </span>
            <span className="md__row-meta mono">
              <span>{p.category}</span>
              {p.stars > 0 && <span>{p.stars}★</span>}
            </span>
          </>
        )}
        renderDetail={(p) => (
          <>
            <p className="md__eyebrow mono">{p.category}</p>
            <h3 className="md__title">{p.name}</h3>
            <p className="md__tagline">{p.tagline}</p>
            <p className="md__body">{p.description}</p>

            <dl className="md__facts">
              <div>
                <dt className="mono">Language</dt>
                <dd>{p.language}</dd>
              </div>
              <div>
                <dt className="mono">Stars</dt>
                <dd>{p.stars}</dd>
              </div>
              <div>
                <dt className="mono">Licence</dt>
                <dd>{p.license ?? 'None yet — not legally open for reuse'}</dd>
              </div>
              <div>
                <dt className="mono">Readme</dt>
                <dd>{p.hasReadme ? 'Yes' : 'Not written'}</dd>
              </div>
            </dl>

            {p.stack.length > 0 && (
              <>
                <p className="md__label mono">Stack</p>
                <ul className="chips md__chips">
                  {p.stack.map((s) => (
                    <li className="chip" key={s}>
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {p.topics.length > 0 && (
              <>
                <p className="md__label mono">Topics</p>
                <ul className="chips md__chips">
                  {p.topics.map((t) => (
                    <li className="chip chip--ghost" key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="md__label mono">Where to start</p>
            <p className="md__body">{p.contributionNote}</p>

            <div className="md__actions">
              <a className="md__action" href={p.repo} target="_blank" rel="noreferrer noopener">
                View repository
                <ExternalMark where="on GitHub" />
              </a>
              {p.live && (
                <a className="md__action md__action--ghost" href={p.live} target="_blank" rel="noreferrer noopener">
                  Live demo
                  <ExternalMark />
                </a>
              )}
            </div>
          </>
        )}
      />
    </div>
  )
}
