import siteSettings from "./types/documents/siteSettings";
import page from "./types/documents/page";
import post from "./types/documents/post";
import caseStudy from "./types/documents/caseStudy";
import category from "./types/documents/category";
import author from "./types/documents/author";

import hero from "./types/sections/hero";
import featureGrid from "./types/sections/featureGrid";
import logoCloud from "./types/sections/logoCloud";
import splitContent from "./types/sections/splitContent";
import stats from "./types/sections/stats";
import testimonials from "./types/sections/testimonials";
import pricing from "./types/sections/pricing";
import faq from "./types/sections/faq";
import richText from "./types/sections/richText";
import mediaBlock from "./types/sections/mediaBlock";
import ctaBanner from "./types/sections/ctaBanner";

import seo from "./types/objects/seo";
import cta from "./types/objects/cta";
import button from "./types/objects/button";
import imageWithAlt from "./types/objects/imageWithAlt";
import badge from "./types/objects/badge";

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
  featureGrid,
  logoCloud,
  splitContent,
  stats,
  testimonials,
  pricing,
  faq,
  richText,
  mediaBlock,
  ctaBanner,
  // objects
  seo,
  cta,
  button,
  imageWithAlt,
  badge,
];

export default schemas;
