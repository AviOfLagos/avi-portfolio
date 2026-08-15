export type OpenSourceProject = {
  slug: string
  name: string
  tagline: string
  description: string
  repo: string
  live?: string
  stack: string[]
  topics: string[]
  stars: number
  language: string
  license: string | null
  hasReadme: boolean
  contributionNote: string
  category: 'Developer tool' | 'AI agent' | 'Demo' | 'Automation'
}

// Data gathered from the GitHub API on 2026-08-15. Star counts and licence
// fields reflect what GitHub reported at that point; `license` is null where
// GitHub detected no LICENSE file, even if a README badge claims one.
export const openSourceProjects: OpenSourceProject[] = [
  {
    slug: 'mcp-coding-assistant',
    name: 'MCP Coding Assistant',
    tagline:
      'MCP server that feeds project documentation to a coding agent so its suggestions stay grounded.',
    description:
      'An MCP (Model Context Protocol) server built for the Cline coding agent. It loads documentation from a project\'s docs directory or from URLs, vectorises it, and answers the agent\'s questions from that index instead of from memory. It also scans the codebase to detect languages, frameworks and libraries in use, then pulls in official docs links for what it finds. The aim is to cut down on invented APIs and on the loop where an agent keeps re-fixing the same bug.',
    repo: 'https://github.com/AviOfLagos/MCP-coding-assistant',
    stack: ['JavaScript', 'TypeScript', 'Node.js', 'MCP', 'OpenAI embeddings', 'Docker'],
    topics: [],
    stars: 15,
    language: 'JavaScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'Two issues are open. The documentation loader in src/ is the easiest place to start — adding support for a new documentation source or a new technology detector is self-contained work.',
    category: 'Developer tool',
  },
  {
    slug: 'roomkit',
    name: 'roomKit',
    tagline:
      'Voice and video rooms where humans and AI agents join through the same API, with LiveKit handling WebRTC.',
    description:
      'A call platform for people building voice agents, meeting bots or transcription tools who do not want to run an SFU or deal with ICE, codecs and TURN themselves. Agents connect over a fixed wire contract — 16 kHz mono PCM in 640-byte, 20 ms frames, with a JSON control channel on the same socket — through a Python or Node SDK, or the raw WebSocket. A default agent (Silero VAD, Deepgram, GPT-4o-mini, ElevenLabs) is bundled, and both SDKs ship a SimulatedRoom so agents can be tested without a live call. Also includes a Next.js web client, server-side recording via LiveKit Egress, and a multi-tenant API-key scaffold.',
    repo: 'https://github.com/AviOfLagos/roomKit',
    live: 'https://roomkit-omega.vercel.app',
    stack: ['TypeScript', 'Next.js', 'Fastify', 'Python', 'LiveKit', 'WebRTC', 'Deepgram', 'ElevenLabs'],
    topics: [
      'webrtc',
      'livekit',
      'voice-ai',
      'voice-agents',
      'ai-agents',
      'transcription',
      'speech-to-text',
      'text-to-speech',
      'call-platform',
      'nextjs',
      'typescript',
      'python',
    ],
    stars: 0,
    language: 'TypeScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'Twelve open issues and the most active repo here — start there. The wire contract lives in packages/shared/src/wire.ts and is mirrored in every SDK, so a new SDK in another language is a well-specified piece of work.',
    category: 'Developer tool',
  },
  {
    slug: 'openadapter',
    name: 'OpenAdapter',
    tagline:
      'Local server that exposes the Claude.ai web interface as an OpenAI-compatible chat completions API.',
    description:
      'Runs a Chromium browser with a persistent profile via Playwright, so it reuses an existing claude.ai login rather than an API key. It accepts OpenAI-format requests at /v1/chat/completions, types the prompt into the web UI, polls the DOM for the reply, converts the HTML to Markdown and returns it — streaming over SSE when asked. File attachments are supported. It works with anything that speaks the OpenAI chat format, including OpenClaw and Continue.dev. Being browser automation, it is inherently sensitive to changes in Claude\'s web UI.',
    repo: 'https://github.com/AviOfLagos/openAdapter',
    stack: ['JavaScript', 'Node.js', 'Express', 'Playwright', 'Chromium'],
    topics: [
      'ai-proxy',
      'api-proxy',
      'browser-automation',
      'claude-ai',
      'llm-api',
      'openai-api',
      'openai-compatible',
      'playwright-automation',
      'self-hosted',
    ],
    stars: 2,
    language: 'JavaScript',
    license: 'MIT License',
    hasReadme: true,
    contributionNote:
      'Eight issues are open. Because it scrapes a live UI, DOM selector breakage is the recurring maintenance task — reproducing and fixing a selector is a good first contribution.',
    category: 'Developer tool',
  },
  {
    slug: 'marketing-agency-skill',
    name: 'Virtual Marketing Agency Skill',
    tagline:
      'A Claude Code skill that runs seven named marketing agents with memory and a shared task queue.',
    description:
      'Rather than one-off prompts, this sets up a persistent team on disk: seven agents (writer, social, SEO, outreach, creative, analytics, technical lead), each with short- and long-term memory files. Agents pull work from a shared goal tree, trigger each other through an event system, and take their tone from a single brand-voice file. A setup script installs it into .claude/skills and adds commands like /heartbeat for syncing agent state and reporting status. Everything is markdown files and shell scripts — no service to run.',
    repo: 'https://github.com/AviOfLagos/marketing-agency-skill',
    stack: ['Shell', 'Markdown', 'Claude Code skills'],
    topics: [],
    stars: 1,
    language: 'Shell',
    license: null,
    hasReadme: true,
    contributionNote:
      'No open issues. Adding an eighth agent is the clearest contribution: copy an existing agent\'s markdown definition and memory files, then register it in SKILL.md and setup.sh.',
    category: 'AI agent',
  },
  {
    slug: 'prism-studio',
    name: 'PRISM Studio',
    tagline: 'Browser-based editor for design tokens that exports to CSS, Tailwind, SCSS or DTCG JSON.',
    description:
      'A design system studio where you configure colours, typography, shape, spacing, shadows and effects through an interactive drawer and export the result in a format you can drop into a codebase. The original working version is a single-file vanilla HTML/JS prototype, kept in /legacy; the repo is a milestone-by-milestone rebuild of it in Next.js with TypeScript, Tailwind and Zustand. The public README is still the default create-next-app text, so the project notes in CLAUDE.md are the real reference.',
    repo: 'https://github.com/AviOfLagos/prism-studio',
    live: 'https://prism-ds.vercel.app/',
    stack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Zustand'],
    topics: [],
    stars: 0,
    language: 'TypeScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'No open issues. Replacing the placeholder README with a real one is the most useful first PR; after that, porting a remaining panel from the legacy prototype to the Next.js app is well-defined work.',
    category: 'Developer tool',
  },
  {
    slug: 'local-media-router',
    name: 'local-media-router',
    tagline: 'Repository name and description do not match its current contents.',
    description:
      'The GitHub description describes an RTMP stream relay for local deployment with multi-stream support and OBS integration, but no such code is in the repository. What is actually committed is a marketing workspace — a CLAUDE.md and a marketing/ directory of skill configuration for an unrelated product. GitHub detects no source languages here. Listed for completeness rather than as usable software.',
    repo: 'https://github.com/AviOfLagos/local-media-router',
    stack: [],
    topics: [],
    stars: 0,
    language: 'None detected',
    license: null,
    hasReadme: true,
    contributionNote:
      'Nothing to build against yet. The repo needs either the RTMP relay code its description promises or a description that matches what is there.',
    category: 'Demo',
  },
  {
    slug: 'brandagi',
    name: 'BrandAGI',
    tagline: 'Multi-agent pipeline that turns a brand brief into a strategy and scheduled social content.',
    description:
      'Eleven agents run in sequence: one ingests brand documents and URLs into embeddings, others research the industry and competitors, assemble a brand profile, then propose three content strategies (safe, balanced, bold). The strategy step pauses for a human to approve before a writer agent produces long-form articles and a repurpose agent cuts them into Twitter threads, LinkedIn posts and Instagram captions. A scheduler agent lays the output onto a publishing calendar. Built on Next.js and the Vercel AI SDK.',
    repo: 'https://github.com/AviOfLagos/brandAGI',
    // Homepage listed on GitHub (brandagi.vercel.app) returns 404 as of 2026-08-15, so no live link.
    stack: ['TypeScript', 'Next.js', 'Vercel AI SDK'],
    topics: ['ai', 'agent', 'branding', 'orchestration'],
    stars: 1,
    language: 'TypeScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'No open issues. The deployment behind the listed homepage is down — getting it running again, or documenting local setup so others can, is the practical entry point.',
    category: 'AI agent',
  },
  {
    slug: 'ai-overflow-clone',
    name: 'AI Overflow',
    tagline: 'Stack Overflow-style Q&A site aimed at people debugging AI coding tools.',
    description:
      'A Next.js and TypeScript MVP of a question-and-answer board where developers post and troubleshoot problems hit while working with AI coding assistants. Scope is limited to the core ask/answer flow with mock authentication and shareable links; there is no real auth or persistence layer described. The README is the unmodified create-next-app template, so the deployed demo is the best way to see what it does.',
    repo: 'https://github.com/AviOfLagos/AI-OVERFLOW-CLONE',
    live: 'https://aiflow-seven.vercel.app',
    stack: ['TypeScript', 'Next.js', 'React'],
    topics: [],
    stars: 0,
    language: 'TypeScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'No open issues. Swapping the mock auth for a real provider is the obvious next step, and the placeholder README needs replacing.',
    category: 'Demo',
  },
  {
    slug: 'ai-charades-game',
    name: 'Context Charades',
    tagline: 'Charades game where the prompts are generated by Gemini at play time.',
    description:
      'A React, TypeScript and Vite front end with a small Node and Express backend. The backend exposes one endpoint, POST /api/generate-charades, which calls the Gemini API to produce the items to act out; the front end runs the round. Configuration is two environment variables, a Gemini API key and a model name. The repo has no GitHub description, so the README and the deployed build are the only documentation.',
    repo: 'https://github.com/AviOfLagos/ai-charades-game',
    live: 'https://ai-charades-game.vercel.app',
    stack: ['TypeScript', 'React', 'Vite', 'Node.js', 'Express', 'Gemini API'],
    topics: [],
    stars: 0,
    language: 'TypeScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'No open issues. The generation endpoint is a single Express handler, so changing prompt categories or difficulty levels touches very little code.',
    category: 'Demo',
  },
  {
    slug: 'google-meet-recording-organizer',
    name: 'Google Meet Recording Organizer',
    tagline: 'Apps Script that files Meet recordings and transcripts into per-calendar Drive folders by date.',
    description:
      'A Google Apps Script that watches the default Drive location for new Meet recordings, matches each one to the calendar event it came from, and moves the recording along with its transcript and generated notes into a folder for that calendar, under a dated subfolder. A connected Google Sheet lists which calendars map to which folders and doubles as the log. Recordings it cannot match go to an /Unknown folder. It runs on a time-based trigger and caches state in ScriptProperties to stay within API rate limits.',
    repo: 'https://github.com/AviOfLagos/AUTOMATION-google-calender-and-meet-automation',
    stack: ['Google Apps Script', 'JavaScript', 'Google Drive API', 'Google Calendar API', 'Google Sheets'],
    topics: [],
    stars: 0,
    language: 'JavaScript',
    license: null,
    hasReadme: true,
    contributionNote:
      'No open issues. The README claims MIT but no LICENSE file is committed — adding one is a one-file PR. Beyond that, the matching logic for unscheduled recordings is the part most likely to need work.',
    category: 'Automation',
  },
]

export default openSourceProjects
