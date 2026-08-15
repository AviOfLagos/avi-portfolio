'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/use-in-view'

/**
 * Ambient point field behind the full-bleed moments (home hero, contact).
 * Deliberately cheap: one canvas, a capped point count, and the loop only runs
 * while the canvas is actually on screen.
 */
export function Field({ density = 18, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || prefersReducedMotion()) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let points: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    let raf = 0
    let running = false

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

    const frame = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of points) {
        p.x += p.vx * w * 0.06
        p.y += p.vy * h * 0.06
        if (p.x < 0) p.x += w
        if (p.x > w) p.x -= w
        if (p.y < 0) p.y += h
        if (p.y > h) p.y -= h
      }
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
      raf = requestAnimationFrame(frame)
    }

    size()
    window.addEventListener('resize', size)

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        raf = requestAnimationFrame(frame)
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(canvas)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', size)
      cancelAnimationFrame(raf)
    }
  }, [density])

  return <canvas ref={ref} className={`field ${className}`} aria-hidden="true" />
}
