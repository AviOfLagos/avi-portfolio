'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PERSON, VENTURES } from '@/lib/content'

const ACCENTS = ['#c8ff3e', '#b197fc', '#66e0ff', '#ffb340', '#ff7a59']

type Action = { label: string; hint: string; group: string; run: () => void }

export default function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const actions: Action[] = useMemo(
    () => [
      { label: 'Home', hint: 'Page', group: 'Navigate', run: () => router.push('/') },
      { label: 'Work', hint: 'Page', group: 'Navigate', run: () => router.push('/work') },
      { label: 'About', hint: 'Page', group: 'Navigate', run: () => router.push('/about') },
      { label: 'Resources', hint: 'Page', group: 'Navigate', run: () => router.push('/resources') },
      { label: 'Open source', hint: 'Resources', group: 'Navigate', run: () => router.push('/resources/open-source') },
      { label: 'Design & dev resources', hint: 'Resources', group: 'Navigate', run: () => router.push('/resources/design-dev') },
      { label: 'Résumé', hint: 'Page', group: 'Navigate', run: () => router.push('/resume') },
      { label: 'FAQ', hint: 'Page', group: 'Navigate', run: () => router.push('/faq') },
      { label: 'Contact', hint: 'Page', group: 'Navigate', run: () => router.push('/contact') },
      ...VENTURES.map((v) => ({
        label: v.name,
        hint: 'Case study',
        group: 'Projects',
        run: () => router.push(`/work/${v.slug}`),
      })),
      {
        label: 'Copy email',
        hint: PERSON.email,
        group: 'Actions',
        run: () => navigator.clipboard?.writeText(PERSON.email),
      },
      {
        label: 'Open GitHub',
        hint: 'External',
        group: 'Actions',
        run: () => window.open(PERSON.socials.github, '_blank'),
      },
      {
        label: 'Party mode',
        hint: 'Easter egg',
        group: 'Actions',
        run: () => {
          let i = 0
          const id = setInterval(() => {
            document.documentElement.style.setProperty('--accent', ACCENTS[i++ % ACCENTS.length])
            if (i > 14) clearInterval(id)
          }, 180)
        },
      },
    ],
    [router],
  )

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query],
  )

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }
    // Remember where focus came from so closing puts the user back.
    const opener = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    setQuery('')
    setCursor(0)
    inputRef.current?.focus()
    // Paint the closed state first so the open transition actually runs.
    const id = requestAnimationFrame(() => setVisible(true))
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = overflow
      opener?.focus?.()
    }
  }, [open])

  // Keep the highlighted row inside the scrolling list.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    }
    if (e.key === 'Enter' && filtered[cursor]) {
      filtered[cursor].run()
      setOpen(false)
    }
    // The list is driven by the arrow keys, so Tab has nowhere useful to go.
    if (e.key === 'Tab') e.preventDefault()
  }

  let lastGroup = ''

  if (!open) return null

  return (
    <div
      className={`palette-overlay ${visible ? 'is-open' : ''}`}
      onClick={() => setOpen(false)}
    >
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="palette__input"
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={filtered[cursor] ? `palette-item-${cursor}` : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder="Type a command…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCursor(0)
          }}
          onKeyDown={onInputKey}
        />
        <div className="palette__list" id="palette-list" role="listbox" ref={listRef}>
          {filtered.map((a, i) => {
            const showGroup = a.group !== lastGroup
            lastGroup = a.group
            return (
              <div key={a.label}>
                {showGroup && <div className="palette__group">{a.group}</div>}
                <button
                  id={`palette-item-${i}`}
                  role="option"
                  aria-selected={i === cursor}
                  data-active={i === cursor}
                  className={`palette__item ${i === cursor ? 'active' : ''}`}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => {
                    a.run()
                    setOpen(false)
                  }}
                >
                  {a.label}
                  <span className="palette__hint">{a.hint}</span>
                </button>
              </div>
            )
          })}
          {!filtered.length && <div className="palette__item">Nothing found.</div>}
        </div>
      </div>
    </div>
  )
}
