'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/use-in-view'
import './field.css'

/**
 * Ambient point field. Mounted once in the root layout, so it survives
 * client-side navigation instead of restarting on every route change.
 *
 * Deliberately cheap: one canvas, a capped point count, and the loop only runs
 * while the canvas is on screen AND the tab is visible. Reduced motion gets a
 * single static frame — texture without animation, and zero rAF.
 */
export function Field({ density = 24, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let points: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    let raf = 0
    let running = false
    let visible = false

    const size = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Seeded from the index rather than Math.random so a resize doesn't
      // reshuffle the whole field under the reader.
      const n = Math.min(70, Math.round(w / density))
      points = Array.from({ length: n }, (_, i) => ({
        x: (((i * 97) % 100) / 100) * w,
        y: (((i * 61) % 100) / 100) * h,
        vx: (((i * 37) % 10) - 5) / 900,
        vy: (((i * 53) % 10) - 5) / 900,
        r: 0.7 + ((i * 13) % 10) / 9,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < 16000) {
            ctx.strokeStyle = `rgba(200,255,62,${(0.1 * (1 - d2 / 16000)).toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.fillStyle = 'rgba(242,242,239,0.3)'
      for (const p of points) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Reduced motion: paint once, keep the loop and its listeners out entirely.
    if (prefersReducedMotion()) {
      size()
      draw()
      const redraw = () => {
        size()
        draw()
      }
      window.addEventListener('resize', redraw)
      return () => window.removeEventListener('resize', redraw)
    }

    const frame = () => {
      for (const p of points) {
        p.x += p.vx * w * 0.06
        p.y += p.vy * h * 0.06
        if (p.x < 0) p.x += w
        if (p.x > w) p.x -= w
        if (p.y < 0) p.y += h
        if (p.y > h) p.y -= h
      }
      draw()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || !visible || document.visibilityState !== 'visible') return
      running = true
      raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    size()
    draw()
    window.addEventListener('resize', size)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    // A backgrounded tab already throttles rAF, but browsers do not guarantee
    // it stops. Pausing explicitly is the behaviour the rest of the app relies on.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', size)
      cancelAnimationFrame(raf)
    }
  }, [density])

  return <canvas ref={ref} className={`field--ambient ${className}`.trim()} aria-hidden="true" />
}
