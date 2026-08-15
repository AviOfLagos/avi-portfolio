'use client'

import { useId, useRef } from 'react'

/**
 * Search box plus the polite live region that reports how many items survived
 * the current query and filters. The region is rendered here, next to the
 * control that changes it, so every panel gets the same announcement wording.
 */
export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  resultCount,
  total,
  noun,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (next: string) => void
  resultCount: number
  total: number
  /** Plural noun used in the announcement, e.g. "resources". */
  noun: string
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rsearch">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="rsearch__field">
        <input
          id={id}
          ref={inputRef}
          type="search"
          className="rsearch__input"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && value !== '') {
              e.preventDefault()
              onChange('')
            }
          }}
        />
        {value !== '' && (
          <button
            type="button"
            className="rsearch__clear"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
      <p className="rsearch__count mono" role="status" aria-live="polite">
        {resultCount === 0
          ? 'No results'
          : `${resultCount} ${resultCount === 1 ? noun.replace(/s$/, '') : noun}${
              resultCount === total ? '' : ` of ${total}`
            }`}
      </p>
    </div>
  )
}
