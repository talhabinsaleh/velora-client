import type { NextConfig } from "next";

// The Express API. Locally it runs on port 5000.
const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // The browser only talks to this website. Any /api route that Next.js does not handle itself
  // (Better Auth and the session token live here) is passed on to Express. Because of that the
  // HTTP-only JWT cookie is first-party and there are no CORS problems in production.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }],
    };
  },
};

export default nextConfig;
