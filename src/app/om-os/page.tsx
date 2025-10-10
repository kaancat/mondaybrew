import { Section } from "@/components/layout/section";

export default function AboutPage() {
  return (
    <main>
      <Section innerClassName="flow">
        <span className="eyebrow text-sm uppercase tracking-[0.25em] text-[color:var(--eyebrow-color,currentColor)]">Om os</span>
        <h1>Teamet bag mondaybrew</h1>
        <p className="max-w-2xl text-muted-foreground">
          Placeholder til om-os siden. Her fortæller vi om teamet, kultur, værdier og hvordan vi
          arbejder i partnerskab med kunder.
        </p>
      </Section>
    </main>
  );
}
