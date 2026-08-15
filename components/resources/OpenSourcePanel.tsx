'use client'

import { useMemo, useState } from 'react'
import type { OpenSourceProject } from '@/lib/open-source'
import { MasterDetail } from './MasterDetail'
import { ExternalMark } from './ExternalMark'
import { SearchField } from './SearchField'
import { haystack, matches, useDebounced } from './search'

type Category = OpenSourceProject['category']

const CATEGORIES: Category[] = ['Developer tool', 'AI agent', 'Demo', 'Automation']

export function OpenSourcePanel({ projects }: { projects: OpenSourceProject[] }) {
  // Empty set means "all"; toggling is additive, so categories OR together.
  const [active, setActive] = useState<Category[]>([])
  const [liveOnly, setLiveOnly] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query)

  const counts = useMemo(() => {
    const map = {} as Record<Category, number>
    for (const c of CATEGORIES) map[c] = 0
    for (const p of projects) map[p.category] += 1
    return map
  }, [projects])

  const liveCount = useMemo(() => projects.filter((p) => Boolean(p.live)).length, [projects])

  const indexed = useMemo(
    () =>
      projects.map((p) => ({
        p,
        hay: haystack(p.name, p.tagline, p.description, p.language, p.stack, p.topics, p.category),
      })),
    [projects],
  )

  const items = useMemo(
    () =>
      indexed
        .filter(({ p }) => active.length === 0 || active.includes(p.category))
        .filter(({ p }) => !liveOnly || Boolean(p.live))
        .filter(({ hay }) => matches(hay, debouncedQuery))
        .map(({ p }) => p),
    [indexed, active, liveOnly, debouncedQuery],
  )

  const toggle = (category: Category) =>
    setActive((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )

  const filtered = active.length > 0 || liveOnly || debouncedQuery.trim() !== ''
  const reset = () => {
    setActive([])
    setLiveOnly(false)
    setQuery('')
  }

  return (
    <div className="rpanel">
      <div className="rpanel__head">
        <h2 className="rpanel__title">Open source</h2>
        <span className="mono">
          {items.length} of {projects.length} repositories
        </span>
      </div>
      <p className="rpanel__lede">
        Hover or arrow through the list to preview a project. Enter opens the repository.
      </p>

      <SearchField
        label="Search open-source projects"
        placeholder="Search names, descriptions, stack and topics"
        value={query}
        onChange={setQuery}
        resultCount={items.length}
        total={projects.length}
        noun="results"
      />

      <div className="rfilters" role="group" aria-label="Filter projects by category">
        <button
          type="button"
          className={`rfilter ${active.length === 0 && !liveOnly ? 'is-on' : ''}`}
          aria-pressed={active.length === 0 && !liveOnly}
          onClick={() => {
            setActive([])
            setLiveOnly(false)
          }}
        >
          All <span className="mono">{projects.length}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`rfilter ${active.includes(c) ? 'is-on' : ''}`}
            aria-pressed={active.includes(c)}
            onClick={() => toggle(c)}
          >
            {c} <span className="mono">{counts[c]}</span>
          </button>
        ))}
        <button
          type="button"
          className={`rfilter ${liveOnly ? 'is-on' : ''}`}
          aria-pressed={liveOnly}
          onClick={() => setLiveOnly((v) => !v)}
        >
          Has live demo <span className="mono">{liveCount}</span>
        </button>
      </div>

      <MasterDetail
        items={items}
        emptyMessage={
          debouncedQuery.trim() !== ''
            ? `No projects match “${debouncedQuery.trim()}”.`
            : 'No projects match these filters.'
        }
        onClearFilters={filtered ? reset : undefined}
        clearLabel="Clear search and filters"
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
