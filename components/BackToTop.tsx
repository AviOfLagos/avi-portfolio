'use client'

import { useEffect, useRef, useState } from 'react'
import { subscribeScroll } from '@/lib/scroll'

/**
 * Appears only once the reader is near the bottom, so it never competes with
 * content on the way down. Rides the shared scroll bus because Lenis suppresses
 * native scroll events.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false)
  const frame = useRef(0)

  useEffect(() => {
    const update = () => {
      frame.current = 0
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      setShown(total > window.innerHeight * 1.6 && scrolled > total - window.innerHeight * 0.9)
    }
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update)
    }
    update()
    const unsubscribe = subscribeScroll(onScroll)
    return () => {
      unsubscribe()
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis
    if (lenis) lenis.scrollTo(0)
    else
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
  }

  return (
    <button
      className="back-to-top"
      data-shown={shown}
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
    >
      <span className="mono">Top</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 20V4m0 0l-6 6m6-6l6 6" />
      </svg>
    </button>
  )
}
