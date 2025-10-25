"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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

type ModeKey = "primary" | "lightAlt" | "dark";

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
  tone?: ModeKey | "auto" | null;
  colors?: ToneStyle;
};

export type TestimonialsClientProps = {
  top: TCard[];
  bottom: TCard[];
  speedTop?: number;
  speedBottom?: number;
};

// Card width rules
const QUOTE_WIDTH = 600; // desired copy column width
const IMAGE_ONLY_WIDTH = 780;
const IMAGE_QUOTE_IMAGE_BASIS = 0.44; // 44% image, 56% text

const CARD_WIDTHS: Record<TCard["variant"], number> = {
  quote: QUOTE_WIDTH,
  // Ensure the text column on Image+Text matches the Quote card width
  // total = textWidth / (1 - imageBasis)
  imageQuote: Math.round(QUOTE_WIDTH / (1 - IMAGE_QUOTE_IMAGE_BASIS)),
  image: IMAGE_ONLY_WIDTH,
};

const CARD_GAP = 32; // px spacing applied symmetrically around each card

// Single source of truth for mobile card height so top/bottom rows match exactly
const MOBILE_CARD_HEIGHT = "clamp(220px, 54vw, 300px)" as const;

// Map Service card presets (Primary, Light Alt, Dark) to concrete tones
const MODE_PRESETS: Record<ModeKey, ToneStyle> = {
  primary: {
    background: "var(--surface-dark)",
    ink: "var(--brand-light)",
    sub: "color-mix(in oklch, var(--brand-light) 82%, transparent 18%)",
    divider: "color-mix(in oklch, var(--brand-light) 32%, transparent 68%)",
    border: "color-mix(in oklch, var(--brand-light) 26%, transparent 74%)",
    ctaInk: "var(--brand-light)",
  },
  lightAlt: {
    background: "var(--services-card-bg, oklch(1 0 0))",
    ink: "var(--services-ink-strong, #0a0a0a)",
    sub: "color-mix(in oklch, var(--services-ink-strong, #0a0a0a) 65%, transparent 35%)",
    divider: "color-mix(in oklch, var(--services-ink-strong, #0a0a0a) 18%, transparent 82%)",
    border: "var(--nav-shell-border, oklch(0.922 0 0))",
    ctaInk: "var(--services-ink-strong, #0a0a0a)",
  },
  dark: {
    background: "var(--services-card-bg, var(--brand-light))",
    ink: "var(--brand-ink-strong)",
    sub: "color-mix(in oklch, var(--brand-ink-strong) 72%, transparent 28%)",
    divider: "color-mix(in oklch, var(--brand-ink-strong) 22%, transparent 78%)",
    border: "color-mix(in oklch, var(--brand-ink-strong) 18%, transparent 82%)",
    ctaInk: "var(--brand-ink-strong)",
  },
};

const MODE_SEQUENCE: ModeKey[] = ["primary", "lightAlt", "dark"];

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
      style={{
        width,
        minWidth: width,
        flex: "0 0 auto",
        marginInline: CARD_GAP / 2,
      }}
    >
      {children}
    </div>
  );
}

function CardMobile({ card }: { card: TCard }) {
  if (card.variant === "image") return <ImageOnlyCardMobile card={card} />;
  if (card.variant === "imageQuote") return <ImageQuoteCardMobile card={card} />;
  return <QuoteCardMobile card={card} />;
}

function CardFrameMobile({ children }: { children: ReactNode }) {
  return (
    <div
      className="group/card relative shrink-0"
      style={{
        width: "clamp(240px, 82vw, 300px)",
        minWidth: "clamp(240px, 82vw, 300px)",
        flex: "0 0 auto",
        marginInline: 14,
      }}
    >
      {children}
    </div>
  );
}

function CardCta({ card, colors, className }: { card: TCard; colors: ToneStyle; className?: string }) {
  if (!card.cta?.label || !card.cta.href) return null;
  const ctaColor = "var(--mb-accent)"; // brand orange
  return (
    <div className={cn("border-t pt-4", className)} style={{ borderColor: colors.border }}>
      <div className="flex items-center justify-between text-sm" style={{ color: ctaColor }}>
        <Link href={card.cta.href} className="underline-offset-4 hover:underline">
          {card.cta.label}
        </Link>
        <span aria-hidden style={{ color: ctaColor }}>→</span>
      </div>
    </div>
  );
}

function QuoteCard({ card }: { card: TCard }) {
  const tone = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[0]) as ModeKey;
  const colors = card.colors ?? MODE_PRESETS[tone];

  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h=[400px] flex-col rounded-[5px] p-8",
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

function QuoteCardMobile({ card }: { card: TCard }) {
  const tone = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[0]) as ModeKey;
  const colors = card.colors ?? MODE_PRESETS[tone];
  return (
    <CardFrameMobile>
      <div
        className={cn(
          // Fixed height on mobile to keep all marquee rows identical
          "card-inner relative flex h-full flex-col rounded-[5px] p-5 overflow-hidden",
          // lighter visual weight on mobile
          "drop-shadow-[0_10px_24px_rgba(8,6,20,0.18)]",
        )}
        style={{ height: MOBILE_CARD_HEIGHT, minHeight: MOBILE_CARD_HEIGHT, background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <CardLogo card={card} className="mb-6 self-start" />
        <div className="flex flex-1 flex-col gap-4">
          {card.quote ? (
            <blockquote className="text-balance text-[clamp(16px,4.6vw,20px)] leading-snug" style={{ color: colors.ink }}>
              “{card.quote}”
            </blockquote>
          ) : null}
          <div className="h-px w-10" style={{ background: colors.divider }} />
          <div className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: colors.sub }}>
            {card.author}
            {card.role ? <span className="opacity-70"> — {card.role}</span> : null}
          </div>
        </div>
        <CardCta card={card} colors={colors} className="mt-6" />
      </div>
    </CardFrameMobile>
  );
}

function ImageQuoteCard({ card }: { card: TCard }) {
  if (!card.image?.url) return null;
  const tone = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[0]) as ModeKey;
  const colors = card.colors ?? MODE_PRESETS[tone];

  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h-[400px] overflow-hidden rounded-[5px]",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
        style={{ background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <div className="relative flex-[0_0_44%] min-w-[210px]">
          <Image
            src={card.image.url}
            alt={card.image.alt || ""}
            draggable={false}
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

function ImageQuoteCardMobile({ card }: { card: TCard }) {
  if (!card.image?.url) return null;
  const tone = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[0]) as ModeKey;
  const colors = card.colors ?? MODE_PRESETS[tone];
  return (
    <CardFrameMobile>
      <div
        className={cn(
          // Fixed height on mobile
          "card-inner relative flex h-full overflow-hidden rounded-[5px]",
          "drop-shadow-[0_10px_24px_rgba(8,6,20,0.18)]",
        )}
        style={{ height: MOBILE_CARD_HEIGHT, minHeight: MOBILE_CARD_HEIGHT, background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <div className="relative flex-[0_0_42%] min-w-[150px]">
          <Image
            src={card.image.url}
            alt={card.image.alt || ""}
            draggable={false}
            fill
            sizes="70vw"
            placeholder={card.image.lqip ? "blur" : undefined}
            blurDataURL={card.image.lqip || undefined}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <CardLogo card={card} className="mb-6 self-start" />
          <div className="flex flex-col gap-4">
            {card.quote ? (
              <blockquote className="text-balance text-[clamp(16px,4.6vw,20px)] leading-snug">
                “{card.quote}”
              </blockquote>
            ) : null}
            <div className="h-px w-10" style={{ background: colors.divider }} />
            <div className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: colors.sub }}>
              {card.author}
              {card.role ? <span className="opacity-70"> — {card.role}</span> : null}
            </div>
          </div>
          <CardCta card={card} colors={colors} className="mt-auto" />
        </div>
      </div>
    </CardFrameMobile>
  );
}

function ImageOnlyCard({ card }: { card: TCard }) {
  if (!card.image?.url) return null;
  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h-[400px] overflow-hidden rounded-[5px]",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
      >
        <Image
          src={card.image.url}
          alt={card.image.alt || ""}
          draggable={false}
          fill
          sizes="(max-width: 768px) 80vw, 480px"
          placeholder={card.image.lqip ? "blur" : undefined}
          blurDataURL={card.image.lqip || undefined}
          className="h-full w-full object-cover"
        />
        <CardLogo card={card} className="absolute left-6 top-6 z-20" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40"
          style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.56) 60%, transparent 100%)" }}
        />
        {card.cta?.label && card.cta?.href ? (
          <div
            className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t px-6 py-4 text-sm"
            style={{
              borderColor: "rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.78)",
              color: "var(--mb-accent)",
              textShadow: "0 1px 1px rgba(0,0,0,0.35)",
            }}
          >
            <Link
              href={card.cta.href}
              className="pointer-events-auto font-medium uppercase tracking-[0.18em] underline-offset-4 hover:underline"
            >
              {card.cta.label}
            </Link>
            <span aria-hidden style={{ opacity: 0.95, color: "var(--mb-accent)" }}>→</span>
          </div>
        ) : null}
      </div>
    </CardFrame>
  );
}

function ImageOnlyCardMobile({ card }: { card: TCard }) {
  if (!card.image?.url) return null;
  return (
    <CardFrameMobile>
      <div
        className={cn(
          // Fixed height on mobile
          "card-inner relative flex h-full overflow-hidden rounded-[5px]",
          "drop-shadow-[0_10px_24px_rgba(8,6,20,0.18)]",
        )}
        style={{ height: MOBILE_CARD_HEIGHT, minHeight: MOBILE_CARD_HEIGHT }}
      >
        <Image
          src={card.image.url}
          alt={card.image.alt || ""}
          draggable={false}
          fill
          sizes="80vw"
          placeholder={card.image.lqip ? "blur" : undefined}
          blurDataURL={card.image.lqip || undefined}
          className="h-full w-full object-cover"
        />
        {/* Bottom gradient for legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
          style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.42) 60%, transparent 100%)" }}
        />
        {/* Mobile CTA overlay (if provided) */}
        {card.cta?.label && card.cta?.href ? (
          <div
            className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t px-4 py-3 text-sm"
            style={{ borderColor: "rgba(255,255,255,0.22)", background: "rgba(0,0,0,0.66)", color: "var(--mb-accent)" }}
          >
            <Link href={card.cta.href} className="pointer-events-auto font-medium underline-offset-4 hover:underline">
              {card.cta.label}
            </Link>
            <span aria-hidden style={{ opacity: 0.95, color: "var(--mb-accent)" }}>→</span>
          </div>
        ) : null}
      </div>
    </CardFrameMobile>
  );
}

// Desktop card switcher used by marquee Row
function Card({ card }: { card: TCard }) {
  if (card.variant === "image") return <ImageOnlyCard card={card} />;
  if (card.variant === "imageQuote") return <ImageQuoteCard card={card} />;
  return <QuoteCard card={card} />;
}

// Desktop marquee row with auto animation, drag and wheel support
function Row({ items, speed = 30, direction = 1 }: { items: TCard[]; speed?: number; direction?: 1 | -1 }) {
  const prefersReducedMotion = useReducedMotion();
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, background: preset.background, colors: preset };
    });
  }, [items]);

  const clones = [0, 1, 2]; // 3 repeats ensures seamless wrap on large screens
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    trackRef.current = node;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setSetWidth(rect.width);
  }, []);

  // Use exact measured width of one set (including margins) for wrap distance
  const totalWidth = setWidth;

  const wrapTx = useCallback((tx: number) => {
    if (!totalWidth) return tx;
    let v = tx;
    const w = totalWidth;
    while (v <= -w) v += w;
    while (v > 0) v -= w;
    return v;
  }, [totalWidth]);

  const directionFactor = direction === -1 ? -1 : 1;

  useLayoutEffect(() => {
    const refresh = () => {
      const node = trackRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setSetWidth(rect.width);
    };
    refresh();
    window.addEventListener("resize", refresh);
    return () => window.removeEventListener("resize", refresh);
  }, []);

  const clearInteractionTimeout = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  }, []);

  const onWheel = useCallback((e: ReactWheelEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return; // native scroll
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    setIsInteracting(true);
    setDragOffset((v) => wrapTx(v - e.deltaX));
    clearInteractionTimeout();
    interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), 200);
  }, [prefersReducedMotion, wrapTx, clearInteractionTimeout]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    startXRef.current = e.clientX;
    startOffsetRef.current = dragOffset;
    setIsInteracting(true);
  }, [prefersReducedMotion, dragOffset]);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    if (pointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    const dx = e.clientX - startXRef.current;
    // Intuitive drag: translate equals dx
    setDragOffset(wrapTx(startOffsetRef.current + dx));
  }, [prefersReducedMotion, wrapTx]);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    clearInteractionTimeout();
    interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), 150);
  }, [prefersReducedMotion, clearInteractionTimeout]);

  const wrapperStyle = useMemo(
    () => ({ transform: `translate3d(${dragOffset}px,0,0)`, willChange: "transform" }),
    [dragOffset],
  );

  // Drive marquee with requestAnimationFrame for robust infinite loop (no CSS keyframe drift)
  useLayoutEffect(() => {
    if (prefersReducedMotion || !totalWidth) return;
    let rafId: number | null = null;
    let last = performance.now();
    const pxPerSec = speed * 2; // match legacy CSS-driven speed mapping
    const step = (now: number) => {
      const dt = Math.max(0, (now - last) / 1000);
      last = now;
      if (!isInteracting) {
        setDragOffset((v) => wrapTx(v + directionFactor * pxPerSec * dt));
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion, totalWidth, speed, directionFactor, isInteracting, wrapTx]);

  return (
    <div ref={viewportRef} className={cn("relative overflow-hidden", prefersReducedMotion && "no-scrollbar overflow-x-auto")}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <div className="flex py-2" style={wrapperStyle}>
        <div className={cn("flex w-max")}> 
          {clones.map((_, idx) => (
            <div key={idx} ref={idx === 0 ? setRef : undefined} className="flex" aria-hidden={idx > 0}>
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

function RowMobile({ items, direction = 1, speed = 12 }: { items: TCard[]; direction?: 1 | -1; speed?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, background: preset.background, colors: preset };
    });
  }, [items]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const node = firstSetRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setSetWidth(rect.width);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useLayoutEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setIsVisible(e.isIntersecting && e.intersectionRatio > 0.1);
      },
      { threshold: [0, 0.1, 0.25] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Initialize scroll position for reverse direction so there's room to scroll backwards
  useLayoutEffect(() => {
    if (direction !== -1) return;
    const node = scrollerRef.current;
    if (!node || !setWidth) return;
    node.scrollLeft = setWidth;
  }, [direction, setWidth]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || !setWidth) return;
    const handle = () => {
      if (direction === 1 && node.scrollLeft >= setWidth) {
        node.scrollLeft -= setWidth;
      } else if (direction === -1 && node.scrollLeft <= 0) {
        node.scrollLeft += setWidth;
      }
    };
    node.addEventListener("scroll", handle);
    return () => node.removeEventListener("scroll", handle);
  }, [setWidth, direction]);

  useEffect(() => {
    if (prefersReducedMotion || !setWidth) return;
    const node = scrollerRef.current;
    if (!node) return;
    let raf: number | null = null;
    let last = performance.now();
    const pxPerSec = speed * 12;
    const step = (now: number) => {
      const dt = Math.max(0, (now - last) / 1000);
      last = now;
      if (!isInteracting && isVisible) {
        node.scrollLeft += direction * pxPerSec * dt;
        if (direction === 1 && node.scrollLeft >= setWidth) {
          node.scrollLeft -= setWidth;
        } else if (direction === -1 && node.scrollLeft <= 0) {
          node.scrollLeft += setWidth;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion, setWidth, direction, isInteracting, isVisible, speed]);

  const markInteraction = useCallback(() => {
    setIsInteracting(true);
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(() => setIsInteracting(false), 1200);
  }, []);

  return (
    <div className="relative -mx-[var(--container-gutter)]">
      <span className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", touchAction: "pan-x" }}
        onPointerDown={markInteraction}
        onPointerUp={markInteraction}
        onTouchStart={markInteraction}
        onTouchEnd={markInteraction}
        onMouseDown={markInteraction}
        onMouseUp={markInteraction}
      >
        <div className="flex" style={{ width: "max-content" }}>
          <div ref={firstSetRef} className="flex gap-3 py-2 px-[var(--container-gutter)]">
            {normalizedItems.map((card, i) => (
              <div key={`set-a-${i}`} className="snap-start">
                <CardMobile card={card} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 py-2 px-[var(--container-gutter)]" aria-hidden>
            {normalizedItems.map((card, i) => (
              <div key={`set-b-${i}`} className="snap-start">
                <CardMobile card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// (Removed) Alternate mobile row (manual scroll). Keeping codebase lean.

// Mobile auto-marquee using the same RAF engine as desktop, but with mobile cards and lower speeds
export default function TestimonialsMarqueeClient({ top, bottom, speedTop = 30, speedBottom = 24 }: TestimonialsClientProps) {
  return (
    // On mobile we want the rows to start right under the heading; keep bottom-aligned only on md+.
    <div className="relative flex flex-1 flex-col justify-start md:justify-end bg-transparent">
      {/* subtle peek of bottom row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[12vh] bg-gradient-to-t from-background to-transparent hidden md:block" />
      {/* Desktop/original marquee */}
      <div className="hidden md:flex flex-col gap-3 pb-3 bg-transparent">
        <Row items={top} speed={speedTop} direction={1} />
        <Row items={bottom} speed={speedBottom} direction={-1} />
      </div>
      {/* Mobile auto-marquee rows (slower, pause on touch) */}
      <div className="md:hidden flex flex-col gap-3 pb-3 justify-start bg-transparent" style={{ height: "auto", minHeight: "320px" }}>
        <RowMobile items={top} direction={1} speed={Math.max(12, speedTop * 0.45)} />
        <RowMobile items={bottom} direction={-1} speed={Math.max(9, speedBottom * 0.35)} />
      </div>
    </div>
  );
}
