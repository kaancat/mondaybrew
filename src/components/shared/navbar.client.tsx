"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe, Moon, Palette, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { defaultThemeId, getThemeDefinition, themeOrder, ThemeId } from "@/theme/registry";
import { useNavPhase } from "@/components/shared/use-nav-phase";
import { DesktopMegaMenu } from "@/components/shared/desktop-mega-menu";
import type { HeroFeatureDisplayItem } from "@/components/sections/hero-feature-carousel";

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
    megaMenuHeadline?: string;
    megaMenuDescription?: string;
    featuredCases?: HeroFeatureDisplayItem[];
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

const DEFAULT_CTA_LABEL = "Let's talk";
const FALLBACK_LOCALE = "da";

/**
 * MegaMenuTrigger: Simplified trigger button for mega menus
 */
function MegaMenuTrigger({
  label,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-[6px] bg-transparent px-3 py-1.5 text-sm font-normal text-[color:var(--nav-link-text)] transition hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]",
          isOpen && "bg-[color:var(--nav-link-hover-bg)]"
        )}
      >
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </button>
    </div>
  );
}

/**
 * SharedMegaMenuDropdown: Single shared dropdown container for all mega menus
 * Prevents flickering by keeping the container mounted during transitions
 */
function SharedMegaMenuDropdown({
  isOpen,
  content,
  contentKey,
  desktopNavRef,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  content: React.ReactNode;
  contentKey: string | null;
  desktopNavRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [leftOffset, setLeftOffset] = useState(0);
  const [width, setWidth] = useState(0);
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    if (!desktopNavRef.current) return;

    const updatePosition = () => {
      const nav = desktopNavRef.current;
      if (!nav) return;

      const navRect = nav.getBoundingClientRect();
      const navList = nav.querySelector('[role="menubar"]') || nav;
      const navListRect = navList.getBoundingClientRect();

      setLeftOffset(navRect.left);
      setWidth(navRect.width);
      setTopOffset(navListRect.bottom + 16); // 16px gap
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [desktopNavRef]);

  if (!content) return null;

  return (
    <div
      className="fixed z-[9998]"
      style={{
        left: `${leftOffset}px`,
        top: `${topOffset}px`,
        width: `${width}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge to maintain hover state */}
      <div className="absolute bottom-full left-0 right-0 h-4" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -8 }}
        transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* AnimatePresence for smooth content transitions */}
        <AnimatePresence mode="wait" initial={false}>
          {contentKey && (
            <motion.div
              key={contentKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                duration: 0.11,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function NavbarClient({ brand, sections, cta, locales }: Props) {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const headerRef = useRef<HTMLElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { mobileOpen, onOpenChange } = useNavPhase();
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const [megaMenuContent, setMegaMenuContent] = useState<React.ReactNode>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMegaMenuOpen = (label: string, content: React.ReactNode) => {
    // Cancel any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMegaMenu(label);
    setMegaMenuContent(content);
  };

  const handleMegaMenuClose = () => {
    // Delay closing to allow moving to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMegaMenu(null);
      // Keep content mounted for instant exit animation
      setTimeout(() => setMegaMenuContent(null), 120);
    }, 150);
  };

  const cancelMegaMenuClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const prevPathRef = useRef(normalizedPath);
  useEffect(() => {
    if (!mounted) return;
    if (mobileOpen && prevPathRef.current !== normalizedPath) {
      onOpenChange(false);
    }
    prevPathRef.current = normalizedPath;
  }, [mobileOpen, normalizedPath, onOpenChange, mounted]);

  // Cleanup handled by useNavPhase

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

  const prevRouteRef = useRef(pathname);
  useEffect(() => {
    if (!mobileOpen) {
      prevRouteRef.current = pathname;
      return;
    }
    if (prevRouteRef.current !== pathname) {
      onOpenChange(false);
    }
    prevRouteRef.current = pathname;
  }, [mobileOpen, pathname, onOpenChange]);

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

      const desktopShell = el.querySelector<HTMLElement>(".desktop-nav-shell");
      if (desktopShell) {
        const shellRect = desktopShell.getBoundingClientRect();
        document.documentElement.style.setProperty("--desktop-nav-shell-width", `${shellRect.width}px`);
        document.documentElement.style.setProperty("--desktop-nav-shell-left", `${shellRect.left}px`);
        document.documentElement.style.setProperty("--desktop-nav-shell-top", `${shellRect.top}px`);
        document.documentElement.style.setProperty("--desktop-nav-shell-height", `${shellRect.height}px`);
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    window.addEventListener("scroll", updateOffset, { passive: true });
    return () => {
      window.removeEventListener("resize", updateOffset);
      window.removeEventListener("scroll", updateOffset);
    };
  }, []);

  const handleOpenChange = onOpenChange;

  // Note: Avoid VisualViewport translations on iOS — they can cause the header
  // to drift while the user holds a finger on the screen. Keeping the header
  // purely fixed at top is more stable across engines.

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[9999]"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
      >
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
                  return <span className="text-sm font-normal">{brand.title}</span>;
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
                  className="mobile-nav-panel fixed inset-0 flex w-screen bg-[color:var(--mobile-nav-surface)] text-[color:var(--mobile-nav-text)] shadow-none border-r-0"
                >
                  {/* Accessibility: satisfy Radix requirements without changing visuals */}
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">Site navigation</SheetDescription>
                  <div className="flex h-full w-full items-stretch">
                    <div className="mobile-nav-inner flex h-full min-h-0 w-[var(--mobile-nav-width)] flex-col px-6 py-8">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between pb-5 shrink-0">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-normal uppercase tracking-[0.32em] text-[color:var(--mobile-nav-muted)]">Menu</span>
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

                      {/* Scrollable menu content */}
                      <div className="mobile-nav-scroll no-scrollbar flex-1 min-h-0 overflow-y-auto pt-2">
                        {mobileOpen && (
                          <motion.div
                            className="space-y-7"
                            initial="hidden"
                            animate="show"
                            variants={mobileMenuVariants}
                          >
                            {megaSections.map((section) => (
                              <motion.section key={section.label} variants={mobileGroupVariants} className="space-y-3">
                                <motion.h2 variants={mobileItemVariants} className="text-sm font-normal uppercase tracking-[0.28em] text-[color:var(--mobile-nav-heading)]">
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
                                            className={cn(
                                              "group flex items-center justify-between rounded-[8px] px-3 py-2 text-[1.05rem] leading-tight transition",
                                              active
                                                ? "text-[color:var(--mobile-nav-text)] font-normal"
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
                                <motion.h2 variants={mobileItemVariants} className="text-sm font-normal uppercase tracking-[0.28em] text-[color:var(--mobile-nav-heading)]">
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
                                          className={cn(
                                            "rounded-[8px] px-3 py-2 text-[1.05rem] transition",
                                            active
                                              ? "text-[color:var(--mobile-nav-text)] font-normal"
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
                      </div>

                      {/* Fixed bottom action buttons */}
                      <div className="mt-auto pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] shrink-0 space-y-3">
                        <Link
                          href={ctaHref}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[color:var(--nav-cta-border)] bg-[color:var(--nav-cta-bg)] px-3 py-2 text-sm font-normal text-[color:var(--nav-cta-text)] transition hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
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
            <div
              ref={desktopNavRef}
              className={cn(menuShell, "desktop-nav-shell relative hidden md:flex items-center gap-5 px-5 py-2.5")}
            >
              <Link href="/" className="inline-flex items-center shrink-0">
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
                  return <span className="text-sm font-normal">{brand.title}</span>;
                })()}
              </Link>
              <NavigationMenu
                viewport={false}
                className="hidden md:flex w-full max-w-none flex-1 items-center justify-start gap-4 text-[color:var(--nav-link-text)]"
              >
                <NavigationMenuList className="justify-start gap-2 text-sm font-normal" role="menubar">
                  {sections.map((section) => {
                    if (section.kind === "mega") {
                      const isOpen = openMegaMenu === section.label;
                      const content = (
                        <DesktopMegaMenu
                          label={section.label}
                          groups={section.groups}
                          featuredCases={section.featuredCases || []}
                          megaMenuHeadline={section.megaMenuHeadline}
                          megaMenuDescription={section.megaMenuDescription}
                        />
                      );

                      return (
                        <MegaMenuTrigger
                          key={section.label}
                          label={section.label}
                          isOpen={isOpen}
                          onMouseEnter={() => handleMegaMenuOpen(section.label, content)}
                          onMouseLeave={handleMegaMenuClose}
                        />
                      );
                    }

                    const href = section.href ?? "#";
                    const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                    return (
                      <NavigationMenuItem key={section.label} className="md:static">
                        <NavigationMenuLink asChild active={active} className="rounded-[6px] px-3 py-1.5 transition hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover-text)]">
                          <Link
                            href={href}
                            className={cn(
                              "whitespace-nowrap",
                              isLightAlt
                                ? "underline-offset-[3px] hover:underline"
                                : active
                                  ? "font-normal"
                                  : undefined,
                            )}
                          >
                            {section.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
                <NavigationMenuIndicator className="hidden md:flex" />
              </NavigationMenu>
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
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[color:var(--nav-cta-border)] bg-[color:var(--nav-cta-bg)] px-3 py-1.5 text-xs font-normal text-[color:var(--nav-cta-text)] transition-colors hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="size-[16px]" aria-hidden="true" />
              </Link>
              <Link
                href={localeConfig.href}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[color:var(--nav-locale-border)] bg-transparent px-3 py-1.5 text-xs font-normal text-[color:var(--nav-locale-text)] transition-colors hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-locale-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
              >
                <Globe className="size-[16px]" aria-hidden="true" />
                <span>{localeConfig.active}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Shared mega menu dropdown - rendered outside header for proper positioning */}
      <SharedMegaMenuDropdown
        isOpen={!!openMegaMenu}
        content={megaMenuContent}
        contentKey={openMegaMenu}
        desktopNavRef={desktopNavRef}
        onMouseEnter={cancelMegaMenuClose}
        onMouseLeave={handleMegaMenuClose}
      />
    </>
  );
}
