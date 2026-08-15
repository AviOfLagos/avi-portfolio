'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { BOARD_PIN_LIMIT, type PinBoard } from '@/app/resources/data'
import { ExternalMark } from './ExternalMark'

/**
 * One horizontally scrollable board. Deliberately no carousel library: the
 * track is a native overflow scroller with CSS scroll-snap, so touch swipe and
 * trackpad scrolling are the browser's job. The buttons only nudge scrollLeft.
 *
 * Edges do NOT wrap — prev is disabled at the start and next at the end, which
 * keeps the control state an honest read of where you are in the board.
 */
export function BoardSlider({ board }: { board: PinBoard }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 1)
    // 1px of slack: fractional layout widths mean scrollLeft rarely lands exactly on max.
    setAtEnd(el.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    sync()
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sync])

  const scrollByPage = useCallback((dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const slide = el.firstElementChild as HTMLElement | null
    // Page by one tile so a keypress maps to one snap point, not a vague jump.
    const step = slide ? slide.getBoundingClientRect().width + 12 : el.clientWidth * 0.8
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollByPage(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollByPage(-1)
    }
  }

  const shown = board.pins.slice(0, BOARD_PIN_LIMIT)
  const labelId = `board-${board.slug}`

  return (
    <section className="board" aria-labelledby={labelId}>
      <div className="board__head">
        <h3 className="board__title" id={labelId}>
          <a href={board.url} target="_blank" rel="noreferrer noopener">
            {board.title}
            <ExternalMark />
          </a>
        </h3>
        <span className="board__count mono">{board.count} pins</span>
      </div>

      <div className="board__slider">
        <button
          type="button"
          className="board__nav board__nav--prev"
          aria-label={`Scroll ${board.title} back`}
          aria-controls={`${labelId}-track`}
          disabled={atStart}
          onClick={() => scrollByPage(-1)}
        >
          <Arrow dir="left" />
        </button>

        <ul
          className="board__track"
          id={`${labelId}-track`}
          ref={trackRef}
          onScroll={sync}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="group"
          aria-label={`${board.title} pins, use the left and right arrow keys to scroll`}
        >
          {shown.map((pin) => (
            <li className="board__slide" key={pin.url}>
              <a
                className="board__pin"
                href={pin.url}
                target="_blank"
                rel="noreferrer noopener"
                // Untitled pins are the norm on these boards. Rather than render
                // an empty caption, the tile stays image-only and the accessible
                // name comes from here.
                aria-label={pin.title ? pin.title : `Pin from ${board.title}`}
              >
                <Image
                  className="board__img"
                  src={pin.imageLarge ?? pin.image}
                  alt={pin.title ? pin.title : `Design reference from ${board.title}`}
                  width={240}
                  height={320}
                  sizes="(min-width: 900px) 240px, 45vw"
                />
                {pin.title && <span className="board__caption">{pin.title}</span>}
              </a>
            </li>
          ))}

          <li className="board__slide board__slide--all">
            <a className="board__all" href={board.url} target="_blank" rel="noreferrer noopener">
              <span className="board__all-n mono">{board.count}</span>
              <span className="board__all-label">
                See all on Pinterest
                <ExternalMark />
              </span>
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="board__nav board__nav--next"
          aria-label={`Scroll ${board.title} forward`}
          aria-controls={`${labelId}-track`}
          disabled={atEnd}
          onClick={() => scrollByPage(1)}
        >
          <Arrow dir="right" />
        </button>
      </div>
    </section>
  )
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d={dir === 'left' ? 'M15 4 L7 12 L15 20' : 'M9 4 L17 12 L9 20'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
