import { Section } from "@/components/layout/section";

export default function AiPage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Web</span>
      <h1>AI-løsninger</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder der beskriver vores AI-arbejde: personaliserede oplevelser, GPT-integrationer,
        data pipelines og automation i produkter og marketing.
      </p>
    </Section>
  );
}
