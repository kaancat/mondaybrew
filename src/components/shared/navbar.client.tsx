"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe, Moon, Palette, Sun, Menu, Target, Search, Share2, Mail, ShoppingBag, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileBottomSheet, MobileBottomSheetTrigger } from "@/components/ui/mobile-bottom-sheet";
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
import { buildSanityImage } from "@/lib/sanity-image";

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

type NavLogoAsset = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const NAV_LOGO_LIGHT_SRC = "/brand/mondaybrew_footer_logo.svg";
const NAV_LOGO_DARK_SRC = "/brand/MondayBrew_footer_orange.svg";

function resolveBrandLogo(
  source: NavbarBrand["logoLight"],
  fallbackSrc: string,
  alt: string,
): NavLogoAsset {
  if (source?.url) {
    const built = buildSanityImage(
      {
        alt: source.alt ?? alt,
        asset: {
          url: source.url,
          metadata: {
            dimensions: {
              width: source.width ?? undefined,
              height: source.height ?? undefined,
            },
          },
        },
      },
      { width: source.width ?? 220, quality: 80 },
    );

    return {
      src: built.src ?? source.url,
      alt: built.alt ?? source.alt ?? alt,
      width: source.width ?? built.width ?? 1000,
      height: source.height ?? built.height ?? 200,
    } satisfies NavLogoAsset;
  }

  return {
    src: fallbackSrc,
    alt,
    width: 1000,
    height: 200,
  } satisfies NavLogoAsset;
}

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

// Icon mapping aligned with desktop mega menu
const ICON_MAP: Record<string, typeof Target> = {
  "Full-Funnel Performance": Target,
  "full-funnel": Target,
  "Paid Search": Search,
  "paid-search": Search,
  "Paid Social": Share2,
  "paid-social": Share2,
  "E-Mail Marketing": Mail,
  "email": Mail,
  "Hjemmesider": Globe,
  "websites": Globe,
  "CRM": Target,
  "crm": Target,
  "AI": Sparkles,
  "ai": Sparkles,
  "eCommerce": ShoppingBag,
  "ecommerce": ShoppingBag,
  "Services": Target,
  "Cases": Target,
  "About": Target,
  "People": Target,
  "Career": Target,
  "Events": Target,
};

function getIconForLabel(label?: string): typeof Target {
  if (!label) return Target;
  if (ICON_MAP[label]) return ICON_MAP[label];
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key.toLowerCase())) return Icon;
  }
  return Target;
}

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
  const [mobileMenuLevel, setMobileMenuLevel] = useState<string | null>(null);
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const [megaMenuContent, setMegaMenuContent] = useState<React.ReactNode>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const [shouldFadeHeader, setShouldFadeHeader] = useState(false);
  const brandTitle = brand.title || "MondayBrew";
  const logos = useMemo(() => {
    const base = resolveBrandLogo(brand.logo ?? null, NAV_LOGO_DARK_SRC, brandTitle);
    const light = resolveBrandLogo(brand.logoLight ?? null, NAV_LOGO_LIGHT_SRC, brandTitle) || base;
    const dark = resolveBrandLogo(brand.logoDark ?? null, NAV_LOGO_DARK_SRC, brandTitle) || base;
    return { light, dark } as const;
  }, [brand.logo, brand.logoDark, brand.logoLight, brandTitle]);

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

  // Reset mobile menu level when menu closes
  useEffect(() => {
    if (!mobileOpen) {
      setMobileMenuLevel(null);
    }
  }, [mobileOpen]);

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

  // Detect when header intersects with footer CTA heading
  useEffect(() => {
    if (typeof window === "undefined") return;

    const header = headerRef.current;
    const footer = document.querySelector("footer");
    const ctaHeading = document.getElementById("footer-cta-heading");
    if (!header || !footer || !ctaHeading) return;

    const checkIntersection = () => {
      const headerRect = header.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const ctaHeadingRect = ctaHeading.getBoundingClientRect();

      // Check if header and footer rectangles overlap (for icon color change)
      const isIntersecting = !(
        headerRect.bottom < footerRect.top ||
        headerRect.top > footerRect.bottom ||
        headerRect.right < footerRect.left ||
        headerRect.left > footerRect.right
      );

      // Only fade if header would actually overlap with CTA heading (not just get close)
      // Check if header's bottom edge is past the CTA heading's top edge
      const shouldFade = headerRect.bottom > ctaHeadingRect.top;

      setIsOverFooter(isIntersecting);
      setShouldFadeHeader(shouldFade);
    };

    checkIntersection();
    window.addEventListener("scroll", checkIntersection, { passive: true });
    window.addEventListener("resize", checkIntersection);

    return () => {
      window.removeEventListener("scroll", checkIntersection);
      window.removeEventListener("resize", checkIntersection);
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
        className={cn(
          "fixed inset-x-0 top-0 z-[9999] transition-opacity duration-300",
          shouldFadeHeader ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
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
                  const chosen = isLightAlt ? logos.light : logos.dark;
                  if (chosen?.src) {
                    return (
                      <Image
                        src={chosen.src}
                        alt={chosen.alt}
                        width={chosen.width ?? 150}
                        height={chosen.height ?? 32}
                        className="h-6 w-auto"
                        priority
                      />
                    );
                  }
                  return <span className="text-sm font-normal">{brandTitle}</span>;
                })()}
              </Link>

              {/* Mobile navigation trigger */}
              <MobileBottomSheetTrigger
                onClick={() => onOpenChange(true)}
                className="inline-flex items-center justify-center rounded-[5px] border border-[color:var(--nav-toggle-border)] bg-transparent p-2 text-[color:var(--nav-link-text)] transition hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]"
                aria-label="Open menu"
              >
                <Menu className="size-[18px]" aria-hidden="true" />
              </MobileBottomSheetTrigger>
            </div>

            {/* Mobile bottom-sheet menu (rendered at portal level) */}
            <MobileBottomSheet open={mobileOpen} onOpenChange={handleOpenChange}>
              <div className="flex w-full max-w-screen-sm mx-auto flex-col px-6 h-full">
                {/* Header with theme + locale controls */}
                <div className="flex items-center justify-between pt-6 pb-4 shrink-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[color:var(--mobile-nav-muted)]">{localeConfig.active === "en" ? "23:27" : "23.27"}</span>
                    {mounted && (
                      <span className="text-[color:var(--mobile-nav-muted)]">
                        {currentThemeId === "dark" ? "🌙" : currentThemeId === "light-alt" ? "🎨" : "☀️"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Locale toggle */}
                    <Link
                      href={localeConfig.href}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--mobile-nav-surface)] border border-[color:var(--mobile-nav-border)] px-3 py-1.5 text-xs font-normal text-[color:var(--mobile-nav-text)] transition hover:bg-[color:var(--mobile-nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)]"
                    >
                      <span className={cn(localeConfig.active === "en" ? "text-[color:var(--mobile-nav-text)]" : "text-[color:var(--mobile-nav-muted)]")}>EN</span>
                      <div className="w-7 h-4 rounded-full bg-[color:var(--mobile-nav-border)] relative">
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-[color:var(--mobile-nav-text)]"
                          animate={{ x: localeConfig.active === "da" ? 12 : 0 }}
                          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                        />
                      </div>
                      <span className={cn(localeConfig.active === "da" ? "text-[color:var(--mobile-nav-text)]" : "text-[color:var(--mobile-nav-muted)]")}>DA</span>
                    </Link>
                    {/* Theme toggle */}
                    <button
                      type="button"
                      onClick={() => setTheme(nextThemeId)}
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--mobile-nav-surface)] border border-[color:var(--mobile-nav-border)] p-2 text-[color:var(--mobile-nav-muted)] transition hover:text-[color:var(--mobile-nav-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)]"
                      aria-label={`Switch to ${nextTheme.label}`}
                    >
                      {themeIcon}
                    </button>
                  </div>
                </div>

                {/* Menu label */}
                <div className="pb-4 shrink-0">
                  <h2 className="text-sm font-normal text-[color:var(--mobile-nav-muted)]">Menu</h2>
                </div>

                {/* Scrollable menu content with cards */}
                <div className="mobile-nav-scroll flex-1 overflow-y-auto pb-6">
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileMenuLevel === null ? (
                      <motion.div
                        key="main-menu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                        className="space-y-2"
                      >
                        {/* Main menu: Section cards */}
                        {megaSections.map((section) => {
                          const Icon = getIconForLabel(section.label);
                          return (
                            <button
                              key={section.label}
                              type="button"
                              onClick={() => setMobileMenuLevel(section.label)}
                              className="group flex w-full items-center gap-2.5 rounded-lg border border-[color:var(--mobile-nav-border)] bg-[color:var(--mobile-nav-surface)] px-3 py-2.5 transition-colors hover:bg-[color:var(--mobile-nav-hover)]"
                            >
                              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[color:var(--mobile-nav-border)] bg-[color:color-mix(in_oklch,var(--mobile-nav-surface)_94%,white_6%)] text-[color:var(--mobile-nav-muted)]">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span className="flex-1 text-left text-[0.95rem] font-normal text-[color:var(--mobile-nav-text)]">{section.label}</span>
                              <ChevronRight className="h-4 w-4 text-[color:var(--mobile-nav-muted)] group-hover:text-[color:var(--mobile-nav-text)]" aria-hidden="true" />
                            </button>
                          );
                        })}
                        {/* Simple links on main menu */}
                        {simpleLinks.map((link) => {
                          const href = link.href ?? "#";
                          const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                          const Icon = getIconForLabel(link.label);
                          return (
                            <Link
                              key={link.label}
                              href={href}
                              className={cn(
                                "group flex w-full items-center gap-2.5 rounded-lg border border-[color:var(--mobile-nav-border)] bg-[color:var(--mobile-nav-surface)] px-3 py-2.5 transition-colors",
                                active ? "ring-1 ring-[color:var(--mobile-nav-border)]" : "hover:bg-[color:var(--mobile-nav-hover)]"
                              )}
                            >
                              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[color:var(--mobile-nav-border)] bg-[color:color-mix(in_oklch,var(--mobile-nav-surface)_94%,white_6%)] text-[color:var(--mobile-nav-muted)]">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span className="flex-1 text-left text-[0.95rem] font-normal text-[color:var(--mobile-nav-link)] group-hover:text-[color:var(--mobile-nav-text)]">{link.label}</span>
                              <ChevronRight className="h-4 w-4 text-[color:var(--mobile-nav-muted)] group-hover:text-[color:var(--mobile-nav-text)]" aria-hidden="true" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`submenu-${mobileMenuLevel}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                        className="space-y-3"
                      >
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={() => setMobileMenuLevel(null)}
                          className="group -ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-[color:var(--mobile-nav-muted)] transition hover:text-[color:var(--mobile-nav-text)]"
                        >
                          <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                          <span className="text-sm">Tilbage</span>
                        </button>
                        {/* Section heading */}
                        <h2 className="text-xs font-normal uppercase tracking-[0.24em] text-[color:var(--mobile-nav-heading)]">
                          {mobileMenuLevel}
                        </h2>
                        {/* Submenu items as cards */}
                        <div className="space-y-2">
                          {megaSections
                            .find((s) => s.label === mobileMenuLevel)
                            ?.groups.flatMap((group) =>
                              group.items.map((item) => {
                                const href = item.href ?? "#";
                                const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
                                const Icon = getIconForLabel(item.label);
                                return (
                                  <Link
                                    key={item.label}
                                    href={href}
                                    className={cn(
                                      "group flex w-full items-center gap-2.5 rounded-lg border border-[color:var(--mobile-nav-border)] bg-[color:var(--mobile-nav-surface)] px-3 py-2.5 transition-colors",
                                      active ? "ring-1 ring-[color:var(--mobile-nav-border)]" : "hover:bg-[color:var(--mobile-nav-hover)]"
                                    )}
                                  >
                                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[color:var(--mobile-nav-border)] bg-[color:color-mix(in_oklch,var(--mobile-nav-surface)_94%,white_6%)] text-[color:var(--mobile-nav-muted)]">
                                      <Icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <span className={cn(
                                      "flex-1 text-left text-[0.95rem] font-normal leading-snug",
                                      active ? "text-[color:var(--mobile-nav-text)]" : "text-[color:var(--mobile-nav-link)] group-hover:text-[color:var(--mobile-nav-text)]"
                                    )}>{item.label}</span>
                                    <ChevronRight className="h-4 w-4 text-[color:var(--mobile-nav-muted)] group-hover:text-[color:var(--mobile-nav-text)]" aria-hidden="true" />
                                  </Link>
                                );
                              })
                            )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fixed bottom CTA */}
                <div className="pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] shrink-0">
                  <Link
                    href={ctaHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[color:var(--nav-cta-bg)] border border-[color:var(--nav-cta-border)] px-4 py-2.5 text-sm font-normal text-[color:var(--nav-cta-text)] transition hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)]"
                  >
                    <span>{ctaLabel}</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </MobileBottomSheet>

            {/* Desktop header */}
            <div
              ref={desktopNavRef}
              className={cn(menuShell, "desktop-nav-shell relative hidden md:flex items-center gap-5 px-5 py-2.5")}
            >
              <Link href="/" className="inline-flex items-center shrink-0">
                {(() => {
                  const chosen = isLightAlt ? logos.light : logos.dark;
                  if (chosen?.src) {
                    return (
                      <Image
                        src={chosen.src}
                        alt={chosen.alt}
                        width={chosen.width ?? 150}
                        height={chosen.height ?? 32}
                        className="h-6 w-auto"
                        priority
                      />
                    );
                  }
                  return <span className="text-sm font-normal">{brandTitle}</span>;
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
                    className={cn(
                      "inline-flex items-center justify-center rounded-[5px] border bg-transparent px-2 py-1.5 transition hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-[var(--nav-toggle-ring-offset)]",
                      isOverFooter && currentThemeId === "light-primary"
                        ? "border-transparent text-white"
                        : "border-[color:var(--nav-toggle-border)] text-[color:var(--nav-toggle-text)]"
                    )}
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
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-[5px] border bg-transparent px-3 py-1.5 text-xs font-normal transition-colors hover:border-[color:var(--nav-toggle-hover-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-locale-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]",
                  isOverFooter && currentThemeId === "light-primary"
                    ? "border-transparent text-white"
                    : "border-[color:var(--nav-locale-border)] text-[color:var(--nav-locale-text)]"
                )}
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
