import { HeroPage } from "@/components/sections/hero-page";

/**
 * Websites service page
 * Hero Page component with hardcoded content
 */
export default function WebsitesPage() {
  return (
    <HeroPage
      eyebrow="Web"
      heading="Websites"
      subheading="Placeholder for website-ydelser. Her beskriver vi design- og udviklingsprocessen, stack (Next.js, Sanity, Vercel) og fokus på performance & SEO."
      media={{
        mediaType: "image",
        image: {
          asset: {
            url: "https://placehold.co/1920x1080/e5e7eb/9ca3af?text=Website+Preview"
          },
          alt: "Website preview placeholder"
        }
      }}
      breadcrumbs={[
        { _key: "overview", label: "Overblik", anchor: "overview" },
        { _key: "process", label: "Proces", anchor: "process" },
        { _key: "tech", label: "Tech", anchor: "tech" },
        { _key: "cases", label: "Cases", anchor: "cases" },
        { _key: "pricing", label: "Priser", anchor: "pricing" },
      ]}
    />
  );
}
