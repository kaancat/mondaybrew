import { fetchSanity } from "./sanity.client";
import { caseStudiesQuery } from "./sanity.queries";
import type { CaseStudy } from "@/types/caseStudy";

/**
 * Fetch all case studies, optionally filtered by locale
 * @param locale - Optional locale to filter by (e.g., "da", "en")
 * @returns Array of case studies matching the locale filter
 */
export async function getCaseStudies(locale?: string) {
  const data = await fetchSanity<CaseStudy[]>(caseStudiesQuery, {});
  
  // Filter by locale if specified
  if (locale && Array.isArray(data)) {
    return data.filter(caseStudy => {
      // Include cases with matching locale or no locale defined
      return !caseStudy.locale || caseStudy.locale === locale;
    });
  }
  
  return data;
}

