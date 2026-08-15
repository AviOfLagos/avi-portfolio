'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Cover } from '@/components/Cover'
import {
  KIND_LABELS,
  PIN_BOARDS,
  PIN_TOTAL,
  type Resource,
  type ResourceKind,
} from '@/app/resources/data'
import { MasterDetail } from './MasterDetail'
import { SearchField } from './SearchField'
import { haystack, matches, useDebounced } from './search'
import { ExternalMark } from './ExternalMark'
import { BoardSlider } from './BoardSlider'

const KINDS: ResourceKind[] = ['figma', 'dev-tool']

export function DesignDevPanel({
  resources,
  counts,
}: {
  resources: Resource[]
  counts: Record<ResourceKind, number>
}) {
  // Empty set means "all"; toggling is additive so two kinds can be shown at once.
  const [active, setActive] = useState<ResourceKind[]>([])
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query)

  // Built once per data change, not once per keystroke.
  const indexed = useMemo(
    () => resources.map((r) => ({ r, hay: haystack(r.title, r.blurb, r.meta, r.tags) })),
    [resources],
  )

  const items = useMemo(
    () =>
      indexed
        .filter(({ r }) => active.length === 0 || active.includes(r.kind))
        .filter(({ hay }) => matches(hay, debouncedQuery))
        .map(({ r }) => r),
    [indexed, active, debouncedQuery],
  )

  const filtered = active.length > 0 || debouncedQuery.trim() !== ''
  const reset = () => {
    setActive([])
    setQuery('')
  }

  const toggle = (kind: ResourceKind) =>
    setActive((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]))

  return (
    <div className="rpanel">
      <div className="rpanel__head">
        <h2 className="rpanel__title">Design &amp; dev resources</h2>
        <span className="mono">
          {items.length} of {resources.length}
        </span>
      </div>
      <p className="rpanel__lede">
        Figma Community files and developer tools. Hover or arrow through the list to preview; Enter
        opens the source.
      </p>

      <SearchField
        label="Search design and dev resources"
        placeholder="Search titles, descriptions and tags"
        value={query}
        onChange={setQuery}
        resultCount={items.length}
        total={resources.length}
        noun="results"
      />

      <div className="rfilters" role="group" aria-label="Filter resources by kind">
        <button
          type="button"
          className={`rfilter ${active.length === 0 ? 'is-on' : ''}`}
          aria-pressed={active.length === 0}
          onClick={() => setActive([])}
        >
          All <span className="mono">{resources.length}</span>
        </button>
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            className={`rfilter ${active.includes(k) ? 'is-on' : ''}`}
            aria-pressed={active.includes(k)}
            onClick={() => toggle(k)}
          >
            {KIND_LABELS[k]} <span className="mono">{counts[k]}</span>
          </button>
        ))}
      </div>

      <MasterDetail
        items={items}
        label="Design and development resources"
        getId={(r) => r.id}
        getHref={(r) => r.href}
        emptyMessage={
          debouncedQuery.trim() !== ''
            ? `Nothing here matches “${debouncedQuery.trim()}”.`
            : 'No resources of that kind.'
        }
        onClearFilters={filtered ? reset : undefined}
        clearLabel="Clear search and filters"
        renderRow={(r) => (
          <>
            <span className="md__thumb" aria-hidden="true">
              {r.image ? (
                <Image src={r.image} alt="" width={72} height={54} sizes="72px" className="md__thumb-img" />
              ) : (
                <Cover slug={r.id} color="#c8ff3e" width={72} height={54} sizes="72px" />
              )}
            </span>
            <span className="md__row-main">
              <span className="md__row-title">{r.title || `Untitled ${KIND_LABELS[r.kind].toLowerCase()}`}</span>
              {r.blurb && <span className="md__row-sub">{r.blurb}</span>}
            </span>
            <span className="md__row-meta mono">
              <span>{KIND_LABELS[r.kind]}</span>
              <span>{r.meta}</span>
            </span>
          </>
        )}
        renderDetail={(r) => (
          <>
            <p className="md__eyebrow mono">{KIND_LABELS[r.kind]}</p>
            <span className="md__hero">
              {r.imageLarge ? (
                <Image
                  src={r.imageLarge}
                  alt={r.title || `${KIND_LABELS[r.kind]} preview`}
                  width={560}
                  height={420}
                  sizes="(min-width: 900px) 40vw, 92vw"
                  className="md__hero-img"
                />
              ) : (
                <Cover slug={r.id} color="#c8ff3e" glyph={r.kind === 'figma' ? 'F' : '</>'} width={560} height={300} />
              )}
            </span>
            <h3 className="md__title">
              {r.title || <span className="md__untitled">Untitled {KIND_LABELS[r.kind].toLowerCase()}</span>}
            </h3>
            {r.blurb && <p className="md__body">{r.blurb}</p>}

            <dl className="md__facts">
              {r.facts.map((f) => (
                <div key={f.label}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>

            {r.tags.length > 0 && (
              <ul className="chips md__chips">
                {r.tags.map((t) => (
                  <li className="chip chip--ghost" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="md__actions">
              <a className="md__action" href={r.href} target="_blank" rel="noreferrer noopener">
                {r.linkLabel}
                <ExternalMark />
              </a>
              {r.secondary && (
                <a
                  className="md__action md__action--ghost"
                  href={r.secondary.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {r.secondary.label}
                  <ExternalMark />
                </a>
              )}
            </div>
          </>
        )}
      />

      <div className="boards">
        <div className="rpanel__head">
          <h2 className="rpanel__title">Pinterest boards</h2>
          <span className="mono">
            {PIN_BOARDS.length} boards · {PIN_TOTAL} pins
          </span>
        </div>
        <p className="rpanel__lede">
          The visual reference library — patterns, components, charts and interactions I collect
          while designing. Swipe, or use the arrows, to page through a board.
        </p>

        {PIN_BOARDS.map((board) => (
          <BoardSlider key={board.slug} board={board} />
        ))}
      </div>
    </div>
  )
}
