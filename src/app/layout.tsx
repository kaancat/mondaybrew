import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { heywow, sailec } from "@/fonts";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GA } from "@/components/shared/ga";
import NavDebug from "@/components/dev/nav-debug.client";
import { JsonLd } from "@/components/shared/json-ld";
import { jsonLd } from "@/lib/jsonld";
import { ThemeProvider } from "@/components/shared/theme-provider";
import TokenDump from "@/components/dev/token-dump.client";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "mondaybrew — Websites, Webapps & PPC",
    template: "%s — mondaybrew",
  },
  description: "Digital agency in Denmark specializing in websites, webapps, and PPC.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app"),
};

// Ensure proper safe-area handling on iOS (enables env(safe-area-*))
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const buildSha = (process.env.VERCEL_GIT_COMMIT_SHA || "dev").slice(0, 7);
  const vercelEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  return (
    <html lang="da" suppressHydrationWarning>
      <body
        className={`${sailec.variable} ${heywow.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
        data-build-sha={buildSha}
        data-build-env={vercelEnv}
      >
        <ThemeProvider>
          {process.env.NEXT_PUBLIC_DUMP_TOKENS === "1" ? <TokenDump /> : null}
          <JsonLd
            id="org-jsonld"
            data={jsonLd.organization({
              name: "mondaybrew",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app"}/brand/MondayBrew%20-%20Logo%20Stor%20-%201.png`,
            })}
          />
          <JsonLd
            id="website-jsonld"
            data={jsonLd.website({
              name: "mondaybrew",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app",
            })}
          />
          <GA />
          {/* Lightweight on-page nav debugger; only renders when URL contains ?navdebug=1 */}
          <NavDebug />
          <div className="site-shell">
            <div className="site-shell__viewport">
              {/* Move header inside the viewport so it travels with the card */}
              <Navbar />
              <div className="site-shell__content">
                {children}
                <Footer />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
