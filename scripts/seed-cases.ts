/* eslint-disable no-console */
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4ot323fc";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN (use: sanity exec scripts/seed-cases.ts --with-user-token)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-09-01", token, useCdn: false });

async function run() {
  const { count } = await client.fetch<{ count: number }>(`{"count": count(*[_type=="caseStudy"])}`);
  if (count < 6) {
    const docs = mockDocs().map((d, i) => ({
      _type: "caseStudy",
      _id: `seed.caseStudy.${i}`,
      title: d.title,
      client: d.client,
      slug: { current: d.slug },
      excerpt: d.excerpt,
      summary: d.excerpt,
      tags: d.tags,
      locale: "da",
      publishedAt: new Date().toISOString(),
    }));

    const tx = client.transaction();
    docs.forEach((doc) => tx.createIfNotExists(doc));
    await tx.commit();
    console.log(`Seeded ${docs.length} caseStudy docs`);
  } else {
    console.log(`Found ${count} caseStudy docs, skipping seeding`);
  }

  // Ensure homepage has the carousel section
  const home = await client.fetch<{ _id: string; sections?: Array<{ _type?: string }> | null }>(
    `*[_type=="page" && isHome == true && locale == "da"][0]{ _id, sections }`,
  );
  if (!home?._id) {
    console.warn("No homepage document found (isHome==true, locale==da)");
    return;
  }
  const hasCarousel = (home.sections || []).some((s) => s?._type === "caseStudyCarousel");
  if (!hasCarousel) {
    await client
      .patch(home._id)
      .setIfMissing({ sections: [] })
      .insert("after", "sections[-1]", [{ _type: "caseStudyCarousel" }])
      .commit();
    console.log("Inserted Case Study Carousel section on homepage");
  } else {
    console.log("Homepage already has a Case Study Carousel section");
  }
}

function mockDocs() {
  const titles = [
    "Lunar",
    "Intersport",
    "Rains",
    "Ecco",
    "Matas",
    "Velux",
    "Normann Copenhagen",
  ];
  const excerpts = [
    "Reached 1M Danes and boosted installs with a top‑funnel TikTok strategy.",
    "Digital transformation with a scalable, flexible Shopify platform.",
    "Come Rains, come shine — omni‑channel campaign rollout.",
    "Global ecommerce push with high‑performing paid social.",
    "Membership growth via cross‑channel performance framework.",
    "Demand generation and self‑serve flows across the funnel.",
    "Brand refresh with a conversion‑first web experience.",
  ];
  return titles.map((t, i) => ({
    title: t,
    client: t,
    slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    excerpt: excerpts[i] || excerpts[0],
    tags: i % 2 === 0 ? ["Social Ads", "Digital Strategy"] : ["Website Development"],
  }));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

