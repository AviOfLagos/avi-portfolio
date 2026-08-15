import Link from 'next/link'
import { PERSON } from '@/lib/content'
import { LocalTime } from './LocalTime'
import { LogoMark } from './Logo'
import { HoverLetters } from './HoverLetters'
import { BackToTop } from './BackToTop'
import { SOCIAL_ICONS, type SocialKey } from './SocialIcons'

export function Footer() {
  // Email lives with the booking CTAs now, so the icon row is socials only.
  const socials = [
    { key: 'github', label: 'GitHub', handle: '@avioflagos', href: PERSON.socials.github },
    { key: 'linkedin', label: 'LinkedIn', handle: 'in/avioflagos', href: PERSON.socials.linkedin },
    { key: 'x', label: 'X', handle: '@avioflagos', href: PERSON.socials.x },
    { key: 'figma', label: 'Figma', handle: 'Community', href: PERSON.socials.figma },
  ].filter((s) => s.href) as { key: SocialKey; label: string; handle: string; href: string }[]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__panel">
          <div className="footer__lead">
            <HoverLetters as="div" className="footer__big" text="Let’s talk" />
            <div className="footer__identity">
              <p className="mono footer__identity-role">
                {PERSON.title} · {PERSON.location}
              </p>
              <p className="footer__identity-line">{PERSON.tagline}</p>
            </div>
            <div className="footer__pitch">
              <span className="status mono">
                <span className="status__dot" />
                {PERSON.availability}
              </span>
              <a className="cta-solid" href={PERSON.booking.intro.url} target="_blank" rel="noreferrer">
                {PERSON.booking.intro.label} · {PERSON.booking.intro.duration}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                </svg>
              </a>
              <a className="footer__email mono" href={`mailto:${PERSON.email}`}>
                {PERSON.email}
              </a>
            </div>
          </div>

          <hr className="footer__rule" />

          <div className="footer__top">
            <nav className="footer__nav">
              <div className="footer__col">
                <span className="mono">Pages</span>
                <Link href="/work">Work</Link>
                <Link href="/about">About</Link>
                <Link href="/writing">Writing</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <div className="footer__col">
                <span className="mono">Resources</span>
                <a href={PERSON.socials.medium} target="_blank" rel="noreferrer">Medium articles</a>
                <a href={PERSON.socials.devto} target="_blank" rel="noreferrer">Dev.to articles</a>
                <a href={PERSON.socials.figma} target="_blank" rel="noreferrer">Figma Community</a>
                <a href={PERSON.socials.github} target="_blank" rel="noreferrer">Open source</a>
                <Link href="/resume">Résumé</Link>
              </div>
              <div className="footer__col">
                <span className="mono">Book a call</span>
                <a href={PERSON.booking.intro.url} target="_blank" rel="noreferrer">
                  {PERSON.booking.intro.label} · {PERSON.booking.intro.duration}
                </a>
                <a href={PERSON.booking.consult.url} target="_blank" rel="noreferrer">
                  {PERSON.booking.consult.label}
                </a>
                <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
              </div>
              <div className="footer__col">
                <span className="mono">Socials</span>
                <ul className="social-list">
                  {socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.key]
                    return (
                      <li key={s.key}>
                        <a className="social-link" href={s.href} target="_blank" rel="noreferrer">
                          <span className="social-link__icon" aria-hidden="true">
                            <Icon />
                          </span>
                          <span className="social-link__label">{s.label}</span>
                          <span className="social-link__handle mono">{s.handle}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>
          </div>

          <div className="footer__bottom">
            <span className="footer__brand">
              <LogoMark size={22} />
              <LocalTime />
            </span>
            <span className="mono">© {new Date().getFullYear()} {PERSON.name}</span>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
