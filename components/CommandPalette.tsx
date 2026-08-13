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

  const actions: Action[] = useMemo(
    () => [
      { label: 'Home', hint: 'Page', group: 'Navigate', run: () => router.push('/') },
      { label: 'Work', hint: 'Page', group: 'Navigate', run: () => router.push('/work') },
      { label: 'About', hint: 'Page', group: 'Navigate', run: () => router.push('/about') },
      { label: 'Writing', hint: 'Page', group: 'Navigate', run: () => router.push('/writing') },
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
    setQuery('')
    setCursor(0)
    inputRef.current?.focus()
    // Paint the closed state first so the open transition actually runs.
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [open])

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
  }

  let lastGroup = ''

  if (!open) return null

  return (
    <div
      className={`palette-overlay ${visible ? 'is-open' : ''}`}
      onClick={() => setOpen(false)}
    >
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="palette__input"
          placeholder="Type a command…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCursor(0)
          }}
          onKeyDown={onInputKey}
        />
        <div className="palette__list">
          {filtered.map((a, i) => {
            const showGroup = a.group !== lastGroup
            lastGroup = a.group
            return (
              <div key={a.label}>
                {showGroup && <div className="palette__group">{a.group}</div>}
                <button
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
