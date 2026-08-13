'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react'
import type { Venture } from '@/lib/content'

export function VentureList({ ventures }: { ventures: Venture[] }) {
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const px = useSpring(x, { stiffness: 160, damping: 20 })
  const py = useSpring(y, { stiffness: 160, damping: 20 })

  const onMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 28)
    y.set(e.clientY - 120)
  }

  return (
    <div className="ventures" onMouseMove={onMove}>
      <div onMouseLeave={() => setActive(null)}>
        {ventures.map((v, i) => (
          <motion.div
            key={v.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              className="venture"
              href={`/work/${v.slug}`}
              style={{ ['--vcolor' as string]: v.color }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="venture__index">0{i + 1}</span>
              <span className="venture__name">{v.name}</span>
              <span className="venture__meta">
                <span className="mono venture__tag">{v.tag}</span>
                <span className="venture__year">{v.year}</span>
              </span>
              <span className="venture__arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="preview"
            key={active}
            style={{ x: px, y: py, background: ventures[active].color }}
            initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <span className="preview__glyph">{ventures[active].glyph}</span>
            <span className="preview__desc">{ventures[active].oneLiner}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
