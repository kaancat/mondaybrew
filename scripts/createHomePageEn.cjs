/* eslint-disable @typescript-eslint/no-require-imports */
const { getCliClient } = require("sanity/cli");

async function main() {
  const client = getCliClient({ apiVersion: "2024-09-01" });
  const docId = "page-home-en";

  const doc = {
    _id: docId,
    _type: "page",
    title: "Homepage",
    slug: { _type: "slug", current: "home" },
    isHome: true,
    locale: "en",
    sections: [
      {
        _type: "hero",
        _key: "hero-main",
        eyebrow: "Digital growth partner",
        headline: [
          {
            _type: "block",
            style: "normal",
            children: [{ _type: "span", text: "Websites and webapps built for measurable growth" }],
          },
        ],
        subheading:
          "We craft high-performing digital experiences across web, app, and PPC to convert more of the right visitors.",
        helper: "Strategy, design, and performance in one team.",
        cta: {
          _type: "button",
          label: "Start a project",
          href: "/kontakt",
          variant: "default",
        },
      },
    ],
    seo: {
      _type: "seo",
      title: "mondaybrew — Websites, Webapps & PPC",
      description:
        "Digital agency in Denmark building websites, webapps, and performance marketing engines for ambitious teams.",
    },
  };

  const tx = client.transaction();

  tx.patch({
    query: '*[_type == "page" && isHome == true && locale == "en" && _id != $id]',
    set: { isHome: false },
    params: { id: docId },
  });

  tx.createOrReplace(doc);

  const result = await tx.commit();
  console.log("Seeded English homepage", result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
