import { CaseStudyCarousel } from "./case-study-carousel.client";
import { getCaseStudies } from "@/lib/caseStudies";

type Props = {
  locale?: string;
  initialIndex?: number;
};

export default async function CaseStudyCarouselSection({ locale, initialIndex }: Props) {
  const items = await getCaseStudies(locale);
  if (!items?.length) return null;
  return <CaseStudyCarousel items={items} initialIndex={initialIndex} exploreHref="/cases" />;
}
