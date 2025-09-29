export const siteSettingsQuery = `*[_type=="siteSettings"][0]{
  title,
  logo {
    asset->{
      url,
      metadata{
        dimensions
      }
    },
    alt
  },
  logoOnDark {
    asset->{
      url,
      metadata{
        dimensions
      }
    },
    alt
  },
  favicon {
    asset->{
      url
    }
  },
  seo,
  mainNavigation[]{
    title,
    variant,
    link {
      label,
      description,
      href,
      reference->{
        "slug": slug.current,
        locale
      }
    },
    groups[]{
      title,
      description,
      items[]{
        label,
        description,
        href,
        reference->{
          "slug": slug.current,
          locale
        }
      }
    }
  },
  headerCta {
    label,
    description,
    href,
    reference->{
      "slug": slug.current,
      locale
    }
  },
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
  locale,
  _updatedAt
}`;

export const postsQuery = `*[_type=="post"] | order(date desc){
  title, slug, date, excerpt, seo
}`;

export const postBySlugQuery = `*[_type=="post" && slug.current==$slug && (defined(locale) => locale==$locale)][0]{
  _id,
  title,
  slug,
  locale,
  date,
  excerpt,
  seo,
  "authorName": author->name,
  mainImage,
  body
}`;
