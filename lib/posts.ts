/**
 * Article bodies are blocks, not bare strings, so a post can carry a subhead,
 * a pull-quote or a diagram without the template guessing.
 * A plain string is shorthand for a paragraph.
 */
export type Block =
  | string
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[] }
  | { type: 'figure'; figure: string; caption: string }

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  tag: string
  draft: boolean
  body: Block[]
}

// Drafts written from your real experience, edit the voice, keep or bin the takes.
export const POSTS: Post[] = [
  {
    slug: 'prototype-before-prd',
    title: 'I ship the prototype before the PRD',
    excerpt:
      'A document describes an argument. A prototype ends it. Why the fastest way to align a team is usually to build the smallest possible version of the disagreement.',
    date: '2026-07-18',
    readingTime: '4 min',
    tag: 'Process',
    draft: false,
    body: [
      'The standard order is requirements, then design, then build. It survives because it looks responsible on a Gantt chart. In practice it front-loads the most expensive kind of work, writing precise specifications for a thing nobody has seen yet, and defers the cheapest source of truth until the end.',
      'When two people on a team disagree about a feature, they are almost never disagreeing about the words. They are disagreeing about a picture in their head. You can spend two days sharpening the document and still ship the wrong thing, because both of them read the same sentence and saw different products.',
      {
        type: 'quote',
        text: 'They are not disagreeing about the words. They are disagreeing about a picture in their head.',
      },
      {
        type: 'figure',
        figure: 'doc-vs-prototype',
        caption: 'Fig. 1, the argument moves to the front, and gets shorter',
      },
      'So I build the disagreement. Not the feature, the disagreement. The narrowest clickable thing that makes the two mental models visibly different. It usually takes an afternoon. It almost always ends the argument in the first ten minutes of the next call, and the PRD that follows is short, specific and uncontested.',
      { type: 'h2', text: 'This is not an argument against writing' },
      'This is not an argument against writing. The document still gets written, and it gets written better, because by then it is describing something real instead of proposing something imagined. Acceptance criteria written after a prototype are testable. Acceptance criteria written before one are wishes.',
      'The failure mode to watch for is the prototype that becomes the product by accident. Prototypes are arguments, not architecture. Once the argument is settled, throw it away and build the thing properly, the two hours you spent are already paid back by the two weeks you did not spend building consensus in a comment thread.',
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
    draft: false,
    body: [
      'The brief was to reduce drop-off during onboarding. The obvious read was that onboarding was too long, so we should cut steps. We measured first, and the data said something less convenient: people were not quitting because the flow was long. They were quitting at the exact moments where they had to go and find an answer somewhere else.',
      'Every one of those moments was a question the product could have answered but did not. What does this field mean. Does this apply to me. What happens if I skip it. Each one sent the user out of the flow, into a help centre or a Slack message to a colleague, and a meaningful share of them never came back.',
      {
        type: 'figure',
        figure: 'search-vs-structure',
        caption: 'Fig. 1, only one step actually moved',
      },
      'Adding AI-driven knowledge search inside the flow cut completion time by 60 to 70% and lifted retention by roughly a quarter. But it would be lazy to file that under "AI works". What actually happened is that we removed the exit. The AI was a delivery mechanism for answers that already existed in our documentation, it just put them where the question was being asked.',
      { type: 'h2', text: 'What you believe decides your roadmap' },
      'That reframing matters for what you build next. If you believe AI fixed onboarding, your roadmap fills up with more AI. If you believe the exits were the problem, you start auditing every flow in the product for the moments where users have to leave to keep going, and you find that most of them do not need a model at all. Some need a tooltip.',
      {
        type: 'list',
        items: [
          'Instrument the step, not the funnel, aggregate numbers only tell you that something is wrong.',
          'Find every point where the product makes a user leave to keep going.',
          'Ask what the exit costs before asking what model would close it. Some of them need a tooltip.',
        ],
      },
      'The general lesson I keep relearning: instrument the exact step where people leave, not the funnel in aggregate. Aggregate numbers tell you that something is wrong. Step-level numbers tell you what to build. The second one is the only one you can act on before Friday.',
    ],
  },
  {
    slug: 'remote-team-four-timezones',
    title: 'Running a product team across four time zones',
    excerpt:
      'Toronto, New York, Berlin, Lagos. What actually holds a distributed team together is not the standup, it is what you write down when nobody is in the room.',
    date: '2026-04-22',
    readingTime: '4 min',
    tag: 'Teams',
    draft: false,
    body: [
      'A distributed team has one real constraint: the number of hours where everybody is awake at once is small, and it shrinks every time you add a city. Most teams respond by defending that overlap fiercely and filling it with meetings. That is backwards. The overlap is your scarcest resource, and you should spend almost none of it on status.',
      'Status is asynchronous by nature. It is a fact about the past. If someone has to be awake to hear it, you have designed the system wrong. What genuinely needs synchronous time is disagreement, the moments where two people need to hear each other think. Everything else is a written artefact with a link.',
      'The practical version: standups become written entries against tasks, with a hard rule that a blocked item names what it is blocked on and who can unblock it. The live call is reserved for the two or three things that are actually contested that week. Sprint boards carry the decisions, not just the tickets, because the person reading them at 6am in Lagos cannot ask a follow-up question until tomorrow.',
      'The failure mode is invisible and slow. Someone gets blocked at the end of their day, writes it in a channel nobody owns, and loses twenty-four hours. Do that three times in a sprint and you have lost a week without a single visible mistake. This is why blockers get a status, an owner and a named dependency, not a message.',
      'What you gain is worth the discipline. A team that writes properly can hand work around the clock instead of stopping at the end of one shift. But it only works if the writing is genuinely good, and that is a standard you have to hold every single week, because it decays the moment you let it.',
    ],
  },
]

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)

/**
 * Articles published on Medium and dev.to. They are linked, never copied — a
 * second full copy here would compete with the original for the same query and
 * split the ranking. `canonical` marks the version to credit when a piece was
 * cross-posted to both platforms.
 */
export type ExternalPost = {
  title: string
  excerpt: string
  date: string
  tag: string
  platform: 'Medium' | 'Dev.to'
  url: string
  canonical?: boolean
}

export const EXTERNAL_POSTS: ExternalPost[] = [
  {
    title: 'How to Create Effective GitHub Issues for Feature Updates',
    excerpt:
      'The issue is the unit of work a team actually reads. What belongs in one, what does not, and why a vague ticket costs more than the feature it describes.',
    date: '2026-08-14',
    tag: 'Process',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/how-to-create-effective-github-issues-for-feature-updates-a8f172989cd0',
  },
  {
    title: 'Breaking the Technical Barriers of Building Internal Tools',
    excerpt:
      'Automating Google Meet recording and filing with Apps Script, so post-meeting admin stops eating the hour after every call. The script is open source.',
    date: '2025-11-10',
    tag: 'Automation',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/breaking-the-technical-barriers-of-building-internal-tools-automating-google-meet-recording-98792424438d',
  },
  {
    title: 'From Prototype to Production: How MCP Servers Transformed My Real Estate Monorepo',
    excerpt:
      'Giving an AI coding agent real tools instead of guesses. What MCP changed about the day-to-day of shipping a monorepo, and where it still gets in the way.',
    date: '2025-10-12',
    tag: 'AI',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/from-prototype-to-production-how-mcp-servers-transformed-my-real-estate-monorepo-development-dc6e4ad55057',
  },
  {
    title: 'Stop Fighting Your Code, Give Your AI a Master Plan Instead',
    excerpt:
      'Type errors and rewrite loops are usually a planning failure, not a model failure. Writing the plan first and letting the agent execute against it.',
    date: '2025-10-12',
    tag: 'AI',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/stop-fighting-your-code-give-your-ai-a-master-plan-instead-a4dbff7e209f',
  },
  {
    title: 'Modern Form Validation with Regex',
    excerpt:
      'The patterns worth memorising, the ones worth looking up, and the validation rules that annoy real users more than they stop bad input.',
    date: '2025-10-12',
    tag: 'Engineering',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/modern-form-validation-with-regex-everything-you-need-80ba1810703f',
  },
  {
    title: 'Create Custom Profile Initial Avatar with Live Preview',
    excerpt:
      'Building initial-based avatars in the browser with a live preview, no image upload and no external service.',
    date: '2025-03-11',
    tag: 'Engineering',
    platform: 'Dev.to',
    url: 'https://dev.to/avioflagos/create-custom-profile-initial-avatar-with-live-preview-58j3',
    canonical: true,
  },
  {
    title: 'Unlocking the Power and Possibilities of Figma Profiles',
    excerpt:
      'What a Figma Community profile is actually for, and how publishing resources changed the way work found me.',
    date: '2024-02-12',
    tag: 'Design',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/unlocking-the-power-possibilities-of-figma-profiles-a-designers-journey-080c84993380',
  },
  {
    title: "Idea: Lawyer's AI Discovery Assistant",
    excerpt:
      'A product sketch for AI-assisted legal discovery, written as a public idea rather than a pitch.',
    date: '2024-06-17',
    tag: 'Ideas',
    platform: 'Medium',
    url: 'https://medium.com/@avioflagos/idea-lawyers-ai-discovery-assistant-eaedb7c020b3',
  },
]
