import { Section } from "@/components/layout/section";

export default function ContactPage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Kontakt</span>
      <h1>Skal vi tage en snak?</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for kontakt-siden. Her kommer kontaktinfo, adresse og et Typeform-embed.
      </p>
      {/* Temporarily commented out for mobile menu testing */}
      {/* <div className="max-w-3xl">
        <TypeformEmbed id="placeholder" />
      </div> */}
    </Section>
  );
}
