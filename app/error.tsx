'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PERSON } from '@/lib/content'

/**
 * Route-level error boundary. Keeps the nav and footer, so a broken page does
 * not strand anyone — they can still leave through the front door.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  // Next 16 passes retry(): re-fetches and re-renders. reset() only re-renders.
  retry: () => void
}) {
  useEffect(() => {
    // The visitor gets the joke; the console gets the actual stack.
    console.error('[route error]', error)
  }, [error])

  return (
    <section className="container oops">
      <p className="oops__code" aria-hidden="true">
        500
      </p>

      <h1 className="oops__title">
        Something shipped that should not have<span className="accent">.</span>
      </h1>

      <p className="oops__lede">
        A portfolio about shipping software, throwing an error in production. I have noted the
        irony, and the console has noted the stack trace. Try again first — a surprising share of
        these fix themselves on the second attempt, which is its own kind of embarrassing.
      </p>

      <nav className="oops__links" aria-label="Recovery options">
        <button className="cta-solid" type="button" onClick={() => retry()}>
          Try that again
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
          </svg>
        </button>
        <Link className="cta-ghost" href="/">
          Back to the start
        </Link>
      </nav>

      <p className="oops__lede oops__lede--tight">
        If it keeps happening,{' '}
        <a href={`mailto:${PERSON.email}?subject=Your site is broken${error.digest ? ` (${error.digest})` : ''}`}>
          tell me
        </a>{' '}
        — you will have found something my testing did not, which is genuinely useful.
      </p>

      {error.digest && (
        <p className="mono oops__path">
          Reference <span className="oops__path-value">{error.digest}</span> · quote this and I can
          find it in the logs
        </p>
      )}
    </section>
  )
}
