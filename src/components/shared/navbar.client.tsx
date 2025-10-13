"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe, Moon, Palette, Sun, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
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
  /** Logo optimized for light UI (Light Alt). */
  logoLight?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  /** Logo optimized for dark UI (Primary/Dark). */
  logoDark?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  /** Back-compat single logo; used as fallback. */
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
  const isLightAlt = currentThemeId === "light-alt";

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

  // Next theme for toggle (shared by desktop and mobile)
  const cycle = themeOrder;
  const currentIndex = cycle.indexOf(currentThemeId);
  const nextThemeId = cycle[(currentIndex + 1) % cycle.length] ?? cycle[0];
  const nextTheme = getThemeDefinition(nextThemeId);
  const themeIcon = (() => {
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
          {/* Mobile header: brand + hamburger inside glass shell */}
          <div className={cn(menuShell, "flex items-center justify-between px-4 py-2.5 md:hidden")}
            aria-label="Mobile header"
          >
            <Link href="/" className="inline-flex items-center">
              {(() => {
                const chosen = isLightAlt
                  ? brand.logoLight ?? brand.logo ?? brand.logoDark
                  : brand.logoDark ?? brand.logo ?? brand.logoLight;
                if (chosen?.url) {
                  return (
                    <Image
                      src={chosen.url}
                      alt={chosen.alt || brand.title}
                      width={chosen.width ?? 150}
                      height={chosen.height ?? 32}
                      className="h-6 w-auto"
                      priority
                    />
                  );
                }
                return <span className="text-sm font-semibold">{brand.title}</span>;
              })()}
            </Link>

            {(
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      aria-label="Open menu"
                      className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-toggle-border)] bg-transparent p-2 text-[color:var(--nav-toggle-text)] transition hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                    >
                      <Menu className="size-[18px]" aria-hidden="true" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[88vw] max-w-sm border-l border-[color:var(--nav-shell-border)] bg-[color:var(--nav-shell-bg)] text-[color:var(--nav-shell-text)] backdrop-blur-[14px]">
                    <div className="flex flex-col gap-6 p-4">
                      <nav className="flex flex-col gap-2 text-base font-medium">
                        {sections.map((section) => {
                          if (section.kind === "link") {
                            const href = section.href ?? "#";
                            return (
                              <Link key={section.label} href={href} className="rounded-[5px] px-2 py-2 hover:bg-[color:var(--nav-link-hover-bg)]">
                                {section.label}
                              </Link>
                            );
                          }
                          // Flatten mega groups
                          return (
                            <div key={section.label} className="flex flex-col gap-1">
                              <span className="px-2 py-1 text-xs uppercase tracking-wider opacity-80">{section.label}</span>
                              {section.groups.flatMap((g, gi) =>
                                g.items.map((item, ii) => (
                                  <Link key={`${gi}-${ii}-${item.label}`} href={item.href ?? "#"} className="rounded-[5px] px-2 py-2 hover:bg-[color:var(--nav-link-hover-bg)]">
                                    {item.label}
                                  </Link>
                                )),
                              )}
                            </div>
                          );
                        })}
                      </nav>

                      <div className="h-px bg-[color:var(--nav-shell-border)]" />

                      <div className="flex items-center gap-3">
                        <Link
                          href={ctaHref}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-[5px] border border-[color:var(--nav-cta-border)] bg-[color:var(--nav-cta-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--nav-cta-text)] hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
                        >
                          <span>{ctaLabel}</span>
                          <ArrowRight className="size-[16px]" aria-hidden="true" />
                        </Link>

                        <Link
                          href={localeConfig.href}
                          className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-locale-border)] px-3 py-2 text-sm font-semibold text-[color:var(--nav-locale-text)] hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-locale-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
                          aria-label="Change language"
                        >
                          <Globe className="size-[16px]" aria-hidden="true" />
                          <span className="sr-only">{localeConfig.active}</span>
                        </Link>
                      </div>

                      <div className="flex items-center justify-center pt-2">
                        <button
                          type="button"
                          onClick={() => setTheme(nextThemeId)}
                          className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-toggle-border)] px-3 py-2 text-sm text-[color:var(--nav-toggle-text)] hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                          aria-label={`Switch to ${nextTheme.label}`}
                        >
                          {themeIcon}
                          <span className="ml-2">Theme</span>
                        </button>
                      </div>

                      <SheetClose asChild>
                        <button className="sr-only" aria-label="Close" />
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
            )}
          </div>

          {/* Desktop header */}
          <div className={cn(menuShell, "hidden md:flex items-center gap-4 px-5 py-2.5 md:flex-row")}
            style={{ justifyContent: "space-between" }}
          >
            <Link href="/" className="inline-flex items-center">
              {(() => {
                const chosen = isLightAlt
                  ? brand.logoLight ?? brand.logo ?? brand.logoDark
                  : brand.logoDark ?? brand.logo ?? brand.logoLight;
                if (chosen?.url) {
                  return (
                    <Image
                      src={chosen.url}
                      alt={chosen.alt || brand.title}
                      width={chosen.width ?? 150}
                      height={chosen.height ?? 32}
                      className="h-6 w-auto"
                      priority
                    />
                  );
                }
                return <span className="text-sm font-semibold">{brand.title}</span>;
              })()}
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
                        "whitespace-nowrap rounded-[5px] px-3 py-1.5 transition text-[color:var(--nav-link-text)]",
                        isLightAlt
                          ? cn(
                              active
                                ? "font-semibold underline underline-offset-[3px] decoration-[color:var(--nav-link-text)]"
                                : "hover:underline underline-offset-[3px] decoration-[color:var(--nav-link-text)]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]",
                            )
                          : cn(
                              active
                                ? "bg-[color:var(--nav-link-active-bg)] text-[color:var(--nav-link-active-text)]"
                                : "hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover-text)]",
                            ),
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
              return (
                <button
                  type="button"
                  onClick={() => setTheme(nextThemeId)}
                  className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-toggle-border)] bg-transparent px-2 py-1.5 text-[color:var(--nav-toggle-text)] transition hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                  aria-label={`Switch to ${nextTheme.label}`}
                >
                  {themeIcon}
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
