import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "primary" | "lightAlt" | "dark";

type ResolvedImage = {
  url: string;
  alt: string | null;
  lqip: string | null;
  width?: number;
  height?: number;
} | null;

export type ContentBillboardData = {
  eyebrow?: string | null;
  backgroundMode?: "tone" | "image" | null;
  tone?: Tone | null;
  backgroundImage?: {
    alt?: string | null;
    asset?: { url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null } | null;
  } | null;
  contentType?: "quote" | "richText" | "ctas" | "newsletter" | null;
  // quote
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  logo?: { alt?: string | null; asset?: { url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null } | null } | null;
  // rich text (portable text as plain string for now)
  body?: unknown;
  // ctas
  ctas?: { label?: string | null; href?: string | null; variant?: string | null }[] | null;
  // newsletter
  heading?: string | null;
  description?: string | null;
};

type ToneStyle = { background: string; ink: string; sub: string; divider: string; border: string };

const MODE_PRESETS: Record<Tone, ToneStyle> = {
  primary: {
    background: "var(--surface-dark)",
    ink: "var(--brand-light)",
    sub: "color-mix(in oklch, var(--brand-light) 82%, transparent 18%)",
    divider: "color-mix(in oklch, var(--brand-light) 32%, transparent 68%)",
    border: "color-mix(in oklch, var(--brand-light) 26%, transparent 74%)",
  },
  lightAlt: {
    background: "var(--services-card-bg, oklch(1 0 0))",
    ink: "var(--services-ink-strong, var(--brand-ink-strong))",
    sub: "color-mix(in oklch, var(--services-ink-strong, var(--brand-ink-strong)) 70%, transparent 30%)",
    divider: "color-mix(in oklch, var(--services-ink-strong, var(--brand-ink-strong)) 18%, transparent 82%)",
    border: "var(--nav-shell-border, oklch(0.922 0 0))",
  },
  dark: {
    background: "var(--services-card-bg, var(--brand-light))",
    ink: "var(--brand-ink-strong)",
    sub: "color-mix(in oklch, var(--brand-ink-strong) 72%, transparent 28%)",
    divider: "color-mix(in oklch, var(--brand-ink-strong) 22%, transparent 78%)",
    border: "color-mix(in oklch, var(--brand-ink-strong) 18%, transparent 82%)",
  },
};

function resolveImage(img?: ContentBillboardData["backgroundImage"] | ContentBillboardData["logo"]): ResolvedImage {
  const url = img?.asset?.url || null;
  const alt = (img as { alt?: string | null } | undefined)?.alt || null;
  const lqip = img?.asset?.metadata?.lqip || null;
  const width = img?.asset?.metadata?.dimensions?.width || undefined;
  const height = img?.asset?.metadata?.dimensions?.height || undefined;
  if (!url) return null;
  return { url, alt, lqip, width, height };
}

export function ContentBillboard(props: ContentBillboardData) {
  const tone: Tone = (props.tone as Tone) || "primary";
  const style = MODE_PRESETS[tone];
  const bgImage = props.backgroundMode === "image" ? resolveImage(props.backgroundImage) : null;
  const logo = resolveImage(props.logo);

  return (
    <Section bleed innerClassName="">
      <div
        className="relative overflow-hidden rounded-[10px]"
        style={{
          background: style.background,
          color: style.ink,
          border: `1px solid ${style.border}`,
          boxShadow: "var(--shadow-elevated-md)",
        }}
      >
        {/* Background image (optional) */}
        {bgImage?.url && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={bgImage.url}
              alt={bgImage.alt || ""}
              fill
              className="object-cover"
              sizes="100vw"
              placeholder={bgImage.lqip ? "blur" : "empty"}
              blurDataURL={bgImage.lqip || undefined}
              priority={false}
            />
            {/* Subtle overlay to ensure readability */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.22), rgba(0,0,0,0.12))" }} />
          </div>
        )}

        <div className={cn("p-6 md:p-10 lg:p-14")}
             style={{ minHeight: 360 }}>
          {props.eyebrow && (
            <span className="block text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--mb-accent)" }}>
              {props.eyebrow}
            </span>
          )}

          {/* Content variants */}
          <div className="mt-4 md:mt-6">
            {props.contentType === "quote" && (
              <div className="grid gap-6 md:gap-8" style={{ maxWidth: 980 }}>
                {props.quote && (
                  <blockquote className="text-balance text-[clamp(1.25rem,2.2vw,1.875rem)] leading-snug font-medium">
                    “{props.quote}”
                  </blockquote>
                )}
                {(props.author || props.role) && (
                  <div className="text-[length:var(--font-body)]" style={{ color: style.sub }}>
                    <div className="font-medium" style={{ color: style.ink }}>{props.author}</div>
                    {props.role && <div>{props.role}</div>}
                  </div>
                )}
                {logo?.url && (
                  <div className="relative h-8 w-28 opacity-90">
                    <Image src={logo.url} alt={logo.alt || ""} fill className="object-contain" sizes="112px" />
                  </div>
                )}
              </div>
            )}

            {props.contentType === "richText" && Array.isArray(props.body) && (
              <div className="prose prose-invert max-w-none" style={{
                // tune tone
                color: style.sub,
              }}>
                {/* We keep it simple: render paragraphs from blocks with children text */}
                {(props.body as { children?: { text?: string }[] }[]).map((block, i) => {
                  const text = Array.isArray(block?.children)
                    ? block.children.map((c) => c.text || "").join("")
                    : "";
                  return text ? <p key={i}>{text}</p> : null;
                })}
              </div>
            )}

            {props.contentType === "ctas" && Array.isArray(props.ctas) && (
              <div className="flex flex-wrap gap-3">
                {props.ctas
                  .filter((b) => b?.label && (b?.href || "").trim())
                  .map((b, i) => (
                    <Button key={i} asChild variant={resolveButtonVariant(b?.variant)} size="lg">
                      <a href={(b?.href || "").trim()}>{b?.label}</a>
                    </Button>
                  ))}
              </div>
            )}

            {props.contentType === "newsletter" && (
              <div className="grid gap-4 md:gap-6" style={{ maxWidth: 720 }}>
                {props.heading && <h3 className="text-2xl font-semibold">{props.heading}</h3>}
                {props.description && <p style={{ color: style.sub }}>{props.description}</p>}
                {/* Minimal local form (no provider binding yet) */}
                <form className="flex w-full max-w-xl gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="flex-1 rounded-md bg-transparent px-4 py-3 outline-none"
                    style={{
                      border: `1px solid ${style.divider}`,
                      color: style.ink,
                    }}
                  />
                  <Button type="submit" size="lg">Subscribe</Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function isContentBillboard(section: { _type?: string } | null | undefined): section is ContentBillboardData & { _type: "contentBillboard" } {
  return Boolean(section && section._type === "contentBillboard");
}

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"] as const);
type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "link";
function resolveButtonVariant(v?: string | null): ButtonVariant {
  if (v && ALLOWED_BUTTON_VARIANTS.has(v as ButtonVariant)) return v as ButtonVariant;
  return "default";
}
