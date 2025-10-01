/* eslint-disable @typescript-eslint/no-require-imports */
const { getCliClient } = require("sanity/cli");

async function main() {
  const client = getCliClient({ apiVersion: "2024-09-01" });
  const docId = "page-home-da";

  const doc = {
    _id: docId,
    _type: "page",
    title: "Forside",
    slug: { _type: "slug", current: "home" },
    isHome: true,
    locale: "da",
    sections: [
      {
        _type: "hero",
        _key: "hero-main",
        eyebrow: "Digital vækstpartner",
        headline: [
          {
            _type: "block",
            style: "normal",
            children: [{ _type: "span", text: "Websites og webapps, der løfter din forretning" }],
          },
        ],
        subheading:
          "Vi designer og udvikler digitale oplevelser med fokus på performance, SEO og konvertering – understøttet af datadrevet marketing.",
        helper: "Strategi, design og performance under ét tag.",
        cta: {
          _type: "button",
          label: "Start et projekt",
          href: "/kontakt",
          variant: "default",
        },
      },
    ],
    seo: {
      _type: "seo",
      title: "mondaybrew — Websites, Webapps & PPC",
      description:
        "Digitalt bureau i Danmark, der bygger websites, webapps og performance marketing-løsninger, der skaber målbar vækst.",
    },
  };

  const tx = client.transaction();

  tx.patch({
    query: '*[_type == "page" && isHome == true && locale == "da" && _id != $id]',
    set: { isHome: false },
    params: { id: docId },
  });

  tx.createOrReplace(doc);

  const result = await tx.commit();

  console.log("Seeded homepage", result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
