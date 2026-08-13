import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useVelocity,
  useTransform,
  useAnimationFrame,
  useInView,
  useReducedMotion,
  animate,
} from 'motion/react'
import Lenis from 'lenis'
import { VENTURES, STATS, EMAIL } from './data'

let lenis = null

const ACCENTS = ['#c8ff3e', '#b197fc', '#66e0ff', '#ffb340', '#ff7a59']

function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/* ---------------- Preloader ---------------- */
function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(onDone, 250),
    })
    return () => controls.stop()
  }, [onDone])
  return (
    <motion.div
      className="preloader"
      exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <span className="mono">Avi Olawale — Portfolio '26</span>
      <span className="preloader__count">{count}%</span>
    </motion.div>
  )
}

/* ---------------- Cursor ---------------- */
function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const dotX = useSpring(x, { stiffness: 500, damping: 35 })
  const dotY = useSpring(y, { stiffness: 500, damping: 35 })
  const glowX = useSpring(x, { stiffness: 90, damping: 25 })
  const glowY = useSpring(y, { stiffness: 90, damping: 25 })
  const [big, setBig] = useState(false)

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setBig(!!e.target.closest('a, button, .venture'))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <>
      <motion.div
        className="cursor-glow"
        style={{ x: glowX, y: glowY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: big ? 3.2 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </>
  )
}

/* ---------------- Magnetic ---------------- */
function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14 })
  const sy = useSpring(y, { stiffness: 180, damping: 14 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

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

/* ---------------- Reveal (masked line) ---------------- */
function Reveal({ children, delay = 0, y = '110%' }) {
  // whileInView lives on the un-clipped mask: an element translated fully
  // outside an overflow:hidden parent never intersects, so observing the
  // inner span directly would never fire.
  return (
    <motion.span
      className="line-mask"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.span
        style={{ display: 'block' }}
        variants={{
          hidden: { y },
          visible: {
            y: 0,
            transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/* ---------------- Nav ---------------- */
function Nav({ openPalette }) {
  return (
    <motion.nav
      className="nav"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="nav__logo" href="#top" onClick={(e) => { e.preventDefault(); lenis?.scrollTo(0) }}>
        AO<span className="accent">.</span>
      </a>
      <div className="nav__links">
        <button className="nav__link" onClick={() => scrollToId('work')}>Work</button>
        <button className="nav__link" onClick={() => scrollToId('about')}>About</button>
        <button className="nav__link" onClick={() => scrollToId('contact')}>Contact</button>
        <button className="nav__kbd" onClick={openPalette}>⌘K</button>
      </div>
    </motion.nav>
  )
}

/* ---------------- Hero ---------------- */
function SpringLetter({ char, index }) {
  const rot = ((index * 7) % 13) - 6
  return (
    <motion.span
      className="letter"
      whileHover={{ y: -18, rotate: rot, scale: 1.05, color: 'var(--accent)' }}
      transition={{ type: 'spring', stiffness: 320, damping: 12 }}
    >
      {char}
    </motion.span>
  )
}

function Hero({ started }) {
  const words = ['Avi', 'Olawale']
  let letterIndex = 0
  return (
    <header className="hero container" id="top">
      <motion.div
        className="hero__eyebrow"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <span className="dot" />
        <span className="mono">Founder · Builder · Lagos → Everywhere</span>
      </motion.div>

      <h1 className="hero__name" aria-label="Avi Olawale">
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
                    transition={{ duration: 0.85, delay: 0.15 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
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
          I build <strong>AI products and marketplaces</strong> — and the teams that ship
          them. Currently: an AI marketing OS, an agent registry, and Nigeria's first
          verified solar marketplace.
        </motion.p>
        <motion.button
          className="hero__scroll nav__link"
          onClick={() => scrollToId('work')}
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
  )
}

/* ---------------- Velocity marquee ---------------- */
function wrap(min, max, v) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Marquee() {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 320 })
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-4, 0, 4])
  const directionRef = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((t, delta) => {
    const vf = velocityFactor.get()
    if (vf < 0) directionRef.current = -1
    else if (vf > 0) directionRef.current = 1
    let moveBy = directionRef.current * -1.6 * (delta / 1000)
    moveBy += moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  const items = ['AI Products', '·', 'Marketplaces', '·', 'Agents', '·', 'From Lagos to the World', '·']
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee__inner" style={{ x }}>
        {[0, 1, 2, 3].map((n) => (
          <span key={n} style={{ display: 'inline-flex' }}>
            {items.map((it, i) => (
              <span className={`marquee__item ${(i + n) % 2 ? 'ghost' : ''}`} key={i}>{it}</span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------------- Ventures ---------------- */
function Ventures() {
  const [active, setActive] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const px = useSpring(x, { stiffness: 160, damping: 20 })
  const py = useSpring(y, { stiffness: 160, damping: 20 })

  const onMove = (e) => {
    x.set(e.clientX + 28)
    y.set(e.clientY - 120)
  }

  return (
    <section className="section container ventures" id="work" onMouseMove={onMove}>
      <div className="section__head">
        <h2 className="section__title">
          <Reveal>Ventures<span className="accent">.</span></Reveal>
        </h2>
        <span className="mono">05 — Shipped &amp; shipping</span>
      </div>

      <div onMouseLeave={() => setActive(null)}>
        {VENTURES.map((v, i) => (
          <motion.a
            className="venture"
            href={v.url}
            target="_blank"
            rel="noreferrer"
            key={v.name}
            style={{ '--vcolor': v.color }}
            onMouseEnter={() => setActive(i)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
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
          </motion.a>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="preview"
            key={active}
            style={{ x: px, y: py, background: VENTURES[active].color }}
            initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <span className="preview__glyph">{VENTURES[active].glyph}</span>
            <span className="preview__desc">{VENTURES[active].desc}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ---------------- Stats ---------------- */
function StatValue({ value, suffix }) {
  const ref = useRef(null)
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
  return <div ref={ref} className="stat__value">{display}{suffix}</div>
}

function About() {
  return (
    <section className="section container" id="about">
      <div className="section__head">
        <h2 className="section__title"><Reveal>About<span className="accent">.</span></Reveal></h2>
        <span className="mono">The short version</span>
      </div>
      <p className="about__body">
        <Reveal>I'm a founder who codes, designs,</Reveal>
        <Reveal delay={0.08}>and sells. <span className="dim">I take products from</span></Reveal>
        <Reveal delay={0.16}><span className="dim">a blank repo to paying users —</span></Reveal>
        <Reveal delay={0.24}>then build the team around them.</Reveal>
      </p>
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <StatValue value={s.value} suffix={s.suffix} />
            <div className="mono stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Contact + footer ---------------- */
function LagosTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: 'Africa/Lagos',
      }).format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="mono">Lagos — {time} WAT</span>
}

function Contact() {
  return (
    <>
      <section className="section container contact" id="contact">
        <h2 className="contact__title">
          <Reveal>Let's build</Reveal>
          <Reveal delay={0.1}>something <span className="accent">absurd</span></Reveal>
        </h2>
        <Magnetic strength={0.45}>
          <a className="magnetic-cta" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
            </svg>
          </a>
        </Magnetic>
      </section>
      <footer className="footer">
        <LagosTime />
        <span className="mono">© 2026 Avi Olawale — built with an unreasonable amount of springs</span>
        <div className="footer__links mono">
          <a href="https://nexprove.com" target="_blank" rel="noreferrer">Nexprove</a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </div>
      </footer>
    </>
  )
}

/* ---------------- Command palette ---------------- */
function Palette({ open, setOpen }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)

  const actions = [
    { label: 'Go to Work', hint: 'Section', run: () => scrollToId('work') },
    { label: 'Go to About', hint: 'Section', run: () => scrollToId('about') },
    { label: 'Go to Contact', hint: 'Section', run: () => scrollToId('contact') },
    ...VENTURES.map((v) => ({
      label: `Open ${v.name}`, hint: 'Venture ↗',
      run: () => window.open(v.url, '_blank'),
    })),
    { label: 'Copy email', hint: EMAIL, run: () => navigator.clipboard?.writeText(EMAIL) },
    {
      label: 'Party mode', hint: 'Easter egg 🎉',
      run: () => {
        let i = 0
        const id = setInterval(() => {
          document.documentElement.style.setProperty('--accent', ACCENTS[i++ % ACCENTS.length])
          if (i > 14) clearInterval(id)
        }, 180)
      },
    },
  ]
  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    if (e.key === 'Enter' && filtered[cursor]) {
      filtered[cursor].run()
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="palette"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <input
              ref={inputRef}
              className="palette__input"
              placeholder="Type a command…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCursor(0) }}
              onKeyDown={onInputKey}
            />
            <div className="palette__list">
              {filtered.map((a, i) => (
                <button
                  key={a.label}
                  className={`palette__item ${i === cursor ? 'active' : ''}`}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => { a.run(); setOpen(false) }}
                >
                  {a.label}
                  <span className="palette__hint">{a.hint}</span>
                </button>
              ))}
              {!filtered.length && <div className="palette__item">Nothing found.</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- App ---------------- */
export default function App() {
  const [loading, setLoading] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const reduced = useReducedMotion()
  const done = useCallback(() => setLoading(false), [])

  useEffect(() => {
    if (reduced) return
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenis = null
    }
  }, [reduced])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onDone={done} />}
      </AnimatePresence>
      {!reduced && <Cursor />}
      <Nav openPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero started={!loading} />
        <Marquee />
        <Ventures />
        <About />
        <Contact />
      </main>
      <Palette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  )
}
