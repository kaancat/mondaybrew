import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure dev and Vercel use the same project root for file tracing
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },
  i18n: {
    locales: ["da", "en"],
    defaultLocale: "da",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
