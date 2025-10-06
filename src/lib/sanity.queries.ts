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
    _type,
    _key,
    ...select(
      _type == "hero" => {
        eyebrow,
        headline,
        heading,
        subheading,
        helper,
        alignment,
        cta {
          label,
          href,
          variant
        },
        primary {
          label,
          href,
          variant
        },
        secondary {
          label,
          href,
          variant
        },
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
      },
      _type == "servicesSplit" => {
        eyebrow,
        title,
        description,
        marketing{
          label,
          intro,
          services[]{
            _key,
            key,
            title,
            detailTitle,
            summary,
            description,
            media{
              mode,
              image{
                alt,
                image{
                  asset->{
                    url,
                    metadata{
                      lqip
                    }
                  }
                }
              },
              videoUrl,
              videoFile{
                asset->{
                  url,
                  mimeType
                }
              },
              poster{
                alt,
                image{
                  asset->{
                    url,
                    metadata{
                      lqip
                    }
                  }
                }
              }
            },
            ctas[]{
              _key,
              label,
              href,
              variant
            }
          }
        },
        web{
          label,
          intro,
          services[]{
            _key,
            key,
            title,
            detailTitle,
            summary,
            description,
            media{
              mode,
              image{
                alt,
                image{
                  asset->{
                    url,
                    metadata{
                      lqip
                    }
                  }
                }
              },
              videoUrl,
              videoFile{
                asset->{
                  url,
                  mimeType
                }
              },
              poster{
                alt,
                image{
                  asset->{
                    url,
                    metadata{
                      lqip
                    }
                  }
                }
              }
            },
            ctas[]{
              _key,
              label,
              href,
              variant
            }
          }
        }
      },
      _type == "caseStudyCarousel" => {
        _type,
        eyebrow,
        headline,
        intro,
        initialIndex,
        explore{
          label,
          href,
          variant
        },
        feature{
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
                  metadata{ lqip, dimensions }
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
                mainImage{ alt, "image": { "asset": asset->{ url, metadata{ lqip, dimensions } } } },
                heroImage.image{ alt, "image": { "asset": asset->{ url, metadata{ lqip, dimensions } } } },
                coverImage{ alt, "image": { "asset": asset->{ url, metadata{ lqip, dimensions } } } }
              )
            }
          }
        }
      },
      _type == "clientsSection" => {
        _type,
        eyebrow,
        headline,
        subheading,
        forceBlackLogos,
        more{ label, href, variant, reference->{"slug": slug.current, locale} },
        logos[]{
          title,
          url,
          image{
            alt,
            image{asset->{url,metadata{dimensions,lqip}}}
          }
        }
      },
      _type == "aboutSection" => {
        _type,
        eyebrow,
        headline,
        subheading,
        mainImage {
          alt,
          asset->{
            url,
            metadata{ lqip, dimensions }
          }
        },
        stats[]{
          value,
          label,
          icon {
            alt,
            asset->{
              url,
              metadata{ lqip, dimensions }
            }
          }
        },
        cta {
          label,
          href,
          variant,
          reference->{"slug": slug.current, locale}
        }
      },
      true => {}
    )
  }
}`;

export const pageBySlugQuery = `*[_type=="page" && slug.current==$slug && (!defined(locale) || locale==$locale)][0]{
  _id,
  title,
  seo,
  locale,
  "slug": slug.current,
  sections[]{
    _type,
    _key,
    ...select(
      _type == "hero" => {
        eyebrow,
        headline,
        heading,
        subheading,
        helper,
        alignment,
        cta {
          label,
          href,
          variant
        },
        primary {
          label,
          href,
          variant
        },
        secondary {
          label,
          href,
          variant
        },
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
        }
      },
      _type == "servicesSplit" => {
        eyebrow,
        title,
        description,
        marketing{
          label,
          intro,
          services[]{
            _key,
            key,
            title,
            detailTitle,
            summary,
            description,
            media{
              mode,
              image{
                alt,
                image{asset->{url,metadata{lqip,dimensions}}}
              },
              videoUrl,
              videoFile{asset->{url,mimeType}},
              poster{
                alt,
                image{asset->{url,metadata{lqip,dimensions}}}
              }
            },
            ctas[]{
              _key,
              label,
              href,
              variant
            }
          }
        },
        web{
          label,
          intro,
          services[]{
            _key,
            key,
            title,
            detailTitle,
            summary,
            description,
            media{
              mode,
              image{
                alt,
                image{asset->{url,metadata{lqip,dimensions}}}
              },
              videoUrl,
              videoFile{asset->{url,mimeType}},
              poster{
                alt,
                image{asset->{url,metadata{lqip,dimensions}}}
              }
            },
            ctas[]{
              _key,
              label,
              href,
              variant
            }
          }
        }
      },
      _type == "caseStudyCarousel" => {
        eyebrow,
        headline,
        intro,
        initialIndex,
        explore{ label, href, variant },
        feature{
          items[]{
            linkType,
            title,
            excerpt,
            href,
            metaLabel,
            image{
              alt,
              image{asset->{url,metadata{lqip}}}
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
        }
      },
      _type == "clientsSection" => {
        eyebrow,
        headline,
        subheading,
        forceBlackLogos,
        more{ label, href, variant, reference->{"slug": slug.current, locale} },
        logos[]{
          title,
          url,
          image{
            alt,
            image{asset->{url,metadata{dimensions,lqip}}}
          }
        }
      },
      _type == "aboutSection" => {
        _type,
        eyebrow,
        headline,
        subheading,
        mainImage {
          alt,
          asset->{
            url,
            metadata{ lqip, dimensions }
          }
        },
        stats[]{
          value,
          label,
          icon {
            alt,
            asset->{
              url,
              metadata{ lqip, dimensions }
            }
          }
        },
        cta {
          label,
          href,
          variant,
          reference->{"slug": slug.current, locale}
        }
      },
      true => {}
    )
  }
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

export const postBySlugQuery = `*[_type=="post" && slug.current==$slug && (!defined(locale) || locale==$locale)][0]{
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

export const caseStudiesQuery = `*[_type=="caseStudy"] | order(coalesce(publishedAt,_updatedAt) desc){
  _id,
  title,
  client,
  "excerpt": coalesce(excerpt, summary),
  "slug": slug.current,
  tags,
  media{
    mode,
    image{
      alt,
      image{asset->{url,metadata{lqip,dimensions}}}
    },
    videoUrl,
    videoFile{asset->{url,mimeType}},
    poster{
      alt,
      image{asset->{url,metadata{lqip,dimensions}}}
    }
  }
}`;
