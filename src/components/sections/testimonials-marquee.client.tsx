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
  type ReactNode,
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

type ToneKey = "surface" | "charcoal" | "accent";

type ToneStyle = {
  background: string;
  ink: string;
  sub: string;
  divider: string;
  border: string;
  ctaInk?: string;
};

export type TCard = {
  variant: "image" | "quote" | "imageQuote";
  background?: string | null;
  logo?: TImage;
  image?: TImage;
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  cta?: { label?: string | null; href?: string | null } | null;
  tone?: ToneKey | "auto" | null;
  colors?: ToneStyle;
};

export type TestimonialsClientProps = {
  top: TCard[];
  bottom: TCard[];
  speedTop?: number;
  speedBottom?: number;
};

const CARD_WIDTHS: Record<TCard["variant"], number> = {
  quote: 460,
  imageQuote: 780,
  image: 780,
};

const CARD_GAP = 32; // px spacing applied symmetrically around each card

const TONE_PRESETS: Record<ToneKey, ToneStyle> = {
  surface: {
    background: "var(--surface-elevated)",
    ink: "var(--brand-ink-strong)",
    sub: "color-mix(in oklch, var(--brand-ink-strong) 70%, transparent 30%)",
    divider: "color-mix(in oklch, var(--brand-ink-strong) 14%, transparent 86%)",
    border: "color-mix(in oklch, var(--brand-ink-strong) 18%, transparent 82%)",
    ctaInk: "var(--brand-ink-strong)",
  },
  charcoal: {
    background: "color-mix(in oklch, var(--surface-dark) 92%, transparent 8%)",
    ink: "var(--brand-light)",
    sub: "color-mix(in oklch, var(--brand-light) 80%, transparent 20%)",
    divider: "color-mix(in oklch, var(--brand-light) 28%, transparent 72%)",
    border: "color-mix(in oklch, var(--brand-light) 24%, transparent 76%)",
    ctaInk: "var(--brand-light)",
  },
  accent: {
    background: "color-mix(in oklch, var(--accent) 88%, var(--surface-base) 12%)",
    ink: "var(--brand-light)",
    sub: "color-mix(in oklch, var(--brand-light) 82%, transparent 18%)",
    divider: "color-mix(in oklch, var(--brand-light) 32%, transparent 68%)",
    border: "color-mix(in oklch, var(--brand-light) 28%, transparent 72%)",
    ctaInk: "var(--brand-light)",
  },
};

const TONE_SEQUENCE: ToneKey[] = ["surface", "charcoal", "accent"];

const LIGHT_INK = "var(--brand-light)";
const DARK_INK = "var(--brand-ink-strong)";

const LIGHT_SUB = "color-mix(in oklch, var(--brand-light) 80%, transparent 20%)";
const LIGHT_DIVIDER = "color-mix(in oklch, var(--brand-light) 32%, transparent 68%)";
const LIGHT_BORDER = "color-mix(in oklch, var(--brand-light) 26%, transparent 74%)";
const DARK_SUB = "color-mix(in oklch, var(--brand-ink-strong) 70%, transparent 30%)";
const DARK_DIVIDER = "color-mix(in oklch, var(--brand-ink-strong) 18%, transparent 82%)";
const DARK_BORDER = "color-mix(in oklch, var(--brand-ink-strong) 14%, transparent 86%)";

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
  if (!rgb) return DARK_INK;
  // relative luminance
  const a = [rgb.r, rgb.g, rgb.b].map(v=>{
    const s = v/255;
    return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055,2.4);
  });
  const L = 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
  return L > 0.5 ? DARK_INK : LIGHT_INK;
}

function deriveColorsFromBackground(background: string): ToneStyle {
  const ink = pickInk(background);
  if (ink === LIGHT_INK) {
    return {
      background,
      ink,
      sub: LIGHT_SUB,
      divider: LIGHT_DIVIDER,
      border: LIGHT_BORDER,
      ctaInk: LIGHT_INK,
    };
  }
  return {
    background,
    ink,
    sub: DARK_SUB,
    divider: DARK_DIVIDER,
    border: DARK_BORDER,
    ctaInk: DARK_INK,
  };
}

function CardLogo({ card, className }: { card: TCard; className?: string }) {
  if (!card.logo?.url) return null;
  return (
    <div className={cn("relative h-6 w-24 opacity-90", className)}>
      <Image src={card.logo.url} alt={card.logo.alt || ""} fill className="object-contain" sizes="96px" />
    </div>
  );
}

function CardFrame({ card, children }: { card: TCard; children: ReactNode }) {
  const width = CARD_WIDTHS[card.variant];
  return (
    <div
      className="group/card relative shrink-0"
      style={{ width, minWidth: width, flex: "0 0 auto", marginInline: CARD_GAP / 2 }}
    >
      {children}
    </div>
  );
}

function CardCta({ card, colors, className }: { card: TCard; colors: ToneStyle; className?: string }) {
  if (!card.cta?.label || !card.cta.href) return null;
  const ink = colors.ctaInk ?? colors.ink;
  return (
    <div
      className={cn("border-t pt-4", className)}
      style={{ borderColor: colors.border }}
    >
      <div className="flex items-center justify-between text-sm" style={{ color: ink }}>
        <Link href={card.cta.href} className="underline-offset-4 hover:underline">
          {card.cta.label}
        </Link>
        <span aria-hidden>→</span>
      </div>
    </div>
  );
}

function QuoteCard({ card }: { card: TCard }) {
  const colors = card.colors ?? deriveColorsFromBackground(card.background ?? TONE_PRESETS.surface.background);

  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full flex-col rounded-[10px] p-8",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
        style={{ background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <CardLogo card={card} className="mb-8 self-start" />

        <div className="flex flex-1 flex-col gap-6">
          {card.quote ? (
            <blockquote className="text-balance text-[1.65rem] leading-snug" style={{ color: colors.ink }}>
              “{card.quote}”
            </blockquote>
          ) : null}

          <div className="h-px w-12" style={{ background: colors.divider }} />

          <div className="text-sm font-medium uppercase tracking-[0.18em]" style={{ color: colors.sub }}>
            {card.author}
            {card.role ? <span className="opacity-70"> — {card.role}</span> : null}
          </div>
        </div>

        <CardCta card={card} colors={colors} className="mt-8" />
      </div>
    </CardFrame>
  );
}

function ImageQuoteCard({ card }: { card: TCard }) {
  if (!card.image?.url) return null;
  const colors = card.colors ?? deriveColorsFromBackground(card.background ?? TONE_PRESETS.surface.background);

  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h-[340px] overflow-hidden rounded-[10px]",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
        style={{ background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <div className="relative flex-[0_0_46%] min-w-[210px]">
          <Image
            src={card.image.url}
            alt={card.image.alt || ""}
            fill
            sizes="(max-width: 768px) 70vw, 360px"
            placeholder={card.image.lqip ? "blur" : undefined}
            blurDataURL={card.image.lqip || undefined}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-6" style={{ background: colors.background, color: colors.ink }}>
          <CardLogo card={card} className="mb-8 self-start" />
          <div className="flex flex-col gap-6">
            {card.quote ? (
              <blockquote className="text-balance text-[1.65rem] leading-snug" style={{ color: colors.ink }}>
                “{card.quote}”
              </blockquote>
            ) : null}

            <div className="h-px w-12" style={{ background: colors.divider }} />

            <div className="text-sm font-medium uppercase tracking-[0.18em]" style={{ color: colors.sub }}>
              {card.author}
              {card.role ? <span className="opacity-70"> — {card.role}</span> : null}
            </div>
          </div>

          <CardCta card={card} colors={colors} className="mt-auto" />
        </div>
      </div>
    </CardFrame>
  );
}

function ImageOnlyCard({ card }: { card: TCard }) {
  if (!card.image?.url) return null;
  const colors = card.colors ?? TONE_PRESETS.charcoal;
  const captionColor = colors.ctaInk ?? colors.ink;

  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h-[340px] overflow-hidden rounded-[10px]",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
      >
        <Image
          src={card.image.url}
          alt={card.image.alt || ""}
          fill
          sizes="(max-width: 768px) 80vw, 480px"
          placeholder={card.image.lqip ? "blur" : undefined}
          blurDataURL={card.image.lqip || undefined}
          className="h-full w-full object-cover"
        />
        <CardLogo card={card} className="absolute left-6 top-6 z-10" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{ backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, transparent 100%)" }}
        />
        {card.cta?.label && card.cta?.href ? (
          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t px-6 py-4 text-sm"
            style={{ borderColor: colors.border, background: "rgba(0,0,0,0.68)", color: captionColor }}
          >
            <Link
              href={card.cta.href}
              className="pointer-events-auto font-medium uppercase tracking-[0.18em] underline-offset-4 hover:underline"
            >
              {card.cta.label}
            </Link>
            <span aria-hidden>→</span>
          </div>
        ) : null}
      </div>
    </CardFrame>
  );
}

function Card({ card }: { card: TCard }) {
  if (card.variant === "image") {
    return <ImageOnlyCard card={card} />;
  }
  if (card.variant === "imageQuote") {
    return <ImageQuoteCard card={card} />;
  }
  return <QuoteCard card={card} />;
}

function Row({ items, speed = 30, direction = 1 }: { items: TCard[]; speed?: number; direction?: 1 | -1 }) {
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const raw = card.background?.trim();
      const toneKey: ToneKey = (card.tone && card.tone !== "auto" ? card.tone : TONE_SEQUENCE[i % TONE_SEQUENCE.length]) as ToneKey;
      const preset = TONE_PRESETS[toneKey];
      const usesToken = raw ? raw.startsWith("var(") || raw.includes("var(--") : false;

      if (raw && !usesToken) {
        const derived = deriveColorsFromBackground(raw);
        return { ...card, tone: toneKey, background: raw, colors: derived };
      }

      const background = raw && usesToken ? raw : preset.background;
      const colors: ToneStyle = raw && usesToken ? { ...preset, background: raw } : preset;
      return { ...card, tone: toneKey, background, colors };
    });
  }, [items]);

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
  
  // Momentum scrolling state
  const velocityRef = useRef(0);
  const lastPosRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumRafRef = useRef<number | null>(null);

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

  // Cancel momentum animation
  const cancelMomentum = useCallback(() => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
    velocityRef.current = 0;
  }, []);

  // Define setOffsetSafe first (used by applyMomentum)
  const setOffsetSafe = useCallback(
    (value: number) => {
      let next = value;
      const width = setWidth;
      if (width) {
        const limit = width;
        while (next > limit) next -= limit;
        while (next < -limit) next += limit;
      }
      offsetRef.current = next;
      setOffset(next);
    },
    [setWidth],
  );

  // Apply momentum/inertia scrolling after drag release
  const applyMomentum = useCallback(() => {
    cancelMomentum();
    
    const friction = 0.92; // Controls how quickly momentum decays
    const minVelocity = 0.1; // Minimum velocity before stopping
    
    const animate = () => {
      const vel = velocityRef.current;
      
      if (Math.abs(vel) < minVelocity) {
        velocityRef.current = 0;
        momentumRafRef.current = null;
        setIsInteracting(false);
        return;
      }
      
      velocityRef.current *= friction;
      setOffsetSafe(offsetRef.current + vel);
      momentumRafRef.current = requestAnimationFrame(animate);
    };
    
    if (Math.abs(velocityRef.current) >= minVelocity) {
      momentumRafRef.current = requestAnimationFrame(animate);
    } else {
      setIsInteracting(false);
    }
  }, [cancelMomentum, setOffsetSafe]);

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
  }, [normalizedItems]);

  useEffect(() => {
    setOffsetSafe(offsetRef.current);
  }, [setOffsetSafe]);

  useEffect(
    () => () => {
      clearInteractionTimeout();
      cancelMomentum();
    },
    [clearInteractionTimeout, cancelMomentum],
  );

  const trackStyle = useMemo(() => {
    if (!setWidth) return undefined;
    return {
      "--marquee-distance": `${-setWidth}px`,
      "--marquee-duration": `${duration}s`,
      animationDirection: direction === 1 ? "normal" : "reverse",
      animationPlayState: isInteracting ? "paused" : "running",
      willChange: "transform",
    } as CSSProperties;
  }, [setWidth, duration, direction, isInteracting]);

  const wrapperStyle = useMemo(
    () => ({
      transform: `translate3d(${-offset}px, 0, 0)`,
      willChange: "transform",
    }),
    [offset],
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      cancelMomentum();
      setOffsetSafe(offsetRef.current + event.deltaX);
      setIsInteracting(true);
      clearInteractionTimeout();
      interactionTimeoutRef.current = setTimeout(() => {
        interactionTimeoutRef.current = null;
        setIsInteracting(false);
      }, 200);
    },
    [cancelMomentum, clearInteractionTimeout, setOffsetSafe],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!viewportRef.current) return;
      
      // Cancel any ongoing momentum
      cancelMomentum();
      
      pointerIdRef.current = event.pointerId;
      viewportRef.current.setPointerCapture(event.pointerId);
      event.preventDefault();
      
      startXRef.current = event.clientX;
      startOffsetRef.current = offsetRef.current;
      lastPosRef.current = event.clientX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
      
      setIsDragging(true);
      setIsInteracting(true);
      clearInteractionTimeout();
    },
    [cancelMomentum, clearInteractionTimeout],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging || pointerIdRef.current !== event.pointerId) return;
      event.preventDefault();
      
      // Calculate velocity for momentum
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      const dx = event.clientX - lastPosRef.current;
      
      if (dt > 0) {
        // Smooth velocity calculation (pixels per frame, roughly 16ms target)
        velocityRef.current = -(dx / dt) * 16;
      }
      
      lastPosRef.current = event.clientX;
      lastTimeRef.current = now;
      
      const totalDx = startXRef.current - event.clientX;
      setOffsetSafe(startOffsetRef.current + totalDx);
    },
    [isDragging, setOffsetSafe],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return;
      event.preventDefault();
      
      pointerIdRef.current = null;
      setIsDragging(false);
      
      if (viewportRef.current?.hasPointerCapture?.(event.pointerId)) {
        viewportRef.current.releasePointerCapture(event.pointerId);
      }
      
      clearInteractionTimeout();
      
      // Apply momentum based on final velocity
      if (!prefersReducedMotion && Math.abs(velocityRef.current) > 0.5) {
        applyMomentum();
      } else {
        setIsInteracting(false);
        velocityRef.current = 0;
      }
    },
    [applyMomentum, clearInteractionTimeout, prefersReducedMotion],
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
      onWheel={handleWheel}
      data-dragging={isDragging ? "true" : "false"}
      style={{ touchAction: "pan-y" }}
    >
      <div className="flex py-2" style={wrapperStyle}>
        <div className={cn("flex", !prefersReducedMotion && setWidth ? "marquee-track" : undefined)} style={trackStyle}>
          {clones.map((_, idx) => (
            <div
              key={idx}
              ref={idx === 0 ? setRef : undefined}
              className="flex"
              aria-hidden={idx > 0}
            >
              {normalizedItems.map((card, i) => (
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
