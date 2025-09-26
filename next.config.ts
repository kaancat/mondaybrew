import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["da", "en"],
    defaultLocale: "da",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
