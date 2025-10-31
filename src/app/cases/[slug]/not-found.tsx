import Link from "next/link";
import { Section } from "@/components/layout/section";

export default function CaseStudyNotFound() {
  return (
    <Section className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Study Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          This case study doesn't exist yet or the URL is incorrect.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          ← Back to Cases
        </Link>
      </div>
    </Section>
  );
}

