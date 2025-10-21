import { createClient } from "next-sanity";

const hasReadToken = Boolean(process.env.SANITY_API_READ_TOKEN);

// Get project ID with fallback (same as sanity.config.ts)
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "4ot323fc";

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

// Public client (no token). Works only for public datasets.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-09-01",
  useCdn: true,
});

// Server-side client with read token for private datasets and draft-aware fetching.
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-09-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  // Prefer the server client when a read token is available.
  // If no token is present, first try the non-CDN path to avoid stale CDN responses for freshly seeded content.
  
  // Next.js fetch options with cache tags for revalidation via webhook
  const fetchOptions = {
    next: {
      tags: ["sanity:site"], // Tag all Sanity fetches so webhook can revalidate them
    },
  };

  if (hasReadToken) {
    return serverClient.fetch<T>(query, params, fetchOptions);
  }
  try {
    // Non-CDN, no-token client (works for public datasets)
    const noCdnClient = createClient({
      projectId,
      dataset,
      apiVersion: "2024-09-01",
      useCdn: false,
    });
    return await noCdnClient.fetch<T>(query, params, fetchOptions);
  } catch {
    // Fallback to CDN client
    return sanityClient.fetch<T>(query, params, fetchOptions);
  }
}
