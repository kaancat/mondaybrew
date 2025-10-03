import { Section } from "@/components/layout/section";
import dynamic from "next/dynamic";

const CaseStudyCarouselSection = dynamic(() => import("@/components/sections/case-study-carousel"), {
  ssr: true,
});

export default function CasesPage() {
  return (
    <Section innerClassName="flow">
      <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Cases</span>
      <h1>Vores cases</h1>
      <p className="text-muted-foreground max-w-2xl">
        Placeholder for case overview. Her kommer filtrering, highlights og links til individuelle
        projekter.
      </p>
      <div className="mt-8">
        {/* Server component fetches from Sanity and falls back to mock data */}
        {/* @ts-expect-error Async Server Component */}
        <CaseStudyCarouselSection />
      </div>
    </Section>
  );
}
