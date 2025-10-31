import siteSettings from "./types/documents/siteSettings";
import page from "./types/documents/page";
import post from "./types/documents/post";
import caseStudy from "./types/documents/caseStudy";
import category from "./types/documents/category";
import author from "./types/documents/author";

import hero from "./types/sections/hero";
import { heroPage } from "./types/sections/heroPage";
import aboutSection from "./types/sections/aboutSection";
import servicesSplit from "./types/sections/servicesSplit";
import caseStudyCarousel from "./types/sections/caseStudyCarousel";
import clientsSection from "./types/sections/clientsSection";
import testimonialsMarquee from "./types/sections/testimonialsMarquee";
import textImage from "./types/sections/textImage";
import textOnly from "./types/sections/textOnly";
import faq from "./types/sections/faq";
import mediaShowcase from "./types/sections/mediaShowcase";
import bentoGallery from "./types/sections/bentoGallery";

import seo from "./types/objects/seo";
import cta from "./types/objects/cta";
import button from "./types/objects/button";
import imageWithAlt from "./types/objects/imageWithAlt";
import badge from "./types/objects/badge";
import navigationLink from "./types/objects/navigationLink";
import navigationGroup from "./types/objects/navigationGroup";
import navigationSection from "./types/objects/navigationSection";
import heroBackground from "./types/objects/heroBackground";
import heroFeature from "./types/objects/heroFeature";
import heroFeatureItem from "./types/objects/heroFeatureItem";
import servicesSplitPillar from "./types/objects/servicesSplitPillar";
import servicesSplitService from "./types/objects/servicesSplitService";
import servicesSplitMedia from "./types/objects/servicesSplitMedia";
import clientLogo from "./types/objects/clientLogo";
import testimonialCard from "./types/objects/testimonialCard";
import textOnlyRichText from "./types/objects/textOnlyRichText";
import textOnlyRichTextImage from "./types/objects/textOnlyRichTextImage";
import textOnlyCta1 from "./types/objects/textOnlyCta1";
import textOnlyCta2 from "./types/objects/textOnlyCta2";
import textOnlyDivider from "./types/objects/textOnlyDivider";
import gridPosition from "./types/objects/gridPosition";

const schemas = [
  // documents
  siteSettings,
  page,
  post,
  caseStudy,
  category,
  author,
  // sections
  hero,
  heroPage,
  aboutSection,
  servicesSplit,
  caseStudyCarousel,
  clientsSection,
  testimonialsMarquee,
  textImage,
  textOnly,
  mediaShowcase,
  bentoGallery,
  faq,
  // objects
  seo,
  cta,
  button,
  imageWithAlt,
  badge,
  navigationLink,
  navigationGroup,
  navigationSection,
  heroBackground,
  heroFeature,
  heroFeatureItem,
  servicesSplitPillar,
  servicesSplitService,
  servicesSplitMedia,
  clientLogo,
  testimonialCard,
  textOnlyRichText,
  textOnlyRichTextImage,
  textOnlyCta1,
  textOnlyCta2,
  textOnlyDivider,
  gridPosition,
];

export default schemas;
