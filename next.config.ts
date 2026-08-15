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
      { protocol: "https", hostname: "s3-alpha.figma.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "s3-figma-hubfile-images-production-cdn-cgi.figma.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
