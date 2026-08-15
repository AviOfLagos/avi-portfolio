'use client'

import Link from 'next/link'
import { useRef, type ReactNode } from 'react'
import { TABS, pathForTab, type TabSlug } from '@/app/resources/tabs'

/**
 * ARIA tabs over real routes.
 *
 * Each tab is a prefetched <Link>, and only the active panel is rendered, so
 * every tab URL serves its own content. The previous version kept all three
 * panels mounted and swapped them with history.pushState: switching was
 * instant, but all four resource URLs then returned near-identical HTML, which
 * reads as duplicate content and makes search engines pick one canonical and
 * drop the rest.
 *
 * `scroll={false}` keeps the viewport where it was, which was the other thing
 * the pushState approach bought.
 */

type Props = {
  activeTab: TabSlug
  /** Only the active panel: the others live at their own URLs. */
  panel: ReactNode
}

export function ResourcesTabs({ activeTab, panel }: Props) {
  const tablistRef = useRef<HTMLDivElement>(null)

  const focusTab = (index: number) => {
    tablistRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus()
  }

  // Roving focus: arrows move between tabs, Enter follows the link.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.slug === activeTab)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next === null) return
    e.preventDefault()
    focusTab(next)
  }

  return (
    <>
      <div className="rtabs">
        <div className="rtabs__list" role="tablist" aria-label="Resources" ref={tablistRef} onKeyDown={onKeyDown}>
          {TABS.map((t, i) => {
            const selected = t.slug === activeTab
            return (
              <Link
                key={t.slug}
                href={pathForTab(t.slug)}
                scroll={false}
                role="tab"
                id={`rtab-${t.slug}`}
                aria-selected={selected}
                aria-controls={selected ? `rpanel-${t.slug}` : undefined}
                tabIndex={selected ? 0 : -1}
                className={`rtabs__tab ${selected ? 'is-selected' : ''}`}
              >
                <span className="rtabs__num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="rtabs__label">{t.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`rpanel-${activeTab}`}
        aria-labelledby={`rtab-${activeTab}`}
        tabIndex={0}
        className="rtabs__panel"
      >
        {panel}
      </div>
    </>
  )
}
