"use client";

import {
  useCallback,
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

// Map Service card presets (Primary, Light Alt, Dark) to concrete tones
const MODE_PRESETS: Record<ModeKey, ToneStyle> = {
  primary: {
    // Services card on Primary uses dark grey surface with light ink
    background: "var(--surface-dark)",
    ink: "var(--brand-light)",
    sub: "color-mix(in oklch, var(--brand-light) 82%, transparent 18%)",
    divider: "color-mix(in oklch, var(--brand-light) 32%, transparent 68%)",
    border: "color-mix(in oklch, var(--brand-light) 26%, transparent 74%)",
    ctaInk: "var(--brand-light)",
  },
  lightAlt: {
    // Light-Alt service cards are strict white with black ink
    background: "var(--services-card-bg, oklch(1 0 0))",
    ink: "var(--services-ink-strong, #0a0a0a)",
    sub: "color-mix(in oklch, var(--services-ink-strong, #0a0a0a) 65%, transparent 35%)",
    divider: "color-mix(in oklch, var(--services-ink-strong, #0a0a0a) 18%, transparent 82%)",
    border: "var(--nav-shell-border, oklch(0.922 0 0))",
    ctaInk: "var(--services-ink-strong, #0a0a0a)",
  },
  dark: {
    // Dark mode service cards present light card with house grey ink
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
        contain: "layout paint",
        contentVisibility: "auto",
      }}
    >
      {children}
    </div>
  );
}

function CardFrameMobile({ children }: { children: ReactNode }) {
  return (
    <div
      className="group/card relative shrink-0 snap-center first:ml-4 last:mr-4"
      style={{
        width: "85vw",
        minWidth: "85vw",
        flex: "0 0 auto",
        contain: "layout paint",
        contentVisibility: "auto",
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
          "card-inner relative flex h-full min-h-[360px] flex-col rounded-[8px] p-6",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
        )}
        style={{ background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <CardLogo card={card} className="mb-6 self-start" />
        <div className="flex flex-1 flex-col gap-4">
          {card.quote ? (
            <blockquote className="text-balance text-[clamp(18px,5vw,22px)] leading-snug" style={{ color: colors.ink }}>
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
  // Restored two-column layout: image left, text right (same width as image-only)
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
        {/* Nudge image a bit wider for balance */}
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
          "card-inner relative flex h-full min-h-[360px] overflow-hidden rounded-[8px]",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
        )}
        style={{ background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <div className="relative flex-[0_0_48%] min-w-[180px]">
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
              <blockquote className="text-balance text-[clamp(18px,5vw,22px)] leading-snug">
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
          "card-inner relative flex h-full min-h-[360px] overflow-hidden rounded-[8px]",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
        )}
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
        <CardLogo card={card} className="absolute left-5 top-5 z-20" />
      </div>
    </CardFrameMobile>
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

function CardMobile({ card }: { card: TCard }) {
  if (card.variant === "image") {
    return <ImageOnlyCardMobile card={card} />;
  }
  if (card.variant === "imageQuote") {
    return <ImageQuoteCardMobile card={card} />;
  }
  return <QuoteCardMobile card={card} />;
}

function Row({ items, speed = 30, direction = 1 }: { items: TCard[]; speed?: number; direction?: 1 | -1 }) {
  // Normalize tones to preset styles
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, background: preset.background, colors: preset };
    });
  }, [items]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const setRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const safeSpeed = Math.max(1, speed);
  const duration = useMemo(() => (setWidth > 0 ? setWidth / safeSpeed : 12), [setWidth, safeSpeed]);

  // Only two clones required for seamless loop; no JS drag/momentum.
  const clones = useMemo(() => Array.from({ length: prefersReducedMotion ? 1 : 2 }), [prefersReducedMotion]);

  useLayoutEffect(() => {
    const setEl = setRef.current;
    if (!setEl) return;
    const measure = () => setSetWidth(setEl.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(setEl);
    return () => observer.disconnect();
  }, [normalizedItems]);

  const trackStyle = useMemo(() => {
    if (!setWidth || prefersReducedMotion) return undefined;
    return {
      "--marquee-distance": `${-setWidth}px`,
      "--marquee-duration": `${duration}s`,
      animationDirection: direction === 1 ? "normal" : "reverse",
      animationPlayState: "running",
      willChange: "transform",
    } as CSSProperties;
  }, [setWidth, duration, direction, prefersReducedMotion]);

  const wrapOffset = useCallback(
    (value: number) => {
      if (!setWidth) return value;
      const limit = setWidth;
      let next = value;
      while (next > limit) next -= limit;
      while (next < -limit) next += limit;
      return next;
    },
    [setWidth],
  );

  // Lightweight drag/scroll: we translate a wrapper layer while pausing the CSS animation.
  const [dragOffset, setDragOffset] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setDragOffset((v) => wrapOffset(v - e.deltaX));
    clearInteractionTimeout();
    interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), 200);
  }, [prefersReducedMotion, wrapOffset, clearInteractionTimeout]);

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
    setDragOffset(wrapOffset(startOffsetRef.current + dx));
  }, [prefersReducedMotion, wrapOffset]);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    clearInteractionTimeout();
    interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), 150);
  }, [prefersReducedMotion, clearInteractionTimeout]);

  const wrapperStyle = useMemo(
    () => ({ transform: `translate3d(${dragOffset}px,0,0)`, willChange: isInteracting ? "transform" : undefined }),
    [dragOffset, isInteracting],
  );

  const animatedTrackStyle = useMemo<CSSProperties | undefined>(() => {
    if (!trackStyle) return undefined;
    return {
      ...trackStyle,
      animationPlayState: isInteracting ? "paused" : "running",
    } satisfies CSSProperties;
  }, [trackStyle, isInteracting]);

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
        <div className={cn("flex w-max", !prefersReducedMotion && setWidth ? "marquee-track" : undefined)} style={animatedTrackStyle}>
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

function RowMobile({ items }: { items: TCard[] }) {
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, background: preset.background, colors: preset };
    });
  }, [items]);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const onWheel = useCallback((e: ReactWheelEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    // Map vertical wheel/trackpad to horizontal scroll for convenience in dev tools
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, []);


  return (
    <div
      ref={viewportRef}
      onWheel={onWheel}
      className="-mx-4 overflow-x-auto px-0 scrollbar-none"
      style={{ 
        WebkitOverflowScrolling: "touch", 
        touchAction: "pan-x" as const,
        scrollBehavior: "smooth"
      }}
    >
      <div className="flex gap-4 px-0 py-2" style={{ width: "max-content" }}>
        {normalizedItems.map((card, i) => (
          <CardMobile key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsMarqueeClient({ top, bottom, speedTop = 30, speedBottom = 24 }: TestimonialsClientProps) {
  return (
    <div className="relative flex flex-1 flex-col justify-end">
      {/* subtle peek of bottom row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[12vh] bg-gradient-to-t from-background to-transparent hidden md:block" />
      {/* Desktop/original marquee */}
      <div className="hidden md:flex flex-col gap-3 pb-3">
        <Row items={top} speed={speedTop} direction={1} />
        <Row items={bottom} speed={speedBottom} direction={-1} />
      </div>
      {/* Mobile scroll-snap variant (desktop unchanged) */}
      <div className="md:hidden flex flex-col gap-4 pb-2">
        <RowMobile items={top} />
        <RowMobile items={bottom} />
      </div>
    </div>
  );
}
