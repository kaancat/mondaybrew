import siteSettings from "./types/documents/siteSettings";
import aboutSection from "./types/documents/aboutSection";
import page from "./types/documents/page";
import post from "./types/documents/post";
import caseStudy from "./types/documents/caseStudy";
import category from "./types/documents/category";
import author from "./types/documents/author";

import hero from "./types/sections/hero";
import servicesSplit from "./types/sections/servicesSplit";
import caseStudyCarousel from "./types/sections/caseStudyCarousel";
import clientsSection from "./types/sections/clientsSection";

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

const schemas = [
  // documents
  siteSettings,
  aboutSection,
  page,
  post,
  caseStudy,
  category,
  author,
  // sections
  hero,
  servicesSplit,
  caseStudyCarousel,
  clientsSection,
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
];

export default schemas;
