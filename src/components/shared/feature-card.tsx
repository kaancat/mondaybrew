"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

/**
 * FeatureCard: Reusable glass-morphic card component
 * 
 * Why: Extracted from HeroFeatureCarousel to be reused across the site,
 * including in the desktop mega menu for case study showcases.
 * 
 * Features:
 * - Glass-morphic design with gradient borders
 * - Optional image with gradient overlay
 * - Backdrop blur and shadow effects
 * - Hover glow effect
 * - Supports both link and static variants
 */

export type FeatureCardProps = {
  title?: string | null;
  excerpt?: string | null;
  href?: string;
  metaLabel?: string | null;
  image?: {
    url?: string;
    alt?: string;
    lqip?: string;
  } | null;
  className?: string;
  /** If true, shows a more compact layout suitable for mega menu */
  compact?: boolean;
};

export function FeatureCard({
  title,
  excerpt,
  href,
  metaLabel,
  image,
  className,
  compact = false,
}: FeatureCardProps) {
  const isLink = Boolean(href?.trim());
  const CardWrapper: ElementType = isLink ? Link : "div";

  return (
    <div className={cn("group relative", className)}>
      {/* Hover glow effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-4 scale-[1.05] rounded-[5px] bg-[radial-gradient(circle_at_18%_20%,rgba(134,118,255,0.32),transparent_74%)] blur-[36px]" />
      </div>

      {/* Gradient border wrapper */}
      <div className="relative rounded-[5px] bg-gradient-to-br from-white/36 via-white/14 to-white/4 p-[1px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-white/16 bg-[rgba(14,12,26,0.42)] shadow-[var(--shadow-glass-lg)] backdrop-blur-[22px]">
          <CardWrapper
            {...(isLink ? { href } : {})}
            className={cn(
              "flex h-full flex-col overflow-hidden rounded-[5px] text-left outline-none",
              isLink &&
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
            )}
          >
            {/* Image section */}
            {image?.url ? (
              <div className={cn(
                "relative w-full overflow-hidden rounded-[5px]",
                compact ? "aspect-[16/10]" : "aspect-[16/9] sm:aspect-[4/3]"
              )}>
                <Image
                  src={image.url}
                  alt={image.alt || title || "Feature image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  placeholder={image.lqip ? "blur" : undefined}
                  blurDataURL={image.lqip}
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[5px] bg-gradient-to-b from-white/12 via-transparent to-black/42" />
                
                {/* Meta label badge */}
                {metaLabel ? (
                  <div className="absolute right-3 top-3 flex h-7 min-w-[3.2rem] items-center justify-center rounded-full bg-black/35 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/85 leading-none">
                    {metaLabel}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Content section */}
            <div className={cn(
              "flex flex-1 flex-col gap-2",
              compact ? "px-4 pb-4 pt-3" : "px-4 pb-4 pt-3 sm:gap-3 sm:px-6 sm:pb-6 sm:pt-4"
            )}>
              {title ? (
                <h3 className={cn(
                  "font-semibold leading-tight tracking-tight text-white",
                  compact ? "text-[1.05rem]" : "text-[1.05rem] sm:text-[1.2rem] md:text-[1.5rem]"
                )}>
                  {title}
                </h3>
              ) : null}
              {excerpt ? (
                <p className={cn(
                  "text-white/78 line-clamp-2",
                  compact ? "text-[0.9rem]" : "text-[0.95rem] sm:text-[1rem] md:text-[1.08rem] sm:line-clamp-3"
                )}>
                  {excerpt}
                </p>
              ) : null}
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}





