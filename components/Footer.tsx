import Link from 'next/link'
import { PERSON } from '@/lib/content'
import { LocalTime } from './Chrome'

export function Footer() {
  const socials = [
    { label: 'GitHub', href: PERSON.socials.github },
    { label: 'LinkedIn', href: PERSON.socials.linkedin },
    { label: 'X / Twitter', href: PERSON.socials.x },
  ].filter((s) => s.href)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__big">Let&rsquo;s talk</div>
        <div className="footer__top">
          <div style={{ maxWidth: '34ch' }}>
            <div className="mono" style={{ marginBottom: '0.8rem' }}>
              {PERSON.title} · {PERSON.location}
            </div>
            <p className="dim" style={{ lineHeight: 1.6 }}>{PERSON.tagline}</p>
          </div>
          <nav className="footer__nav">
            <div className="footer__col">
              <span className="mono">Pages</span>
              <Link href="/work">Work</Link>
              <Link href="/about">About</Link>
              <Link href="/writing">Writing</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer__col">
              <span className="mono">Elsewhere</span>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
              <a href={`mailto:${PERSON.email}`}>Email</a>
            </div>
          </nav>
        </div>
        <div className="footer__bottom">
          <LocalTime />
          <span className="mono">© {new Date().getFullYear()} {PERSON.name}</span>
          <span className="mono">Built with an unreasonable amount of springs</span>
        </div>
      </div>
    </footer>
  )
}
