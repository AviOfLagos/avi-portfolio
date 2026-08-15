import { ImageResponse } from 'next/og'
import { POSTS } from '@/lib/posts'
import { PERSON } from '@/lib/content'

/**
 * Per-post social card. Generated at build time, one per article, so a shared
 * link shows the post's own title instead of the generic site card — and so
 * BlogPosting has a real `image`, which Article rich results require.
 */

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Article card'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

const INK = '#f2f2ef'
const MUTED = '#8b8b93'
const ACCENT = '#c8ff3e'
const BG = '#0a0a0c'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)

  const title = post?.title ?? 'Writing'
  const meta = post
    ? `${post.tag} · ${post.readingTime} · ${new Date(post.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`
    : PERSON.title

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: BG,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: ACCENT,
              color: BG,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            a
          </div>
          <div style={{ color: MUTED, fontSize: 24, letterSpacing: 2 }}>NOTES FROM THE BUILD</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: INK,
              fontSize: title.length > 52 ? 62 : 76,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          <div style={{ color: MUTED, fontSize: 26, marginTop: 28 }}>{meta}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Satori needs an explicit display on any element with more than
              one child, so this row is a flex container rather than inline. */}
          <div style={{ display: 'flex', gap: 10, color: INK, fontSize: 26 }}>
            <span>{PERSON.name}</span>
            <span style={{ color: MUTED }}>({PERSON.shortName})</span>
          </div>
          <div style={{ color: ACCENT, fontSize: 24 }}>avi.nexprove.com</div>
        </div>
      </div>
    ),
    size,
  )
}
