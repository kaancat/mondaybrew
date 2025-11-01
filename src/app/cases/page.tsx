import React from "react";
import { Section } from "@/components/layout/section";
import { getCaseStudies } from "@/lib/caseStudies";
import { CasesStickyScroll } from "@/components/sections/cases-sticky-scroll-v2.client";
import type { CaseStudy } from "@/types/caseStudy";

export default async function CasesPage() {
  let cases: CaseStudy[] = [];
  try {
    cases = (await getCaseStudies("da")) || [];
  } catch {
    cases = [];
  }

  if (!cases || cases.length === 0) {
    return (
      <Section>
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">No Case Studies Yet</h1>
          <p className="text-muted-foreground mb-8">Create case studies in Sanity Studio to see them here.</p>
          <a
            href="https://mondaybrew.sanity.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Open Sanity Studio →
          </a>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section className="!pb-0">
        <div className="flex flex-col" style={{ gap: "1em" } as React.CSSProperties}>
          <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)] block" style={{ lineHeight: "1" }}>
            Cases
          </span>
          <h1 style={{ lineHeight: "1", margin: 0 }}>Vores cases</h1>
          <p className="text-muted-foreground max-w-2xl" style={{ lineHeight: "1.5", margin: 0 }}>
            Discover our portfolio of successful projects and innovative solutions we&#39;ve delivered for our clients.
          </p>
        </div>
      </Section>
      <Section padding="none">
        <CasesStickyScroll cases={cases} />
      </Section>
    </>
  );
}
