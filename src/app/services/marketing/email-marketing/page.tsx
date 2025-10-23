import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * Email Marketing service page
 * Dynamically renders content from Sanity CMS
 */
export default function EmailMarketingPage() {
  return (
    <DynamicPage
      slug="services/marketing/email-marketing"
      fallbackTitle="E-mail Marketing"
      fallbackDescription="Placeholder for e-mail marketing. Her beskriver vi flows, segmentering, platforme som Klaviyo/HubSpot og hvordan vi kobler automation med performance data."
    />
  );
}

export const revalidate = 60;
