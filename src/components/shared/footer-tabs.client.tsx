"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

/**
 * Footer navigation columns component
 * 
 * Displays three vertical columns side-by-side:
 * 1. Marketing services (heading + 4 links)
 * 2. Web services (heading + 3 links)
 * 3. Virksomhed (heading + 4 links)
 */
export function FooterTabs() {
    const { resolvedTheme } = useTheme();
    const isLightAlt = resolvedTheme === "light-alt";

    return (
        <div className="flex flex-col md:flex-row gap-10 md:gap-24">
            {/* Column 1: Marketing */}
            <nav className="flex flex-col" aria-label="Marketing services">
                <h3 className={`text-lg font-bold uppercase tracking-wider mb-6 ${isLightAlt ? "text-black" : "text-white"}`}>
                    Marketing
                </h3>
                <ul className="space-y-4">
                    <li>
                        <Link
                            href="/services/marketing/full-funnel-performance"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Full-Funnel Performance
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/services/marketing/paid-search"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Paid Search
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/services/marketing/paid-social"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Paid Social
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/services/marketing/email-marketing"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            E-mail Marketing
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Column 2: Web */}
            <nav className="flex flex-col" aria-label="Web services">
                <h3 className={`text-lg font-bold uppercase tracking-wider mb-6 ${isLightAlt ? "text-black" : "text-white"}`}>
                    Web
                </h3>
                <ul className="space-y-4">
                    <li>
                        <Link
                            href="/services/web/websites"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Websites
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/services/web/ai"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            AI
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/services/web/ecommerce"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            eCommerce
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Column 3: Virksomhed */}
            <nav className="flex flex-col" aria-label="Virksomhed">
                <h3 className={`text-lg font-bold uppercase tracking-wider mb-6 ${isLightAlt ? "text-black" : "text-white"}`}>
                    Virksomhed
                </h3>
                <ul className="space-y-4">
                    <li>
                        <Link
                            href="/om-os"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Om os
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/kontakt"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Kontakt
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/blog"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/cases"
                            className={`transition-colors text-base block ${isLightAlt ? "text-black/70 hover:text-[#F97844]" : "text-white/70 hover:text-[#F97844]"}`}
                        >
                            Cases
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
