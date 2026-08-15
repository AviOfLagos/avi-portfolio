'use client'

import { useEffect, useState } from 'react'
import { useInViewOnce, prefersReducedMotion } from '@/lib/use-in-view'

/**
 * A single result from a case study. Outcome values are written as prose
 * ('~50', '12 min', 'Free'), so we count up only the numeric part when there is
 * one and leave everything around it alone.
 */
const NUMBER = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/

export function Outcome({ value, label, color }: { value: string; label: string; color: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('0px 0px -12% 0px')
  const match = NUMBER.exec(value)
  const target = match ? Number(match[2]) : 0
  const [shown, setShown] = useState(target)

  useEffect(() => {
    if (!match) return
    if (prefersReducedMotion()) {
      setShown(target)
      return
    }
    if (!inView) {
      setShown(0)
      return
    }
    const duration = 1100
    let raf = 0
    let start = 0
    const step = (time: number) => {
      if (!start) start = time
      const p = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      // Keep one decimal only if the source value had one.
      const next = eased * target
      setShown(match[2].includes('.') ? Math.round(next * 10) / 10 : Math.round(next))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, match])

  return (
    <div ref={ref} className="outcome" style={{ ['--vcolor' as string]: color }}>
      <div className="outcome__value">
        {match ? (
          <>
            {match[1] && <span className="outcome__affix">{match[1]}</span>}
            {shown}
            {match[3] && <span className="outcome__affix">{match[3]}</span>}
          </>
        ) : (
          value
        )}
      </div>
      <div className="outcome__label">{label}</div>
    </div>
  )
}
