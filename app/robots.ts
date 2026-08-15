import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Open to everything, including AI crawlers — the goal here is to be found and
 * cited, not to hold content back. Named agents are listed explicitly so the
 * intent survives anyone later tightening the wildcard rule.
 */
const AI_AGENTS = [
  'GPTBot', // OpenAI, training
  'OAI-SearchBot', // OpenAI, ChatGPT search index
  'ChatGPT-User', // OpenAI, live fetch on a user's behalf
  'ClaudeBot', // Anthropic, training
  'Claude-User', // Anthropic, live fetch on a user's behalf
  'Claude-SearchBot', // Anthropic, search index
  'PerplexityBot', // Perplexity index
  'Perplexity-User', // Perplexity, live fetch
  'Google-Extended', // Gemini training / grounding
  'Applebot-Extended', // Apple Intelligence
  'meta-externalagent', // Meta AI
  'Bytespider', // ByteDance
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // The API surface has nothing to index and costs crawl budget.
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
