import { fetchSanity } from "./sanity.client";
import { caseStudiesQuery } from "./sanity.queries";
import type { CaseStudy } from "@/types/caseStudy";

export async function getCaseStudies(locale?: string) {
  const data = await fetchSanity<CaseStudy[]>(caseStudiesQuery, { locale });
  return data;
}

