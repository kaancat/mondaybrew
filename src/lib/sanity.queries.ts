export const siteSettingsQuery = `*[_type=="siteSettings"][0]{
  title,
  seo,
  nav,
  footer
}`;

export const pageBySlugQuery = `*[_type=="page" && slug.current==$slug && (defined(locale) => locale==$locale)][0]{
  _id,
  title,
  seo,
  sections,
  locale,
  "slug": slug.current
}`;

export const allRoutesQuery = `*[_type in ["page","post","caseStudy"]]{
  _type,
  "slug": slug.current,
  locale
}`;

export const postsQuery = `*[_type=="post"] | order(date desc){
  title, slug, date, excerpt, seo
}`;

