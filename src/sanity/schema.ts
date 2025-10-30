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
import contentBillboard from "./types/sections/contentBillboard";

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
  faq,
  contentBillboard,
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
];

export default schemas;
