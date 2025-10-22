"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

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

// Card width for mobile
const MOBILE_CARD_WIDTH = 320;
const MOBILE_CARD_GAP = 16;

// Mode presets
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

// Simple card components
function CardLogo({ logo }: { logo?: TImage }) {
  if (!logo?.url) return null;
  return (
    <div className="relative h-6 w-24 opacity-90 mb-6">
      <Image src={logo.url} alt={logo.alt || ""} fill className="object-contain object-left" sizes="96px" />
    </div>
  );
}

function CardCta({ card, colors }: { card: TCard; colors: ToneStyle }) {
  if (!card.cta?.label || !card.cta.href) return null;
  const ctaColor = "var(--mb-accent)";
  return (
    <div className="border-t pt-4 mt-6" style={{ borderColor: colors.border }}>
      <div className="flex items-center justify-between text-sm" style={{ color: ctaColor }}>
        <Link href={card.cta.href} className="underline-offset-4 hover:underline">
          {card.cta.label}
        </Link>
        <span aria-hidden>→</span>
      </div>
    </div>
  );
}

function QuoteCard({ card, colors }: { card: TCard; colors: ToneStyle }) {
  return (
    <div
      className="flex h-full min-h-[320px] flex-col rounded-lg p-6 shadow-lg"
      style={{ background: colors.background, color: colors.ink }}
    >
      <CardLogo logo={card.logo} />
      
      {card.quote && (
        <blockquote className="text-lg leading-relaxed mb-4 flex-1">
          &ldquo;{card.quote}&rdquo;
        </blockquote>
      )}

      <div className="h-px w-12 mb-4" style={{ background: colors.divider }} />

      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.sub }}>
        {card.author}
        {card.role && <span className="opacity-70"> — {card.role}</span>}
      </div>

      <CardCta card={card} colors={colors} />
    </div>
  );
}

function ImageCard({ card, colors }: { card: TCard; colors: ToneStyle }) {
  if (!card.image?.url) return <QuoteCard card={card} colors={colors} />;
  
  return (
    <div
      className="flex h-full min-h-[320px] flex-col rounded-lg overflow-hidden shadow-lg"
      style={{ background: colors.background }}
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={card.image.url}
          alt={card.image.alt || ""}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>
      {(card.author || card.role) && (
        <div className="p-6">
          <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.ink }}>
            {card.author}
            {card.role && <span className="opacity-70"> — {card.role}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageQuoteCard({ card, colors }: { card: TCard; colors: ToneStyle }) {
  if (!card.image?.url) return <QuoteCard card={card} colors={colors} />;
  
  return (
    <div
      className="flex h-full min-h-[320px] flex-col rounded-lg overflow-hidden shadow-lg"
      style={{ background: colors.background }}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={card.image.url}
          alt={card.image.alt || ""}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <CardLogo logo={card.logo} />
        
        {card.quote && (
          <blockquote className="text-base leading-relaxed mb-4" style={{ color: colors.ink }}>
            &ldquo;{card.quote}&rdquo;
          </blockquote>
        )}

        <div className="h-px w-12 mb-4 mt-auto" style={{ background: colors.divider }} />

        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.sub }}>
          {card.author}
          {card.role && <span className="opacity-70"> — {card.role}</span>}
        </div>

        <CardCta card={card} colors={colors} />
      </div>
    </div>
  );
}

function Card({ card }: { card: TCard }) {
  const colors = card.colors!;
  
  if (card.variant === "image") {
    return <ImageCard card={card} colors={colors} />;
  }
  if (card.variant === "imageQuote") {
    return <ImageQuoteCard card={card} colors={colors} />;
  }
  return <QuoteCard card={card} colors={colors} />;
}

// Simple horizontal scroll row - MOBILE ONLY
function ScrollRow({ items }: { items: TCard[] }) {
  const normalizedItems = useMemo(() => {
    return items.map((card, i) => {
      const toneKey: ModeKey = (card.tone && card.tone !== "auto" ? card.tone : MODE_SEQUENCE[i % MODE_SEQUENCE.length]) as ModeKey;
      const preset = MODE_PRESETS[toneKey];
      return { ...card, tone: toneKey, colors: preset };
    });
  }, [items]);

  return (
    <div className="relative w-full">
      {/* Scrollable container */}
      <div 
        className="overflow-x-auto overflow-y-hidden pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Cards row */}
        <div 
          className="flex"
          style={{ 
            gap: `${MOBILE_CARD_GAP}px`,
            paddingLeft: 'var(--container-gutter)',
            paddingRight: 'var(--container-gutter)',
          }}
        >
          {normalizedItems.map((card, i) => (
            <div 
              key={i}
              style={{
                width: `${MOBILE_CARD_WIDTH}px`,
                minWidth: `${MOBILE_CARD_WIDTH}px`,
                flexShrink: 0,
              }}
            >
              <Card card={card} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default function TestimonialsMarqueeClient({ top, bottom }: TestimonialsClientProps) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-6 md:gap-8">
      <ScrollRow items={top} />
      <ScrollRow items={bottom} />
    </div>
  );
}
