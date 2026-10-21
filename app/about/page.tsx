import type { Metadata } from 'next'
import { ProfilePageLd, BreadcrumbLd } from '@/components/StructuredData'
import Link from 'next/link'
import Image from 'next/image'
import { PERSON, EXPERIENCE, STATS } from '@/lib/content'
import { Reveal, FadeUp, StatValue, Magnetic } from '@/components/motion-primitives'
import { HoverLetters } from '@/components/HoverLetters'
import { Toolkit } from '@/components/Toolkit'
import { CertificationList } from '@/components/CertificationList'

/** How I work, in the terms I would defend in a review. */
const PHILOSOPHY = [
  {
    title: 'Reimagine, not just automate',
    body: 'Putting an agent on a broken workflow gets you a faster broken workflow. I map the whole thing first, handoffs included, and look for the step that should not exist at all.',
  },
  {
    title: 'Own the agent after launch',
    body: 'Shipping an agent is the start. I track whether people use it, whether its output holds up, and I replace it without sentiment when a better approach shows up.',
  },
  {
    title: 'Settle it with something clickable',
    body: 'A prototype ends an argument that a third document would only extend. If two people read the same spec two ways, I build the smallest version of both and we look at them.',
  },
  {
    title: 'The backlog is the strategy',
    body: 'Everyone agrees with the roadmap deck. What you actually chose is whatever sits at the top of the backlog on Monday, so that is the artefact I guard.',
  },
  {
    title: 'Ship, then look',
    body: 'Research before a release tells you what people say. The week after tells you what they do. I plan for both and weight the second more heavily.',
  },
]

/** Three roles worth the space on a narrative page. The full record is /resume. */
const HIGHLIGHT_COMPANIES = ['Ellum AI', 'Nexprove Agency', 'HNG']
const HIGHLIGHTS = HIGHLIGHT_COMPANIES.map(
  (name) => EXPERIENCE.find((r) => r.company === name)!,
).filter(Boolean)

export const metadata: Metadata = {
  title: 'About',
  description: PERSON.summary,
  alternates: { canonical: '/about' },
  openGraph: { title: `About ${PERSON.name}`, description: PERSON.summary, url: '/about', type: 'profile', images: ['/opengraph-image.png'] },
}

export default function AboutPage() {
  return (
    <>
      <ProfilePageLd />
      <BreadcrumbLd trail={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal><HoverLetters text="About" /></Reveal>
        </h1>
        <p className="page-head__lede">{PERSON.summary}</p>
      </section>

      <section className="section--tight container about-grid">
        <figure className="portrait">
          <Image
            src={PERSON.portrait}
            alt={`${PERSON.name}, photographed in Lagos`}
            width={682}
            height={1024}
            sizes="(max-width: 900px) 100vw, 340px"
            priority
          />
          <figcaption className="mono">{PERSON.location}</figcaption>
        </figure>

        <div className="prose" style={{ maxWidth: '68ch' }}>
          <FadeUp>
            <p>
              I&rsquo;m David Olatunji, though almost everyone calls me Avi — online I&rsquo;m
              AviOfLagos. I lead AI product and AI transformation work from Lagos, with teams across
              Toronto, New York and Berlin. My background is split down the middle:
              electrical engineering, then computer science, then four years of shipping products.
              That split is basically the job description.
            </p>
          </FadeUp>
          <FadeUp delay={0.06}>
            <p>
              In practice that means I can sit with an operations lead to map how their week really
              runs, then go and build the agent that changes it: the skills file, the MCP connection,
              the review step where a human signs off. I hold the roadmap and the success metrics,
              and I open the codebase when that is faster than writing another spec.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>
              Most of my recent work is AI: an orchestration platform for marketing teams, a registry
              that lets agents install new capabilities, a voice AI that runs first-round interviews,
              and the agents that now run sprint planning and reporting at my own studio. Before that, marketplaces, real estate, then solar. The thread is the
              same: take something people currently do with spreadsheets, phone calls and hope, and
              make it a product.
            </p>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p>
              Alongside that I coordinate team leads and mentors at HNG, Africa&rsquo;s largest tech
              internship programme: a volunteer network where nobody reports to me, so everything
              moves by influence. I&rsquo;m leading its shift to AI-native ways of working, from the
              curriculum to the office hours that get people actually using the tools.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="section--tight container">
        <FadeUp>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <StatValue value={s.value} suffix={s.suffix} />
                <div className="mono stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              How I work<span className="accent">.</span>
            </Reveal>
          </h2>
        </div>
        <div className="card-grid">
          {PHILOSOPHY.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.05}>
              <div className="card" style={{ height: '100%' }}>
                <h3>{p.title}</h3>
                <p style={{ marginTop: '0.7rem' }}>{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Where I&rsquo;ve been<span className="accent">.</span>
            </Reveal>
          </h2>
          <p className="mono">Three of them. The full record lives on the résumé.</p>
        </div>
        <div className="timeline">
          {HIGHLIGHTS.map((r, i) => (
            <FadeUp key={r.company} delay={i * 0.04}>
              <div className="timeline__item">
                <div>
                  <div className="timeline__company">{r.company}</div>
                  <div className="mono" style={{ marginTop: '0.5rem' }}>{r.period}</div>
                  <div className="mono" style={{ marginTop: '0.3rem' }}>{r.meta}</div>
                </div>
                <div>
                  <div className="timeline__title">{r.title}</div>
                  <ul className="timeline__points">
                    <li>{r.points[0]}</li>
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link className="cta-ghost" href="/resume">
            Read the full résumé →
          </Link>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Toolkit<span className="accent">.</span>
            </Reveal>
          </h2>
        </div>
        <Toolkit />
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">
            <Reveal>
              Certifications<span className="accent">.</span>
            </Reveal>
          </h2>
          <p className="mono">Click one to see the certificate.</p>
        </div>
        <FadeUp>
          <div className="card">
            <CertificationList />
          </div>
        </FadeUp>
      </section>

      <section className="section container contact-hero">
        <h2 className="contact__title">
          <Reveal><HoverLetters text="Work with me" /></Reveal>
        </h2>
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Magnetic strength={0.45}>
            <Link className="magnetic-cta" href="/contact">
              Get in touch
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
              </svg>
            </Link>
          </Magnetic>
          <Link className="cta-ghost" href="/work">See the work</Link>
        </div>
      </section>
    </>
  )
}
