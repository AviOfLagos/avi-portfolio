'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInViewOnce, prefersReducedMotion } from '@/lib/use-in-view'
import { subscribeScroll } from '@/lib/scroll'

/* ---------- Masked line reveal ---------- */
export function Reveal({
  children,
  delay = 0,
  y = '110%',
  as = 'span',
}: {
  children: ReactNode
  delay?: number
  y?: string
  as?: 'span' | 'div'
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('0px 0px -18% 0px')
  const Tag = as === 'div' ? 'div' : 'span'
  const Inner = as === 'div' ? 'div' : 'span'
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement>}
      className={`line-mask ${inView ? 'is-visible' : ''}`}
    >
      <Inner
        className="reveal__inner"
        style={{ '--reveal-y': y, '--d': `${delay}s` } as React.CSSProperties}
      >
        {children}
      </Inner>
    </Tag>
  )
}

/* ---------- Fade + rise ---------- */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`fade-up ${inView ? 'is-visible' : ''} ${className ?? ''}`}
      style={{ '--d': `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/**
 * Frame-loop spring, matching motion's feel closely enough for cursor-follow
 * effects. Returns a setter for the target; the element is written to directly
 * so React never re-renders during the animation.
 */
function useFollowSpring(ref: React.RefObject<HTMLElement | null>, stiffness: number) {
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const running = useRef(false)

  const tick = () => {
    const t = target.current
    const c = current.current
    c.x += (t.x - c.x) * stiffness
    c.y += (t.y - c.y) * stiffness
    const el = ref.current
    if (el) el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`
    if (Math.abs(t.x - c.x) > 0.05 || Math.abs(t.y - c.y) > 0.05) {
      requestAnimationFrame(tick)
    } else {
      running.current = false
    }
  }

  return (x: number, y: number) => {
    target.current = { x, y }
    if (!running.current) {
      running.current = true
      requestAnimationFrame(tick)
    }
  }
}

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const setTarget = useFollowSpring(ref, 0.18)

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setTarget((e.clientX - r.left - r.width / 2) * strength, (e.clientY - r.top - r.height / 2) * strength)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTarget(0, 0)}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

/* ---------- Scroll-velocity marquee ---------- */
function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export function Marquee({ items }: { items: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = innerRef.current
    const host = wrapRef.current
    if (!el || !host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let base = 0
    let direction = -1
    let velocity = 0
    let lastScroll = window.scrollY
    let lastTime = 0
    let raf = 0
    let visible = true

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) {
        lastTime = 0
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(host)

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastScroll
      lastScroll = y
      if (delta !== 0) direction = delta > 0 ? -1 : 1
      // Decays back to the idle drift speed in the loop below.
      velocity = Math.min(Math.abs(delta) / 12, 4)
    }
    const unsubscribe = subscribeScroll(onScroll)

    function loop(time: number) {
      raf = 0
      if (!visible) return
      const delta = lastTime ? time - lastTime : 16
      lastTime = time
      velocity *= 0.9
      let moveBy = direction * 1.6 * (delta / 1000)
      moveBy += moveBy * velocity
      base = wrap(-25, 0, base + moveBy)
      el!.style.transform = `translateX(${base}%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      io.disconnect()
      unsubscribe()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="marquee" aria-hidden="true" ref={wrapRef}>
      <div className="marquee__inner" ref={innerRef}>
        {[0, 1, 2, 3].map((n) => (
          <span key={n} style={{ display: 'inline-flex' }}>
            {items.map((it, i) => (
              <span className={`marquee__item ${(i + n) % 2 ? 'ghost' : ''}`} key={i}>
                {it}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Count-up stat ---------- */
export function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('0px 0px -10% 0px')
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) {
      setDisplay(value)
      return
    }
    const duration = 1400
    let raf = 0
    let start = 0
    const step = (time: number) => {
      if (!start) start = time
      const p = Math.min((time - start) / duration, 1)
      // easeOutExpo-ish, matches the old cubic-bezier(0.22, 1, 0.36, 1) closely.
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <div ref={ref} className="stat__value">
      {display}
      {suffix}
    </div>
  )
}

/* ---------- Scroll progress bar ---------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      ref.current?.style.setProperty('--progress', String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    const unsubscribe = subscribeScroll(onScroll)
    return () => {
      unsubscribe()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="progress" ref={ref} />
}
