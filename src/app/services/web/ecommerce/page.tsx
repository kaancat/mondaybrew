import { Section } from "@/components/layout/section";

export default function EcommercePage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Web</span>
      <h1>eCommerce</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for eCommerce-løsninger. Her samler vi vores tilgang til shops, headless
        arkitektur, integrationer og vækstplaner for CLV.
      </p>
    </Section>
  );
}
