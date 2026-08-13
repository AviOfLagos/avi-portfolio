'use client'

type Callback = () => void

const subscribers = new Set<Callback>()
let bound = false

function emit() {
  for (const cb of subscribers) cb()
}

/**
 * Single shared scroll subscription.
 *
 * Lenis takes over scrolling without emitting native `scroll` events, so a
 * plain `window.addEventListener('scroll')` goes silent the moment smooth
 * scrolling is active. SmoothScroll pipes Lenis's own event into `emitScroll`,
 * and the native listener covers the reduced-motion / touch / pre-hydration
 * cases where Lenis never starts.
 */
export function subscribeScroll(cb: Callback) {
  subscribers.add(cb)
  if (!bound) {
    bound = true
    window.addEventListener('scroll', emit, { passive: true })
    window.addEventListener('resize', emit, { passive: true })
  }
  return () => {
    subscribers.delete(cb)
  }
}

export function emitScroll() {
  emit()
}
