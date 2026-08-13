'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PERSON } from '@/lib/content'
import { LogoMark, LogoWordmark } from './Logo'
import { subscribeScroll, emitScroll } from '@/lib/scroll'

// Palette JS (plus its router/venture payload) only downloads once it is summoned.
const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false })

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
]

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- Smooth scroll ---------- */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (prefersReducedMotion()) return
    // Coarse pointers already have native momentum scrolling; Lenis is pure overhead there.
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    let cancelled = false
    let instance: { raf: (t: number) => void; destroy: () => void } | undefined

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      instance = lenis
      // Lenis swallows native scroll events; re-broadcast so listeners keep working.
      lenis.on('scroll', emitScroll)
      ;(window as unknown as { lenis?: unknown }).lenis = lenis
      const loop = (time: number) => {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      instance?.destroy()
      ;(window as unknown as { lenis?: unknown }).lenis = undefined
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

/* ---------- Cursor ---------- */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const glow = glowRef.current
    if (!dot || !glow) return

    const target = { x: -200, y: -200 }
    const fast = { x: -200, y: -200 }
    const slow = { x: -200, y: -200 }
    let scale = 1
    let scaleTarget = 1
    let raf = 0
    let hoverFrame = 0
    let lastTarget: HTMLElement | null = null

    const loop = () => {
      // Two different follow rates reproduce the old dot/glow spring pairing.
      fast.x += (target.x - fast.x) * 0.35
      fast.y += (target.y - fast.y) * 0.35
      slow.x += (target.x - slow.x) * 0.08
      slow.y += (target.y - slow.y) * 0.08
      scale += (scaleTarget - scale) * 0.2
      dot.style.transform = `translate3d(${fast.x}px, ${fast.y}px, 0) translate(-50%, -50%) scale(${scale})`
      glow.style.transform = `translate3d(${slow.x}px, ${slow.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const move = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      lastTarget = e.target as HTMLElement
      // closest() walks the DOM, so only run it once per frame instead of per event.
      if (hoverFrame) return
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0
        scaleTarget = lastTarget?.closest?.('a, button, .venture, .archive__row, .post-row') ? 3.2 : 1
      })
    }
    window.addEventListener('mousemove', move, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      if (hoverFrame) cancelAnimationFrame(hoverFrame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="cursor-glow" ref={glowRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  )
}

/* ---------- Nav ---------- */
export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteMounted, setPaletteMounted] = useState(false)

  const openPalette = () => {
    setPaletteMounted(true)
    setPaletteOpen(true)
  }

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 40)
      })
    }
    onScroll()
    const unsubscribe = subscribeScroll(onScroll)
    return () => {
      unsubscribe()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteMounted(true)
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <Link className="nav__logo" href="/" aria-label={`${PERSON.name} — home`}>
          <LogoMark size={26} />
          <LogoWordmark height={17} />
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
            onClick={openPalette}
            onPointerEnter={() => setPaletteMounted(true)}
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
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((l, i) => (
            <div
              key={l.href}
              className="mobile-menu__item"
              style={{ '--d': `${0.06 * i}s` } as React.CSSProperties}
            >
              <Link href={l.href}>{l.label}</Link>
            </div>
          ))}
        </div>
      )}

      {paletteMounted && <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />}
    </>
  )
}
