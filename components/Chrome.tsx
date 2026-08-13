'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'motion/react'
import Lenis from 'lenis'
import { PERSON, VENTURES } from '@/lib/content'

const ACCENTS = ['#c8ff3e', '#b197fc', '#66e0ff', '#ffb340', '#ff7a59']

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
]

/* ---------- Smooth scroll ---------- */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    ;(window as unknown as { lenis?: Lenis }).lenis = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      ;(window as unknown as { lenis?: Lenis }).lenis = undefined
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

/* ---------- Cursor ---------- */
export function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const dotX = useSpring(x, { stiffness: 500, damping: 35 })
  const dotY = useSpring(y, { stiffness: 500, damping: 35 })
  const glowX = useSpring(x, { stiffness: 90, damping: 25 })
  const glowY = useSpring(y, { stiffness: 90, damping: 25 })
  const [big, setBig] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement
      setBig(!!t.closest?.('a, button, .venture, .archive__row, .post-row'))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <>
      <motion.div
        className="cursor-glow"
        style={{ x: glowX, y: glowY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: big ? 3.2 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </>
  )
}

/* ---------- Preloader (home only) ---------- */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(onDone, 220),
    })
    return () => controls.stop()
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <span className="mono">{PERSON.name} — Portfolio &rsquo;26</span>
      <span className="preloader__count">{count}%</span>
    </motion.div>
  )
}

/* ---------- Nav ---------- */
export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link className="nav__logo" href="/">
          {PERSON.initials}
          <span className="accent">.</span>
        </Link>
        <div className="nav__links">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav__link"
              data-active={pathname.startsWith(l.href)}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="nav__kbd"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette"
          >
            ⌘K
          </button>
          <button
            className="nav__burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 8h18M3 16h18" />}
            </svg>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <Link href={l.href}>{l.label}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  )
}

/* ---------- Command palette ---------- */
type Action = { label: string; hint: string; group: string; run: () => void }

function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const actions: Action[] = [
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
  ]

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o: boolean) => !o)
      }
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="palette"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Local time ---------- */
export function LocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: PERSON.timezone,
        }).format(new Date()),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="mono">Lagos — {time} WAT</span>
}

/* ---------- Page transition ---------- */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
