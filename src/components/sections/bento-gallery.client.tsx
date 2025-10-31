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
};

export function BentoGalleryClient({ images, columns }: BentoGalleryClientProps) {
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
      {/* Bento Grid - Single responsive grid */}
      <div className="relative">
        {/* Grid Lines Overlay - 10 rows */}
        <div
          className="absolute pointer-events-none grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(10, minmax(150px, auto))`,
            zIndex: 50,
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {/* Create grid cells with borders - 5 columns x 10 rows = 50 cells */}
          {Array.from({ length: columns * 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                border: "1px solid red",
              }}
            />
          ))}
        </div>

        {/* Actual Content Grid - constrained to 10 rows */}
        <div
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(10, minmax(150px, auto))`,
            gridAutoRows: "minmax(150px, auto)",
            gridAutoFlow: "dense", // Fill gaps smartly
          }}
        >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg bg-muted cursor-pointer group"
            style={{
              gridColumn: image.colStart 
                ? `${image.colStart} / span ${image.colSpan}` 
                : `span ${image.colSpan}`,
              gridRow: image.rowStart 
                ? `${image.rowStart} / span ${image.rowSpan}` 
                : `span ${image.rowSpan}`,
            }}
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={image.lqip ? "blur" : undefined}
              blurDataURL={image.lqip}
              sizes={`${100 / columns * image.colSpan}vw`}
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* Zoom icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
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
          </motion.div>
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

