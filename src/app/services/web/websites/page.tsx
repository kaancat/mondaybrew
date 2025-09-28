import { Section } from "@/components/layout/section";

export default function WebsitesPage() {
  return (
    <Section innerClassName="flow">
      <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Web</span>
      <h1>Websites</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for website-ydelser. Her beskriver vi design- og udviklingsprocessen, stack
        (Next.js, Sanity, Vercel) og fokus på performance & SEO.
      </p>
    </Section>
  );
}

