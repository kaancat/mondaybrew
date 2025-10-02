import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { heywow, sailec } from "@/fonts";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GA } from "@/components/shared/ga";
import { ConsentBanner } from "@/components/shared/consent";
import { JsonLd } from "@/components/shared/json-ld";
import { jsonLd } from "@/lib/jsonld";
import { ThemeProvider } from "@/components/shared/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" suppressHydrationWarning>
      <body className={`${sailec.variable} ${heywow.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
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
          <ConsentBanner />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
