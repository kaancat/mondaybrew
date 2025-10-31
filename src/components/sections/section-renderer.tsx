import React from "react";
import { HeroSection } from "./hero";
import { HeroPage } from "./hero-page";
import { TextOnlySection } from "./text-only";
import { TextImageSection } from "./text-image";
import MediaShowcase from "./media-showcase";
import { BentoGallerySection } from "./bento-gallery";
import { ServicesSplitSection } from "./services-split";
import { AboutSection } from "./about-section";
import CaseStudyCarousel from "./case-study-carousel";
import ClientsSection from "./clients-section";
import { FAQSection } from "./faq";
import TestimonialsMarquee from "./testimonials-marquee";

type SectionBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

type SectionRendererProps = {
  block: SectionBlock;
};

/**
 * Dynamically renders section components based on their _type from Sanity
 * This component maps Sanity block types to their corresponding React components
 */
export function SectionRenderer({ block }: SectionRendererProps) {
  const { _type, _key, ...props } = block;

  switch (_type) {
    case "hero":
      return <HeroSection key={_key} {...props} />;
    
    case "heroPage":
      return <HeroPage key={_key} {...props} />;
    
    case "textOnly":
      return <TextOnlySection key={_key} {...props} />;
    
    case "textImage":
      return <TextImageSection key={_key} {...props} />;
    
    case "mediaShowcase":
      return <MediaShowcase key={_key} {...props} />;
    
    case "bentoGallery":
      return <BentoGallerySection key={_key} {...props} />;
    
    case "servicesSplit":
      return <ServicesSplitSection key={_key} {...props} />;
    
    case "aboutSection":
      return <AboutSection key={_key} {...props} />;
    
    case "caseStudyCarousel":
      return <CaseStudyCarousel key={_key} {...props} />;
    
    case "clientsSection":
      return <ClientsSection key={_key} {...props} />;
    
    case "faq":
      return <FAQSection key={_key} {...props} />;
    
    case "testimonialsMarquee":
      return <TestimonialsMarquee key={_key} {...props} />;
    
    default:
      console.warn(`Unknown section type: ${_type}`);
      return (
        <div key={_key} className="py-8 px-4 border border-dashed border-muted">
          <p className="text-sm text-muted-foreground">
            Unknown section type: <code>{_type}</code>
          </p>
        </div>
      );
  }
}
