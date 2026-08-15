import type { Metadata } from 'next'
import { ContactPageLd, BreadcrumbLd } from '@/components/StructuredData'
import { PERSON } from '@/lib/content'
import { Reveal, FadeUp, Magnetic } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import { LocalTime } from '@/components/LocalTime'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${PERSON.name}, ${PERSON.email}`,
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact', description: `Get in touch with ${PERSON.name}`, url: '/contact' },
}

export default function ContactPage() {
  const socials = [
    { label: 'GitHub', value: '@avioflagos', href: PERSON.socials.github },
    { label: 'LinkedIn', value: 'Connect', href: PERSON.socials.linkedin },
    { label: 'X / Twitter', value: '@avioflagos', href: PERSON.socials.x },
    { label: 'Figma', value: 'Community', href: PERSON.socials.figma },
    { label: 'Medium', value: 'Read', href: PERSON.socials.medium },
    { label: 'Dev.to', value: 'Read', href: PERSON.socials.devto },
  ]

  return (
    <>
      <ContactPageLd />
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />
      <section className="container page-head contact-hero">
        <h1 className="contact__title">
          <Reveal><HoverLetters text="Let’s build" /></Reveal>
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
          <a className="cta-ghost" href={PERSON.booking.intro.url} target="_blank" rel="noreferrer">
            {PERSON.booking.intro.label} · {PERSON.booking.intro.duration} ↗
          </a>
          <a className="cta-ghost" href={PERSON.booking.consult.url} target="_blank" rel="noreferrer">
            {PERSON.booking.consult.label} ↗
          </a>
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
