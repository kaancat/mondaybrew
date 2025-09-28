import { Section } from "@/components/layout/section";

export default function AboutPage() {
  return (
    <Section innerClassName="flow">
      <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Om os</span>
      <h1>Teamet bag mondaybrew</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder til om-os siden. Her fortæller vi om teamet, kultur, værdier og hvordan vi
        arbejder i partnerskab med kunder.
      </p>
    </Section>
  );
}

