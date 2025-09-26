export type WithContext<T> = T & { '@context': 'https://schema.org' };

export const jsonLd = {
  organization: ({
    name,
    url,
    logo,
    sameAs = [],
  }: {
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
  }): WithContext<{
    '@type': 'Organization';
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
  }> => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }),

  website: ({
    name,
    url,
    searchActionUrl,
  }: {
    name: string;
    url: string;
    searchActionUrl?: string;
  }): WithContext<{ '@type': 'WebSite'; url: string; name: string; potentialAction?: unknown }> => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    ...(searchActionUrl
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: `${searchActionUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }
      : {}),
  }),

  breadcrumb: (items: { name: string; item: string }[]): WithContext<{ '@type': 'BreadcrumbList'; itemListElement: unknown[] }> => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  }),

  article: ({
    headline,
    description,
    authorName,
    datePublished,
    dateModified,
    image,
    url,
    publisherName,
    publisherLogo,
  }: {
    headline: string;
    description?: string;
    authorName: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
    publisherName: string;
    publisherLogo?: string;
  }): WithContext<{
    '@type': 'Article';
    mainEntityOfPage: string;
    headline: string;
    description?: string;
    image?: string[];
    author: { '@type': 'Person'; name: string }[];
    datePublished: string;
    dateModified?: string;
    publisher: { '@type': 'Organization'; name: string; logo?: { '@type': 'ImageObject'; url: string } };
  }> => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: url,
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    author: [{ '@type': 'Person', name: authorName }],
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      ...(publisherLogo ? { logo: { '@type': 'ImageObject', url: publisherLogo } } : {}),
    },
  }),

  service: ({
    serviceType,
    areaServed,
    providerName,
    url,
  }: {
    serviceType: string;
    areaServed?: string | string[];
    providerName: string;
    url: string;
  }): WithContext<{ '@type': 'Service'; serviceType: string; url: string; provider?: unknown; areaServed?: unknown }> => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: { '@type': 'Organization', name: providerName },
    url,
    ...(areaServed ? { areaServed } : {}),
  }),

  faq: (faqs: { q: string; a: string }[]): WithContext<{ '@type': 'FAQPage'; mainEntity: unknown[] }> => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }),
};
