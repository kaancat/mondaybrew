import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * Websites service page
 * Dynamically renders content from Sanity CMS
 */
export default function WebsitesPage() {
  return (
    <DynamicPage
      slug="services/web/websites"
      fallbackTitle="Websites"
      fallbackDescription="This page needs to be set up in Sanity."
    />
  );
}

export const revalidate = 60;
