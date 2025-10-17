"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe, Moon, Palette, Sun, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const NAV_DEBUG = process.env.NEXT_PUBLIC_NAV_DEBUG === "1";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Cleanup on unmount to avoid stale attributes
    return () => {
      if (typeof document === "undefined") return;
      const body = document.body;
      const html = document.documentElement;
      body.removeAttribute("data-mobile-nav-open");
      html.removeAttribute("data-mobile-nav-open");
      body.removeAttribute("data-mobile-nav-closing");
      html.removeAttribute("data-mobile-nav-closing");
    };
  }, []);

  // CSS controls site-shell transforms purely via data attribute and CSS vars.

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  const megaSections = sections.filter((section): section is Extract<NavbarSection, { kind: "mega" }> => section.kind === "mega");
  const simpleLinks = sections.filter((section): section is Extract<NavbarSection, { kind: "link" }> => section.kind === "link");

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 0.61, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.06,
      },
    },
  } as const;

  const mobileGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 0.61, 0.36, 1],
        staggerChildren: 0.06,
      },
    },
  } as const;

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.22, 0.61, 0.36, 1] },
    },
  } as const;

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

  const readShellMetrics = () => {
    if (typeof window === "undefined") return {} as any;
    const body = document.body;
    const shell = document.querySelector<HTMLElement>(".site-shell");
    const csBody = getComputedStyle(body);
    const csShell = shell ? getComputedStyle(shell) : ({} as any);
    return {
      offsetVar: csBody.getPropertyValue("--site-shell-offset-x").trim(),
      scaleVar: csBody.getPropertyValue("--site-shell-scale").trim(),
      shellTransform: csShell.transform,
      sheetState: document.querySelector<HTMLElement>('[data-slot="sheet-content"]')?.getAttribute("data-state"),
      phaseAttr: document.body.getAttribute("data-nav-phase"),
      openAttr: document.body.getAttribute("data-mobile-nav-open"),
    };
  };

  const log = (label: string) => {
    if (!NAV_DEBUG) return;
    // eslint-disable-next-line no-console
    console.log(`[nav-debug] ${label}`, readShellMetrics());
  };

  const handleOpenChange = (open: boolean) => {
    if (typeof document === "undefined") return;
    const body = document.body;
    const html = document.documentElement;

    if (open) {
      // Open: set attribute and let existing CSS handle enter animation
      setMobileOpen(true);
      body.setAttribute("data-mobile-nav-open", "true");
      html.setAttribute("data-mobile-nav-open", "true");
      body.removeAttribute("data-nav-phase");
      log("open:start");
      return;
    }

    // Start controlled exit: keep 'open' while reversing geometry via CSS
    body.setAttribute("data-nav-phase", "exiting");
    // Keep Sheet open until animation completes
    setMobileOpen(true);
    log("exit:start");

    const shell = document.querySelector<HTMLElement>(".site-shell");
    const finalize = () => {
      log("exit:finalize-before-clear");
      // Freeze transitions for a tick while removing attributes
      body.setAttribute("data-nav-phase", "cleanup");
      body.removeAttribute("data-mobile-nav-open");
      html.removeAttribute("data-mobile-nav-open");
      setMobileOpen(false);
      setTimeout(() => {
        body.removeAttribute("data-nav-phase");
        log("exit:finalize-after-clear");
      }, 40);
    };

    if (shell) {
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName === "transform") {
          shell.removeEventListener("transitionend", onEnd as any);
          log("exit:transitionend(transform)");
          finalize();
        }
      };
      shell.addEventListener("transitionend", onEnd as any, { once: true });
      // Fallback in case transitionend is missed
      window.setTimeout(() => {
        log("exit:timeout-fallback");
        finalize();
      }, 700);
    } else {
      finalize();
    }
  };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-2 sm:top-3 md:top-4 z-50">
      <div className="layout-container px-2 sm:px-3 md:px-[var(--container-gutter)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Mobile header: brand + hamburger inside glass shell */}
          <div className={cn(menuShell, "flex items-center justify-between px-5 py-1.5 md:py-2.5 md:hidden")}
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

            <Sheet open={mobileOpen} onOpenChange={handleOpenChange}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-toggle-border)] bg-transparent p-2 text-[color:var(--nav-toggle-text)] transition hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                >
                  <Menu className="size-[18px]" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                hideCloseButton
                className="mobile-nav-panel fixed inset-0 z-[40] flex h-screen w-screen bg-[color:var(--mobile-nav-surface)] text-[color:var(--mobile-nav-text)] shadow-none border-r-0"
              >
                <div className="flex h-full w-full items-stretch">
                  <div className="mobile-nav-inner flex h-full w-[var(--mobile-nav-width)] flex-col px-6 py-8">
                    <div className="flex items-center justify-between pb-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[color:var(--mobile-nav-muted)]">Menu</span>
                      </div>
                      <SheetClose asChild>
                        <button
                          type="button"
                          aria-label="Luk menu"
                          className="inline-flex items-center justify-center rounded-full border border-transparent p-2 text-[color:var(--mobile-nav-muted)] transition hover:border-[color:var(--mobile-nav-border)] hover:text-[color:var(--mobile-nav-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                        >
                          <X className="size-[18px]" aria-hidden="true" />
                          <span className="sr-only">Luk</span>
                        </button>
                      </SheetClose>
                    </div>
                    {mobileOpen && (
                      <motion.div
                        className="no-scrollbar flex-1 space-y-7 overflow-y-auto pb-10"
                        initial="hidden"
                        animate="show"
                        variants={mobileMenuVariants}
                      >
                      {megaSections.map((section) => (
                        <motion.section key={section.label} variants={mobileGroupVariants} className="space-y-3">
                          <motion.h2 variants={mobileItemVariants} className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--mobile-nav-heading)]">
                            {section.label}
                          </motion.h2>
                          <motion.ul variants={mobileGroupVariants} className="flex flex-col gap-1.5">
                            {section.groups.flatMap((group) =>
                              group.items.map((item) => {
                                const href = item.href ?? "#";
                                const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                                return (
                                  <motion.li key={`${section.label}-${item.label}`} variants={mobileItemVariants}>
                                    <Link
                                      href={href}
                                      onClick={() => setMobileOpen(false)}
                                      className={cn(
                                        "group flex items-center justify-between rounded-[8px] px-3 py-2 text-[1.05rem] leading-tight transition",
                                        active
                                          ? "text-[color:var(--mobile-nav-text)] font-semibold"
                                          : "text-[color:var(--mobile-nav-link)] hover:text-[color:var(--mobile-nav-text)] hover:bg-[color:var(--mobile-nav-hover)]",
                                      )}
                                    >
                                      <span>{item.label}</span>
                                      <span className="ml-3 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[color:var(--mobile-nav-border)] text-[10px] opacity-0 transition group-hover:opacity-100">↗</span>
                                    </Link>
                                  </motion.li>
                                );
                              }),
                            )}
                          </motion.ul>
                        </motion.section>
                      ))}
                      {simpleLinks.length ? (
                        <motion.section key="primary-links" variants={mobileGroupVariants} className="space-y-3 pt-2">
                          <motion.h2 variants={mobileItemVariants} className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--mobile-nav-heading)]">
                            Mere
                          </motion.h2>
                          <motion.ul variants={mobileGroupVariants} className="flex flex-col gap-1.5">
                            {simpleLinks.map((link) => {
                              const href = link.href ?? "#";
                              const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                              return (
                                <motion.li key={link.label} variants={mobileItemVariants}>
                                  <Link
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                      "rounded-[8px] px-3 py-2 text-[1.05rem] transition",
                                      active
                                        ? "text-[color:var(--mobile-nav-text)] font-semibold"
                                        : "text-[color:var(--mobile-nav-link)] hover:text-[color:var(--mobile-nav-text)] hover:bg-[color:var(--mobile-nav-hover)]",
                                    )}
                                  >
                                    {link.label}
                                  </Link>
                                </motion.li>
                              );
                            })}
                          </motion.ul>
                        </motion.section>
                      ) : null}
                      </motion.div>
                    )}
                    <div className="mt-auto space-y-3 pb-6 pt-6">
                      <Link
                        href={ctaHref}
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[color:var(--nav-cta-border)] bg-[color:var(--nav-cta-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--nav-cta-text)] transition hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
                      >
                        <span>{ctaLabel}</span>
                        <ArrowRight className="size-[16px]" aria-hidden="true" />
                      </Link>
                      <div className="flex items-center justify-between text-[13px] text-[color:var(--mobile-nav-muted)]">
                        <button
                          type="button"
                          onClick={() => setTheme(nextThemeId)}
                          className="inline-flex items-center gap-2 rounded-[6px] border border-transparent px-2 py-1 transition hover:border-[color:var(--mobile-nav-border)] hover:text-[color:var(--mobile-nav-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                        >
                          {themeIcon}
                          <span>Skift tema</span>
                        </button>
                        <Link
                          href={localeConfig.href}
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex items-center gap-2 rounded-[6px] border border-transparent px-2 py-1 transition hover:border-[color:var(--mobile-nav-border)] hover:text-[color:var(--mobile-nav-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-locale-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
                        >
                          <Globe className="size-[16px]" aria-hidden="true" />
                          <span>{localeConfig.target}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <button type="button" tabIndex={-1} aria-hidden="true" className="flex-1 bg-transparent" />
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
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

          <div className="hidden md:flex flex-wrap items-center gap-2 px-0 py-0 sm:gap-3 md:flex-nowrap md:justify-end md:pl-4">
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
