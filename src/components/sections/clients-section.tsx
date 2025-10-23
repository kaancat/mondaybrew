import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import ClientsMarquee from "./clients.marquee.client";

export type ClientLogo = {
  title?: string;
  url?: string;
  image?: {
    alt?: string;
    image?: {
      asset?: {
        url?: string;
        metadata?: {
          lqip?: string;
          dimensions?: { width?: number; height?: number };
        };
      };
    };
  };
};

export type ClientsSectionData = {
  eyebrow?: string;
  headline?: string;
  subheading?: string;
  more?: { label?: string; href?: string; variant?: string } | null;
  forceBlackLogos?: boolean;
  logos?: ClientLogo[];
};

export default function ClientsSection({ eyebrow, headline, subheading, logos, more, forceBlackLogos }: ClientsSectionData & { locale?: "da" | "en" }) {
  const items = (logos || []).filter((l) => (l?.title || l?.image?.image?.asset?.url)).slice(0, 60);

  return (
    <section aria-labelledby="clients-heading" className="group/clients">
      {/* Mobile: Full width */}
      <div className="md:hidden">
        <div
          className={cn(
            "clients-hero-strip rounded-none border-b border-[color:var(--clients-hero-divider)]",
            // Theme-driven capsule colors
            "bg-[color:var(--clients-hero-bg)] text-[color:var(--clients-hero-text)]",
            "px-6 py-[20px]",
            "relative overflow-hidden",
          )}
        >
          {/* Left-aligned copy */}
          <div className="max-w-[56ch] pr-10">
            {eyebrow ? (
              <p className="clients-hero-eyebrow mb-3 text-[12px] font-medium tracking-[0.25em] text-[color:var(--clients-hero-eyebrow)]">
                {eyebrow.toUpperCase()}
              </p>
            ) : null}
            {headline ? (
              <h2
                id="clients-heading"
                className="text-[clamp(28px,3.4vw,40px)] leading-tight font-semibold text-[color:var(--clients-hero-title,var(--clients-hero-text))]"
              >
                {headline}
              </h2>
            ) : null}
            {subheading ? (
              <p
                className={cn(
                  "mt-3 text-[15px]/[1.6]",
                  // Theme-driven muted color for contrast in the capsule
                  "text-[color:var(--clients-hero-muted)]",
                )}
              >
                {subheading}
              </p>
            ) : null}
          </div>

          {/* Decorative SVG removed per request */}
        </div>
      </div>

      {/* Desktop: Constrained container */}
      <div className="hidden md:block layout-container">
        <div
          className={cn(
            "clients-hero-strip rounded-t-[5px] rounded-b-none border-b border-[color:var(--clients-hero-divider)]",
            // Theme-driven capsule colors
            "bg-[color:var(--clients-hero-bg)] text-[color:var(--clients-hero-text)]",
            "px-10 py-20 lg:px-12 lg:py-24",
            "relative overflow-hidden",
          )}
        >
          {/* Left-aligned copy */}
          <div className="max-w-[56ch] pr-10">
            {eyebrow ? (
              <p className="clients-hero-eyebrow mb-3 text-[12px] font-medium tracking-[0.25em] text-[color:var(--clients-hero-eyebrow)]">
                {eyebrow.toUpperCase()}
              </p>
            ) : null}
            {headline ? (
              <h2
                id="clients-heading"
                className="text-[clamp(28px,3.4vw,40px)] leading-tight font-semibold text-[color:var(--clients-hero-title,var(--clients-hero-text))]"
              >
                {headline}
              </h2>
            ) : null}
            {subheading ? (
              <p
                className={cn(
                  "mt-3 text-[15px]/[1.6]",
                  // Theme-driven muted color for contrast in the capsule
                  "text-[color:var(--clients-hero-muted)]",
                )}
              >
                {subheading}
              </p>
            ) : null}
          </div>

          {/* Decorative SVG removed per request */}
        </div>
      </div>

      {/* Desktop/Tablet: lined grid */}
      <div className="layout-container hidden md:block">
        <LinedGrid items={items} more={more} forceBlackLogos={forceBlackLogos} />
      </div>

      {/* Mobile: marquee rows (prefers-reduced-motion handled inside) */}
      <div
        className="md:hidden"
        style={{
          // @ts-expect-error CSS var
          "--clients-logo-filter": forceBlackLogos ? "brightness(0) saturate(100%)" : "grayscale(100%)",
        }}
      >
        <ClientsMarquee items={items} />
      </div>
    </section>
  );
}

function LinedGrid({ items, more, forceBlackLogos }: { items: ClientLogo[]; more?: { label?: string; href?: string; reference?: { slug?: string; locale?: string } } | null; forceBlackLogos?: boolean }) {
  // 5 columns on large, 4 on md, 3 on sm
  const styleVars = ({
    "--color-border": "var(--border)",
  } as unknown) as CSSProperties & Record<string, string>;
  if (forceBlackLogos) {
    styleVars["--clients-logo-filter"] = "brightness(0) saturate(100%)";
  }
  return (
    <div
      className={cn(
        "relative clients-grid",
        "bg-[color:var(--clients-grid-bg)]",
        // outer bottom/right hairlines
        "[box-shadow:inset_0_-1px_var(--color-border),inset_-1px_0_var(--color-border)]",
      )}
      style={styleVars}
    >
      <div className="grid grid-cols-3 gap-0 md:grid-cols-4 lg:grid-cols-5">
        {items.map((logo, i) => (
          <div
            key={i}
            className={cn(
              "group relative flex items-center justify-center border-r border-b border-[color:var(--color-border)] p-4 transition-colors",
              "hover:bg-[color:var(--muted)]",
            )}
          >
            <Logo logo={logo} forceBlackLogos={forceBlackLogos} />
          </div>
        ))}
      </div>

      {more ? (
        <div className="border-t border-[color:var(--color-border)] p-4">
          <a
            href={more.href}
            className="group flex items-center justify-center gap-2 text-sm font-medium text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
          >
            {more.label}
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      ) : null}
    </div>
  );
}

function Logo({ logo, forceBlackLogos: _forceBlackLogos }: { logo: ClientLogo; forceBlackLogos?: boolean }) {
  const { title, image } = logo;
  const alt = image?.alt || title || "Logo";

  if (image?.image?.asset?.url) {
    const dims = image.image.asset.metadata?.dimensions as { width?: number; height?: number } | undefined;
    const width = (dims?.width ?? 120) as number;
    const height = (dims?.height ?? 60) as number;
    const safeHeight = height === 0 ? 60 : height;
    const aspectRatio = width / safeHeight;
    const maxHeight = 40;
    const w = maxHeight * aspectRatio;
    const h = maxHeight;

    return (
      <Image
        src={image.image.asset.url}
        alt={alt}
        width={Math.round(w)}
        height={Math.round(h)}
        sizes="160px"
        className="max-h-[40px] w-auto opacity-90 [filter:var(--clients-logo-filter,grayscale(100%))] group-hover:[filter:var(--clients-logo-hover-filter,none)]"
        style={{ mixBlendMode: "multiply" }}
      />
    );
  }

  return <span className="px-2 text-sm text-muted-foreground">{title}</span>;
}
