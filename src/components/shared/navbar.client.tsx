"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import { useMemo } from "react";
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

const DEFAULT_CTA_LABEL = "Let\u2019s talk";
const FALLBACK_LOCALE = "da";

export function NavbarClient({ brand, sections, cta, locales }: Props) {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

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

  return (
    <header className="sticky top-3 z-50 flex justify-center px-4 sm:px-6">
      <div className="layout-container-full">
        <div className="flex justify-center">
          <div
            className="relative flex w-full max-w-[calc(var(--layout-max)+var(--layout-gutter)*2)] items-center justify-between gap-6 rounded-full border border-white/10 bg-[rgba(28,22,32,0.72)] px-4 py-2 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-colors duration-300"
          >
            <div className="flex flex-1 items-center gap-2 sm:gap-3">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--mb-accent)] px-4 py-2 text-sm font-semibold text-[var(--mb-ink)] shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--mb-accent)]"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={localeConfig.href}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Globe className="size-3.5" aria-hidden="true" />
                <span>{localeConfig.active}</span>
              </Link>
            </div>

            <div className="flex flex-[1.6] items-center justify-end gap-4 sm:gap-6">
              <Link
                href="/"
                className="hidden whitespace-nowrap text-sm font-semibold tracking-tight text-white/90 transition hover:text-white sm:inline-flex"
              >
                {brand.logo?.url ? (
                  <Image
                    src={brand.logo.url}
                    alt={brand.logo.alt || brand.title}
                    width={brand.logo.width ?? 112}
                    height={brand.logo.height ?? 32}
                    className="h-6 w-auto"
                    priority
                  />
                ) : (
                  brand.title
                )}
              </Link>
              <nav className="flex gap-3 overflow-x-auto text-xs font-medium uppercase tracking-[0.08em] text-white/70 sm:text-sm sm:tracking-[0.12em]">
                {sections.map((section) => {
                  if (section.kind === "link") {
                    const href = section.href ?? "#";
                    const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                    return (
                      <Link
                        key={section.label}
                        href={href}
                        className={cn(
                          "whitespace-nowrap rounded-full px-3 py-1.5 transition",
                          active
                            ? "bg-white/15 text-white font-semibold"
                            : "hover:bg-white/10 hover:text-white",
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
                      className="whitespace-nowrap rounded-full px-3 py-1.5 text-left text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
