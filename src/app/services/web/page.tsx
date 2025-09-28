import { Section } from "@/components/layout/section";

export default function WebOverviewPage() {
  return (
    <Section innerClassName="flow">
      <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Services</span>
      <h1>Web & Digital Products</h1>
      <p className="text-muted-foreground max-w-2xl">
        Overblik over vores web- og produktteam. Her introducerer vi samarbejdsmodellen, stack og
        link til de centrale underområder.
      </p>
    </Section>
  );
}

