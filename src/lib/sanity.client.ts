import { createClient } from "next-sanity";

const hasReadToken = Boolean(process.env.SANITY_API_READ_TOKEN);

// Public client (no token). Works only for public datasets.
export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-09-01",
  useCdn: true,
});

// Server-side client with read token for private datasets and draft-aware fetching.
export const serverClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-09-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  // Prefer the server client when a read token is available (private datasets)
  const client = hasReadToken ? serverClient : sanityClient;
  return client.fetch<T>(query, params);
}
