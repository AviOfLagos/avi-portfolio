/**
 * Splits a string into per-letter spans so each one can lift and take the accent
 * on hover — the same gesture as the hero name, minus the entrance stagger.
 *
 * Pure CSS: no JS, no client boundary. The rotation per letter is deterministic
 * from its index, so it looks scattered without being random (which would
 * mismatch between server and client render).
 */

type Props = {
  text: string
  className?: string
  /** Wrap in an element that reads the whole string to assistive tech. */
  as?: 'span' | 'div'
}

export function HoverLetters({ text, className, as = 'span' }: Props) {
  const Tag = as
  const words = text.split(' ')
  let index = 0

  return (
    <Tag className={className}>
      {/* The visible letters are decorative shrapnel; the real text is exposed
          once, here. aria-label on a generic span is not reliably announced,
          so this is a visually hidden node rather than an attribute. */}
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <span className="hover-word" key={`${word}-${w}`} aria-hidden="true">
          {[...word].map((char) => {
            const i = index++
            const rot = ((i * 7) % 13) - 6
            return (
              <span
                className="hover-letter"
                key={i}
                style={{ '--rot': `${rot}deg` } as React.CSSProperties}
              >
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
