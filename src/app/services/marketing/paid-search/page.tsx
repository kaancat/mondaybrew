import { Section } from "@/components/layout/section";

export default function PaidSearchPage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Marketing</span>
      <h1>Paid Search</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for paid search services. Her beskriver vi vores tilgang til Google Ads,
        søgeordsstrategi, datamodel og hvordan vi arbejder med automatisering og scripts.
      </p>
    </Section>
  );
}
