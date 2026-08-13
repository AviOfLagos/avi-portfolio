export const PERSON = {
  name: 'David "Avi" Olatunji',
  shortName: 'Avi',
  initials: 'DO',
  title: 'Product Owner',
  secondaryTitle: 'Technical Product Manager',
  location: 'Lagos, Nigeria',
  timezone: 'Africa/Lagos',
  email: 'avi@nexprove.com',
  phone: '+234 817 045 8819',
  calendly: '', // TODO: paste your Calendly link here
  socials: {
    github: 'https://github.com/avioflagos',
    linkedin: '', // TODO
    x: '', // TODO
  },
  tagline:
    'I turn fuzzy ideas into products people actually use — and run the teams that ship them.',
  summary:
    'Product Owner and technical PM with 4+ years leading AI and marketplace products from first sketch to launch. I write the roadmap, prototype the thing, and keep engineering, design and business pointed at the same outcome.',
}

export type Venture = {
  slug: string
  name: string
  tag: string
  year: string
  color: string
  glyph: string
  url: string
  role: string
  oneLiner: string
  desc: string
  context: string
  contributions: string[]
  outcomes: { value: string; label: string }[]
  stack: string[]
  featured: boolean
}

export const VENTURES: Venture[] = [
  {
    slug: 'ellum-ai',
    name: 'Ellum AI',
    tag: 'AI Marketing OS',
    year: '2024 —',
    color: '#c8ff3e',
    glyph: 'E/',
    url: 'https://ellum.ai',
    role: 'Technical Product Manager & Product Owner',
    oneLiner: 'An AI operating system for marketing teams.',
    desc:
      'An AI operating system for marketing — an orchestrator that delegates to agents, skills and tools to plan, draft and publish content across every social platform.',
    context:
      'Small marketing teams drown in the gap between strategy and execution. They know what they want to say; they do not have the hours to plan a calendar, draft for six platforms, and publish on schedule. Generic AI writing tools made the drafting marginally faster and left every other part of the job untouched.',
    contributions: [
      'Owned the product from discovery through MVP and into a V2 architecture defined across eleven milestones and seven epics.',
      'Re-architected the content engine from single-shot prompting to an orchestrator model that routes work to specialised agents, skills and tools.',
      'Designed an AI-enabled onboarding flow that captures brand identity, goals, tone and audience as structured context every downstream agent can use.',
      'Specified the social infrastructure rewrite — LinkedIn, TikTok and YouTube integrations with per-user resource allocation to dodge shared API rate limits.',
      'Ran the pilot with roughly 50 users, converted feedback into prioritised iterations, and produced the investor-ready materials that supported fundraising.',
      'Led a distributed team of eight across backend, frontend, design, QA and marketing on a weekly standup and sprint cadence.',
    ],
    outcomes: [
      { value: '~50', label: 'pilot users onboarded' },
      { value: '11', label: 'V2 milestones scoped and sequenced' },
      { value: '8', label: 'person team coordinated remotely' },
    ],
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Agent orchestration', 'MCP', 'Notion', 'Linear'],
    featured: true,
  },
  {
    slug: 'deepellum',
    name: 'DeepEllum',
    tag: 'AI Capability Registry',
    year: '2025 —',
    color: '#b197fc',
    glyph: 'D∞',
    url: 'https://deepellum.ai',
    role: 'Product Owner',
    oneLiner: 'The registry where AI agents, skills and tools live.',
    desc:
      'The registry where AI agents, skills, tools and MCPs live — install capabilities into Ellum AI or any third-party platform from one marketplace.',
    context:
      'Every AI platform was rebuilding the same capabilities in-house. Adding a new tool meant shipping core platform code. We wanted capability to be something you install, not something you rebuild — and we wanted that registry to serve more than one product.',
    contributions: [
      'Defined the registry model that treats agents, skills, tools, CLIs, MCPs and integrations as one installable resource class.',
      'Specified how Ellum AI consumes capabilities over a connection to DeepEllum rather than storing them locally, so agents can be upgraded without touching core code.',
      'Scoped subscription-aware installation, so what an agent can do maps to what the customer actually pays for.',
      'Designed a monitoring agent that scans other AI platforms for new capabilities and logs them for an administrator to review — with the legal review step built into the flow, not bolted on.',
    ],
    outcomes: [
      { value: '6', label: 'resource types unified in one registry' },
      { value: '3rd', label: 'party platforms supported by design' },
    ],
    stack: ['Next.js', 'MCP', 'FastAPI', 'PostgreSQL'],
    featured: true,
  },
  {
    slug: 'vettika',
    name: 'Vettika',
    tag: 'Voice-AI Hiring',
    year: '2026',
    color: '#66e0ff',
    glyph: 'V…',
    url: 'https://vettika.com',
    role: 'Product Owner',
    oneLiner: 'First-round interviews on autopilot.',
    desc:
      'A voice AI runs 12-minute adaptive screens, scores against your rubric, and hands candidates their own transcript. No black-box rejections.',
    context:
      'First-round screening is the most repetitive hour in hiring and the least fair to candidates. Recruiters lose days to scheduling; applicants get rejected by systems they cannot see. One-way video tools solved the recruiter half and made the candidate half worse.',
    contributions: [
      'Framed the product around a two-sided promise: recruiters get their time back, candidates get their transcript and score.',
      'Specified the adaptive interview loop — real conversation with follow-ups, not a fixed question list read at a camera.',
      'Defined rubric-based scoring so every candidate is measured against the same stated criteria, and made the report shareable with the candidate by default.',
      'Built compliance into the spec from day one for NYC Local Law 144 and EU requirements, rather than retrofitting it.',
      'Chose pay-as-you-go with three free interviews to remove the trial barrier for small teams.',
    ],
    outcomes: [
      { value: '12 min', label: 'per screening call' },
      { value: '3', label: 'free interviews before payment' },
      { value: '100%', label: 'of candidates receive their transcript' },
    ],
    stack: ['Next.js', 'Voice AI', 'Rubric scoring engine', 'Vercel'],
    featured: true,
  },
  {
    slug: 'solarbuilders',
    name: 'SolarBuilders',
    tag: 'Solar Marketplace',
    year: '2026',
    color: '#ffb340',
    glyph: 'S☀',
    url: 'https://solarbuilders.ng',
    role: 'Product Owner',
    oneLiner: "Nigeria's first verified solar marketplace.",
    desc:
      'Homeowners size their system on a free calculator, then get matched with vetted installers across the country.',
    context:
      'Nigerian homeowners going solar face two unknowns at once: what system they actually need, and which installer will not disappear after taking a deposit. The market had directories and it had vendors. It did not have verification, and it did not have a sizing tool anyone would trust.',
    contributions: [
      'Built the funnel around a free sizing calculator — answer the technical question first, earn the right to make the match second.',
      'Defined the verification standard that separates a listed builder from a vetted one, since the whole proposition rests on it.',
      'Ran founding supply-side outreach to established Nigerian solar companies to seed the directory with credible installers.',
      'Positioned free listings for builders to solve the cold-start problem before charging anyone.',
    ],
    outcomes: [
      { value: 'Free', label: 'calculator as the top of funnel' },
      { value: '1st', label: 'verified solar marketplace in Nigeria' },
    ],
    stack: ['Next.js', 'Sizing calculator', 'Supabase', 'Vercel'],
    featured: true,
  },
  {
    slug: 'nexprove',
    name: 'Nexprove',
    tag: 'Product Studio',
    year: '2022 —',
    color: '#ff7a59',
    glyph: 'N×',
    url: 'https://nexprove.com',
    role: 'Technical Product Manager & Co-founder',
    oneLiner: 'From MVP to scale, across four cities.',
    desc:
      'A product development studio taking startups from MVP to scale — AI, design and engineering across Toronto, New York, Berlin and Lagos.',
    context:
      'Early-stage teams rarely need a full department. They need someone who can hold discovery, delivery and go-to-market at once, then hand back something maintainable. Nexprove exists to be that team on demand.',
    contributions: [
      'Spearheaded multiple client projects from discovery through MVP delivery, shaping roadmaps and go-to-market strategy.',
      'Introduced product processes and design systems that measurably reduced iteration time across client engagements.',
      'Mentored junior project and product managers on prioritisation and planning at execution scale.',
      'Served as the link between leadership and product teams, turning company strategy into plans people could actually run.',
    ],
    outcomes: [
      { value: '4', label: 'cities: Toronto, NY, Berlin, Lagos' },
      { value: '5+', label: 'products shipped under the studio' },
    ],
    stack: ['React', 'Next.js', 'Tailwind', 'Supabase', 'FastAPI'],
    featured: true,
  },
]

export type Archive = {
  name: string
  tag: string
  year: string
  note: string
  url: string
}

export const ARCHIVE: Archive[] = [
  {
    name: 'Rides.co',
    tag: 'Mobility · Product Manager',
    year: '2025',
    note:
      'Rebuilt onboarding around AI-driven knowledge search — completion time down 60–70%, retention up ~25%.',
    url: '',
  },
  {
    name: 'Inspekta',
    tag: 'Real Estate · MVP',
    year: '2024',
    note: 'Remote property inspections — clients preview properties before physical visits.',
    url: '',
  },
  {
    name: 'Fintrove',
    tag: 'Fintech · Prototype',
    year: '2025',
    note: 'Fundraising prototypes that positioned the platform for early-stage investment conversations.',
    url: '',
  },
  {
    name: 'Simoles',
    tag: 'Web3 · Messaging & DEX',
    year: '2024',
    note: 'Directed Web3 MVP delivery for messaging DApps and a trading platform built for community adoption.',
    url: '',
  },
  {
    name: 'Creo Builders',
    tag: 'Web3 · Product & Docs',
    year: '2025',
    note: 'Product documentation and landing pages aligning marketing with product vision.',
    url: '',
  },
  {
    name: 'Landpropy',
    tag: 'Real Estate · Marketplace',
    year: '2022–23',
    note: 'Full real estate marketplace MVP plus a scalable Figma design system that cut handoff friction.',
    url: '',
  },
  {
    name: 'EVUSA',
    tag: 'B2B · Product & Design',
    year: '2023–24',
    note: 'Design prototypes, onboarding strategy and product-market-fit recommendations for B2B partnerships.',
    url: '',
  },
]

export type Role = {
  company: string
  title: string
  period: string
  meta: string
  points: string[]
}

export const EXPERIENCE: Role[] = [
  {
    company: 'HNG',
    title: 'Product Coordinator & PM Mentor',
    period: 'Jul 2023 — Present',
    meta: 'Remote',
    points: [
      "Co-led strategic planning and ideation for multiple cohorts of Africa's largest tech internship programme, defining objectives, curriculum structure and success metrics for thousands of participants.",
      'Mentored aspiring product managers through the full lifecycle — roadmaps, MVP definition, agile sprints and stakeholder expectations.',
      'Coordinated a large distributed team of engineers, designers and mentors to keep programme delivery aligned.',
      'Directed large-scale community events end to end, including the annual HNG Mentors Hangout and finalist meetups.',
    ],
  },
  {
    company: 'Nexprove Agency',
    title: 'Technical Product Manager & Co-founder',
    period: 'Jun 2022 — Present',
    meta: 'Remote',
    points: [
      'Spearheaded multiple projects from discovery through MVP delivery, shaping roadmaps and go-to-market strategy.',
      'Introduced product processes and design systems that reduced project iteration time for clients.',
      'Mentored junior project and product managers on prioritisation and planning at scale.',
      'Acted as the key link between leadership and product teams to turn strategy into actionable plans.',
    ],
  },
  {
    company: 'Rides.co',
    title: 'Product Manager',
    period: 'Feb 2025 — May 2025',
    meta: 'San Francisco · Remote contract',
    points: [
      'Partnered with stakeholders to define the product roadmap and release plans, aligning business goals with development priorities.',
      'Translated roadmap initiatives into smaller actionable tasks, improving delivery speed and transparency.',
      'Optimised the onboarding flow with AI-driven knowledge search, cutting completion time by 60–70% and improving retention by roughly 25%.',
    ],
  },
  {
    company: 'EVUSA',
    title: 'Product Manager & Designer',
    period: 'Oct 2023 — Jan 2024',
    meta: 'Texas · Remote contract',
    points: [
      'Translated product vision into design prototypes for the technical team.',
      'Defined onboarding strategies and product-market-fit recommendations that positioned the product for B2B partnerships.',
      'Advised founders on scaling strategy and technical recruitment.',
    ],
  },
  {
    company: 'Landpropy',
    title: 'Product Manager & Designer',
    period: 'Aug 2022 — Sep 2023',
    meta: 'Remote · Full-time',
    points: [
      'Facilitated cross-functional alignment, ensuring a smooth transition from design to code.',
      'Designed and delivered a complete real estate marketplace MVP with near-perfect completion rates.',
      'Developed scalable Figma design systems, reducing handoff friction for developers.',
    ],
  },
  {
    company: 'Reposebay HR',
    title: 'Product Experience Manager',
    period: 'Jul 2022 — Sep 2022',
    meta: 'Onsite · Internship',
    points: [
      'Conducted user research and streamlined onboarding workflows, improving customer retention.',
      'Implemented analytics practices, enabling structured data collection for product decisions.',
    ],
  },
]

export const SKILLS = [
  { group: 'Product', items: ['Roadmapping', 'Backlog grooming', 'Prioritisation', 'MVP definition', 'Agile / Scrum', 'Stakeholder management'] },
  { group: 'Research & Design', items: ['User research', 'Technical prototyping', 'Figma', 'Framer', 'Webflow', 'Design systems'] },
  { group: 'Engineering', items: ['React', 'Next.js', 'FastAPI', 'PostgreSQL', 'Firebase', 'MongoDB', 'Docker', 'Git'] },
  { group: 'Operations', items: ['Remote team leadership', 'Budget management', 'Logistics & ops', 'Community engagement', 'Linear', 'Notion'] },
]

export const EDUCATION = [
  { school: 'MIVA University', detail: 'Computer Science' },
  { school: 'Yaba College of Technology', detail: 'Electrical Engineering' },
]

export const CERTIFICATIONS = [
  { name: 'Software Product Management', issuer: 'University of Alberta (Coursera)' },
  { name: 'Human Computer Interaction', issuer: 'Interaction Design Foundation' },
  { name: 'UX Design & Research', issuer: 'Google' },
  { name: 'Docker & Kubernetes', issuer: 'HNG Advanced' },
]

export const STATS = [
  { value: 4, suffix: '+', label: 'Years leading product' },
  { value: 12, suffix: '', label: 'Products shipped' },
  { value: 8, suffix: '', label: 'People led across teams' },
  { value: 4, suffix: '', label: 'Cities the studio runs in' },
]
