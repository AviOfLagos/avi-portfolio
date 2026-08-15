'use client'

import { useCallback, useId, useRef, useState, type ReactNode } from 'react'

/**
 * Master-detail list. One detail node exists at a time and it lives in a second
 * grid column on wide screens; below 900px the grid collapses to one column so
 * the same node simply stacks under the list. There is no hover-only path:
 * hover previews are gated on `pointerType === 'mouse'`, so on touch the list
 * is a plain tap-to-select list and the detail scrolls into view underneath.
 *
 * Semantics are listbox/option with a roving tabindex: Up/Down/Home/End move
 * selection and focus together, Enter or Space opens the active item.
 */

type Props<T> = {
  items: T[]
  getId: (item: T) => string
  /** Row contents. `active` lets the row echo the selected state visually. */
  renderRow: (item: T, active: boolean) => ReactNode
  renderDetail: (item: T) => ReactNode
  /** Accessible name for the list. */
  label: string
  /** Where Enter takes you. */
  getHref: (item: T) => string
  emptyMessage?: string
  /** Renders a reset affordance inside the empty state. */
  onClearFilters?: () => void
  clearLabel?: string
}

export function MasterDetail<T>({
  items,
  getId,
  renderRow,
  renderDetail,
  label,
  getHref,
  emptyMessage = 'Nothing matches these filters.',
  onClearFilters,
  clearLabel = 'Clear filters',
}: Props<T>) {
  const baseId = useId()
  /**
   * Selection is held as an id, not an index. Search and filters reorder and
   * shrink the list underneath it, and an index would silently point at a
   * different item (or at nothing) the moment that happens. Resolving the id
   * against the current list every render means a selected item that survives
   * filtering stays selected, and one that is filtered out falls back to the
   * first visible row instead of leaving a stale or empty detail panel.
   */
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const found = selectedId === null ? -1 : items.findIndex((item) => getId(item) === selectedId)
  const clamped = items.length === 0 ? -1 : found >= 0 ? found : 0

  const active = clamped >= 0 ? items[clamped] : undefined

  const select = useCallback(
    (index: number) => {
      const item = items[index]
      if (item) setSelectedId(getId(item))
    },
    [items, getId],
  )

  const focusRow = useCallback((index: number) => {
    const row = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[index]
    row?.focus()
  }, [])

  /**
   * On the stacked layout the detail is below the fold of the list, so an
   * explicit selection nudges it into view. Skipped for hover previews and for
   * keyboard arrowing, which would otherwise fight the user's own scrolling.
   */
  const revealDetail = useCallback(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(min-width: 900px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detailRef.current?.scrollIntoView({ block: 'nearest' })
      return
    }
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (items.length === 0) return
    let next: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (clamped + 1) % items.length
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (clamped - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active) window.open(getHref(active), '_blank', 'noopener,noreferrer')
      return
    }
    if (next === null) return
    e.preventDefault()
    select(next)
    focusRow(next)
  }

  const detailId = `${baseId}-detail`

  return (
    <div className="md">
      <div
        className="md__list"
        role="listbox"
        aria-label={label}
        aria-controls={detailId}
        ref={listRef}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          const isActive = i === clamped
          return (
            <div
              key={getId(item)}
              id={`${baseId}-opt-${getId(item)}`}
              role="option"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`md__row ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                select(i)
                revealDetail()
              }}
              onFocus={() => select(i)}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') select(i)
              }}
            >
              {renderRow(item, isActive)}
            </div>
          )
        })}
        {items.length === 0 && (
          <div className="md__empty">
            <p className="md__empty-text">{emptyMessage}</p>
            {onClearFilters && (
              <button type="button" className="rfilter rfilter--reset" onClick={onClearFilters}>
                {clearLabel}
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className="md__detail"
        id={detailId}
        ref={detailRef}
        role="group"
        aria-label={`${label}, details`}
        // Lenis hijacks wheel events for the whole page; without this the panel
        // cannot scroll independently while smooth scrolling is running.
        data-lenis-prevent
      >
        {active ? (
          <div className="md__detail-inner" key={getId(active)}>
            {renderDetail(active)}
          </div>
        ) : (
          <p className="md__empty md__empty-text">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}
