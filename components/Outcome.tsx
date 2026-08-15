'use client'

import { useEffect, useMemo, useState } from 'react'
import { useInViewOnce, prefersReducedMotion } from '@/lib/use-in-view'

/**
 * A single result from a case study. Outcome values are written as prose
 * ('~50', '12 min', 'Free'), so we count up only the numeric part when there is
 * one and leave everything around it alone.
 */
const NUMBER = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/

export function Outcome({ value, label, color }: { value: string; label: string; color: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('0px 0px -12% 0px')

  // Parse once per value. Everything the effect depends on has to be a
  // primitive: a fresh array from .exec() would re-run the effect on every
  // render, and since the animation itself sets state, that never settles.
  const { prefix, suffix, target, decimals, numeric } = useMemo(() => {
    const match = NUMBER.exec(value)
    if (!match) {
      return { prefix: '', suffix: '', target: 0, decimals: 0, numeric: false }
    }
    return {
      prefix: match[1],
      suffix: match[3],
      target: Number(match[2]),
      decimals: match[2].includes('.') ? 1 : 0,
      numeric: true,
    }
  }, [value])

  const [shown, setShown] = useState(target)

  useEffect(() => {
    if (!numeric) return
    if (prefersReducedMotion()) {
      setShown(target)
      return
    }
    if (!inView) {
      setShown(0)
      return
    }

    const duration = 1100
    const factor = 10 ** decimals
    let raf = 0
    let start = 0
    const step = (time: number) => {
      if (!start) start = time
      const p = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(eased * target * factor) / factor)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, numeric, target, decimals])

  return (
    <div ref={ref} className="outcome" style={{ ['--vcolor' as string]: color }}>
      <div className="outcome__value">
        {numeric ? (
          <>
            {prefix && <span className="outcome__affix">{prefix}</span>}
            {shown.toFixed(decimals)}
            {suffix && <span className="outcome__affix">{suffix}</span>}
          </>
        ) : (
          value
        )}
      </div>
      <div className="outcome__label">{label}</div>
    </div>
  )
}
