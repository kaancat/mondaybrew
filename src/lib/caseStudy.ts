import { fetchSanity } from "./sanity.client";
import { caseStudyBySlugQuery } from "./sanity.queries";

export async function getCaseStudyBySlug(slug: string, locale?: string) {
  return await fetchSanity(caseStudyBySlugQuery, { slug, locale });
}

