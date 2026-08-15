'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { TABS, TAB_META, pathForTab, tabForPath, type TabSlug } from '@/app/resources/tabs'

/**
 * ARIA tabs over path-based URLs. Selecting a tab rewrites the address bar with
 * window.history.pushState rather than router.push, so no Next navigation runs:
 * all three panels stay mounted, scroll position is untouched, and the URL is
 * still a real, server-rendered, shareable route if someone copies it.
 * Back/forward is handled by popstate, which re-reads the tab from the path.
 */

type Props = {
  initialTab: TabSlug
  panels: Record<TabSlug, ReactNode>
  /** Passed in rather than imported so lib/content stays out of this bundle. */
  siteName: string
}

export function ResourcesTabs({ initialTab, panels, siteName }: Props) {
  const [tab, setTab] = useState<TabSlug>(initialTab)
  const tablistRef = useRef<HTMLDivElement>(null)

  const select = useCallback((next: TabSlug, { push = true } = {}) => {
    setTab(next)
    if (push && typeof window !== 'undefined') {
      const path = pathForTab(next)
      if (window.location.pathname !== path) {
        // The current history state is carried over deliberately. Passing null
        // makes Next treat this as a fresh entry and reset scroll to the top,
        // which would defeat the point of keeping the panels mounted.
        window.history.pushState(window.history.state, '', path)
        // Matches the metadata title template in app/layout.tsx, so a history
        // entry created here is labelled the same as a server-rendered visit.
        document.title = `${TAB_META[next].title}, ${siteName}`
      }
    }
  }, [siteName])

  useEffect(() => {
    const onPop = () => setTab(tabForPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const focusTab = (index: number) => {
    tablistRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.slug === tab)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next === null) return
    e.preventDefault()
    select(TABS[next].slug)
    focusTab(next)
  }

  return (
    <>
      <div className="rtabs">
        <div className="rtabs__list" role="tablist" aria-label="Resources" ref={tablistRef} onKeyDown={onKeyDown}>
          {TABS.map((t, i) => {
            const selected = t.slug === tab
            return (
              <button
                key={t.slug}
                type="button"
                role="tab"
                id={`rtab-${t.slug}`}
                aria-selected={selected}
                aria-controls={`rpanel-${t.slug}`}
                tabIndex={selected ? 0 : -1}
                className={`rtabs__tab ${selected ? 'is-selected' : ''}`}
                onClick={() => {
                  select(t.slug)
                  focusTab(i)
                }}
              >
                <span className="rtabs__num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="rtabs__label">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {TABS.map((t) => (
        <div
          key={t.slug}
          role="tabpanel"
          id={`rpanel-${t.slug}`}
          aria-labelledby={`rtab-${t.slug}`}
          tabIndex={0}
          hidden={t.slug !== tab}
          className="rtabs__panel"
        >
          {panels[t.slug]}
        </div>
      ))}
    </>
  )
}
