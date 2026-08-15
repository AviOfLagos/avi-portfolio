/**
 * Marks a link that leaves the site. The arrow is decorative; the sentence is
 * what a screen reader announces, so "opens on Medium" is not carried by a
 * glyph alone.
 */
export function ExternalMark({ where }: { where?: string }) {
  return (
    <>
      <span className="ext-arrow" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only"> (opens {where ? `${where}, ` : ''}in a new tab)</span>
    </>
  )
}
