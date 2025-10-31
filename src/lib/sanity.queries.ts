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
    },
    megaMenuHeadline,
    megaMenuDescription,
    featuredCases[]->{
      _id,
      title,
      client,
      "excerpt": coalesce(excerpt, summary),
      "slug": slug.current,
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
      _type == "testimonialsMarquee" => {
        eyebrow,
        headline,
        subheading,
        speedTop,
        speedBottom,
        top[]{
          variant,
          background,
          logo{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          quote,
          author,
          role,
          cta{ label, href }
        },
        bottom[]{
          variant,
          background,
          logo{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          quote,
          author,
          role,
          cta{ label, href }
        }
      },
      _type == "testimonialsMarquee" => {
        _type,
        eyebrow,
        headline,
        subheading,
        speedTop,
        speedBottom,
        top[]{
          variant,
          background,
          logo{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          quote,
          author,
          role,
          cta{ label, href }
        },
        bottom[]{
          variant,
          background,
          logo{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          quote,
          author,
          role,
          cta{ label, href }
        }
      },
      _type == "textImage" => {
        _type,
        variant,
        enableTabs,
        eyebrow,
        title,
        body,
        imagePosition,
        "image": {
          "alt": image.alt,
          "asset": image.image.asset->{ url, metadata{ lqip, dimensions } }
        },
        tabs[]{ label, title, body },
        cta{ label, href, variant }
      },
      _type == "textOnly" => {
        _type,
        eyebrow,
        title,
        body,
        cta{ label, href, variant },
        cta2{ label, href, variant }
      },
      _type == "contentBillboard" => {
        _type,
        sectionId,
        eyebrow,
        backgroundMode,
        tone,
        "backgroundImage": {
          "alt": backgroundImage.alt,
          "asset": backgroundImage.image.asset->{ url, metadata{ lqip, dimensions } }
        },
        contentType,
        quote,
        author,
        role,
        "logo": { "alt": logo.alt, "asset": logo.image.asset->{ url, metadata{ lqip, dimensions } } },
        body,
        ctas[]{ label, href, variant },
        heading,
        description
      },
      _type == "contentBillboard" => {
        _type,
        sectionId,
        eyebrow,
        backgroundMode,
        tone,
        "backgroundImage": {
          "alt": backgroundImage.alt,
          "asset": backgroundImage.image.asset->{ url, metadata{ lqip, dimensions } }
        },
        contentType,
        quote,
        author,
        role,
        "logo": { "alt": logo.alt, "asset": logo.image.asset->{ url, metadata{ lqip, dimensions } } },
        body,
        ctas[]{ label, href, variant },
        heading,
        description
      },
      _type == "mediaShowcase" => {
        _type,
        sectionId,
        eyebrow,
        headline,
        alignment,
        cta{ label, href, variant, reference->{"slug": slug.current, locale} },
        media{
          mode,
          image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
          videoUrl,
          videoFile{ asset->{ url, mimeType } },
          poster{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } }
        },
        stats[]{
          value,
          label,
          icon{ alt, asset->{ url, metadata{ lqip, dimensions } } }
        }
      },
      _type == "faq" => {
        _type,
        title,
        subheading,
        titleAlignment,
        categories[]{
          "id": id.current,
          label,
          questions[]{
            question,
            answer,
            cta{
              label,
              href,
              variant,
              reference->{"slug": slug.current, locale}
            }
          }
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
      _type == "heroPage" => {
        _type,
        eyebrow,
        heading,
        subheading,
        media {
          mediaType,
          image {
            alt,
            asset->{
              url,
              metadata{ lqip, dimensions }
            }
          },
          video {
            asset->{
              url,
              mimeType
            }
          },
          videoUrl,
          poster {
            alt,
            asset->{
              url,
              metadata{ lqip, dimensions }
            }
          }
        },
        breadcrumbs[]{
          _key,
          label,
          anchor
        }
      },
      _type == "textImage" => {
        _type,
        variant,
        enableTabs,
        eyebrow,
        title,
        body,
        imagePosition,
        "image": {
          "alt": image.alt,
          "asset": image.image.asset->{ url, metadata{ lqip, dimensions } }
        },
        tabs[]{ label, title, body },
        cta{ label, href, variant }
      },
      _type == "textOnly" => {
        _type,
        eyebrow,
        title,
        body,
        cta{ label, href, variant },
        cta2{ label, href, variant }
      },
      _type == "faq" => {
        _type,
        title,
        subheading,
        titleAlignment,
        categories[]{
          "id": id.current,
          label,
          questions[]{
            question,
            answer,
            cta{
              label,
              href,
              variant,
              reference->{"slug": slug.current, locale}
            }
          }
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

export const caseStudyBySlugQuery = `*[_type=="caseStudy" && slug.current==$slug][0]{
  _id,
  title,
  client,
  excerpt,
  summary,
  "slug": slug.current,
  media{
    mode,
    image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } },
    videoUrl,
    videoFile{ asset->{ url, mimeType } },
    poster{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } }
  },
  pageBlocks[]{
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
        cta { label, href, variant },
        background {
          alt,
          videoUrl,
          image { alt, image { asset->{ url, metadata{ lqip, dimensions } } } },
          poster { alt, image { asset->{ url, metadata{ lqip, dimensions } } } }
        },
        feature {
          title,
          excerpt,
          href,
          metaLabel,
          image { alt, image { asset->{ url, metadata{ lqip, dimensions } } } },
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
          },
          items[]{
            linkType,
            title,
            excerpt,
            href,
            metaLabel,
            image { alt, image { asset->{ url, metadata{ lqip, dimensions } } } },
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
      _type == "heroPage" => {
        eyebrow,
        heading,
        subheading,
        media {
          mediaType,
          image { alt, asset->{ url, metadata{ lqip, dimensions } } },
          video { asset->{ url, mimeType } },
          videoUrl,
          poster { alt, asset->{ url, metadata{ lqip, dimensions } } }
        },
        breadcrumbs[]{ _key, label, anchor }
      },
      _type == "textImage" => {
        variant,
        enableTabs,
        eyebrow,
        title,
        body,
        imagePosition,
        "image": { "alt": image.alt, "asset": image.image.asset->{ url, metadata{ lqip, dimensions } } },
        tabs[]{ label, title, body },
        cta{ label, href, variant }
      },
      _type == "textOnly" => {
        eyebrow,
        title,
        body,
        cta{ label, href, variant },
        cta2{ label, href, variant }
      },
      _type == "servicesSplit" => {
        eyebrow,
        title,
        description,
        marketing{ label, intro, services[]{ _key, key, title, detailTitle, summary, description,
          media{ mode, image{ alt, image{asset->{url,metadata{lqip,dimensions}}}}, videoUrl, videoFile{asset->{url,mimeType}}, poster{ alt, image{asset->{url,metadata{lqip,dimensions}}}} },
          ctas[]{ _key, label, href, variant } } },
        web{ label, intro, services[]{ _key, key, title, detailTitle, summary, description,
          media{ mode, image{ alt, image{asset->{url,metadata{lqip,dimensions}}}}, videoUrl, videoFile{asset->{url,mimeType}}, poster{ alt, image{asset->{url,metadata{lqip,dimensions}}}} },
          ctas[]{ _key, label, href, variant } } }
      },
      _type == "contentBillboard" => {
        sectionId, eyebrow, backgroundMode, tone,
        "backgroundImage": { "alt": backgroundImage.alt, "asset": backgroundImage.image.asset->{ url, metadata{ lqip, dimensions } } },
        contentType, quote, author, role,
        "logo": { "alt": logo.alt, "asset": logo.image.asset->{ url, metadata{ lqip, dimensions } } },
        body, ctas[]{ label, href, variant }, heading, description
      },
      _type == "mediaShowcase" => {
        sectionId, eyebrow, headline, alignment,
        cta{ label, href, variant, reference->{"slug": slug.current, locale} },
        media{ mode, image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } }, videoUrl, videoFile{ asset->{ url, mimeType } }, poster{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } } },
        stats[]{ value, label, icon{ alt, asset->{ url, metadata{ lqip, dimensions } } } }
      },
      _type == "bentoGallery" => {
        images[]{ _key, image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } }, position{ columnStart, columnSpan, rowStart, rowSpan } },
        columns, rows, showGridLines
      },
      _type == "clientsSection" => { eyebrow, headline, description, intro, logos[]{ _key, label, href, image{ alt, image{ asset->{ url, metadata{ lqip, dimensions } } } } }, explore{ label, href, variant } },
      _type == "caseStudyCarousel" => { eyebrow, headlineText, intro, items[]->{ _id, title, client, "excerpt": coalesce(excerpt, summary), "slug": slug.current, media{ mode, image{ alt, image{asset->{url,metadata{lqip,dimensions}}}}, videoUrl, videoFile{asset->{url,mimeType}}, poster{ alt, image{asset->{url,metadata{lqip,dimensions}}}} } }, explore{ label, href, variant } },
      _type == "faq" => { title, subheading, titleAlignment, categories[]{ "id": id.current, label, questions[]{ question, answer, cta{ label, href, variant, reference->{"slug": slug.current, locale} } } } },
      _type == "testimonialsMarquee" => { eyebrow, headline, subheading }
      , true => {}
    )
  }
}`;
