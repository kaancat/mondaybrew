import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * Paid Social service page
 * Dynamically renders content from Sanity CMS
 */
export default function PaidSocialPage() {
  return (
    <DynamicPage
      slug="services/marketing/paid-social"
      fallbackTitle="Paid Social"
      fallbackDescription="Placeholder til paid social. Her kommer vores frameworks for kampagnestrukturer, kreative, audience design og platforme som Meta, TikTok og LinkedIn."
    />
  );
}

export const revalidate = 60;
