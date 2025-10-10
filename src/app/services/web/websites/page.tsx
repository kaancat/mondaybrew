import { Section } from "@/components/layout/section";

export default function WebsitesPage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Web</span>
      <h1>Websites</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for website-ydelser. Her beskriver vi design- og udviklingsprocessen, stack
        (Next.js, Sanity, Vercel) og fokus på performance & SEO.
      </p>
    </Section>
  );
}
