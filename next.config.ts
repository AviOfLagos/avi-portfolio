import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // package-lock.json above the repo root would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["motion"],
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
