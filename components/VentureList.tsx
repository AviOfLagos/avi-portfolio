'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useInViewOnce, prefersReducedMotion } from '@/lib/use-in-view'
import { Cover } from './Cover'
import type { Venture } from '@/lib/content'

function VentureRow({ venture, index }: { venture: Venture; index: number }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('0px 0px -10% 0px')
  return (
    <div
      ref={ref}
      className={`fade-up ${inView ? 'is-visible' : ''}`}
      style={{ '--d': `${index * 0.06}s` } as React.CSSProperties}
    >
      <Link
        className="venture"
        href={`/work/${venture.slug}`}
        style={{ ['--vcolor' as string]: venture.color }}
        data-index={index}
      >
        <span className="venture__index">0{index + 1}</span>
        <Cover
          className="venture__thumb"
          slug={venture.slug}
          color={venture.color}
          glyph={venture.glyph}
          src={venture.cover}
          alt=""
          width={128}
          height={80}
          sizes="128px"
        />
        <span className="venture__name">{venture.name}</span>
        <span className="venture__meta">
          <span className="mono venture__tag">{venture.niche}</span>
          <span className="venture__year">
            {venture.platform} · {venture.year}
          </span>
        </span>
        <span className="venture__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
          </svg>
        </span>
      </Link>
    </div>
  )
}

export function VentureList({ ventures }: { ventures: Venture[] }) {
  const [active, setActive] = useState<number | null>(null)
  const followRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  // Follow the pointer on a frame loop so React never re-renders while moving.
  // Only while a row is actually hovered: the card is hidden below 900px and on
  // touch, so an always-on loop was burning frames for nothing.
  useEffect(() => {
    if (active === null) return
    const loop = () => {
      const t = target.current
      const p = pos.current
      p.x += (t.x - p.x) * 0.16
      p.y += (t.y - p.y) * 0.16
      const el = followRef.current
      if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [active])

  const onMove = (e: React.MouseEvent) => {
    target.current = { x: e.clientX + 28, y: e.clientY - 120 }
  }

  const onEnter = (i: number) => {
    // The card is desktop-pointer-only; skip the whole mechanism otherwise.
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return
    // Jump straight to the pointer when the card first appears, no fly-in from the last spot.
    if (active === null) pos.current = { ...target.current }
    setActive(i)
  }

  const current = active !== null ? ventures[active] : null

  return (
    <div className="ventures" onMouseMove={onMove}>
      <div onMouseLeave={() => setActive(null)}>
        {ventures.map((v, i) => (
          <div className="venture-wrap" key={v.slug} onMouseEnter={() => onEnter(i)}>
            <VentureRow venture={v} index={i} />
            <a
              className="venture__visit mono"
              href={v.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${v.name} in a new tab`}
            >
              Visit site ↗
            </a>
          </div>
        ))}
      </div>

      <div className="preview-follow" ref={followRef}>
        <div
          ref={cardRef}
          className={`preview ${current ? 'is-open' : 'is-closing'}`}
          style={{ background: current?.color }}
        >
          <span className="preview__glyph">{current?.glyph}</span>
          <span className="preview__desc">{current?.oneLiner}</span>
        </div>
      </div>
    </div>
  )
}
