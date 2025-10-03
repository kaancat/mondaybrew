"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CaseStudy } from "@/types/caseStudy";
import { cn } from "@/lib/utils";

export interface CaseStudyCarouselProps {
  items: CaseStudy[];
  initialIndex?: number;
  exploreHref?: string;
}

export function CaseStudyCarousel({ items, initialIndex = 0, exploreHref }: CaseStudyCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [perView, setPerView] = useState(1);

  // Responsive items per view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const next = w >= 1280 ? 3 : w >= 880 ? 2 : 1;
      setPerView(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageCount = Math.max(1, Math.ceil(items.length / perView));
  const clampedIndex = Math.min(index, pageCount - 1);
  useEffect(() => {
    if (clampedIndex !== index) setIndex(clampedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedIndex]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(pageCount - 1, i + 1)), [pageCount]);

  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  []);

  const slideStyle = {
    transform: `translateX(-${(100 / perView) * index}%)`,
    transition: prefersReduced ? undefined : "transform 400ms var(--ease-out)",
  } as const;

  return (
    <div className="group/section">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Our work</h2>
        {exploreHref && (
          <a href={exploreHref} className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring rounded-[5px] px-2 py-1">
            Explore all cases
          </a>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        aria-roledescription="carousel"
      >
        <div className="overflow-hidden">
          <ul
            className="flex gap-4 will-change-transform"
            style={slideStyle}
            aria-live="polite"
          >
            {items.map((item, i) => (
              <li key={item._id || i} className="min-w-0" style={{ width: `${100 / perView}%` }}>
                <CaseCard item={item} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous cases"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border text-foreground transition",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= pageCount - 1}
            aria-label="Next cases"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border text-foreground transition",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function CaseCard({ item }: { item: CaseStudy }) {
  const href = item.slug ? `/cases/${item.slug}` : "/cases";
  const tags = (item.tags || []).slice(0, 3);
  const media = item.media;

  const poster = media?.poster?.image?.asset?.url || media?.image?.image?.asset?.url;
  const imageAlt = media?.image?.alt || item.title;
  const videoSrc = media?.videoFile?.asset?.url || media?.videoUrl || undefined;

  return (
    <a
      href={href}
      aria-label={`Open ${item.title}`}
      className="group block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring rounded-[5px]"
    >
      <div className="relative rounded-[5px] shadow-[var(--shadow-card,0_24px_48px_rgba(0,0,0,0.12))] overflow-hidden">
        <div className="aspect-video bg-muted/20">
          {videoSrc ? (
            <VideoHover src={videoSrc} poster={poster} />
          ) : poster ? (
            <img src={poster} alt={imageAlt || ""} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
      <div className="mt-3">
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="bg-muted/40 text-muted-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="text-foreground text-xl font-semibold leading-snug">{item.title}</div>
        {item.excerpt && <p className="text-muted-foreground mt-1 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>}
      </div>
    </a>
  );
}

function VideoHover({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => {
      el.muted = true;
      el.play().catch(() => {});
    };
    const onLeave = () => {
      el.pause();
      el.currentTime = 0;
    };
    const parent = el.parentElement?.parentElement;
    parent?.addEventListener("mouseenter", onEnter);
    parent?.addEventListener("mouseleave", onLeave);
    return () => {
      parent?.removeEventListener("mouseenter", onEnter);
      parent?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="metadata"
      playsInline
      muted
      className="h-full w-full object-cover"
    />
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

