'use client'

/**
 * Last resort: the root layout itself failed, so this replaces it entirely.
 * No nav, no footer, no shared CSS assumed — styles are inline so this renders
 * even when the stylesheet is the thing that broke.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const ink = '#f2f2ef'
  const muted = '#8b8b93'
  const accent = '#c8ff3e'

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#0a0a0c',
          color: ink,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          lineHeight: 1.55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        <main style={{ width: 'min(60ch, 100%)' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: muted,
              margin: 0,
            }}
          >
            Total loss
          </p>

          <h1
            style={{
              fontSize: 'clamp(1.9rem, 6vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0.6rem 0 1rem',
            }}
          >
            The whole page fell over
            <span style={{ color: accent }}>.</span>
          </h1>

          <p style={{ color: muted, margin: '0 0 1rem' }}>
            Not one section — the layout itself. This screen is what is left when everything
            protecting it has already failed, which is why it looks like this.
          </p>

          <p style={{ color: muted, margin: '0 0 1.8rem' }}>
            Reload first. If it happens twice, email{' '}
            <a href="mailto:avi@nexprove.com" style={{ color: accent }}>
              avi@nexprove.com
            </a>{' '}
            and I will owe you a fortune-not cookie.
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                background: accent,
                color: '#0a0a0c',
                border: 0,
                padding: '0.85rem 1.6rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                borderRadius: 2,
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: '1px solid rgba(242,242,239,0.22)',
                color: ink,
                padding: '0.85rem 1.6rem',
                fontSize: '0.95rem',
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              Back to the start
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: '0.72rem',
                color: muted,
                marginTop: '2rem',
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  )
}
