import { getCliClient } from "sanity/cli";

const nav = [
  {
    _type: "navigationSection",
    title: "Marketing",
    variant: "mega",
    groups: [
      {
        _type: "navigationGroup",
        title: "Marketing",
        description: "Performance på tværs af hele funnel'en.",
        items: [
          { _type: "navigationLink", label: "Full-Funnel Performance", href: "/services/marketing/full-funnel-performance" },
          { _type: "navigationLink", label: "Paid Search", href: "/services/marketing/paid-search" },
          { _type: "navigationLink", label: "Paid Social", href: "/services/marketing/paid-social" },
          { _type: "navigationLink", label: "E-Mail Marketing", href: "/services/marketing/email-marketing" },
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
        title: "Web",
        description: "Digitale produkter der konverterer.",
        items: [
          { _type: "navigationLink", label: "Hjemmesider", href: "/services/web/hjemmesider" },
          { _type: "navigationLink", label: "CRM", href: "/services/web/crm" },
          { _type: "navigationLink", label: "AI", href: "/services/web/ai" },
          { _type: "navigationLink", label: "eCommerce", href: "/services/web/ecommerce" },
        ],
      },
    ],
  },
  {
    _type: "navigationSection",
    title: "Cases",
    variant: "link",
    link: { _type: "navigationLink", label: "Cases", href: "/cases" },
  },
  {
    _type: "navigationSection",
    title: "Om os",
    variant: "link",
    link: { _type: "navigationLink", label: "Om os", href: "/om-os" },
  },
];

async function main() {
  const client = getCliClient({ apiVersion: "2024-09-01" });

  await client
    .patch("siteSettings")
    .set({
      mainNavigation: nav,
    })
    .commit();

  console.log("Main navigation updated");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
