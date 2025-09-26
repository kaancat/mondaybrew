import createImageUrlBuilder from "@sanity/image-url";

const projectId = process.env.SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET || "production";

// Build a Sanity image URL for a fixed size (avoids leaking `any` types)
export function ogUrlFor(source: unknown, width: number, height: number): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (createImageUrlBuilder({ projectId, dataset }) as any)
    .image(source)
    .width(width)
    .height(height)
    .fit("crop")
    .url();
}
