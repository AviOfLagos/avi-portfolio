'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PERSON } from '@/lib/content'
import { Preloader } from './Chrome'

function SpringLetter({ char, index }: { char: string; index: number }) {
  const rot = ((index * 7) % 13) - 6
  return (
    <motion.span
      className="letter"
      whileHover={{ y: -18, rotate: rot, scale: 1.05, color: 'var(--accent)' }}
      transition={{ type: 'spring', stiffness: 320, damping: 12 }}
    >
      {char === ' ' ? ' ' : char}
    </motion.span>
  )
}

export function Hero() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])

  // Only show the preloader on a genuine first visit this session.
  useEffect(() => {
    if (sessionStorage.getItem('seen-intro')) {
      setLoading(false)
    } else {
      sessionStorage.setItem('seen-intro', '1')
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  const started = !loading
  const words = PERSON.name.replace(/"/g, '').split(' ')
  let letterIndex = 0

  const scrollToWork = () => {
    const el = document.getElementById('work')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>

      <header className="hero container" id="top">
        <motion.div
          className="hero__eyebrow"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <span className="dot" />
          <span className="mono">
            {PERSON.title} · {PERSON.secondaryTitle} · {PERSON.location}
          </span>
        </motion.div>

        <h1 className="hero__name" aria-label={PERSON.name}>
          {words.map((word) => (
            <span className="word" key={word} aria-hidden="true">
              {word.split('').map((char) => {
                const i = letterIndex++
                return (
                  <span className="line-mask" key={i}>
                    <motion.span
                      style={{ display: 'inline-block' }}
                      initial={{ y: '115%' }}
                      animate={started ? { y: 0 } : {}}
                      transition={{
                        duration: 0.85,
                        delay: 0.15 + i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <SpringLetter char={char} index={i} />
                    </motion.span>
                  </span>
                )
              })}
            </span>
          ))}
        </h1>

        <div className="hero__sub">
          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 24 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            I turn fuzzy ideas into <strong>products people actually use</strong> — and run the
            teams that ship them. Currently: an AI marketing OS, an agent registry, and Nigeria&rsquo;s
            first verified solar marketplace.
          </motion.p>
          <motion.button
            className="hero__scroll nav__link"
            onClick={scrollToWork}
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <span className="mono">Scroll</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
            </svg>
          </motion.button>
        </div>
      </header>
    </>
  )
}
