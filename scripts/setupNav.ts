import { getCliClient } from "sanity/cli";

type PageSeed = {
  id: string;
  title: string;
  slug: string;
  description?: string;
};

const pages: PageSeed[] = [
  { id: "page-cases", title: "Vores cases", slug: "cases" },
  { id: "page-om-os", title: "Om os", slug: "om-os" },
  { id: "page-kontakt", title: "Kontakt", slug: "kontakt" },
  { id: "page-services-marketing", title: "Marketing Services", slug: "services/marketing" },
  {
    id: "page-services-marketing-full-funnel",
    title: "Full-Funnel Performance",
    slug: "services/marketing/full-funnel-performance",
    description: "Strategi og execution på tværs af kanaler i hele funnel'en.",
  },
  {
    id: "page-services-marketing-paid-search",
    title: "Paid Search",
    slug: "services/marketing/paid-search",
    description: "Datadrevet søgeannoncering med fokus på ROAS.",
  },
  {
    id: "page-services-marketing-paid-social",
    title: "Paid Social",
    slug: "services/marketing/paid-social",
    description: "Kreative kampagner og audience design på sociale platforme.",
  },
  {
    id: "page-services-marketing-email",
    title: "E-mail Marketing",
    slug: "services/marketing/email-marketing",
    description: "Automatiserede flows og segmenteret kommunikation.",
  },
  { id: "page-services-web", title: "Web & Digital Products", slug: "services/web" },
  {
    id: "page-services-web-websites",
    title: "Websites",
    slug: "services/web/websites",
    description: "Konverterende websites designet til vækst.",
  },
  {
    id: "page-services-web-ai",
    title: "AI-løsninger",
    slug: "services/web/ai",
    description: "AI værktøjer, automation og personalisering.",
  },
  {
    id: "page-services-web-ecommerce",
    title: "eCommerce",
    slug: "services/web/ecommerce",
    description: "Skalerbare shops med fokus på CLV.",
  },
];

async function main() {
  const client = getCliClient({ apiVersion: "2024-09-01" });

  for (const page of pages) {
    await client.createOrReplace({
      _id: page.id,
      _type: "page",
      title: page.title,
      slug: { _type: "slug", current: page.slug },
      locale: "da",
      seo: {
        _type: "seo",
        title: page.title,
        description: page.description || "",
      },
      sections: [],
    });
  }

  const nav = [
    {
      _type: "navigationSection",
      title: "Marketing",
      variant: "mega",
      groups: [
        {
          _type: "navigationGroup",
          title: "Marketing Services",
          description: "Skalérbare kampagner på tværs af hele funnel'en.",
          items: [
            {
              _type: "navigationLink",
              label: "Full-Funnel Performance",
              description: "Strategi og execution fra awareness til conversion.",
              reference: { _type: "reference", _ref: "page-services-marketing-full-funnel" },
            },
            {
              _type: "navigationLink",
              label: "Paid Search",
              description: "Datadrevet søgeannoncering med fokus på ROAS.",
              reference: { _type: "reference", _ref: "page-services-marketing-paid-search" },
            },
            {
              _type: "navigationLink",
              label: "Paid Social",
              description: "Kreative kampagner på tværs af sociale platforme.",
              reference: { _type: "reference", _ref: "page-services-marketing-paid-social" },
            },
            {
              _type: "navigationLink",
              label: "E-mail Marketing",
              description: "Automatiserede flows og segmenteret kommunikation.",
              reference: { _type: "reference", _ref: "page-services-marketing-email" },
            },
          ],
        },
      ],
    },
    {
      _type: "navigationSection",
      title: "Web",
      variant: "mega",
      groups: [
        {
          _type: "navigationGroup",
          title: "Digitale produkter",
          description: "Hastighed, performance og oplevelse i ét.",
          items: [
            {
              _type: "navigationLink",
              label: "Websites",
              description: "Konverterende websites designet til vækst.",
              reference: { _type: "reference", _ref: "page-services-web-websites" },
            },
            {
              _type: "navigationLink",
              label: "AI",
              description: "AI-værktøjer og automation i produkter og marketing.",
              reference: { _type: "reference", _ref: "page-services-web-ai" },
            },
            {
              _type: "navigationLink",
              label: "eCommerce",
              description: "Skalerbare shops med fokus på customer lifetime value.",
              reference: { _type: "reference", _ref: "page-services-web-ecommerce" },
            },
          ],
        },
      ],
    },
    {
      _type: "navigationSection",
      title: "Cases",
      variant: "link",
      link: {
        _type: "navigationLink",
        label: "Cases",
        reference: { _type: "reference", _ref: "page-cases" },
      },
    },
    {
      _type: "navigationSection",
      title: "Om os",
      variant: "link",
      link: {
        _type: "navigationLink",
        label: "Om os",
        reference: { _type: "reference", _ref: "page-om-os" },
      },
    },
  ];

  await client
    .patch("siteSettings")
    .set({
      mainNavigation: nav,
      headerCta: {
        _type: "navigationLink",
        label: "Kontakt os",
        reference: { _type: "reference", _ref: "page-kontakt" },
      },
    })
    .commit();

  console.log("Navigation and pages seeded");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

