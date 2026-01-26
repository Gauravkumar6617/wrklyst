import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,

  images: {
    // Standard Remote Patterns for Next.js 16
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  /** * THE TURBOPACK FIX
   * In Next.js 16, Turbopack requires a conditional alias object
   * to correctly "empty" modules for the browser.
   */
  turbopack: {
    resolveAlias: {
      fs: { browser: "./empty.js" },
      path: { browser: "./empty.js" },
      child_process: { browser: "./empty.js" },
      readline: { browser: "./empty.js" },
      process: { browser: "./empty.js" },
    },
  },

  /** * WEBPACK FALLBACK
   * Used for 'next build' and environments where Turbopack is not active.
   */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        child_process: false,
        readline: false,
        process: false,
      };
    }
    return config;
  },
};
