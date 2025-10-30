import { FAQClient } from "./faq.client";

/**
 * FAQ Section - Server Component Wrapper
 * 
 * Purpose: Provides server-side data fetching for FAQ content from Sanity CMS
 * Why: Separates data fetching from client interactivity, enabling better performance
 */

interface FAQCategory {
  id: string;
  label: string;
  questions: Array<{
    question: string;
    answer: string;
    cta?: {
      label?: string | null;
      href?: string | null;
      variant?: string | null;
      reference?: {
        slug?: string | null;
        locale?: string | null;
      } | null;
    } | null;
  }>;
}

export interface FAQSectionProps {
  title?: string;
  subheading?: string;
  titleAlignment?: "left" | "center" | "right";
  categories?: FAQCategory[];
}

export function FAQSection({
  title,
  subheading,
  titleAlignment,
  categories,
}: FAQSectionProps) {
  // Transform Sanity data structure to match component expectations
  const transformedCategories: FAQCategory[] | undefined = categories?.map((cat) => ({
    id: cat.id || "",
    label: cat.label || "",
    questions: cat.questions || [],
  }));

  return (
    <FAQClient
      title={title}
      subheading={subheading}
      titleAlignment={titleAlignment}
      categories={transformedCategories}
    />
  );
}

export type { FAQSectionProps };

