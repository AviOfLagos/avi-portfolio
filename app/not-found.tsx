import type { Metadata } from 'next'
import Link from 'next/link'
import { PERSON } from '@/lib/content'
import { RequestedPath, ShortcutKey } from '@/components/Missing'

export const metadata: Metadata = {
  title: 'Not found',
  description: 'That page does not exist.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="container oops">
      <p className="oops__code" aria-hidden="true">
        404
      </p>

      <h1 className="oops__title">
        This page got descoped<span className="accent">.</span>
      </h1>

      <p className="oops__lede">
        It was in the backlog. It had an owner. Then a quarter happened. Either the URL is wrong, or
        I moved something and did not leave a redirect, which is my fault and not yours.
      </p>

      <RequestedPath />

      <nav className="oops__links" aria-label="Where to go instead">
        <Link className="cta-solid" href="/work">
          See the work
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
          </svg>
        </Link>
        <Link className="cta-ghost" href="/">
          Back to the start
        </Link>
      </nav>

      <ul className="oops__list">
        <li>
          <Link href="/writing">Writing</Link> — notes on product, AI and shipping from Lagos
        </li>
        <li>
          <Link href="/about">About</Link> — the four-year version
        </li>
        <li>
          <Link href="/contact">Contact</Link> — or <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a> if
          you were looking for something specific
        </li>
      </ul>

      <p className="mono oops__hint">
        Tip: press <ShortcutKey /> and search for it. That works better than guessing URLs.
      </p>
    </section>
  )
}
