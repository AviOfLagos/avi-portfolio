'use client'

import { useEffect, useState, useCallback } from 'react'
import { PERSON } from '@/lib/content'
import { Preloader } from './Preloader'

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
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {loading && <Preloader onDone={done} />}

      <header className={`hero container ${started ? 'hero--started' : ''}`} id="top">
        <div className="hero__eyebrow hero__fade" style={{ '--d': '0.9s' } as React.CSSProperties}>
          <span className="dot" />
          <span className="mono">
            {PERSON.title} · {PERSON.secondaryTitle} · {PERSON.location}
          </span>
        </div>

        <h1 className="hero__name" aria-label={PERSON.name}>
          {words.map((word) => (
            <span className="word" key={word} aria-hidden="true">
              {word.split('').map((char) => {
                const i = letterIndex++
                const rot = ((i * 7) % 13) - 6
                return (
                  <span className="line-mask" key={i}>
                    <span
                      className="hero__letter letter"
                      style={{ '--i': i, '--rot': `${rot}deg` } as React.CSSProperties}
                    >
                      <span>{char === ' ' ? ' ' : char}</span>
                    </span>
                  </span>
                )
              })}
            </span>
          ))}
        </h1>

        <div className="hero__sub">
          <p
            className="hero__tagline hero__fade"
            style={{ '--d': '1.1s', '--fade-y': '24px' } as React.CSSProperties}
          >
            I turn fuzzy ideas into <strong>products people actually use</strong>, and run the
            teams that ship them. Currently: an AI marketing OS, an agent registry, and Nigeria&rsquo;s
            first verified solar marketplace.
          </p>
          <button
            className="hero__scroll nav__link hero__fade"
            onClick={scrollToWork}
            style={{ '--d': '1.5s' } as React.CSSProperties}
          >
            <span className="mono">Scroll</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
            </svg>
          </button>
        </div>
      </header>
    </>
  )
}
