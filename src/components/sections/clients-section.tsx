import Image from "next/image";
import { cn } from "@/lib/utils";
import ClientsMarquee from "./clients.marquee.client";

export type ClientLogo = {
  title?: string;
  url?: string;
  image?: { alt?: string; image?: { asset?: { url?: string; metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } } } } };
};

export type ClientsSectionData = {
  eyebrow?: string;
  headline?: string;
  subheading?: string;
  logos?: ClientLogo[];
  more?: { label?: string; href?: string; reference?: { slug?: string; locale?: string } } | null;
  locale?: "da" | "en";
  forceBlackLogos?: boolean;
};

export default function ClientsSection({ eyebrow, headline, subheading, logos, more, locale, forceBlackLogos }: ClientsSectionData) {
  const items = (logos || []).filter((l) => (l?.title || l?.image?.image?.asset?.url)).slice(0, 60);

  return (
    <section aria-labelledby="clients-heading" className="group/clients">
      <div className="layout-container">
        <div
          className={cn(
            "clients-hero-strip rounded-none md:rounded-[5px] shadow-[var(--shadow-elevated-md)]",
            "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
            "dark:!bg-[color:var(--services-card-bg)] dark:!text-[color:var(--services-ink-strong)]",
            "px-6 py-[10px] md:px-10 md:py-10 lg:px-12 lg:py-12",
            "relative overflow-hidden",
          )}
        >
          {/* Left-aligned copy */}
          <div className="max-w-[56ch] pr-10">
            {eyebrow ? (
              <p className="clients-hero-eyebrow mb-3 text-[12px] font-medium tracking-[0.25em] text-[color:var(--clients-hero-eyebrow,currentColor)]">
                {eyebrow.toUpperCase()}
              </p>
            ) : null}
            {headline ? (
              <h2
                id="clients-heading"
                className="text-[clamp(28px,3.4vw,40px)] leading-tight font-semibold text-[color:var(--clients-hero-title,inherit)]"
              >
                {headline}
              </h2>
            ) : null}
            {subheading ? (
              <p
                className={cn(
                  "mt-3 text-[15px]/[1.6]",
                  // Use theme-driven variable so we can tune per mode
                  "text-[color:var(--clients-hero-sub,color-mix(in_oklch,var(--accent-foreground)_78%,white_22%))]",
                )}
              >
                {subheading}
              </p>
            ) : null}
          </div>

          {/* Optional geometric line art (subtle, trivial) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-30"
            width="140"
            height="120"
            viewBox="0 0 140 120"
            fill="none"
          >
            <g stroke="currentColor" strokeOpacity="0.4">
              <path d="M0 120 L120 0" />
              <path d="M40 120 L140 20" />
              <path d="M0 80 L80 0" />
            </g>
          </svg>
        </div>
      </div>

      {/* Desktop/Tablet: lined grid */}
      <div className="layout-container hidden md:block">
        <LinedGrid items={items} more={more} locale={locale} forceBlackLogos={forceBlackLogos} />
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

function LinedGrid({ items, more, locale, forceBlackLogos }: { items: ClientLogo[]; more?: { label?: string; href?: string; reference?: { slug?: string; locale?: string } } | null; locale?: "da" | "en"; forceBlackLogos?: boolean }) {
  // 5 columns on large, 4 on md, 3 on sm
  return (
    <div
      className={cn(
        "relative clients-grid",
        // outer bottom/right hairlines
        "[box-shadow:inset_0_-1px_var(--color-border),inset_-1px_0_var(--color-border)]",
      )}
      style={{
        // token alias to simplify arbitrary properties
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "--color-border": "var(--border)",
        // logo tone
        "--clients-logo-filter": forceBlackLogos ? "brightness(0) saturate(100%)" : "grayscale(100%)",
        // Orange hover tuned for brand accent tone
        "--clients-logo-hover-filter": forceBlackLogos
          ? "invert(60%) sepia(86%) saturate(1200%) hue-rotate(340deg) brightness(105%) contrast(101%)"
          : "none",
      }}
    >
      <div className={cn("grid gap-0", "grid-cols-3 md:grid-cols-4 lg:grid-cols-5")}>
        {items.map((logo, i) => (
          <GridCell key={i} logo={logo} />
        ))}
        {/* Optional tail cell from Sanity */}
        {resolveMoreHref(more, locale) && more?.label ? (
          <MoreCell label={more.label} href={resolveMoreHref(more, locale)!} />
        ) : null}
      </div>
    </div>
  );
}

function GridCell({ logo }: { logo: ClientLogo }) {
  const title = logo.title?.trim() || "Client";
  const href = logo.url?.trim();
  const asset = logo.image?.image?.asset;
  const alt = logo.image?.alt?.trim() || title;
  const url = asset?.url;
  const w = Math.max(1, asset?.metadata?.dimensions?.width || 400);
  const h = Math.max(1, asset?.metadata?.dimensions?.height || 200);

  const content = (
    <div
      className={cn(
        "group/[cell] flex items-center justify-center",
        "min-h-[92px] lg:min-h-[112px]",
        // top/left hairlines only; container draws bottom/right
        "[box-shadow:inset_0_1px_var(--color-border),inset_1px_0_var(--color-border)]",
        "bg-[color:var(--card)]",
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          width={Math.round(w)}
          height={Math.round(h)}
          placeholder={logo.image?.image?.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={logo.image?.image?.asset?.metadata?.lqip}
          className="max-h-[56px] w-auto opacity-90 transition will-change-transform [filter:var(--clients-logo-filter)] group-hover/[cell]:[filter:var(--clients-logo-hover-filter)]"
          style={{ mixBlendMode: "multiply" }}
        />
      ) : (
        <span className="px-4 text-sm text-muted-foreground">{title}</span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} aria-label={`Visit ${title}`} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]">
        {content}
      </a>
    );
  }
  return content;
}

function MoreCell({ label = "+ Many more →", href = "/cases" }: { label?: string; href?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "group flex items-center justify-center text-[15px]",
        "min-h-[92px] lg:min-h-[112px]",
        "[box-shadow:inset_0_1px_var(--color-border),inset_1px_0_var(--color-border)]",
        "bg-[color:var(--card)] text-[color:var(--card-foreground)]",
      )}
      aria-label={`Browse more clients`}
    >
      <span className="inline-flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
        {label} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" /></svg>
      </span>
    </a>
  );
}

function resolveMoreHref(
  more: { href?: string; reference?: { slug?: string; locale?: string } } | null | undefined,
  locale?: "da" | "en",
): string | undefined {
  if (!more) return undefined;
  if (more.href) return more.href;
  const slug = more.reference?.slug?.trim();
  const loc = more.reference?.locale || locale;
  if (!slug) return undefined;
  return loc === "en" ? `/en/${slug}` : `/${slug}`;
}
