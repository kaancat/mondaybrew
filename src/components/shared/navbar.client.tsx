"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export type NavbarLink = {
  label: string;
  href?: string;
};

export type NavbarMegaGroupItem = {
  label: string;
  description?: string;
  href?: string;
};

export type NavbarMegaGroup = {
  title?: string;
  description?: string;
  items: NavbarMegaGroupItem[];
};

export type NavbarSection =
  | {
      kind: "link";
      label: string;
      href?: string;
    }
  | {
      kind: "mega";
      label: string;
      groups: NavbarMegaGroup[];
    };

export type NavbarBrand = {
  title: string;
  logo?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
};

export type NavbarCta = {
  label: string;
  href?: string;
};

type Props = {
  brand: NavbarBrand;
  sections: NavbarSection[];
  cta?: NavbarCta | null;
  locales?: {
    available: string[];
    defaultLocale: string;
  };
};

const DEFAULT_CTA_LABEL = "Let’s talk";
const FALLBACK_LOCALE = "da";

export function NavbarClient({ brand, sections, cta, locales }: Props) {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const headerRef = useRef<HTMLElement>(null);

  const localeConfig = useMemo(() => {
    const available = locales?.available?.length ? locales.available : [FALLBACK_LOCALE, "en"];
    const defaultLocale = locales?.defaultLocale ?? FALLBACK_LOCALE;
    const pathSegments = pathname.split("/").filter(Boolean);
    const hasLocalePrefix = available.includes(pathSegments[0]);
    const activeLocale = hasLocalePrefix ? pathSegments[0] : defaultLocale;
    const restSegments = hasLocalePrefix ? pathSegments.slice(1) : pathSegments;

    const targetLocale = available.find((locale) => locale !== activeLocale) ?? defaultLocale;
    const prefix = targetLocale === defaultLocale ? "" : `/${targetLocale}`;
    const restPath = restSegments.join("/");
    const href = `${prefix}${restPath ? `/${restPath}` : ""}` || "/";

    return {
      active: activeLocale,
      target: targetLocale,
      href: href === "" ? "/" : href,
    };
  }, [locales?.available, locales?.defaultLocale, pathname]);

  const ctaHref = cta?.href ?? "/kontakt";
  const ctaLabel = cta?.label || DEFAULT_CTA_LABEL;

  const menuShell =
    "rounded-[5px] border border-white/12 bg-[rgba(24,24,24,0.6)] text-white shadow-[0_24px_48px_rgba(0,0,0,0.22)] backdrop-blur-[12px] transition-all duration-300";

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof window === "undefined") return;

    const updateOffset = () => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const top = parseFloat(style.top || "0");
      const gap = 24;
      const offset = Math.round(top + rect.height + gap);
      document.documentElement.style.setProperty("--hero-offset", `${offset}px`);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-4 z-50">
      <div className="layout-container">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div
            className={cn(menuShell, "flex items-center gap-4 px-5 py-2.5 md:flex-row text-[#f5f7fd]")}
            style={{ justifyContent: "space-between" }}
          >
            <Link href="/" className="inline-flex items-center">
              {brand.logo?.url ? (
                <Image
                  src={brand.logo.url}
                  alt={brand.logo.alt || brand.title}
                  width={brand.logo.width ?? 150}
                  height={brand.logo.height ?? 32}
                  className="h-6 w-auto"
                  priority
                />
              ) : (
                <span className="text-sm font-semibold text-white/90">{brand.title}</span>
              )}
            </Link>
            <nav className="flex flex-wrap items-center gap-3 overflow-x-auto text-sm font-medium text-white/85 md:flex-nowrap">
              {sections.map((section) => {
                if (section.kind === "link") {
                  const href = section.href ?? "#";
                  const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                  return (
                    <Link
                      key={section.label}
                      href={href}
                      className={cn(
                        "whitespace-nowrap rounded-[5px] px-3 py-1.5 transition",
                        active ? "bg-white/18 text-white" : "hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {section.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={section.label}
                    type="button"
                    className="whitespace-nowrap rounded-[5px] px-3 py-1.5 text-left transition hover:bg-white/10 hover:text-white"
                  >
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 md:justify-end md:pl-4">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF914D] px-3 py-1.5 text-xs font-semibold text-[#f5f7fd] transition-colors hover:bg-[#ff8233] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(255,145,77,0.7)]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="size-[16px]" aria-hidden="true" />
            </Link>
            <Link
              href={localeConfig.href}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#6f6f74] px-3 py-1.5 text-xs font-semibold text-[#f5f7fd] transition-colors hover:bg-[#5f5f64] focus:outline-none focus-visible:outline-2 focus-visible:outline-[rgba(255,145,77,0.7)] focus-visible:outline-offset-2"
            >
              <Globe className="size-[16px]" aria-hidden="true" />
              <span>{localeConfig.active}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
