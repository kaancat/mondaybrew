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
  const frameRef = useRef<HTMLDivElement>(null); // non-scrolling frame
  const scrollerRef = useRef<HTMLDivElement>(null); // scrollable track
  const [index, setIndex] = useState(initialIndex);
  const [perView, setPerView] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [announce, setAnnounce] = useState("");
  const snapTimeoutRef = useRef<number | null>(null);

  // Responsive items per view
  useEffect(() => {
    const el = frameRef.current;
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
    // Fallback for browsers where RO may not fire as expected
    const update = () => {
      const w = el.getBoundingClientRect().width;
      const next = w >= 1200 ? 3 : w >= 768 ? 2 : 1;
      setPerView(next);
      setContainerWidth(Math.floor(w));
    };
    window.addEventListener("resize", update);
    update();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
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
  const epsilon = 1; // px tolerance
  const snapPoints = useMemo(() => {
    const pts: number[] = [];
    if (stepX <= 0) return [0];
    for (let p = 0; p * stepX <= maxOffset + epsilon; p++) {
      const val = Math.round(Math.min(p * stepX, maxOffset));
      if (!pts.length || Math.abs(pts[pts.length - 1] - val) > epsilon) pts.push(val);
    }
    if (pts[pts.length - 1] !== Math.round(maxOffset)) pts.push(Math.round(maxOffset));
    return pts;
  }, [stepX, maxOffset]);
  const lastIndex = snapPoints.length - 1;

  // Keep index clamped if layout changes
  useEffect(() => {
    if (index > lastIndex) setIndex(lastIndex);
  }, [lastIndex, index]);

  // Arrows use scrollToIndex; no standalone prev/next needed

  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  []);

  // Programmatic paging using native scrollLeft
  const scrollToIndex = useCallback((target: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(target, lastIndex));
    const left = snapPoints[clamped] ?? 0;
    el.scrollTo({ left, behavior: prefersReduced ? "auto" : "smooth" });
    setIndex(clamped);
    // Announce visible range
    const start = clamped * perView + 1;
    const end = Math.min(items.length, (clamped + 1) * perView);
    setAnnounce(`Showing cases ${start}–${end} of ${items.length}`);
  }, [prefersReduced, perView, items.length, lastIndex, snapPoints]);

  const nearestIndex = useCallback((left: number) => {
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < snapPoints.length; i++) {
      const d = Math.abs(snapPoints[i] - left);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }, [snapPoints]);

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
        ref={frameRef}
        className="relative"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") scrollToIndex(index - 1);
          if (e.key === "ArrowRight") scrollToIndex(index + 1);
        }}
        aria-roledescription="carousel"
        tabIndex={0}
      >
        <div
          ref={scrollerRef}
          className="no-scrollbar overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x"
          onScroll={() => {
            const el = scrollerRef.current;
            if (!el || stepX <= 0) return;
            const i = nearestIndex(el.scrollLeft);
            if (i !== index) setIndex(i);
            // snap after idle
            if (snapTimeoutRef.current) window.clearTimeout(snapTimeoutRef.current);
            const anchor = index;
            const threshold = Math.max(0.2 * stepX, 1);
            snapTimeoutRef.current = window.setTimeout(() => {
              if (!el) return;
              const sl = el.scrollLeft;
              const base = snapPoints[anchor] ?? 0;
              const delta = sl - base;
              let target = anchor;
              if (delta > threshold && anchor < lastIndex) target = anchor + 1;
              else if (delta < -threshold && anchor > 0) target = anchor - 1;
              else target = nearestIndex(sl);
              scrollToIndex(target);
            }, 140);
          }}
        >
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
      </div>
      {/* Controls bar below, fixed (not inside scroller) */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollToIndex(index - 1)}
          disabled={index <= 0}
          aria-label="Previous cases"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(index + 1)}
          disabled={index >= lastIndex}
          aria-label="Next cases"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <ArrowRightIcon />
        </button>
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
