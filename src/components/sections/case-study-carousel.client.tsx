"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CaseStudy } from "@/types/caseStudy";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface CaseStudyCarouselProps {
  items: CaseStudy[];
  initialIndex?: number;
  exploreHref?: string;
  exploreLabel?: string;
  eyebrow?: string;
  headlineText?: string;
  intro?: string;
}

export function CaseStudyCarousel({ items, initialIndex = 0, exploreHref, exploreLabel = "Explore all cases", eyebrow, headlineText, intro }: CaseStudyCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null); // scroll container
  const [index, setIndex] = useState(initialIndex);
  const [perView, setPerView] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [announce, setAnnounce] = useState("");

  // Responsive items per view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // Align with site breakpoints and enforce larger cards:
      // 1 on mobile (< 768), 2 on tablet (>= 768), 3 on desktop (>= 1200)
      const next = w >= 1200 ? 3 : w >= 768 ? 2 : 1;
      setPerView(next);
      setContainerWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Layout constants derived from container width
  const gapPx = useMemo(() => (containerWidth >= 1200 ? 32 : 24), [containerWidth]); // lg:gap-8, base:gap-6
  const peekPx = useMemo(() => {
    if (!containerWidth) return 0;
    const pct = Math.round(containerWidth * 0.1); // 10% of visible width
    return Math.min(pct, 120); // cap at 120px
  }, [containerWidth]);

  // Derived card width and paging math
  const cardWidth = useMemo(() => {
    if (!containerWidth || perView < 1) return 0;
    // cardW = (Wv - P - (C-1)*G) / C
    const w = (containerWidth - peekPx - (perView - 1) * gapPx) / perView;
    return Math.max(0, Math.floor(w));
  }, [containerWidth, perView, gapPx, peekPx]);

  const stepX = useMemo(() => perView * (cardWidth + gapPx), [perView, cardWidth, gapPx]);
  const totalWidth = useMemo(() => (items.length * cardWidth) + Math.max(0, items.length - 1) * gapPx, [items.length, cardWidth, gapPx]);
  const maxOffset = useMemo(() => Math.max(0, totalWidth - containerWidth), [totalWidth, containerWidth]);
  const maxIndex = useMemo(() => (stepX > 0 ? Math.ceil(maxOffset / stepX) : 0), [maxOffset, stepX]);
  const pageCount = maxIndex + 1;

  // Keep index clamped if layout changes
  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  []);

  // Programmatic paging using native scrollLeft
  const scrollToIndex = useCallback((target: number) => {
    const el = containerRef.current;
    if (!el) return;
    const raw = target * stepX;
    const left = Math.min(Math.max(0, Math.round(raw)), Math.round(maxOffset));
    el.scrollTo({ left, behavior: prefersReduced ? "auto" : "smooth" });
    setIndex(target);
    // Announce visible range
    const start = target * perView + 1;
    const end = Math.min(items.length, (target + 1) * perView);
    setAnnounce(`Showing cases ${start}–${end} of ${items.length}`);
  }, [maxOffset, prefersReduced, perView, stepX, items.length]);

  return (
    <div className="group/section">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">{eyebrow}</div>
          ) : null}
          <h2 className="font-semibold text-foreground break-words">
            {headlineText || "Our work"}
          </h2>
          {intro ? (
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">{intro}</p>
          ) : null}
        </div>
        {exploreHref && (
          <a href={exploreHref} className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring rounded-[5px] px-2 py-1 whitespace-nowrap self-start">
            {exploreLabel}
          </a>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative overflow-x-auto overscroll-contain scroll-smooth"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") scrollToIndex(Math.max(0, index - 1));
          if (e.key === "ArrowRight") scrollToIndex(Math.min(maxIndex, index + 1));
        }}
        aria-roledescription="carousel"
        tabIndex={0}
        onScroll={() => {
          const el = containerRef.current;
          if (!el || stepX <= 0) return;
          // debounce-ish snap detection
          const i = Math.round(el.scrollLeft / stepX);
          if (i !== index) setIndex(Math.min(Math.max(0, i), maxIndex));
        }}
      >
        <div className="overflow-hidden">
          <ul
            className="flex"
            style={{ gap: `${gapPx}px`, width: `${Math.max(totalWidth, containerWidth)}px` }}
            aria-live="polite"
          >
            {items.map((item, i) => (
              <li key={item._id || i} className="shrink-0" style={{ width: `${cardWidth}px` }}>
                <CaseCard item={item} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, index - 1))}
            disabled={index <= 0}
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
            onClick={() => scrollToIndex(Math.min(maxIndex, index + 1))}
            disabled={index >= maxIndex}
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
      {/* polite announcement for screen readers */}
      <div aria-live="polite" className="sr-only" role="status">{announce}</div>
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
        <div className="bg-muted/20 h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[420px] relative">
          {videoSrc ? (
            <VideoAuto src={videoSrc} poster={poster} />
          ) : poster ? (
            <Image
              src={poster}
              alt={imageAlt || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
      <div className="mt-4">
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
        <div className="text-foreground text-[1.25rem] font-semibold leading-snug">{item.title}</div>
        {item.excerpt && <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>}
      </div>
    </a>
  );
}

function VideoAuto({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // Respect reduced motion: no autoplay
    let observer: IntersectionObserver | null = null;
    const onVisible = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!el) return;
      if (entry.isIntersecting) {
        el.muted = true;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    };
    observer = new IntersectionObserver(onVisible, { rootMargin: "0px", threshold: 0.35 });
    observer.observe(el);
    return () => observer?.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="metadata"
      playsInline
      muted
      loop
      autoPlay
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
