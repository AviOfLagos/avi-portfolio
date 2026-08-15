import { useEffect, useState } from 'react'

/**
 * Substring matching, not fuzzy. This codebase ships zero UI dependencies by
 * design, and the lists here are tens of items, not thousands — a normalised
 * `includes` over a pre-joined haystack is both cheaper and more predictable
 * than a scoring library.
 */
export function normalise(value: string) {
  return value.toLowerCase().trim()
}

/** Every field a query can hit, joined once per item by the caller. */
export function haystack(...parts: (string | string[] | undefined)[]) {
  return normalise(
    parts
      .flatMap((p) => (Array.isArray(p) ? p : p ? [p] : []))
      .join(' '),
  )
}

export function matches(hay: string, query: string) {
  const q = normalise(query)
  return q === '' || hay.includes(q)
}

/**
 * Trailing debounce. Typing updates the input immediately (controlled value
 * stays responsive) while the filtering pass — which re-renders every row —
 * only runs once the user pauses.
 */
export function useDebounced<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    if (value === debounced) return
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay, debounced])
  return debounced
}
