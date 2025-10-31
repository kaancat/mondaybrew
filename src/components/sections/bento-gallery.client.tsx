"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type BentoImage = {
  url: string;
  alt: string;
  lqip?: string;
  colStart?: number;
  colSpan: number;
  rowStart?: number;
  rowSpan: number;
};

type BentoGalleryClientProps = {
  images: BentoImage[];
  columns: number;
  rows: number;
  showGridLines: boolean;
};

export function BentoGalleryClient({ images, columns, rows, showGridLines }: BentoGalleryClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      {/* Bento Grid - Responsive grid */}
      <div className="relative">
        {/* Grid Lines Overlay - only show on desktop when enabled */}
        {showGridLines && (
          <div
            className="hidden lg:grid absolute pointer-events-none gap-3 md:gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, minmax(150px, auto))`,
              zIndex: 50,
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {/* Create grid cells with borders */}
            {Array.from({ length: columns * rows }).map((_, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid red",
                }}
              />
            ))}
          </div>
        )}

        {/* Actual Content Grid - responsive */}
        <div
          className="bento-grid-container grid gap-3 md:gap-4"
          style={{
            // CSS custom properties for responsive columns
            "--bento-columns": columns,
            "--bento-rows": rows,
            gridTemplateColumns: "repeat(1, 1fr)", // Mobile default
            gridAutoRows: "minmax(200px, auto)",
            gridAutoFlow: "dense",
          } as React.CSSProperties}
        >
        {images.map((image, index) => (
          <div
            key={index}
            className="bento-grid-item relative overflow-hidden rounded-lg bg-muted cursor-pointer group"
            style={{
              // On mobile/tablet: just span 1 column
              // On desktop: use configured positioning
              "--col-start": image.colStart || 'auto',
              "--col-span": image.colSpan,
              "--row-start": image.rowStart || 'auto',
              "--row-span": image.rowSpan,
              gridColumn: 'span 1', // Mobile default
              gridRow: 'auto',
            } as React.CSSProperties}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-all duration-500 group-hover:brightness-110"
              placeholder={image.lqip ? "blur" : undefined}
              blurDataURL={image.lqip}
              sizes={`${100 / columns * image.colSpan}vw`}
            />
            
            {/* Shine effect on hover - sweeps from left to right */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
              }}
            >
              <div 
                className="w-full h-full group-hover:animate-shine"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                }}
              />
            </div>
            
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            
            {/* Zoom icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>

            {/* Previous button */}
            {images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
              >
                ←
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
              >
                →
              </button>
            )}

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm z-10">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].alt}
                width={1600}
                height={1200}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

