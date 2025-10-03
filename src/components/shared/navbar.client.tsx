"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { defaultThemeId, getThemeDefinition, themeOrder, ThemeId } from "@/theme/registry";

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
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveTheme = (mounted ? resolvedTheme : undefined) as ThemeId | undefined;
  const currentThemeId = effectiveTheme ?? defaultThemeId;

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
    "rounded-[5px] border border-[color:var(--nav-shell-border)] bg-[color:var(--nav-shell-bg)] text-[color:var(--nav-shell-text)] shadow-[var(--nav-shell-shadow)] backdrop-blur-[12px] transition-all duration-300";

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
          <div className={cn(menuShell, "flex items-center gap-4 px-5 py-2.5 md:flex-row")}
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
                <span className="text-sm font-semibold">{brand.title}</span>
              )}
            </Link>
            <nav className={cn("flex flex-wrap items-center gap-3 overflow-x-auto text-sm font-medium md:flex-nowrap", "text-[color:var(--nav-link-text)]")}>
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
                        active
                          ? "bg-[color:var(--nav-link-active-bg)] text-[color:var(--nav-link-active-text)]"
                          : "hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover-text)]",
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
                    className="whitespace-nowrap rounded-[5px] px-3 py-1.5 text-left transition hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover-text)]"
                  >
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-0 py-0 sm:gap-3 md:flex-nowrap md:justify-end md:pl-4">
            {(() => {
              const cycle = themeOrder;
              const currentIndex = cycle.indexOf(currentThemeId);
              const nextThemeId = cycle[(currentIndex + 1) % cycle.length] ?? cycle[0];
              const nextTheme = getThemeDefinition(nextThemeId);

              const icon = (() => {
                if (!mounted) {
                  return <Sun className="size-[16px]" aria-hidden="true" />;
                }
                switch (nextThemeId) {
                  case "light-alt":
                    return <Palette className="size-[16px]" aria-hidden="true" />;
                  case "dark":
                    return <Moon className="size-[16px]" aria-hidden="true" />;
                  default:
                    return <Sun className="size-[16px]" aria-hidden="true" />;
                }
              })();

              return (
                <button
                  type="button"
                  onClick={() => setTheme(nextThemeId)}
                  className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-toggle-border)] bg-transparent px-2 py-1.5 text-[color:var(--nav-toggle-text)] transition hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                  aria-label={`Switch to ${nextTheme.label}`}
                >
                  {icon}
                </button>
              );
            })()}
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[color:var(--nav-cta-border)] bg-[color:var(--nav-cta-bg)] px-3 py-1.5 text-xs font-semibold text-[color:var(--nav-cta-text)] transition-colors hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="size-[16px]" aria-hidden="true" />
            </Link>
            <Link
              href={localeConfig.href}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[color:var(--nav-locale-border)] bg-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--nav-locale-text)] transition-colors hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-locale-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
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
