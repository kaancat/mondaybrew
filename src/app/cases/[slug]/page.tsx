import React from "react";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/caseStudy";
import { SectionRenderer } from "@/components/sections/section-renderer";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: caseStudy.title,
    description: caseStudy.excerpt || caseStudy.summary || undefined,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      {/* Page Content Sections - Build the entire page in Sanity */}
      {caseStudy.pageBlocks && caseStudy.pageBlocks.length > 0 ? (
        <>
          {caseStudy.pageBlocks.map((block: any) => (
            <SectionRenderer key={block._key} block={block} />
          ))}
        </>
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h1 className="text-3xl font-bold mb-4">{caseStudy.title || "Case Study"}</h1>
            <p className="text-muted-foreground">
              No content sections added yet. Go to Sanity Studio and add components in the "📄 Individual Page" tab.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

