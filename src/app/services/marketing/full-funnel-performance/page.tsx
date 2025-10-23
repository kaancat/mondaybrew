import { DynamicPage } from "@/components/shared/dynamic-page";

/**
 * Full-Funnel Performance service page
 * Dynamically renders content from Sanity CMS
 */
export default function FullFunnelPerformancePage() {
  return (
    <DynamicPage 
      slug="services/marketing/full-funnel-performance"
      fallbackTitle="Full-Funnel Performance"
      fallbackDescription="Placeholder page for vores full-funnel performance-tilbud. Her kommer cases, hvordan vi arbejder med kanaler på tværs af awareness, consideration og conversion – og de strategiske rammer vi bygger kampagnerne på."
    />
  );
}

export const revalidate = 60;
