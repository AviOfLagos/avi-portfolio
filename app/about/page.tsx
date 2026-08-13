import type { Metadata } from 'next'
import Link from 'next/link'
import { PERSON, EXPERIENCE, SKILLS, EDUCATION, CERTIFICATIONS, STATS } from '@/lib/content'
import { Reveal, FadeUp, StatValue, Magnetic } from '@/components/motion-primitives'

export const metadata: Metadata = {
  title: 'About',
  description: PERSON.summary,
}

export default function AboutPage() {
  return (
    <>
      <section className="container page-head">
        <h1 className="page-head__title">
          <Reveal>About</Reveal>
        </h1>
        <p className="page-head__lede">{PERSON.summary}</p>
      </section>

      <section className="section--tight container">
        <div className="prose" style={{ maxWidth: '68ch' }}>
          <FadeUp>
            <p>
              I&rsquo;m a product owner and technical product manager based in Lagos, working with
              teams across Toronto, New York and Berlin. My background is split down the middle —
              electrical engineering, then computer science, then four years of shipping products —
              and that split is basically the job description.
            </p>
          </FadeUp>
          <FadeUp delay={0.06}>
            <p>
              In practice that means I can sit in a technical design review and a pricing
              conversation on the same afternoon, and translate faithfully in both directions. I
              write the roadmap and the acceptance criteria. I also open Figma and the codebase when
              a spec is faster to settle with a prototype than a paragraph.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>
              Most of my recent work is AI products: an orchestration platform for marketing teams, a
              registry that lets agents install new capabilities, a voice AI that runs first-round
              interviews. Before that, marketplaces — real estate, then solar. The thread is the
              same: take something people currently do with spreadsheets, phone calls and hope, and
              make it a product.
            </p>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p>
              Alongside client and venture work I mentor product managers at HNG, Africa&rsquo;s
              largest tech internship programme, where I&rsquo;ve helped shape curriculum and success
              metrics for thousands of participants and run the community events that go with it.
              Teaching the fundamentals is the fastest way I know to keep re-checking my own.
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
              Experience<span className="accent">.</span>
            </Reveal>
          </h2>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((r, i) => (
            <FadeUp key={r.company + r.period} delay={i * 0.04}>
              <div className="timeline__item">
                <div>
                  <div className="timeline__company">{r.company}</div>
                  <div className="mono" style={{ marginTop: '0.5rem' }}>{r.period}</div>
                  <div className="mono" style={{ marginTop: '0.3rem' }}>{r.meta}</div>
                </div>
                <div>
                  <div className="timeline__title">{r.title}</div>
                  <ul className="timeline__points">
                    {r.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
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
        <div className="card-grid">
          {SKILLS.map((g, i) => (
            <FadeUp key={g.group} delay={i * 0.05}>
              <div className="card" style={{ height: '100%' }}>
                <div className="mono" style={{ marginBottom: '1rem' }}>{g.group}</div>
                <div className="chips">
                  {g.items.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="card-grid">
          <FadeUp>
            <div className="card" style={{ height: '100%' }}>
              <div className="mono" style={{ marginBottom: '1rem' }}>Education</div>
              {EDUCATION.map((e) => (
                <div key={e.school} style={{ marginBottom: '1rem' }}>
                  <h3>{e.school}</h3>
                  <p>{e.detail}</p>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.06}>
            <div className="card" style={{ height: '100%' }}>
              <div className="mono" style={{ marginBottom: '1rem' }}>Certifications</div>
              {CERTIFICATIONS.map((c) => (
                <div key={c.name} style={{ marginBottom: '1rem' }}>
                  <h3>{c.name}</h3>
                  <p>{c.issuer}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section container contact-hero">
        <h2 className="contact__title">
          <Reveal>Work with me</Reveal>
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
