import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Full-size footer component
 *
 * Horizontal full-width layout with dark purple-gray background
 * and orange accent colors from the design.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{
      backgroundColor: "var(--mb-ink)",
      height: "100vh",
    } as React.CSSProperties}>
      {/* Footer content */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        {/* Main footer content */}
        <div className="w-full px-[var(--container-gutter)] pb-16">
          {/* Logo */}
          <div className="mb-12" style={{ marginTop: "25rem" } as React.CSSProperties}>
            <div className="relative w-[400px] h-40 md:w-[500px] md:h-52 lg:w-[600px] lg:h-60">
              <Image
                src="/brand/Copy of Hvidt Logo - 1.png"
                alt="MondayBrew"
                fill
                className="object-contain object-left"
                priority={false}
              />
            </div>
          </div>

          {/* Horizontal content row */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">
            {/* Left: CTA */}
            <div className="flex-1 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Lad os bygge noget fedt sammen
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Vi hjælper ambitiøse brands med at vokse gennem moderne web og performance marketing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-12 px-8"
                  style={{
                    backgroundColor: "var(--mb-accent)",
                    color: "var(--brand-light)",
                  } as React.CSSProperties}
                >
                  Start et projekt
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-12 px-8"
                  style={{
                    backgroundColor: "var(--brand-light)",
                    color: "var(--mb-ink)",
                  } as React.CSSProperties}
                >
                  Se vores services
                </Link>
              </div>
            </div>

            {/* Right: Links and Contact */}
            <div className="flex flex-wrap gap-12 lg:gap-16">
              {/* Quick links */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
                  Navigation
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/services/web/websites" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Websites
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/web/ecommerce" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      eCommerce
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/marketing/paid-social" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Paid Social
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/marketing/paid-search" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Paid Search
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
                  Virksomhed
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/om-os" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Om os
                    </Link>
                  </li>
                  <li>
                    <Link href="/cases" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Cases
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/kontakt" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      Kontakt
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
                  Kontakt
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="mailto:hej@mondaybrew.dk" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      hej@mondaybrew.dk
                    </a>
                  </li>
                  <li>
                    <a href="tel:+4512345678" className="text-white/80 hover:text-[color:var(--mb-accent)] transition-colors text-sm">
                      +45 12 34 56 78
                    </a>
                  </li>
                  <li className="text-white/50 text-sm">
                    København, Danmark
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-6">
                <p className="text-xs text-white/40">
                  © MondayBrew {new Date().getFullYear()}
                </p>
                <Link
                  href="/privacy-policy"
                  className="text-xs text-white/40 hover:text-[color:var(--mb-accent)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/mondaybrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-[color:var(--mb-accent)] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/mondaybrew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-[color:var(--mb-accent)] transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
