'use client'

import { useEffect, useState } from 'react'
import { PERSON } from '@/lib/content'

const COUNT_MS = 550
const EXIT_MS = 550

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let raf = 0
    let start = 0
    let exitTimer: ReturnType<typeof setTimeout>
    let doneTimer: ReturnType<typeof setTimeout>

    const step = (time: number) => {
      if (!start) start = time
      const p = Math.min((time - start) / COUNT_MS, 1)
      // Mirrors the old cubic-bezier(0.65, 0, 0.35, 1) count ramp.
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      setCount(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(step)
      } else {
        exitTimer = setTimeout(() => setExiting(true), 100)
        doneTimer = setTimeout(onDone, 100 + EXIT_MS)
      }
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div className={`preloader ${exiting ? 'preloader--out' : ''}`}>
      <span className="mono">{PERSON.name} — Portfolio &rsquo;26</span>
      <span className="preloader__count">{count}%</span>
    </div>
  )
}
