"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Search, Share2, Mail, Globe, ShoppingBag, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavbarMegaGroup } from "./navbar.client";
import type { HeroFeatureDisplayItem } from "@/components/sections/hero-feature-carousel";
import { useState, useMemo } from "react";
import Image from "next/image";

/**
 * DesktopMegaMenu: Full-width dropdown menu for desktop navigation
 * 
 * Why: Provides a rich, organized menu experience on desktop that showcases
 * services with icons, descriptions, and featured case studies
 */

export type DesktopMegaMenuProps = {
  label: string;
  groups: NavbarMegaGroup[];
  /** Featured case studies to display in the carousel */
  featuredCases?: HeroFeatureDisplayItem[];
  /** Optional headline for the mega menu (from Sanity) */
  megaMenuHeadline?: string;
  /** Optional description for the mega menu (from Sanity) */
  megaMenuDescription?: string;
};

// Icon mapping for common service types
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
};

function getIconForItem(label?: string): typeof Target {
  if (!label) return Target;
  
  // Exact match
  if (ICON_MAP[label]) {
    return ICON_MAP[label];
  }
  
  // Partial match (case-insensitive)
  const lowerLabel = label.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (lowerLabel.includes(key.toLowerCase())) {
      return icon;
    }
  }
  
  // Default icon
  return Target;
}

export function DesktopMegaMenu({
  label,
  groups,
  featuredCases = [],
  megaMenuHeadline,
  megaMenuDescription,
}: DesktopMegaMenuProps) {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  // Flatten all items from all groups
  const allItems = groups.flatMap((group) => group.items);

  return (
    <div className="w-full rounded-[5px] border border-[color:var(--border)] bg-[color:var(--surface-base)] text-[color:var(--foreground)] shadow-[var(--shadow-elevated-md)]">
      <div className="flex flex-col gap-8 p-8">
        {/* Top Section: Menu Items - Horizontal 2x2 Grid */}
        <div className="flex flex-col gap-4">
          {/* Headline & Description */}
          {(megaMenuHeadline || megaMenuDescription) && (
            <div className="flex flex-col gap-1">
              {megaMenuHeadline && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--text-tertiary,color-mix(in_oklch,var(--foreground)_55%,transparent))]">
                  {megaMenuHeadline}
                </span>
              )}
              {megaMenuDescription && (
                <span className="text-[13px] text-[color:var(--text-secondary,color-mix(in_oklch,var(--foreground)_70%,transparent))]">
                  {megaMenuDescription}
                </span>
              )}
            </div>
          )}

          {/* Feature items - Horizontal 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {allItems.map((item) => {
              const href = item.href ?? "#";
              const active = href !== "#" && (normalizedPath === href || normalizedPath === `${href}/`);
              const Icon = getIconForItem(item.label);

              return (
                <Link
                  key={`${label}-${item.label}`}
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-[8px] px-4 py-3 transition-colors",
                    active
                      ? "bg-[color:color-mix(in_oklch,var(--mb-accent)_8%,transparent)]"
                      : "hover:bg-[color:color-mix(in_oklch,var(--mb-accent)_8%,transparent)]",
                  )}
                >
                  {/* Icon */}
                  {Icon && (
                    <div className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] transition-colors",
                      active
                        ? "bg-[color:var(--mb-accent)] text-white"
                        : "bg-[color:var(--surface-muted,color-mix(in_oklch,var(--foreground)_6%,transparent))] text-[color:var(--text-secondary,color-mix(in_oklch,var(--foreground)_60%,transparent))] group-hover:bg-[color:color-mix(in_oklch,var(--mb-accent)_10%,transparent)] group-hover:text-[color:var(--mb-accent)]"
                    )}>
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </div>
                  )}

                  {/* Text */}
                  <span className={cn(
                    "text-[15px] font-semibold text-[color:var(--foreground)]",
                    !active && "group-hover:text-[color:var(--mb-accent)]"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Featured case studies - Full width */}
        {featuredCases.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-[color:var(--border)] pt-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--text-tertiary,color-mix(in_oklch,var(--foreground)_55%,transparent))]">
              FEATURED CASES
            </span>
            <div className="relative w-full">
              <MegaMenuFeatureCarousel items={featuredCases} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// MegaMenu-specific feature carousel component
function MegaMenuFeatureCarousel({ items }: { items: HeroFeatureDisplayItem[] }) {
  const normalized = useMemo(
    () =>
      items
        .filter((item): item is HeroFeatureDisplayItem => Boolean(item))
        .map((item) => ({
          ...item,
          href: item.href?.trim() || undefined,
        }))
        .filter((item) => item.href || item.title || item.excerpt || item.image?.url),
    [items],
  );
  const [index, setIndex] = useState(0);

  if (!normalized.length) return null;

  const goNext = () => setIndex((prev) => (prev + 1) % normalized.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);

  return (
    <div className="group relative w-full">
      {/* Background glow effect - all themes */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-2 scale-[1.02] rounded-[5px] bg-[radial-gradient(circle_at_18%_20%,rgba(134,118,255,0.32),transparent_74%)] blur-[24px]" />
      </div>

      {/* Card container - glass-morphic in all themes */}
      <div className="relative rounded-[5px] bg-gradient-to-br from-white/36 via-white/14 to-white/4 p-[1px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-white/16 bg-[rgba(14,12,26,0.42)] shadow-[var(--shadow-glass-lg)] backdrop-blur-[22px]">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {normalized.map((item, itemIndex) => {
                const cardHref = item.href?.trim();
                const isLink = Boolean(cardHref);

                return (
                  <article className="w-full shrink-0 p-[6px]" key={item.key || itemIndex}>
                    {isLink && cardHref ? (
                      <Link
                        href={cardHref}
                        className={cn(
                          "flex h-full flex-col overflow-hidden rounded-[5px] text-left outline-none",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                        )}
                      >
                      {/* Image section */}
                      {item.image?.url && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px]">
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || item.title || ""}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            placeholder={item.image.lqip ? "blur" : "empty"}
                            blurDataURL={item.image.lqip}
                          />
                          {/* Pagination indicator */}
                          {normalized.length > 1 && (
                            <div className="absolute right-2 top-2 rounded-[4px] bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                              {itemIndex + 1} / {normalized.length}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content section */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* Meta label */}
                        {item.metaLabel && (
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">
                            {item.metaLabel}
                          </div>
                        )}

                        {/* Title */}
                        {item.title && (
                          <h3 className="mb-2 text-base font-semibold text-white line-clamp-2">
                            {item.title}
                          </h3>
                        )}

                        {/* Excerpt */}
                        {item.excerpt && (
                          <p className="flex-1 text-[13px] leading-relaxed text-white/80 line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                    ) : (
                      <div
                        className={cn(
                          "flex h-full flex-col overflow-hidden rounded-[5px] text-left outline-none",
                        )}
                      >
                      {/* Image section */}
                      {item.image?.url && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px]">
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || item.title || ""}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            placeholder={item.image.lqip ? "blur" : "empty"}
                            blurDataURL={item.image.lqip}
                          />
                          {/* Pagination indicator */}
                          {normalized.length > 1 && (
                            <div className="absolute right-2 top-2 rounded-[4px] bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                              {itemIndex + 1} / {normalized.length}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content section */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* Meta label */}
                        {item.metaLabel && (
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">
                            {item.metaLabel}
                          </div>
                        )}

                        {/* Title */}
                        {item.title && (
                          <h3 className="mb-2 text-base font-semibold text-white line-clamp-2">
                            {item.title}
                          </h3>
                        )}

                        {/* Excerpt */}
                        {item.excerpt && (
                          <p className="flex-1 text-[13px] leading-relaxed text-white/80 line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Navigation arrows */}
          {normalized.length > 1 && (
            <div className="flex items-center justify-end gap-1 p-2">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/55"
                aria-label="Previous case"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/55"
                aria-label="Next case"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
