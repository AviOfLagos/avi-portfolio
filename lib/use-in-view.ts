'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Minimal replacement for motion's `useInView`. Toggles once and disconnects,
 * so a long page costs one observer per element and nothing on scroll.
 */
export function useInViewOnce<T extends HTMLElement>(margin = '-8% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No IntersectionObserver (or JS ran late): show the content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])

  return [ref, inView] as const
}
