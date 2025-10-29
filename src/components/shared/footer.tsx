"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FooterTabs } from "./footer-tabs.client";
import { useTheme } from "next-themes";

/**
 * Full-size footer component
 *
 * Horizontal full-width layout with theme-aware background
 * and orange accent colors from the design.
 */
export function Footer() {
  const { resolvedTheme } = useTheme();
  const isLightAlt = resolvedTheme === "light-alt";

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: isLightAlt ? "#ffffff" : "#49444B",
      } as React.CSSProperties}>
      {/* Footer content */}
      <div className="relative z-10 flex flex-col justify-between">
        {/* Main content */}
        <div className="px-[var(--container-gutter)] pt-12 pb-10 md:pt-16 lg:pt-24">
          <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">
            {/* Left side - CTA */}
            <div className="flex-1">
              <h2 id="footer-cta-heading" className={`text-[clamp(28px,5.2vw,42px)] md:text-5xl font-bold mb-4 md:mb-6 ${isLightAlt ? "text-black" : "text-white"}`}>
                Lad os bygge noget fedt sammen
              </h2>
              <p className={`text-base md:text-lg mb-6 md:mb-8 ${isLightAlt ? "text-black/70" : "text-white/70"}`}>
                Vi hjælper ambitiøse brands med at vokse gennem moderne web og performance marketing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                <Link
                  href="/kontakt"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[5px] bg-[#F97844] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#e8693a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97844] focus-visible:ring-offset-2"
                >
                  Start et projekt
                </Link>
                <Link
                  href="/services"
                  className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[5px] border px-6 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isLightAlt
                    ? "border-black/20 text-black hover:bg-black/5"
                    : "border-white/20 text-white hover:bg-white/5"
                    }`}
                >
                  Se vores services
                </Link>
              </div>
            </div>

            {/* Right side - Navigation */}
            <div className="lg:w-1/2 lg:pr-16 w-full">
              <FooterTabs />
            </div>
          </div>
        </div>

        {/* Main footer content - stays at bottom */}
        <div className="w-full px-[var(--container-gutter)] pb-6">

          {/* Logo */}
          <div className="mb-6 md:mb-4">
            <Image
              src={isLightAlt ? "/brand/mondaybrew_footer_logo.svg" : "/brand/MondayBrew_footer_orange.svg"}
              alt="MondayBrew"
              className="w-full h-auto opacity-10 md:opacity-15"
              width={1000}
              height={200}
              priority={false}
            />
          </div>

          {/* Bottom bar */}
          <div className={`pt-4 border-t ${isLightAlt ? "border-black/10" : "border-white/10"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-3 sm:gap-0 w-full items-start md:justify-items-center">
              {/* Column 1: Privacy Policy + Copyright */}
              <div className={`flex flex-col gap-2 items-start w-full pt-4 md:pt-0 border-t md:border-t-0 ${isLightAlt ? "border-black/10" : "border-white/10"}`}>
                <Link
                  href="/privacy-policy"
                  className={`text-sm transition-colors block ${isLightAlt
                    ? "text-black/80 hover:text-[#F97844]"
                    : "text-white/80 hover:text-[#F97844]"
                    }`}
                >
                  Privacy Policy
                </Link>
                <p className={`text-sm ${isLightAlt ? "text-black/80" : "text-white/80"}`}>
                  © MondayBrew {new Date().getFullYear()}
                </p>
              </div>

              {/* Separator 1 */}
              <div className={`hidden sm:block w-px self-stretch -mt-4 -mb-6 ${isLightAlt ? "bg-black/10" : "bg-white/10"}`} aria-hidden="true"></div>

              {/* Column 2: Social Media */}
              <div className={`flex flex-col gap-2 items-start w-full pt-4 md:pt-0 border-t md:border-t-0 ${isLightAlt ? "border-black/10" : "border-white/10"}`}>
                <a
                  href="https://www.linkedin.com/company/mondaybrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors block ${isLightAlt
                    ? "text-black/80 hover:text-[#F97844]"
                    : "text-white/80 hover:text-[#F97844]"
                    }`}
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/mondaybrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors block ${isLightAlt
                    ? "text-black/80 hover:text-[#F97844]"
                    : "text-white/80 hover:text-[#F97844]"
                    }`}
                >
                  Instagram
                </a>
              </div>

              {/* Separator 2 */}
              <div className={`hidden sm:block w-px self-stretch -mt-4 -mb-6 ${isLightAlt ? "bg-black/10" : "bg-white/10"}`} aria-hidden="true"></div>

              {/* Column 3: Email + Phone */}
              <div className={`flex flex-col gap-2 items-start w-full pt-4 md:pt-0 border-t md:border-t-0 ${isLightAlt ? "border-black/10" : "border-white/10"}`}>
                <a
                  href="mailto:hej@mondaybrew.dk"
                  className={`text-sm transition-colors block ${isLightAlt
                    ? "text-black/80 hover:text-[#F97844]"
                    : "text-white/80 hover:text-[#F97844]"
                    }`}
                >
                  hej@mondaybrew.dk
                </a>
                <a
                  href="tel:+4542211065"
                  className={`text-sm transition-colors block ${isLightAlt
                    ? "text-black/80 hover:text-[#F97844]"
                    : "text-white/80 hover:text-[#F97844]"
                    }`}
                >
                  (+45) 42 21 10 65
                </a>
              </div>

              {/* Separator 3 */}
              <div className={`hidden sm:block w-px self-stretch -mt-4 -mb-6 ${isLightAlt ? "bg-black/10" : "bg-white/10"}`} aria-hidden="true"></div>

              {/* Column 4: Address */}
              <div className={`flex flex-col gap-2 items-start w-full pt-4 md:pt-0 border-t md:border-t-0 ${isLightAlt ? "border-black/10" : "border-white/10"}`}>
                <p className={`text-sm ${isLightAlt ? "text-black/80" : "text-white/80"}`}>
                  Vesterbrogade 74, 4. sal
                </p>
                <p className={`text-sm ${isLightAlt ? "text-black/80" : "text-white/80"}`}>
                  1620 København V
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
