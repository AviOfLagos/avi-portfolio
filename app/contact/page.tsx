import type { Metadata } from 'next'
import { PERSON } from '@/lib/content'
import { Reveal, FadeUp, Magnetic } from '@/components/motion-primitives'
import { LocalTime } from '@/components/Chrome'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${PERSON.name} — ${PERSON.email}`,
}

export default function ContactPage() {
  const socials = [
    { label: 'GitHub', value: '@avioflagos', href: PERSON.socials.github },
    { label: 'LinkedIn', value: PERSON.socials.linkedin ? 'Connect' : 'Coming soon', href: PERSON.socials.linkedin },
    { label: 'X / Twitter', value: PERSON.socials.x ? 'Follow' : 'Coming soon', href: PERSON.socials.x },
  ]

  return (
    <>
      <section className="container page-head contact-hero">
        <h1 className="contact__title">
          <Reveal>Let&rsquo;s build</Reveal>
          <Reveal delay={0.1}>
            something <span className="accent">absurd</span>
          </Reveal>
        </h1>
        <p className="page-head__lede" style={{ marginInline: 'auto', textAlign: 'center' }}>
          Product work, fractional product ownership, or just a conversation about something
          you&rsquo;re building. I read everything.
        </p>

        <div
          style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Magnetic strength={0.45}>
            <a className="magnetic-cta" href={`mailto:${PERSON.email}`}>
              {PERSON.email}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
              </svg>
            </a>
          </Magnetic>
          {PERSON.calendly && (
            <a className="cta-ghost" href={PERSON.calendly} target="_blank" rel="noreferrer">
              Book a session ↗
            </a>
          )}
        </div>

        <FadeUp delay={0.1}>
          <div className="contact-grid">
            <div className="contact-cell">
              <div className="mono">Email</div>
              <div className="contact-cell__value">
                <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
              </div>
            </div>
            <div className="contact-cell">
              <div className="mono">Phone</div>
              <div className="contact-cell__value">
                <a href={`tel:${PERSON.phone.replace(/\s/g, '')}`}>{PERSON.phone}</a>
              </div>
            </div>
            {socials.map((s) => (
              <div className="contact-cell" key={s.label}>
                <div className="mono">{s.label}</div>
                <div className="contact-cell__value">
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.value} ↗
                    </a>
                  ) : (
                    <span className="dim">{s.value}</span>
                  )}
                </div>
              </div>
            ))}
            <div className="contact-cell">
              <div className="mono">Based in</div>
              <div className="contact-cell__value">{PERSON.location}</div>
            </div>
            <div className="contact-cell">
              <div className="mono">Local time</div>
              <div className="contact-cell__value">
                <LocalTime />
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  )
}
