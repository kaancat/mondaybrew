"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AboutSectionResolvedImage = {
  src?: string | null;
  alt?: string | null;
  blurDataURL?: string | null;
  width?: number;
  height?: number;
};

export type AboutSectionResolvedStat = {
  value?: string | null;
  label?: string | null;
  icon?: AboutSectionResolvedImage | null;
};

type AboutSectionClientProps = {
  eyebrow?: string | null;
  headline?: string | null;
  subheading?: string | null;
  image?: AboutSectionResolvedImage | null;
  stats?: AboutSectionResolvedStat[];
  cta?: {
    label?: string | null;
    href?: string | null;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  } | null;
};

// No per-stat entrance needed for the simplified static panel.

export function AboutSectionClient({ eyebrow, headline, subheading, image, stats = [], cta }: AboutSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // (removed) gridCols helper not used after mobile redesign

  return (
    <div ref={sectionRef} className="relative flex flex-col gap-[var(--flow-space)]">
      <div className="flex flex-col gap-[calc(var(--flow-space)/1.4)] w-full lg:max-w-[78ch] xl:max-w-[82ch]">
        {eyebrow ? (
          <p className="eyebrow text-[length:var(--font-tight)] uppercase tracking-[0.3em] text-[color:var(--eyebrow-color,var(--accent))]">
            {eyebrow}
          </p>
        ) : null}
        {headline ? (
          <h2 className="text-balance text-[color:var(--foreground)]">
            {headline}
          </h2>
        ) : null}
        {subheading ? (
          <p className="max-w-[78ch] text-[length:var(--font-body)] leading-[1.7] text-muted-foreground">
            {subheading}
          </p>
        ) : null}
      </div>

      <div className={cn("relative isolate", isMobile ? "full-bleed" : undefined)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-[5px]",
            "drop-shadow-[0_36px_110px_rgba(8,6,20,0.28)]",
          )}
        >
          <div className="aspect-[4/3] md:aspect-[16/6]" />

          {/* Image layer with its own mask and parallax (prevents the bottom fade from affecting overlay text) */}
          {image?.src ? (
            <div
              aria-hidden
              className="absolute inset-0 w-full h-full md:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]"
            >
              <Image
                src={image.src!}
                alt={image.alt || "About us hero"}
                fill
                loading="lazy"
                placeholder={image.blurDataURL ? "blur" : undefined}
                blurDataURL={image.blurDataURL || undefined}
                sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 92vw"
                className="object-cover md:object-center object-[55%_center] scale-100 md:scale-100"
                priority={false}
              />
            </div>
          ) : null}
          {!isMobile ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, transparent 40%, color-mix(in_oklch,var(--card)_55%, white 45%) 47%, transparent 55%)",
                backgroundSize: "250% 250%",
              }}
            />
          ) : null}

          {/* Overlay moved outside (see below) to allow covering both image and the spacer container */}
        </div>
        {/* Stats glass bar anchored at image bottom (matches Media Showcase styling) */}
        {stats.length ? (
          <div className="z-10">
            {/* Mobile: stack stats in responsive grid (matches media showcase) */}
            <div className="block md:hidden w-full pt-4">
              <div className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2">
                {stats.map((stat, i) => (
                  <div
                    key={`${stat.label || stat.value || i}`}
                    className="about-stats-card px-4 py-3"
                  >
                    {stat.value ? (
                      <div data-stat-value className="text-[length:var(--font-h3)] font-bold leading-none">{stat.value}</div>
                    ) : null}
                    {stat.label ? <div data-stat-label className="mt-1 text-sm leading-relaxed">{stat.label}</div> : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: full-width glass bar attached to image bottom */}
            <div className="about-stats-panel hidden md:block md:absolute md:inset-x-0 md:bottom-0">
              <div
                className={cn(
                  "w-full rounded-t-0 rounded-b-[5px] border border-t md:border md:border-t border-[color:var(--nav-shell-border)]",
                  "bg-[color-mix(in_oklch,var(--nav-shell-bg)_68%,transparent)] backdrop-blur-[12px]",
                  "px-8 py-4 drop-shadow-[0_18px_38px_rgba(8,6,20,0.18)]",
                )}
                style={{ boxShadow: "var(--nav-shell-shadow)" }}
              >
                <dl
                  className={cn(
                    "grid gap-x-6 gap-y-2",
                    stats.length >= 4
                      ? "grid-cols-4"
                      : stats.length === 3
                        ? "grid-cols-3"
                        : stats.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-1",
                  )}
                >
                  {stats.map((stat, i) => (
                    <div key={`${stat.label || stat.value || i}`} className="flex items-start gap-3 flex-col items-center text-center">
                      {stat.value ? (
                        <div data-stat-value className="text-[length:var(--font-h3)] leading-none text-primary">{stat.value}</div>
                      ) : null}
                      {stat.label ? <div data-stat-label className="text-muted-foreground">{stat.label}</div> : null}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {cta?.label && cta?.href ? (
        <div>
          <Button asChild variant={cta.variant ?? "default"}>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// Removed animated/stat formatting utilities — values render static like Media Showcase
