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

export const homePageQuery = `*[_type=="page" && isHome == true && locale==$locale][0]{
  _id,
  title,
  locale,
  seo,
  sections[]{
    ...,
    background {
      alt,
      videoUrl,
      image {
        alt,
        image {
          asset->{
            url,
            metadata{
              lqip,
              dimensions
            }
          }
        }
      },
      poster {
        alt,
        image {
          asset->{
            url,
            metadata{
              lqip,
              dimensions
            }
          }
        }
      }
    },
    cta {
      label,
      href,
      variant
    },
    helper,
    feature {
      title,
      excerpt,
      href,
      metaLabel,
      image {
        alt,
        image {
          asset->{
            url,
            metadata{
              lqip,
              dimensions
            }
          }
        }
      },
      reference->{
        _type,
        title,
        locale,
        "slug": slug.current,
        "excerpt": coalesce(excerpt, summary, description),
        "image": coalesce(
          mainImage{
            alt,
            "image": {
              "asset": asset->{
                url,
                metadata{
                  lqip,
                  dimensions
                }
              }
            }
          },
          heroImage.image{
            alt,
            "image": {
              "asset": asset->{
                url,
                metadata{
                  lqip,
                  dimensions
                }
              }
            }
          },
          coverImage{
            alt,
            "image": {
              "asset": asset->{
                url,
                metadata{
                  lqip,
                  dimensions
                }
              }
            }
          }
        )
      },
      items[]{
        linkType,
        title,
        excerpt,
        href,
        metaLabel,
        image {
          alt,
          image {
            asset->{
              url,
              metadata{
                lqip,
                dimensions
              }
            }
          }
        },
        reference->{
          _type,
          title,
          locale,
          "slug": slug.current,
          "excerpt": coalesce(excerpt, summary, description),
          "image": coalesce(
            mainImage{
              alt,
              "image": {
                "asset": asset->{
                  url,
                  metadata{
                    lqip,
                    dimensions
                  }
                }
              }
            },
            heroImage.image{
              alt,
              "image": {
                "asset": asset->{
                  url,
                  metadata{
                    lqip,
                    dimensions
                  }
                }
              }
            },
            coverImage{
              alt,
              "image": {
                "asset": asset->{
                  url,
                  metadata{
                    lqip,
                    dimensions
                  }
                }
              }
            }
          )
        }
      }
    },
    _type == "pillars" => {
      sectionTitle,
      groups[]{
        key,
        headline,
        description,
        chips,
        listLabel,
        items[]{
          label,
          href,
          reference->{
            _type,
            title,
            locale,
            "slug": slug.current
          }
        }
      }
    },
    media {
      alt,
      image {
        asset->{
          url,
          metadata{
            lqip,
            dimensions
          }
        }
      }
    }
  }
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
