import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * Paid Search service page
 * Dynamically renders content from Sanity CMS
 */
export default function PaidSearchPage() {
  return (
    <DynamicPage 
      slug="services/marketing/paid-search"
      fallbackTitle="Paid Search"
      fallbackDescription="Placeholder for paid search services. Her beskriver vi vores tilgang til Google Ads, søgeordsstrategi, datamodel og hvordan vi arbejder med automatisering og scripts."
    />
  );
}

export const revalidate = 60;
