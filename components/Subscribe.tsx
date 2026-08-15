'use client'

import { useEffect, useId, useState } from 'react'
import { PERSON } from '@/lib/content'

type State = 'idle' | 'sending' | 'sent' | 'confirmed' | 'error' | 'offline'

/**
 * Newsletter signup. Double opt-in: this only asks for a confirmation email —
 * nothing joins the list until the reader clicks the link.
 *
 * Every outcome that ends the interaction (subscribed, confirmed, or mailer not
 * configured) hands over a fortune-not cookie. Typing your address into a form
 * deserves something back either way.
 */

// Fortune cookies, minus the fortune.
const NOT_FORTUNES = [
  'You will ship it. The date is the negotiable part.',
  'A meeting in your future could have been this sentence.',
  'The bug is in the file you already checked. Twice.',
  'Someone is reading your PRD right now. They are not reading all of it.',
  'Your best idea this quarter is currently a note titled "untitled".',
  'The roadmap is correct. The roadmap is also fiction. Both, at once.',
  'You will estimate two weeks. It is not two weeks.',
  'Scope creeps toward the person least able to say no. Stand up straight.',
  'The feature nobody argued about is the one nobody wanted.',
  'Your users found a workflow you never designed. It is now the main one.',
]

const pickFortune = () => NOT_FORTUNES[Math.floor(Math.random() * NOT_FORTUNES.length)]

function Cookie() {
  return (
    <svg viewBox="0 0 124 80" className="fortune__cookie" aria-hidden="true">
      {/* Cookie first, then the slip on top of it, or the fill hides the paper */}
      <path
        d="M8 64c14-28 38-40 54-40s40 12 54 40c-16 8-34 12-54 12S24 72 8 64Z"
        fill="var(--bg-soft)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <path d="M62 24c-7 18-7 34 0 52" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.5" />
      <g transform="rotate(-8 62 20)">
        <path d="M38 10h48v18H38z" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
        <path d="M46 19h32" stroke="var(--accent)" strokeWidth="2" opacity="0.45" />
      </g>
    </svg>
  )
}

export function Subscribe() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const [fortune, setFortune] = useState('')

  // The confirm route redirects back here with the outcome.
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('subscribe')
    if (!result) return
    if (result === 'confirmed') {
      setFortune(pickFortune())
      setState('confirmed')
    } else if (result === 'expired') {
      setState('error')
      setMessage('That confirmation link expired. Enter your email to get a fresh one.')
    } else {
      setState('error')
      setMessage('Something went wrong confirming that link. Try again?')
    }
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 503) {
        // Not configured yet. Own it, and hand over the consolation prize.
        setFortune(pickFortune())
        setState('offline')
        return
      }
      if (!res.ok) {
        setState('error')
        setMessage(data.error ?? 'That did not go through. Try again in a minute.')
        return
      }
      setFortune(pickFortune())
      setState('sent')
      setEmail('')
    } catch {
      setState('error')
      setMessage('Network trouble. Try again in a minute.')
    }
  }

  if (state === 'offline' || state === 'sent' || state === 'confirmed') {
    const panel = {
      offline: {
        title: (
          <>
            Well. The signup form is broken<span className="accent">.</span>
          </>
        ),
        body: (
          <>
            A product person shipped a subscribe button that does not subscribe. I am aware of the
            irony and I am fixing it. Check back, or{' '}
            <a href={`mailto:${PERSON.email}?subject=Your newsletter form is broken`}>email me</a>{' '}
            and I will add you by hand — which, honestly, is more reliable.
          </>
        ),
        kicker: 'For your trouble, a fortune-not cookie. No fortune inside, only an observation:',
      },
      sent: {
        title: (
          <>
            Your data has been successfully harvested<span className="accent">.</span>
          </>
        ),
        body: (
          <>
            Kidding. It is one email address, going into one list, and I do not even have it yet —
            confirm the link in your inbox or this entire exchange was performance art. While you
            are here: if there was something you actually wanted,{' '}
            <a href={`mailto:${PERSON.email}`}>reply to me directly</a> or{' '}
            <a href="/contact">book a call</a>. I read everything.
          </>
        ),
        kicker: 'Payment for the labour of typing your own email address:',
      },
      confirmed: {
        title: (
          <>
            Confirmed. You are on the list<span className="accent">.</span>
          </>
        ),
        body: (
          <>
            Formally: one (1) email address acquired, zero (0) sold onward, an unsubscribe link in
            every send. You will hear from me when I have something worth the interruption. Sooner,
            if you need it — <a href={`mailto:${PERSON.email}`}>email me</a> or{' '}
            <a href="/contact">book a call</a>.
          </>
        ),
        kicker: 'Signing bonus, payable in cookie:',
      },
    }[state]

    return (
      <section className={`subscribe subscribe--result subscribe--${state}`} id="subscribe">
        <div className="subscribe__copy">
          <h2 className="subscribe__title">{panel.title}</h2>
          <p className="subscribe__lede">{panel.body}</p>
          <p className="subscribe__lede">{panel.kicker}</p>
        </div>

        <figure className="fortune">
          <Cookie />
          <blockquote className="fortune__text">{fortune}</blockquote>
          <figcaption className="mono">Not a fortune. An observation.</figcaption>
        </figure>
      </section>
    )
  }

  return (
    <section className="subscribe" id="subscribe">
      <div className="subscribe__copy">
        <h2 className="subscribe__title">Notes from the build</h2>
        <p className="subscribe__lede">
          Occasional writing on product ownership, shipping AI features, and building from Lagos.
          No cadence promises, no forwarding your address anywhere.
        </p>
      </div>

      <form className="subscribe__form" onSubmit={submit} noValidate>
        <label className="mono subscribe__label" htmlFor={`${id}-email`}>
          Email
        </label>
        <div className="subscribe__row">
          <input
            id={`${id}-email`}
            className="subscribe__input"
            type="email"
            name="email"
            value={email}
            required
            autoComplete="email"
            spellCheck={false}
            placeholder="you@company.com"
            aria-describedby={`${id}-status`}
            onChange={(e) => {
              setEmail(e.target.value)
              if (state === 'error') setState('idle')
            }}
          />
          <button className="subscribe__button" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Subscribe'}
          </button>
        </div>
        <p
          id={`${id}-status`}
          className={`subscribe__status ${state === 'error' ? 'is-error' : ''}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </form>
    </section>
  )
}
