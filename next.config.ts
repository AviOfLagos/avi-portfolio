import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // package-lock.json above the repo root would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  poweredByHeader: false,
  images: {
    // Every image is local, so only the served formats and breakpoints matter.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1440, 1920],
    imageSizes: [72, 112, 128, 256, 340],
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
