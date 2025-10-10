import { Section } from "@/components/layout/section";

export default function EmailMarketingPage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Marketing</span>
      <h1>E-mail Marketing</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for e-mail marketing. Her beskriver vi flows, segmentering, platforme som
        Klaviyo/HubSpot og hvordan vi kobler automation med performance data.
      </p>
    </Section>
  );
}
