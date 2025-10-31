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
  // Also ensure unique IDs by appending index if duplicates exist
  const seenIds = new Set<string>();
  const duplicates: string[] = [];
  
  const transformedCategories: FAQCategory[] | undefined = categories?.map((cat, index) => {
    let uniqueId = cat.id || `category-${index}`;
    
    // Handle duplicate IDs by appending index
    if (seenIds.has(uniqueId)) {
      duplicates.push(uniqueId);
      uniqueId = `${uniqueId}-${index}`;
    }
    seenIds.add(uniqueId);
    
    return {
      id: uniqueId,
      label: cat.label || "",
      questions: cat.questions || [],
    };
  });
  
  // Warn about duplicate IDs in development
  if (duplicates.length > 0 && process.env.NODE_ENV === "development") {
    console.warn(
      `[FAQ Section] Duplicate category IDs detected: ${duplicates.join(", ")}. ` +
      `Please fix these in Sanity Studio to ensure proper functionality.`
    );
  }

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

