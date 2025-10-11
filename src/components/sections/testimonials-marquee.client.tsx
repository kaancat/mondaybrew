"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

export type TImage = {
  url?: string | null;
  alt?: string | null;
  lqip?: string | null;
  width?: number;
  height?: number;
} | null;

export type TCard = {
  variant: "image" | "quote" | "imageQuote";
  background?: string | null;
  logo?: TImage;
  image?: TImage;
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  cta?: { label?: string | null; href?: string | null } | null;
};

export type TestimonialsClientProps = {
  top: TCard[];
  bottom: TCard[];
  speedTop?: number;
  speedBottom?: number;
};

// simple luminance check to pick ink
function hexToRgb(hex?: string | null) {
  if (!hex) return null;
  const h = hex.replace("#","");
  if (h.length !== 6) return null;
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return { r,g,b };
}
function pickInk(bg?: string | null) {
  const rgb = hexToRgb(bg || "");
  if (!rgb) return "var(--brand-ink-strong)";
  // relative luminance
  const a = [rgb.r, rgb.g, rgb.b].map(v=>{
    const s = v/255;
    return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055,2.4);
  });
  const L = 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
  return L > 0.5 ? "#0a0a0a" : "#ffffff";
}

function Card({ card }: { card: TCard }) {
  const bg = card.background || undefined;
  const ink = pickInk(bg);
  const textClass = ink === "#ffffff" ? "text-white" : "text-[color:var(--brand-ink-strong)]";
  const subClass = ink === "#ffffff" ? "text-white/80" : "text-[color:color-mix(in_oklch,var(--brand-ink-strong)_70%,white_30%)]";

  return (
    <div className="group/card relative min-w-[340px] max-w-[520px] shrink-0">
      <div
        className={cn(
          "card-inner relative flex h-full flex-col rounded-[10px] p-6",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
        style={{ background: bg ?? "var(--card)", color: ink, transformOrigin: "center" }}
      >
        {card.logo?.url ? (
          <div className="absolute right-4 top-4 h-6 w-24 opacity-90">
            <Image src={card.logo.url} alt={card.logo.alt || ""} fill className="object-contain" />
          </div>
        ) : null}

      {card.variant !== "quote" && card.image?.url ? (
        <div className="mb-4 overflow-hidden rounded-[6px]">
          <Image
            src={card.image.url}
            alt={card.image.alt || ""}
            width={Math.min(card.image.width || 960, 960)}
            height={Math.min(card.image.height || 600, 600)}
            placeholder={card.image.lqip ? "blur" : undefined}
            blurDataURL={card.image.lqip || undefined}
            className="h-40 w-full object-cover"
          />
        </div>
      ) : null}

      {card.variant !== "image" && card.quote ? (
        <blockquote className={cn("text-balance text-xl leading-[1.35]", textClass)}>
          “{card.quote}”
        </blockquote>
      ) : null}

      <div className="mt-4 h-px w-full bg-current/20" />

      <div className={cn("mt-3 text-sm font-medium uppercase tracking-[0.18em]", subClass)}>
        {card.author}
        {card.role ? <span className="opacity-70"> — {card.role}</span> : null}
      </div>

      {card.cta?.label && card.cta?.href ? (
        <div className={cn("mt-4 flex items-center justify-between text-sm", subClass)}>
          <Link href={card.cta.href} className="underline-offset-4 hover:underline">
            {card.cta.label}
          </Link>
          <span aria-hidden>→</span>
        </div>
      ) : null}
      </div>
    </div>
  );
}

function Row({ items, speed = 30, direction = 1 }: { items: TCard[]; speed?: number; direction?: 1 | -1 }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const setRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const offsetRef = useRef(0);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeSpeed = Math.max(1, speed);
  const duration = useMemo(() => (setWidth > 0 ? setWidth / safeSpeed : 12), [setWidth, safeSpeed]);

  const repeatCount = useMemo(() => {
    if (prefersReducedMotion) return 1;
    if (!setWidth || !viewportWidth) return 3;
    return Math.max(2, Math.ceil(viewportWidth / setWidth) + 2);
  }, [setWidth, viewportWidth, prefersReducedMotion]);

  const clones = useMemo(() => Array.from({ length: repeatCount }), [repeatCount]);

  const clearInteractionTimeout = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  }, []);

  const setOffsetSafe = useCallback(
    (value: number) => {
      if (!setWidth) {
        offsetRef.current = value;
        setOffset(value);
        return;
      }
      const width = setWidth;
      let next = value % width;
      if (next < 0) next += width;
      offsetRef.current = next;
      setOffset(next);
    },
    [setWidth],
  );

  useLayoutEffect(() => {
    const setEl = setRef.current;
    const vpEl = viewportRef.current;
    if (!setEl || !vpEl) return;

    const measure = () => {
      setSetWidth(setEl.offsetWidth);
      setViewportWidth(vpEl.offsetWidth);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(setEl);
    observer.observe(vpEl);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    setOffsetSafe(offsetRef.current);
  }, [setOffsetSafe]);

  useEffect(
    () => () => {
      clearInteractionTimeout();
    },
    [clearInteractionTimeout],
  );

  const trackStyle = useMemo(() => {
    if (!setWidth) return undefined;
    return {
      "--marquee-distance": `${-setWidth}px`,
      "--marquee-duration": `${duration}s`,
      animationDirection: direction === 1 ? "normal" : "reverse",
      animationPlayState: isInteracting ? "paused" : "running",
      willChange: "transform",
    } satisfies CSSProperties;
  }, [setWidth, duration, direction, isInteracting]);

  const wrapperStyle = useMemo(() => {
    if (!setWidth && offset === 0) return undefined;
    return {
      transform: `translate3d(${-offset}px, 0, 0)`,
      willChange: "transform",
    } satisfies CSSProperties;
  }, [offset, setWidth]);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      setOffsetSafe(offsetRef.current + event.deltaX);
      setIsInteracting(true);
      clearInteractionTimeout();
      interactionTimeoutRef.current = setTimeout(() => {
        interactionTimeoutRef.current = null;
        setIsInteracting(false);
      }, 200);
    },
    [clearInteractionTimeout, setOffsetSafe],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!viewportRef.current) return;
      pointerIdRef.current = event.pointerId;
      viewportRef.current.setPointerCapture(event.pointerId);
      startXRef.current = event.clientX;
      startOffsetRef.current = offsetRef.current;
      setIsDragging(true);
      setIsInteracting(true);
      clearInteractionTimeout();
    },
    [clearInteractionTimeout],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging || pointerIdRef.current !== event.pointerId) return;
      const dx = startXRef.current - event.clientX;
      setOffsetSafe(startOffsetRef.current + dx);
    },
    [isDragging, setOffsetSafe],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return;
      pointerIdRef.current = null;
      setIsDragging(false);
      setIsInteracting(false);
      clearInteractionTimeout();
      viewportRef.current?.releasePointerCapture(event.pointerId);
    },
    [clearInteractionTimeout],
  );

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative overflow-hidden",
        !prefersReducedMotion ? "no-scrollbar" : undefined,
        isDragging ? "cursor-[grabbing]" : "cursor-[grab]",
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onWheel={handleWheel}
      data-dragging={isDragging ? "true" : "false"}
    >
      <div className="flex py-2" style={wrapperStyle}>
        <div className={cn("flex", !prefersReducedMotion && setWidth ? "marquee-track" : undefined)} style={trackStyle}>
          {clones.map((_, idx) => (
            <div
              key={idx}
              ref={idx === 0 ? setRef : undefined}
              className="flex gap-6 pr-6"
              aria-hidden={idx > 0}
            >
              {items.map((card, i) => (
                <Card key={`${idx}-${i}`} card={card} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsMarqueeClient({ top, bottom, speedTop = 30, speedBottom = 24 }: TestimonialsClientProps) {
  return (
    <div className="relative flex flex-1 flex-col justify-end">
      {/* subtle peek of bottom row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[12vh] bg-gradient-to-t from-background to-transparent" />
      <div className="flex flex-col gap-3 pb-3">
        <Row items={top} speed={speedTop} direction={1} />
        <Row items={bottom} speed={speedBottom} direction={-1} />
      </div>
    </div>
  );
}
