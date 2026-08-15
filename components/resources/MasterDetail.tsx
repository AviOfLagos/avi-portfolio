'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'

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
}

export function MasterDetail<T>({
  items,
  getId,
  renderRow,
  renderDetail,
  label,
  getHref,
  emptyMessage = 'Nothing matches these filters.',
}: Props<T>) {
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  // Filters can shrink the list out from under the selection.
  const clamped = items.length === 0 ? -1 : Math.min(activeIndex, items.length - 1)
  useEffect(() => {
    setActiveIndex((i) => (items.length === 0 ? 0 : Math.min(i, items.length - 1)))
  }, [items.length])

  const active = clamped >= 0 ? items[clamped] : undefined

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
    setActiveIndex(next)
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
                setActiveIndex(i)
                revealDetail()
              }}
              onFocus={() => setActiveIndex(i)}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setActiveIndex(i)
              }}
            >
              {renderRow(item, isActive)}
            </div>
          )
        })}
        {items.length === 0 && <p className="md__empty">{emptyMessage}</p>}
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
          <p className="md__empty">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}
