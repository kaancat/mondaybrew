"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import type { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

export type TImage = {
  src?: string | null;
  alt?: string | null;
  blurDataURL?: string | null;
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
    ink: "var(--services-ink-strong, var(--brand-ink-strong))",
    sub: "color-mix(in oklch, var(--services-ink-strong, var(--brand-ink-strong)) 65%, transparent 35%)",
    divider: "color-mix(in oklch, var(--services-ink-strong, var(--brand-ink-strong)) 18%, transparent 82%)",
    border: "var(--nav-shell-border, oklch(0.922 0 0))",
    ctaInk: "var(--services-ink-strong, var(--brand-ink-strong))",
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

type AutoScrollPluginApi = ReturnType<typeof AutoScroll>;

// (removed) manual RAF auto-scroll in favour of official AutoScroll plugin

// Lightweight in-view detection (IntersectionObserver)
function useInView<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: "200px 0px", threshold: 0.2 },
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      const e = entries[0];
      const threshold = Array.isArray(options.threshold)
        ? Number(options.threshold[0] ?? 0)
        : Number(options.threshold ?? 0);
      setInView(e.isIntersecting && (e.intersectionRatio ?? 0) > threshold);
    }, options);
    obs.observe(node);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView } as const;
}

// Prefetch a small set of image URLs during idle time to avoid decode jank
function useIdlePrefetch(urls: string[], enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const prefetch = () => {
      urls.slice(0, 4).forEach((u) => {
        if (!u) return;
        const img = new window.Image();
        // These properties are widely supported in modern browsers
        // and help hint the decoder, but are optional.
        try { img.decoding = "async"; } catch {}
        try { (img as HTMLImageElement).loading = "eager"; } catch {}
        img.src = u;
      });
    };

    type IdleDeadline = { didTimeout: boolean; timeRemaining: () => number };
    type RequestIdle = (cb: (deadline: IdleDeadline) => void, opts?: { timeout?: number }) => number;
    type CancelIdle = (id: number) => void;

    const w = window as unknown as { requestIdleCallback?: RequestIdle; cancelIdleCallback?: CancelIdle };

    let cancel: (() => void) | undefined;
    if (typeof w.requestIdleCallback === "function") {
      const handle = w.requestIdleCallback(prefetch, { timeout: 1200 });
      cancel = () => { w.cancelIdleCallback?.(handle); };
    } else {
      const handle = window.setTimeout(prefetch, 400);
      cancel = () => { clearTimeout(handle); };
    }
    return cancel;
  }, [enabled, urls]);
}

function useAutoScrollPlugin(
  emblaApi: EmblaCarouselType | undefined,
  plugin: AutoScrollPluginApi | undefined,
  { paused, disabled }: { paused: boolean; disabled: boolean },
  watch?: unknown,
) {
  useEffect(() => {
    if (!emblaApi || !plugin) return;

    const syncState = () => {
      if (disabled) {
        plugin.stop();
        return;
      }
      if (paused) {
        plugin.stop();
        return;
      }
      plugin.play();
    };

    syncState();

    const handleReInit = () => {
      syncState();
    };
    const handleAutoScrollStop = () => {
      if (!disabled && !paused) plugin.play();
    };

    emblaApi.on("reInit", handleReInit);
    emblaApi.on("autoScroll:stop", handleAutoScrollStop);

    return () => {
      emblaApi.off("reInit", handleReInit);
      emblaApi.off("autoScroll:stop", handleAutoScrollStop);
      plugin.stop();
    };
  }, [emblaApi, plugin, paused, disabled, watch]);
}

function CardLogo({ card, className }: { card: TCard; className?: string }) {
  if (!card.logo?.src) return null;
  return (
    <div className={cn("relative h-6 w-24 opacity-90", className)}>
      <Image src={card.logo.src} alt={card.logo.alt || ""} fill className="object-contain" sizes="96px" />
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

function CardMobile({ card, priority }: { card: TCard; priority?: boolean }) {
  if (card.variant === "image") return <ImageOnlyCardMobile card={card} priority={priority} />;
  if (card.variant === "imageQuote") return <ImageQuoteCardMobile card={card} priority={priority} />;
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
          "ring-1 ring-black/10 dark:ring-white/10",
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
          // lightweight shadow on mobile (compositor-friendly)
          "shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
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
  if (!card.image?.src) return null;
  const tone = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[0]) as ModeKey;
  const colors = card.colors ?? MODE_PRESETS[tone];

  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h-[400px] overflow-hidden rounded-[5px]",
          "ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
        style={{ background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <div className="relative flex-[0_0_44%] min-w-[210px]">
          <Image
            src={card.image.src!}
            alt={card.image.alt || ""}
            draggable={false}
            fill
            sizes="(max-width: 768px) 70vw, 360px"
            placeholder={card.image.blurDataURL ? "blur" : undefined}
            blurDataURL={card.image.blurDataURL || undefined}
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

function ImageQuoteCardMobile({ card, priority }: { card: TCard; priority?: boolean }) {
  if (!card.image?.src) return null;
  const tone = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[0]) as ModeKey;
  const colors = card.colors ?? MODE_PRESETS[tone];
  return (
    <CardFrameMobile>
      <div
        className={cn(
          // Fixed height on mobile
          "card-inner relative flex h-full overflow-hidden rounded-[5px]",
          "shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
        )}
        style={{ height: MOBILE_CARD_HEIGHT, minHeight: MOBILE_CARD_HEIGHT, background: colors.background, color: colors.ink, borderColor: colors.border }}
      >
        <div className="relative flex-[0_0_42%] min-w-[150px]">
          <Image
            src={card.image.src!}
            alt={card.image.alt || ""}
            draggable={false}
            fill
            sizes="(max-width: 767px) 42vw, 360px"
            placeholder={card.image.blurDataURL ? "blur" : undefined}
            blurDataURL={card.image.blurDataURL || undefined}
            className="h-full w-full object-cover"
            priority={!!priority}
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
  if (!card.image?.src) return null;
  return (
    <CardFrame card={card}>
      <div
        className={cn(
          "card-inner relative flex h-full min-h-[400px] overflow-hidden rounded-[5px]",
          "ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
      >
        <Image
          src={card.image.src!}
          alt={card.image.alt || ""}
          draggable={false}
          fill
          sizes="(max-width: 768px) 80vw, 480px"
          placeholder={card.image.blurDataURL ? "blur" : undefined}
          blurDataURL={card.image.blurDataURL || undefined}
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

function ImageOnlyCardMobile({ card, priority }: { card: TCard; priority?: boolean }) {
  if (!card.image?.src) return null;
  return (
    <CardFrameMobile>
      <div
        className={cn(
          // Fixed height on mobile
          "card-inner relative flex h-full overflow-hidden rounded-[5px]",
          "shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
        )}
        style={{ height: MOBILE_CARD_HEIGHT, minHeight: MOBILE_CARD_HEIGHT, background: "color-mix(in oklch, var(--foreground) 6%, transparent)" }}
      >
        <Image
          src={card.image.src!}
          alt={card.image.alt || ""}
          draggable={false}
          fill
          sizes="(max-width: 767px) 82vw, 480px"
          placeholder={card.image.blurDataURL ? "blur" : undefined}
          blurDataURL={card.image.blurDataURL || undefined}
          className="h-full w-full object-cover"
          priority={!!priority}
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

// Desktop marquee row powered by Embla
function Row({ items, speed = 30, direction = 1 }: { items: TCard[]; speed?: number; direction?: 1 | -1 }) {
  const prefersReducedMotion = useReducedMotion();
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, colors: preset };
    });
  }, [items]);

  const [repeatCount, setRepeatCount] = useState(3);
  const displayItems = useMemo(() => {
    if (!normalizedItems.length) return [] as { card: TCard; key: string }[];
    const repeats = Math.max(1, repeatCount);
    const sequence: { card: TCard; key: string }[] = [];
    for (let setIndex = 0; setIndex < repeats; setIndex += 1) {
      normalizedItems.forEach((card, cardIndex) => {
        sequence.push({ card, key: `${setIndex}-${card.variant}-${cardIndex}` });
      });
    }
    return sequence;
  }, [normalizedItems, repeatCount]);

  const innerViewportRef = useRef<HTMLDivElement | null>(null);
  const { ref: containerRef, inView } = useInView<HTMLDivElement>({ rootMargin: "150px 0px", threshold: 0.15 });
  const autoScrollPlugin = useMemo(() => {
    const pxPerFrame = Math.max(0.35, (speed * 2) / 60);
    return AutoScroll({
      speed: pxPerFrame,
      direction: direction === -1 ? "backward" : "forward",
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
      startDelay: 0,
    });
  }, [direction, speed]);

  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      loop: displayItems.length > 1,
      align: "start",
      dragFree: true,
      skipSnaps: true,
    },
    [autoScrollPlugin],
  );

  const setViewportNode = useCallback((node: HTMLDivElement | null) => {
    innerViewportRef.current = node;
    viewportRef(node);
  }, [viewportRef]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, displayItems.length]);

  const [hovering, setHovering] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const handlePointerDown = () => setPointerActive(true);
    const handlePointerRelease = () => setPointerActive(false);
    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerRelease);
    emblaApi.on("settle", handlePointerRelease);
    emblaApi.on("scroll", handlePointerRelease);
    return () => {
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerRelease);
      emblaApi.off("settle", handlePointerRelease);
      emblaApi.off("scroll", handlePointerRelease);
    };
  }, [emblaApi]);

  const autoScrollDisabled = prefersReducedMotion || displayItems.length <= 1 || !inView;
  useAutoScrollPlugin(emblaApi, autoScrollPlugin, {
    paused: hovering || pointerActive,
    disabled: autoScrollDisabled,
  }, displayItems.length);

  useEffect(() => {
    // Auto-measure and increase repeats until track width comfortably exceeds viewport
    const node = innerViewportRef.current;
    if (!node) return;
    const track = node.firstElementChild as HTMLElement | null;
    if (!track) return;
    const vp = node.getBoundingClientRect().width;
    const trackWidth = track.scrollWidth;
    if (!vp || !trackWidth || repeatCount > 12) return;
    const perSet = trackWidth / Math.max(1, repeatCount);
    if (!perSet) return;
    const target = vp * 2.5; // ensure plenty of headroom to loop seamlessly
    const needed = Math.max(2, Math.ceil(target / perSet));
    if (needed > repeatCount) setRepeatCount(needed);
  }, [repeatCount, displayItems.length]);

  const desktopContainerStyle: React.CSSProperties = {
    contentVisibility: inView ? "visible" : "auto",
    containIntrinsicSize: "420px",
  };
  return (
    <div ref={containerRef} className="relative -mx-[var(--container-gutter)] overflow-hidden min-w-0" style={desktopContainerStyle}>
      <div
        ref={setViewportNode}
        className={cn("overflow-hidden px-[var(--container-gutter)] w-full", prefersReducedMotion && "no-scrollbar")}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex py-2" style={{ willChange: inView ? "transform" : undefined }}>
          {displayItems.map(({ card, key }) => (
            <Card key={`desktop-${key}`} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Ultra-light mobile marquee: CSS-only animation, no carousel runtime
function RowMobile({ items, direction = 1, speed = 12 }: { items: TCard[]; direction?: 1 | -1; speed?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, colors: preset };
    });
  }, [items]);
  const { ref: containerRef, inView } = useInView<HTMLDivElement>({ rootMargin: "150px 0px", threshold: 0.1 });
  // Eager-load the first few unique images to avoid initial blank cards
  const eagerImageIndexes = useMemo(() => {
    const eager: number[] = [];
    for (let i = 0; i < normalizedItems.length && eager.length < 2; i += 1) {
      if (normalizedItems[i]?.image?.src) eager.push(i);
    }
    return new Set(eager);
  }, [normalizedItems]);

  // Background prefetch when section is near view
  useIdlePrefetch(
    normalizedItems.map((c) => c.image?.src || "").filter(Boolean) as string[],
    inView && !prefersReducedMotion,
  );

  // Choose duration based on provided speed (lower = faster)
  const durationMs = Math.max(12000, Math.min(48000, Math.round(26000 / Math.max(1, speed)))) ;
  const trackClass = direction === -1 ? "marquee-mobile-track-reverse" : "marquee-mobile-track-forward";

  // Track ref for play-state control
  const trackRef = useRef<HTMLDivElement | null>(null);

  const mobileContainerStyle: React.CSSProperties = {};
  return (
    <div ref={containerRef} className="relative -mx-[var(--container-gutter)] overflow-hidden min-w-0" style={mobileContainerStyle}>
      <div className={cn("w-full", prefersReducedMotion && "no-scrollbar")} style={{ touchAction: "pan-y" }}>
        <div
          ref={trackRef}
          className={cn("marquee-mobile-track flex py-3", trackClass)}
          style={{
            animationDuration: `${Math.round(durationMs / 1000)}s`,
            animationPlayState: inView && !prefersReducedMotion ? "running" : "paused",
          }}
        >
          {/* Two identical sets enable seamless -50% translate looping */}
          <div className="marquee-mobile-set flex">
            {normalizedItems.map((card, idx) => (
              <CardMobile key={`mobile-a-${idx}`} card={card} priority={eagerImageIndexes.has(idx)} />
            ))}
          </div>
          <div className="marquee-mobile-set flex" aria-hidden>
            {normalizedItems.map((card, idx) => (
              <CardMobile key={`mobile-b-${idx}`} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// (Removed) Alternate mobile row (manual scroll). Keeping codebase lean.

export default function TestimonialsMarqueeClient({ top, bottom, speedTop = 30, speedBottom = 24 }: TestimonialsClientProps) {
  const mobileTopSpeed = Math.max(8, speedTop * 0.18);
  const mobileBottomSpeed = Math.max(7, speedBottom * 0.16);

  return (
    <div className="relative flex flex-1 flex-col justify-start md:justify-end bg-transparent min-w-0">
      <div className="hidden md:flex flex-col gap-3 pb-3 bg-transparent min-w-0">
        <Row items={top} speed={speedTop} direction={1} />
        <Row items={bottom} speed={speedBottom} direction={-1} />
      </div>
      <div className="md:hidden flex flex-col gap-3 pb-3 justify-start bg-transparent min-w-0" style={{ minHeight: "320px" }}>
        <RowMobile items={top} direction={1} speed={mobileTopSpeed} />
        <RowMobile items={bottom} direction={-1} speed={mobileBottomSpeed} />
      </div>
    </div>
  );
}
