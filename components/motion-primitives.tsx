'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useVelocity,
  useTransform,
  useAnimationFrame,
  useInView,
  animate,
} from 'motion/react'

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
  const Tag = as === 'div' ? motion.div : motion.span
  const Inner = as === 'div' ? motion.div : motion.span
  return (
    <Tag
      className="line-mask"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <Inner
        style={{ display: 'block' }}
        variants={{
          hidden: { y },
          visible: { y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
        }}
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
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
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14 })
  const sy = useSpring(y, { stiffness: 180, damping: 14 })

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Scroll-velocity marquee ---------- */
function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export function Marquee({ items }: { items: string[] }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 320 })
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-4, 0, 4])
  const directionRef = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((_t, delta) => {
    const vf = velocityFactor.get()
    if (vf < 0) directionRef.current = -1
    else if (vf > 0) directionRef.current = 1
    let moveBy = directionRef.current * -1.6 * (delta / 1000)
    moveBy += moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee__inner" style={{ x }}>
        {[0, 1, 2, 3].map((n) => (
          <span key={n} style={{ display: 'inline-flex' }}>
            {items.map((it, i) => (
              <span className={`marquee__item ${(i + n) % 2 ? 'ghost' : ''}`} key={i}>
                {it}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------- Count-up stat ---------- */
export function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
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
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <motion.div className="progress" style={{ scaleX }} />
}
