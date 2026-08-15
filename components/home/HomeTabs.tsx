'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Cover } from '@/components/Cover'
import { FadeUp } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import './home-tabs.css'

export type TeaserItem = {
  key: string
  title: string
  sub: string
  meta: string
  href: string
  /** Off-site links open in a new tab and get the outbound arrow. */
  external?: boolean
  /** Real thumbnail where one exists; <Cover> draws one from the key if not. */
  image?: string
  /** Accent the generated cover is drawn in. */
  color?: string
}

export type TeaserTab = {
  slug: string
  label: string
  items: TeaserItem[]
  more: { href: string; label: string }
}

/**
 * Compact ARIA tab strip for the homepage teaser. Only the tab state is client
 * side — every panel is rendered by the server component that owns the data and
 * handed down as plain props, so the page itself stays a server component.
 *
 * All panels stay mounted (hidden, not unmounted) so switching tabs never
 * reflows the sections below it.
 */
export function HomeTabs({ tabs, label }: { tabs: TeaserTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.slug ?? '')
  const listRef = useRef<HTMLDivElement>(null)

  const focusTab = (index: number) => {
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.slug === active)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next === null) return
    e.preventDefault()
    setActive(tabs[next].slug)
    focusTab(next)
  }

  return (
    <>
      <div className="htabs__list" role="tablist" aria-label={label} ref={listRef} onKeyDown={onKeyDown}>
        {tabs.map((t, i) => {
          const selected = t.slug === active
          return (
            <button
              key={t.slug}
              type="button"
              role="tab"
              id={`htab-${t.slug}`}
              aria-selected={selected}
              aria-controls={`hpanel-${t.slug}`}
              tabIndex={selected ? 0 : -1}
              className={`htabs__tab ${selected ? 'is-selected' : ''}`}
              onClick={() => {
                setActive(t.slug)
                focusTab(i)
              }}
            >
              <span className="htabs__num mono">{String(i + 1).padStart(2, '0')}</span>
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.slug}
          role="tabpanel"
          id={`hpanel-${t.slug}`}
          aria-labelledby={`htab-${t.slug}`}
          tabIndex={0}
          hidden={t.slug !== active}
          className="htabs__panel"
        >
          <div className="htabs__rows">
            {t.items.map((item, i) => (
              <FadeUp key={item.key} delay={i * 0.06}>
                <Row item={item} />
              </FadeUp>
            ))}
            <FadeUp delay={t.items.length * 0.06}>
              <Link className="hrow hrow--more" href={t.more.href}>
                <span className="hrow__main">
                  <HoverLetters text={t.more.label} />
                </span>
                <span className="hrow__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </FadeUp>
          </div>
        </div>
      ))}
    </>
  )
}

function Row({ item }: { item: TeaserItem }) {
  const inner = (
    <>
      <Cover
        className="hrow__thumb"
        slug={item.key}
        color={item.color ?? '#c8ff3e'}
        src={item.image}
        alt=""
        width={112}
        height={72}
        sizes="112px"
      />
      <span className="hrow__main">
        <span className="hrow__title">
          {item.title}
          {item.external && (
            <span className="hrow__ext" aria-hidden="true">
              ↗
            </span>
          )}
        </span>
        {item.sub && <span className="hrow__sub">{item.sub}</span>}
      </span>
      <span className="hrow__meta mono">{item.meta}</span>
    </>
  )

  if (item.external) {
    return (
      <a className="hrow" href={item.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return (
    <Link className="hrow" href={item.href}>
      {inner}
    </Link>
  )
}
