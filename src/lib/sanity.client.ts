import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-09-01",
  useCdn: true,
});

export const previewClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-09-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: "previewDrafts",
});

export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}
