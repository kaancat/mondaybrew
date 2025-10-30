"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ShowcaseResolvedImage = {
  src?: string | null;
  alt?: string | null;
  blurDataURL?: string | null;
  width?: number;
  height?: number;
} | null;

export type ShowcaseResolvedVideo = {
  url?: string | null;
  poster?: ShowcaseResolvedImage;
} | null;

export type ShowcaseStat = { value?: string | null; label?: string | null; icon?: ShowcaseResolvedImage | null };

type Props = {
  eyebrow?: string | null;
  headline?: string | null;
  alignment?: "start" | "center" | "end";
  image?: ShowcaseResolvedImage;
  video?: ShowcaseResolvedVideo;
  cta?: { label?: string | null; href?: string | null; variant?: "default" | "secondary" | "outline" | "ghost" | "link" } | null;
  stats?: ShowcaseStat[];
};

export default function MediaShowcaseClient({ eyebrow, headline, alignment = "start", image, video, cta, stats = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const hasVideo = !!video?.url;
  const hasImage = !!image?.src && !hasVideo;

  const onTogglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, []);

  const gridCols = useMemo(() => {
    const n = stats.length;
    if (n >= 4) return "grid-cols-2 md:grid-cols-4";
    if (n === 3) return "grid-cols-2 md:grid-cols-3";
    if (n === 2) return "grid-cols-2";
    return "grid-cols-1";
  }, [stats]);

  return (
    <div className="flex flex-col gap-[var(--flow-space)]">
      <div className={cn("flex flex-col gap-3", alignment === "center" ? "items-center text-center" : "items-start text-left")}> 
        {eyebrow ? (
          <p className="eyebrow text-[length:var(--font-tight)] uppercase tracking-[0.3em] text-[color:var(--eyebrow-color,var(--accent))]">{eyebrow}</p>
        ) : null}
        {headline ? (
          <h2 className="text-balance text-[color:var(--foreground)]">{headline}</h2>
        ) : null}
      </div>

      {/* Media card with 3D-ish elevation and top-notch CTA */}
      <div className={cn("relative isolate", isMobile ? "full-bleed" : undefined)}>
        {/* Notch pocket: white rectangular component that sits on top of the video card */}
        {cta?.label && cta?.href ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
            <div className="relative" style={{ marginTop: "0px" }}>
              <div
                className={cn(
                  "pointer-events-auto inline-flex flex-col items-center",
                  // width + geometry (shrink-wrap around the CTA)
                  // smaller on mobile, scale up at md+
                  "w-auto max-w-[172px] sm:max-w-[196px] md:max-w-[220px]",
                  "rounded-t-[0px] rounded-b-[5px]",
                  // Glassy notch background like header
                  "bg-[color:var(--nav-shell-bg)] border border-[color:var(--nav-shell-border)] backdrop-blur-[8px] md:backdrop-blur-[10px]",
                  // Tighter padding on mobile
                  "px-2.5 py-1.5 md:px-3 md:py-2",
                )}
                style={{ boxShadow: "var(--nav-shell-shadow)" }}
              >
                <Link
                  href={cta.href!}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[color:var(--nav-cta-border)] bg-[color:var(--nav-cta-bg)] px-3 py-1.5 text-xs font-normal text-[color:var(--nav-cta-text)] transition-colors hover:bg-[color:var(--nav-cta-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-cta-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-cta-ring-offset)]"
                >
                  <span>{cta.label}</span>
                </Link>
                
              </div>
            </div>
          </div>
        ) : null}

        {/* Card */}
        <motion.div
          className={cn(
            "group relative overflow-hidden bg-[color:var(--card)]",
            isMobile ? "rounded-none" : "rounded-[5px] drop-shadow-[0_36px_110px_rgba(8,6,20,0.28)]",
          )}
          whileHover={isMobile ? undefined : { rotateX: 0.6, rotateY: -0.6 }}
          transition={isMobile ? undefined : { type: "spring", stiffness: 120, damping: 18 }}
          style={isMobile ? ({ marginTop: "0" } as CSSProperties) : ({ transformStyle: "preserve-3d", marginTop: "0" } as CSSProperties)}
        >
          {/* aspect to keep layout stable */}
          <div className={cn(isMobile ? "aspect-[4/3]" : "aspect-[16/6]")} />

          {hasImage ? (
            <Image
              src={image!.src!}
              alt={image!.alt || "Media image"}
              fill
              sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 100vw"
              placeholder={image?.blurDataURL ? "blur" : undefined}
              blurDataURL={image?.blurDataURL || undefined}
              className="absolute inset-0 object-cover"
              priority={false}
            />
          ) : null}
          {hasVideo ? (
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                playsInline
                controls
                poster={video?.poster?.src || undefined}
                className="size-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={video!.url!} />
              </video>
              {/* Overlay play button for quick UX on top of native controls; hidden when playing */}
              <button
                type="button"
                aria-label={isPlaying ? "Pause video" : "Play video"}
                onClick={onTogglePlay}
                className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center",
                  "size-16 rounded-full bg-black/55 text-white backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.36)]",
                  isPlaying ? "opacity-0 pointer-events-none" : "opacity-100",
                )}
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          ) : null}

          {/* Subtle sheen animation */}
          {!isMobile ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, transparent 40%, color-mix(in_oklch,var(--card)_55%, white 45%) 47%, transparent 55%)",
                backgroundSize: "250% 250%",
              }}
            />
          ) : null}

          {/* Gradient bottom fade for legibility */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 md:h-2/5 bg-[linear-gradient(to_top,rgba(0,0,0,0.38),transparent)]"
          />
        </motion.div>
      </div>

      {stats.length ? (
        <div className={cn("grid gap-x-8 gap-y-3 md:gap-y-2", gridCols)}>
          {stats.map((s, i) => (
            <div key={`${s.label || s.value || i}`} className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
              {s.icon?.src ? (
                <Image
                  src={s.icon.src}
                  alt={s.icon.alt || ""}
                  width={24}
                  height={24}
                  className="mt-[2px] size-6 object-contain opacity-80 md:mt-0"
                />
              ) : null}
              <div>
                {s.value ? <div className="text-[length:var(--font-h3)] leading-none text-primary">{s.value}</div> : null}
                {s.label ? <div className="text-muted-foreground">{s.label}</div> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
