import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * AI service page
 * Dynamically renders content from Sanity CMS
 */
export default function AiPage() {
  return (
    <DynamicPage 
      slug="services/web/ai"
      fallbackTitle="AI-løsninger"
      fallbackDescription="Placeholder der beskriver vores AI-arbejde: personaliserede oplevelser, GPT-integrationer, data pipelines og automation i produkter og marketing."
    />
  );
}

export const revalidate = 60;
