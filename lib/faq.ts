/**
 * FAQ content, kept here rather than in the page so the same answers can feed
 * the JSON-LD, llms.txt and any future assistant context without drifting
 * apart.
 *
 * Answers are plain strings on purpose: FAQPage schema wants text, and anything
 * with markup has to be stripped before it goes into JSON-LD.
 */

export type Faq = {
  /** Stable anchor, so a single answer can be linked directly. */
  id: string
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    id: 'what-work',
    question: 'What kind of work do you take on?',
    answer:
      'Product ownership and technical product management, usually on something with real ambiguity in it: an AI product finding its shape, a marketplace that has to earn trust on both sides, a platform being rebuilt rather than patched. I am most useful between the idea and the first shipped version, where the job is deciding what to build, in what order, and what to leave out.',
  },
  {
    id: 'engagement-type',
    question: 'Are you available full-time, contract, or fractional?',
    answer:
      'All three, depending on the problem. Fractional product ownership works well for teams with engineers but no one holding the roadmap. Contract suits a defined push — a discovery phase, an MVP, a rebuild. Full-time is open for the right product. Availability is listed in the footer of this site and kept current; if it is stale, say so and I will fix it.',
  },
  {
    id: 'process',
    question: 'What does your process look like on a new product?',
    answer:
      'Understand the problem before writing anything down, then get to something clickable fast. I write the roadmap, the PRD, the acceptance criteria and the release plan, but I try to settle contested decisions with a prototype rather than another round of documents. From there it is a weekly cadence: backlog, sprint, review, and a running fight against scope creep.',
  },
  {
    id: 'do-you-code',
    question: 'Do you write code, or only specs?',
    answer:
      'Both, with a clear line between them. I prototype in Next.js and TypeScript when a spec is faster to settle as working code than as a paragraph, and I can hold a technical design review honestly. I do not take production engineering off your team; the prototypes are arguments, not architecture.',
  },
  {
    id: 'rates',
    question: 'What are your rates?',
    answer:
      'They depend on the shape of the engagement — scope, duration, and whether it is fractional, contract or full-time. The fastest route to a real number is a 15-minute intro call: tell me what you are building and I will quote against it rather than against a rate card that fits nobody.',
  },
  {
    id: 'where-based',
    question: 'Where are you based, and which timezones do you work across?',
    answer:
      'Lagos, Nigeria, on West Africa Time. I have worked with teams in Toronto, New York and Berlin, which in practice means an overlap window with both North America and Europe on the same day. Written handover matters more than meeting count when the team is spread; that is the part I hold.',
  },
  {
    id: 'existing-team',
    question: 'Can you work with an existing team, or do you need to build one?',
    answer:
      'An existing team is the easier start — I have led distributed teams across backend, frontend, design, QA and marketing, and slotting into that is normal. I have also hired testers and specialists when a product needed coverage it did not have. Either way I would rather strengthen the team you have than replace it.',
  },
  {
    id: 'ai-products',
    question: 'How much of your work is AI, really?',
    answer:
      'Most of the recent work: an orchestration platform for marketing teams, a capability registry that lets agents install new tools, a voice AI that runs first-round interviews. The useful part is rarely the model. It is deciding what the model is allowed to do, what happens when it is wrong, and which parts of the job should never have been a model in the first place.',
  },
  {
    id: 'mentoring',
    question: 'Do you mentor, or speak?',
    answer:
      'Yes to both. I run product coordination and mentorship at HNG, one of the largest tech internship programmes in Africa, and I have run community events end to end. If you are organising something and want a product session that is not a recruiting pitch, get in touch.',
  },
]
