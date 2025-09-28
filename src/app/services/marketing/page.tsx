import { Section } from "@/components/layout/section";

export default function MarketingOverviewPage() {
  return (
    <Section innerClassName="flow">
      <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Services</span>
      <h1>Marketing Services</h1>
      <p className="text-muted-foreground max-w-2xl">
        Overblik over vores marketing-ydelser. Her kommer introtekst, links til underkategorier og
        evt. en kontakt-CTA.
      </p>
    </Section>
  );
}

