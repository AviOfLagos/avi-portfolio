export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tag: string
  draft: boolean
  body: string[]
}

// Drafts written from your real experience — edit the voice, keep or bin the takes.
export const POSTS: Post[] = [
  {
    slug: 'prototype-before-prd',
    title: 'I ship the prototype before the PRD',
    excerpt:
      'A document describes an argument. A prototype ends it. Why the fastest way to align a team is usually to build the smallest possible version of the disagreement.',
    date: '2026-07-18',
    readingTime: '4 min',
    tag: 'Process',
    draft: true,
    body: [
      'The standard order is requirements, then design, then build. It survives because it looks responsible on a Gantt chart. In practice it front-loads the most expensive kind of work — writing precise specifications for a thing nobody has seen yet — and defers the cheapest source of truth until the end.',
      'When two people on a team disagree about a feature, they are almost never disagreeing about the words. They are disagreeing about a picture in their head. You can spend two days sharpening the document and still ship the wrong thing, because both of them read the same sentence and saw different products.',
      'So I build the disagreement. Not the feature — the disagreement. The narrowest clickable thing that makes the two mental models visibly different. It usually takes an afternoon. It almost always ends the argument in the first ten minutes of the next call, and the PRD that follows is short, specific and uncontested.',
      'This is not an argument against writing. The document still gets written, and it gets written better, because by then it is describing something real instead of proposing something imagined. Acceptance criteria written after a prototype are testable. Acceptance criteria written before one are wishes.',
      'The failure mode to watch for is the prototype that becomes the product by accident. Prototypes are arguments, not architecture. Once the argument is settled, throw it away and build the thing properly — the two hours you spent are already paid back by the two weeks you did not spend building consensus in a comment thread.',
    ],
  },
  {
    slug: 'ai-onboarding-lesson',
    title: 'Cutting onboarding time by 60% was not an AI problem',
    excerpt:
      'We put AI-driven search into an onboarding flow and completion time dropped by more than half. The interesting part is what the AI was actually fixing.',
    date: '2026-06-02',
    readingTime: '5 min',
    tag: 'Case notes',
    draft: true,
    body: [
      'The brief was to reduce drop-off during onboarding. The obvious read was that onboarding was too long, so we should cut steps. We measured first, and the data said something less convenient: people were not quitting because the flow was long. They were quitting at the exact moments where they had to go and find an answer somewhere else.',
      'Every one of those moments was a question the product could have answered but did not. What does this field mean. Does this apply to me. What happens if I skip it. Each one sent the user out of the flow, into a help centre or a Slack message to a colleague, and a meaningful share of them never came back.',
      'Adding AI-driven knowledge search inside the flow cut completion time by 60–70% and lifted retention by roughly a quarter. But it would be lazy to file that under "AI works". What actually happened is that we removed the exit. The AI was a delivery mechanism for answers that already existed in our documentation — it just put them where the question was being asked.',
      'That reframing matters for what you build next. If you believe AI fixed onboarding, your roadmap fills up with more AI. If you believe the exits were the problem, you start auditing every flow in the product for the moments where users have to leave to keep going — and you find that most of them do not need a model at all. Some need a tooltip.',
      'The general lesson I keep relearning: instrument the exact step where people leave, not the funnel in aggregate. Aggregate numbers tell you that something is wrong. Step-level numbers tell you what to build. The second one is the only one you can act on before Friday.',
    ],
  },
  {
    slug: 'remote-team-four-timezones',
    title: 'Running a product team across four time zones',
    excerpt:
      'Toronto, New York, Berlin, Lagos. What actually holds a distributed team together is not the standup — it is what you write down when nobody is in the room.',
    date: '2026-04-22',
    readingTime: '4 min',
    tag: 'Teams',
    draft: true,
    body: [
      'A distributed team has one real constraint: the number of hours where everybody is awake at once is small, and it shrinks every time you add a city. Most teams respond by defending that overlap fiercely and filling it with meetings. That is backwards. The overlap is your scarcest resource, and you should spend almost none of it on status.',
      'Status is asynchronous by nature. It is a fact about the past. If someone has to be awake to hear it, you have designed the system wrong. What genuinely needs synchronous time is disagreement — the moments where two people need to hear each other think. Everything else is a written artefact with a link.',
      'The practical version: standups become written entries against tasks, with a hard rule that a blocked item names what it is blocked on and who can unblock it. The live call is reserved for the two or three things that are actually contested that week. Sprint boards carry the decisions, not just the tickets, because the person reading them at 6am in Lagos cannot ask a follow-up question until tomorrow.',
      'The failure mode is invisible and slow. Someone gets blocked at the end of their day, writes it in a channel nobody owns, and loses twenty-four hours. Do that three times in a sprint and you have lost a week without a single visible mistake. This is why blockers get a status, an owner and a named dependency — not a message.',
      'What you gain is worth the discipline. A team that writes properly can hand work around the clock instead of stopping at the end of one shift. But it only works if the writing is genuinely good, and that is a standard you have to hold every single week, because it decays the moment you let it.',
    ],
  },
]

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)
