import React from "react";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/caseStudy";
import { SectionRenderer } from "@/components/sections/section-renderer";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cs = await getCaseStudyBySlug(params.slug);
  if (!cs) return { title: "Case Study Not Found" };
  return { title: cs.title, description: cs.excerpt || cs.summary || undefined };
}

export default async function CaseStudyPage({ params }: Props) {
  const cs = await getCaseStudyBySlug(params.slug);
  if (!cs) notFound();
  const blocks = Array.isArray(cs.pageBlocks) ? cs.pageBlocks : [];
  type Block = { _key: string; _type: string } & Record<string, unknown>;
  return (
    <>
      {blocks.length ? (
        (blocks as Block[]).map((block) => <SectionRenderer key={block._key} block={block} />)
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h1 className="text-3xl font-bold mb-4">{cs.title || "Case Study"}</h1>
            <p className="text-muted-foreground">
              No content sections added yet. Add components in the &quot;📄 Individual Page&quot; tab in Studio.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
