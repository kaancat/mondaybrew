import { fetchSanity } from "./sanity.client";
import { caseStudyBySlugQuery } from "./sanity.queries";
import type { CaseStudy } from "@/types/caseStudy";

/**
 * Fetch a single case study by its slug
 * @param slug - The case study slug
 * @param locale - Optional locale for i18n
 * @returns Case study data or null if not found
 */
export async function getCaseStudyBySlug(slug: string, locale?: string) {
  const data = await fetchSanity<CaseStudy | null>(caseStudyBySlugQuery, { slug, locale });
  return data;
}

