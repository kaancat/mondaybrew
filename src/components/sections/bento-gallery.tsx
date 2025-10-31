import { Section } from "@/components/layout/section";
import { BentoGalleryClient } from "./bento-gallery.client";
import { calculateGridSize, optimizeBentoLayout } from "@/lib/bentoGridHelper";

type SanityImage = {
  image?: {
    image?: {
      asset?: {
        url?: string | null;
        metadata?: {
          lqip?: string | null;
          dimensions?: {
            width?: number | null;
            height?: number | null;
          } | null;
        } | null;
      } | null;
    } | null;
    alt?: string | null;
  } | null;
  position?: {
    columnStart?: number | null;
    columnSpan?: number | null;
    rowStart?: number | null;
    rowSpan?: number | null;
  } | null;
};

export type BentoGallerySectionData = {
  images?: SanityImage[] | null;
  columns?: number | null;
  rows?: number | null;
  showGridLines?: boolean | null;
};

export function BentoGallerySection({ images, columns = 5, rows = 10, showGridLines = true }: BentoGallerySectionData) {
  // Use columns and rows from Sanity, with defaults
  const gridColumns = columns || 5;
  const gridRows = rows || 10;
  const showLines = showGridLines ?? true;
  if (!images || images.length === 0) return null;

  // Process images and calculate grid sizes
  const processedImages = images
    .map((item, index) => {
      const imageUrl = item.image?.image?.asset?.url;
      if (!imageUrl) return null;

      const dimensions = item.image?.image?.asset?.metadata?.dimensions;
      
      // Check if manual position is set
      const hasManualPosition = item.position?.columnStart && item.position?.rowStart;
      
      let colSpan, rowSpan, colStart, rowStart;
      
      if (hasManualPosition) {
        // Use manual position from number inputs
        colStart = item.position!.columnStart!;
        colSpan = item.position!.columnSpan || 1;
        rowStart = item.position!.rowStart!;
        rowSpan = item.position!.rowSpan || 2;
      } else {
        // Auto-calculate based on aspect ratio
        colStart = undefined;
        rowStart = undefined;
        if (!dimensions || !dimensions.width || !dimensions.height) {
          // Fallback to square if no dimensions
          colSpan = 1;
          rowSpan = 2;
        } else {
          const gridSize = calculateGridSize(
            { width: dimensions.width, height: dimensions.height },
            undefined,
            index // Pass index for deterministic variety
          );
          colSpan = gridSize.colSpan;
          rowSpan = gridSize.rowSpan;
        }
      }

      return {
        url: imageUrl,
        alt: item.image?.alt || "Gallery image",
        lqip: item.image?.image?.asset?.metadata?.lqip || undefined,
        width: dimensions?.width || 1000,
        height: dimensions?.height || 1000,
        colStart,
        colSpan,
        rowStart,
        rowSpan,
        manualPosition: hasManualPosition,
      };
    })
    .filter((img): img is NonNullable<typeof img> => img !== null);

  if (processedImages.length === 0) return null;

  // Only optimize layout for images without manual positions
  const hasAnyManualPositions = processedImages.some(img => img.manualPosition);
  
  let finalImages;
  if (hasAnyManualPositions) {
    // If any images have manual positions, don't optimize (use exact positions)
    finalImages = processedImages;
  } else {
    // Optimize layout for auto-positioned images
    const gridSizes = processedImages.map((img) => ({
      colSpan: img.colSpan,
      rowSpan: img.rowSpan,
    }));
    const optimizedSizes = optimizeBentoLayout(gridSizes, gridColumns);

    // Apply optimized sizes
    finalImages = processedImages.map((img, i) => ({
      ...img,
      colSpan: optimizedSizes[i].colSpan,
      rowSpan: optimizedSizes[i].rowSpan,
    }));
  }

  return (
    <Section>
      <BentoGalleryClient images={finalImages} columns={gridColumns} rows={gridRows} showGridLines={showLines} />
    </Section>
  );
}

export function isBentoGallerySection(
  section: { _type?: string } | null | undefined,
): section is BentoGallerySectionData & { _type: "bentoGallery" } {
  return Boolean(section && section._type === "bentoGallery");
}

