/**
 * Fixed-window rate limiter held in module memory.
 *
 * Deliberately modest about what it is: serverless instances are not shared, so
 * a determined attacker spread across many cold starts gets more than the
 * nominal budget. It still shuts down the case that actually matters here —
 * one client hammering the signup endpoint to make us send confirmation mail to
 * addresses that never asked for it, which is how a sending domain ends up on a
 * blocklist. A shared store (Redis/KV) is the upgrade if this ever gets abused
 * in earnest.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 5_000

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()

  // Opportunistic sweep; without it the map is an unbounded memory leak on a
  // long-lived instance, which is its own denial of service.
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
    if (buckets.size > MAX_KEYS) buckets.clear()
  }

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds }
  }
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds }
}

/**
 * Client address from the proxy headers Vercel sets. `x-forwarded-for` is
 * attacker-supplied in general, so this is a speed bump rather than identity —
 * but on Vercel the leftmost entry is set by the platform, not the caller.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
