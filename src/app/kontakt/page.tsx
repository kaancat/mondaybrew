import { Section } from "@/components/layout/section";
import { TypeformEmbed } from "@/components/shared/typeform";

export default function ContactPage() {
  return (
    <Section innerClassName="flow">
      <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Kontakt</span>
      <h1>Skal vi tage en snak?</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for kontakt-siden. Her kommer kontaktinfo, adresse og et Typeform-embed.
      </p>
      <div className="max-w-3xl">
        <TypeformEmbed id="placeholder" />
      </div>
    </Section>
  );
}

