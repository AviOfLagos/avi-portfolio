export const PERSON = {
  name: "David Olatunji",
  shortName: "Avi",
  /** Every name people actually search for. Feeds schema.org alternateName,
   *  metadata keywords and llms.txt, so "Avi of Lagos" and the handle resolve
   *  to the same person as the legal name. */
  aliases: ["Avi", "Avi of Lagos", "AviOfLagos", "avioflagos", "David Avi Olatunji"],
  site: "avi.nexprove.com",
  initials: "Avi",
  title: "Technical Product Manager",
  secondaryTitle: "Product Owner",
  location: "Lagos, Nigeria",
  timezone: "Africa/Lagos",
  email: "avi@nexprove.com",
  phone: "+234 817 045 8819",
  /** Shown in the footer next to the booking CTA. Keep it accurate — a stale
   *  availability line is worse than none at all. */
  availability: "Available for Q4 2026",
  // Cal.com booking links, surfaced on /contact.
  booking: {
    intro: {
      url: "https://cal.com/avichukwu/15min",
      label: "Intro call",
      duration: "15 min",
    },
    consult: {
      url: "https://cal.com/avichukwu/consultat",
      label: "Consultation",
      duration: "60 min",
    },
  },
  socials: {
    github: "https://github.com/avioflagos",
    linkedin: "https://linkedin.com/in/avioflagos",
    x: "https://x.com/avioflagos",
    figma: "https://www.figma.com/@avioflagos",
    medium: "https://medium.com/@avioflagos",
    devto: "https://dev.to/avioflagos",
  },
  tagline:
    "I turn fuzzy ideas into products people actually use, and run the teams that ship them.",
  // Portrait shown on /about and reused for the about OG card.
  portrait: "/gallery/avi-portrait.webp",
  summary:
    "Technical Product Manager and Product Owner with 5+ years taking AI, SaaS, fintech and marketplace products from ambiguous problem to shipped release. I own the full arc: discovery, PRDs and technical specifications, backlog and acceptance criteria, release planning. I also build working prototypes, so a contested spec gets settled with something clickable instead of another document.",
};

export type Venture = {
  slug: string;
  name: string;
  tag: string;
  year: string;
  color: string;
  glyph: string;
  /** What the thing runs on, so a reader knows before they click. */
  platform:
    | "Web app"
    | "Web + PWA"
    | "Mobile app iOS + Android"
    | "Web + mobile apps"
    | "Marketplace"
    | "Platform";
  /** The market it competes in, in the reader's words. */
  niche: string;
  /** Real product screenshot. Omit and <Cover> draws a generated one from the slug. */
  cover?: string;
  /**
   * Extra shots for the case study, newest first. Drop files into
   * public/shots/<slug>/ and list them here.
   */
  gallery?: { src: string; caption: string }[];
  url: string;
  role: string;
  oneLiner: string;
  desc: string;
  context: string;
  contributions: string[];
  outcomes: { value: string; label: string }[];
  stack: string[];
  featured: boolean;
};

export const VENTURES: Venture[] = [
  {
    slug: "ellum-ai",
    name: "Ellum AI",
    tag: "AI Marketing OS",
    year: "2024 -",
    color: "#c8ff3e",
    glyph: "E/",
    platform: "Web + mobile apps",
    niche: "Marketing automation · AI agents",
    cover: "/shots/ellum-ai.webp",
    url: "https://www.ellum.ai",
    role: "Technical Product Manager & Product Owner",
    oneLiner: "An AI operating system for marketing teams.",
    desc: "An AI operating system for marketing: an orchestrator that delegates to agents, skills and tools to plan, draft and publish content across every social platform.",
    context:
      "Small marketing teams drown in the gap between strategy and execution. They know what they want to say; they do not have the hours to plan a calendar, draft for six platforms, and publish on schedule. Generic AI writing tools made the drafting marginally faster and left every other part of the job untouched.",
    contributions: [
      "Owned the product from discovery through MVP and into a V2 architecture defined across eleven milestones and seven epics.",
      "Re-architected the content engine from single-shot prompting to an orchestrator model that routes work to specialised agents, skills and tools.",
      "Designed an AI-enabled onboarding flow that captures brand identity, goals, tone and audience as structured context every downstream agent can use.",
      "Specified the social infrastructure rewrite covering LinkedIn, TikTok and YouTube integrations with per-user resource allocation to dodge shared API rate limits.",
      "Ran the pilot with roughly 50 users, converted feedback into prioritised iterations, and produced the investor-ready materials that supported fundraising.",
      "Led a distributed team of eight across backend, frontend, design, QA and marketing on a weekly standup and sprint cadence.",
    ],
    outcomes: [
      { value: "~50", label: "pilot users onboarded" },
      { value: "11", label: "V2 milestones scoped and sequenced" },
      { value: "8", label: "person team coordinated remotely" },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Agent orchestration",
      "MCP",
      "Vercel",
      "Linear",
      "Notion",
    ],
    featured: true,
  },
  {
    slug: "mottars",
    name: "Mottars",
    tag: "Auto Marketplace",
    year: "Nov 2025 —",
    color: "#b197fc",
    glyph: "M⌁",
    platform: "Web + PWA",
    niche: "Automotive · Cars, parts and repairers · Nigeria",
    cover: "/shots/mottars.webp",
    url: "https://mottars.com",
    role: "Product Owner & Product Manager",
    oneLiner: "Buy or rent cars, source parts, find repairers.",
    desc: "Nigeria's automotive marketplace across the whole ownership chain: buying or renting a vehicle, sourcing parts, and finding a verified repairer. Installable to the home screen, so it behaves like an app without an app store.",
    context:
      "Buying a used car in Nigeria means running three separate hunts at once: the car, the parts it will need, and someone trustworthy to fit them. Each one happens in a different place — dealer lots, WhatsApp groups, a mechanic someone vouched for — and none of them carry any verification you can check. Mottars puts the three in one product and makes the verification the thing you are actually buying.",
    contributions: [
      "Owned the product direction: what shipped next, what got upgraded, and what was deliberately left out. Held the backlog and used it to keep scope creep off a roadmap that four different user types were all pulling at.",
      "Specified the four-sided model — buyers, dealers, parts sellers and auto repairers — so each side has its own reason to show up rather than one audience carrying the marketplace.",
      "Defined the trust layer that the proposition rests on: dealer verification, vehicle history reports covering accidents, ownership and service records, and direct support when a deal goes sideways.",
      "Specified the search model across brand, region, vehicle type, price band and year, covering sixteen Nigerian cities, plus a request-a-car flow so demand with no matching listing still reaches verified dealers.",
      "Scoped the commercial mechanics buyers actually needed here: direct offers and negotiation, and split payment plans, because full price up front rules out most of the market.",
      "Hired and ran a beta tester cohort alongside QA, and combined their findings with heuristic evaluation and user research into one prioritised fix list — polish, corrections and gaps that only show up in the field.",
      "Reviewed and tested each release myself before sign-off, so what shipped matched what was specified.",
    ],
    outcomes: [
      {
        value: "4",
        label: "sides served: buyers, dealers, parts sellers, repairers",
      },
      { value: "16", label: "Nigerian cities covered at launch" },
      {
        value: "3",
        label: "feedback streams merged into one fix list: QA, beta, research",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PWA / service worker",
      "Vercel",
      "Verification workflow",
      "Vehicle history reports",
      "Split payments",
    ],
    featured: true,
  },
  {
    slug: "vettika",
    name: "Vettika",
    tag: "Voice-AI Hiring",
    year: "2026",
    color: "#66e0ff",
    glyph: "V…",
    platform: "Web app",
    niche: "Hiring · Voice AI screening",
    cover: "/shots/vettika.webp",
    url: "https://vettika.com",
    role: "Product Owner",
    oneLiner: "First-round interviews on autopilot.",
    desc: "A voice AI runs 12-minute adaptive screens, scores against your rubric, and hands candidates their own transcript. No black-box rejections.",
    context:
      "First-round screening is the most repetitive hour in hiring and the least fair to candidates. Recruiters lose days to scheduling; applicants get rejected by systems they cannot see. One-way video tools solved the recruiter half and made the candidate half worse.",
    contributions: [
      "Framed the product around a two-sided promise: recruiters get their time back, candidates get their transcript and score.",
      "Specified the adaptive interview loop: a real conversation with follow-ups, not a fixed question list read at a camera.",
      "Defined rubric-based scoring so every candidate is measured against the same stated criteria, and made the report shareable with the candidate by default.",
      "Built compliance into the spec from day one for NYC Local Law 144 and EU requirements, rather than retrofitting it.",
      "Chose pay-as-you-go with three free interviews to remove the trial barrier for small teams.",
    ],
    outcomes: [
      { value: "12 min", label: "per screening call" },
      { value: "3", label: "free interviews before payment" },
      { value: "100%", label: "of candidates receive their transcript" },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "LiveKit",
      "Speech-to-text / TTS",
      "Rubric scoring engine",
      "Vercel",
    ],
    featured: true,
  },
  {
    slug: "solarbuilders",
    name: "SolarBuilders",
    tag: "Solar Marketplace",
    year: "2026",
    color: "#ffb340",
    glyph: "S☀",
    platform: "Marketplace",
    niche: "Renewable energy · Nigeria",
    cover: "/shots/solarbuilders.webp",
    url: "https://solarbuildersng.com",
    role: "Product Owner",
    oneLiner: "Nigeria's first verified solar marketplace.",
    desc: "Homeowners size their system on a free calculator, then get matched with vetted installers across the country.",
    context:
      "Nigerian homeowners going solar face two unknowns at once: what system they actually need, and which installer will not disappear after taking a deposit. The market had directories and it had vendors. It did not have verification, and it did not have a sizing tool anyone would trust.",
    contributions: [
      "Built the funnel around a free sizing calculator: answer the technical question first, earn the right to make the match second.",
      "Defined the verification standard that separates a listed builder from a vetted one, since the whole proposition rests on it.",
      "Ran founding supply-side outreach to established Nigerian solar companies to seed the directory with credible installers.",
      "Positioned free listings for builders to solve the cold-start problem before charging anyone.",
    ],
    outcomes: [
      { value: "Free", label: "calculator as the top of funnel" },
      { value: "1st", label: "verified solar marketplace in Nigeria" },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Sizing calculator",
      "Vercel",
    ],
    featured: true,
  },
  {
    slug: "breadcrumbs",
    name: "Breadcrumbs",
    tag: "Walking Companion",
    year: "May 2026 —",
    color: "#ff7a59",
    glyph: "B∙",
    platform: "Mobile app iOS + Android",
    niche: "Navigation · Personal safety, offline-first",
    cover: "/shots/breadcrumbs.webp",
    url: "https://www.breadcrumbstrail.com",
    role: "Product Owner & Product Manager",
    oneLiner: "Drops a trail as you walk. Walks you back along it.",
    desc: "A walking companion that records the way you came and returns you along it turn by turn, with voice guidance. No account, works offline, and your trail stays on the phone. Android is live; iOS is in build.",
    context:
      "Every navigation app answers 'how do I get there'. Almost none answer 'how do I get back', which is the question that matters on an unlit street, a ridge line, or a run you improvised. The ones that come close want an account, a signal and your location history. Breadcrumbs refuses all three and still has to be genuinely useful — that constraint is the product.",
    contributions: [
      "Owned product direction and the backlog: what got built next, what got upgraded, and what was cut to keep the promise simple enough to state in one sentence.",
      "Held the line on scope. An offline, account-free app attracts feature requests that quietly require a server; each one got measured against the covenant before it entered the backlog.",
      "Specified the return itself: turns derived from the recorded route's geometry rather than the compass, so guidance never flips left and right on a stationary phone.",
      "Defined the safety layer as separate escalating pieces — a check-in timer, safe zones that notice when you leave, a buddy that speaks up when a walk goes quiet, and an SOS with a five-second cancel so a pocket press cannot arm it.",
      "Scoped per-person sharing levels inside a circle (live location, status only, or last known position), so sharing is a dial rather than an on/off switch.",
      "Specified the watch companion around a single question — which way home and how far — with SOS one tap away, leaving the heavy work on the phone.",
      "Ran user research on the return journey itself, watching where people lose confidence in a route they have already walked, and fed it straight into how guidance is phrased and timed.",
      "Ran QA and structured testing across the four ways people actually use it — walking, running, hiking and cycling — and reviewed each build against the spec before sign-off.",
      "Turned heuristic evaluation and tester feedback into a prioritised fix list rather than a bug pile, so polish and real gaps got sequenced against each other.",
    ],
    outcomes: [
      { value: "0", label: "accounts, servers or trackers required" },
      { value: "4", label: "escalation stages: timer, zones, buddy, SOS" },
      { value: "5s", label: "to cancel an SOS before it arms" },
    ],
    stack: [
      "Android",
      "iOS (in build)",
      "Watch companion",
      "On-device storage",
      "Offline routing",
      "Voice guidance",
    ],
    featured: true,
  },
];

export type Archive = {
  name: string;
  tag: string;
  year: string;
  note: string;
  url: string;
};

export const ARCHIVE: Archive[] = [
  {
    name: "Rides.co",
    tag: "Mobility · Product Manager",
    year: "2025",
    note: "Rebuilt onboarding around AI-driven knowledge search; completion time down 60 to 70%, retention up ~25%.",
    url: "https://rides.co/",
  },
  {
    name: "BlueTide Group",
    tag: "Sustainability · Digital product",
    year: "2025",
    note: "Digital product and web platform for a North American re-refiner producing sustainable base and process oils.",
    url: "https://www.bluetidegroup.com/",
  },
  {
    name: "Simoles",
    tag: "Web3 · Messaging & DEX",
    year: "2024",
    note: "Directed Web3 MVP delivery for messaging DApps and a trading platform built for community adoption.",
    url: "https://simoles.vercel.app/",
  },
  {
    name: "Creo Builders",
    tag: "Web3 · Product & Docs",
    year: "2025",
    note: "Product documentation and landing pages aligning marketing with product vision.",
    url: "",
  },
  {
    name: "EVUSA",
    tag: "B2B · Product & Design",
    year: "2023-24",
    note: "Design prototypes, onboarding strategy and product-market-fit recommendations for B2B partnerships.",
    url: "https://evusa.vercel.app/",
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  meta: string;
  points: string[];
};

export const EXPERIENCE: Role[] = [
  {
    company: "Ellum AI",
    title: "Technical Product Manager & Product Owner",
    period: "2024 - Present",
    meta: "Remote · AI SaaS",
    points: [
      "Own the product end to end for an AI marketing platform, from the original pilot through a V2 architecture scoped across 11 milestones and 7 epics.",
      "Re-architected the content engine from single-shot prompting to an orchestrator that routes work to specialised agents, skills and tools, so new capabilities ship without changes to the core platform.",
      "Defined an MCP-compatible capability registry (DeepEllum) covering agents, skills, tools, CLIs and integrations, with subscription-aware installation so entitlements map to what customers pay for.",
      "Specified an AI-enabled onboarding flow capturing brand identity, goals and audience as structured context for every downstream agent, plus a social publishing rewrite across LinkedIn, TikTok and YouTube.",
      "Ran the pilot with ~50 users, converted feedback into a prioritised roadmap, and produced the investor-ready materials used in fundraising conversations.",
      "Lead a distributed team of 8 across backend, frontend, design, QA and marketing on a weekly sprint and standup cadence.",
    ],
  },
  {
    company: "Nexprove Agency",
    title: "Technical Product Manager & Product Owner",
    period: "Jun 2022 - Dec 2025",
    meta: "Remote · Full-time",
    points: [
      "Led 6+ client products across AI, fintech, real estate and Web3 from discovery to MVP, owning roadmaps, requirements and go-to-market.",
      "Introduced product processes and design systems that cut design iteration time by ~40%, improving delivery velocity across engagements.",
      "Translated client business goals into PRDs, functional and technical requirements, user stories and acceptance criteria that engineering could execute without rework.",
      "Scoped a cross-border remittance platform for African corridors covering multi-currency wallets, partner-first PSP routing with fallback, a double-entry ledger, tiered KYC and AML screening.",
      "Built stakeholder relationships that influenced company-level strategy, and mentored junior PMs and designers.",
    ],
  },
  {
    company: "HNG",
    title: "Product Coordinator & PM Mentor",
    period: "Jul 2023 - Apr 2026",
    meta: "Remote · Volunteer",
    points: [
      "Led product coordination and mentorship across 30,000+ participants annually in Africa's largest tech internship programme, enforcing agile standards and improving delivery efficiency by ~50%.",
      "Currently restructuring the product-education model around AI-native product engineering, defining an AI Product Engineer curriculum spanning frontend, backend, DevOps, AI-assisted development and post-launch maintenance.",
      "Facilitated strategy co-creation with senior stakeholders, driving organisational alignment.",
      "Directed large-scale community events end to end, including the annual HNG Mentors Hangout and finalist meetups.",
    ],
  },
  {
    company: "Rides.co",
    title: "Product Manager",
    period: "Feb 2025 - May 2025",
    meta: "San Francisco · Remote contract",
    points: [
      "Led a redesign of onboarding around AI-driven knowledge search, cutting completion time by 60 to 70% and increasing retention by ~25%.",
      "Partnered with stakeholders to define the product roadmap and release plans, aligning business goals with development priorities.",
      "Translated roadmap initiatives into actionable engineering tasks, improving delivery speed and transparency.",
    ],
  },
  {
    company: "Others — early career",
    title: "Product Manager · Designer",
    period: "2022 - 2024",
    meta: "Zuri · Reposebay HR · EVUSA",
    points: [
      "EVUSA (Texas, remote contract): turned product vision into design prototypes for engineering, defined onboarding strategy and product-market-fit recommendations that positioned the product for B2B partnerships, and advised founders on scaling and technical recruitment.",
      "Zuri and Reposebay HR: contributed to SaaS and marketplace MVPs through user research, UX design and agile delivery, and introduced analytics practices so product decisions ran on structured data.",
      "Built scalable Figma design systems across these engagements, reducing handoff friction for developers.",
    ],
  },
];

export const SKILLS = [
  {
    group: "Product & Delivery",
    items: [
      "Roadmapping",
      "PRDs / FRDs / TRDs",
      "Backlog management",
      "Acceptance criteria",
      "Agile / Scrum",
      "Jira",
      "Linear",
      "Notion",
    ],
  },
  {
    group: "AI",
    items: [
      "LLM applications",
      "AI agents",
      "MCP",
      "Agent orchestration",
      "Retrieval",
      "Browser automation",
      "Speech-to-text / TTS",
    ],
  },
  {
    group: "Design & Research",
    items: [
      "Figma",
      "User research",
      "Information architecture",
      "Wireframing",
      "Prototyping",
      "Usability testing",
      "Design systems",
    ],
  },
  {
    group: "Engineering",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
      "Vercel",
    ],
  },
];

export const EDUCATION = [
  { school: "MIVA University", detail: "Computer Science" },
  { school: "Yaba College of Technology", detail: "Electrical Engineering" },
];

export type Certification = {
  name: string;
  issuer: string;
  /**
   * Scan of the certificate, shown in the modal. Drop the file into
   * public/certificates/ and point at it. Nothing is scanned yet, so every
   * entry currently falls back to the placeholder in <CertificationList>.
   */
  image?: string;
};

export const CERTIFICATIONS: Certification[] = [
  { name: "Software Product Management", issuer: "University of Alberta" },
  {
    name: "Human Computer Interaction",
    issuer: "Interaction Design Foundation",
  },
  { name: "UX Design & Research", issuer: "Google" },
  { name: "Docker & Kubernetes", issuer: "HNG Advanced" },
];

export const STATS = [
  { value: 4, suffix: "+", label: "Years leading product" },
  { value: 6, suffix: "+", label: "Client products led" },
  { value: 8, suffix: "", label: "People led across teams" },
  { value: 30000, suffix: "+", label: "Participants reached at HNG" },
];
