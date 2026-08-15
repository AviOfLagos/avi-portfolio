import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // package-lock.json above the repo root would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1440, 1920],
    imageSizes: [72, 112, 128, 256, 340],
    // Article and resource thumbnails are hosted by the platforms that publish them.
    remotePatterns: [
      { protocol: "https", hostname: "cdn-images-1.medium.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pinimg.com", pathname: "/**" },
    ],
  },
  async headers() {
    // 'unsafe-inline' on scripts is unavoidable without a nonce: Next inlines its
    // bootstrap and the streamed RSC payload. Everything else is locked down, so
    // an injected <script src> from another origin still cannot run.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn-images-1.medium.com https://i.pinimg.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      // No third party may embed the site, so an overlay cannot trick a visitor
      // into clicking something they cannot see.
      "frame-ancestors 'none'",
      "frame-src 'none'",
      "object-src 'none'",
      // Stops an injected <base> tag repointing every relative URL on the page.
      "base-uri 'self'",
      // The signup form can only post back to us.
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Never let a signup response sit in a shared cache.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
