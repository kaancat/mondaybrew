import { Section } from "@/components/layout/section";
import CaseStudyCarouselSection from "@/components/sections/case-study-carousel";

export default function CasesPage() {
  return (
    <Section innerClassName="flow">
      <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Cases</span>
      <h1>Vores cases</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for case overview. Her kommer filtrering, highlights og links til individuelle
        projekter.
      </p>
      <div className="mt-8">
        <CaseStudyCarouselSection />
      </div>
    </Section>
  );
}
