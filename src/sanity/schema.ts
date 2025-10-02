import siteSettings from "./types/documents/siteSettings";
import page from "./types/documents/page";
import post from "./types/documents/post";
import caseStudy from "./types/documents/caseStudy";
import category from "./types/documents/category";
import author from "./types/documents/author";

import hero from "./types/sections/hero";

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
];

export default schemas;
