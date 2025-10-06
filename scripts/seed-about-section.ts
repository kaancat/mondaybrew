import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4ot323fc";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_USER_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN (use: sanity exec scripts/seed-about-section.ts --with-user-token)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-09-01", token, useCdn: false });

async function fetchBuffer(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download asset: ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadImage(url: string, filename: string) {
  const buffer = await fetchBuffer(url);
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

async function ensurePageDocument() {
  const existing = await client.fetch<
    | {
        _id: string;
        sections?: Array<{ _type?: string; _key?: string }>;
      }
    | null
  >(
    `*[_type=="page" && slug.current==$slug && locale==$locale][0]{ _id, sections }`,
    { slug: "om-os", locale: "da" },
  );

  if (existing?._id) {
    return existing._id;
  }

  const _id = `page-om-os-da`;
  await client.create({
    _id,
    _type: "page",
    title: "Om os",
    slug: { _type: "slug", current: "om-os" },
    locale: "da",
    isHome: false,
    sections: [],
  });

  return _id;
}

async function run() {
  console.log("Seeding About section inside page builder...");

  const pageId = await ensurePageDocument();

  const mainImageId = await uploadImage(
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=2400&q=80",
    "about-team-studio.jpg",
  );

  const statIconBuildId = await uploadImage(
    "https://dummyimage.com/240x240/14121F/ffffff.png&text=Build",
    "stat-icon-build.png",
  );
  const statIconLaunchId = await uploadImage(
    "https://dummyimage.com/240x240/1A1A1A/ffffff.png&text=Launch",
    "stat-icon-launch.png",
  );
  const statIconImpactId = await uploadImage(
    "https://dummyimage.com/240x240/222244/ffffff.png&text=Impact",
    "stat-icon-impact.png",
  );

  const aboutSection = {
    _type: "aboutSection" as const,
    eyebrow: "About mondaybrew",
    headline: "We build digital experiences that move the metrics you care about",
    subheading:
      "Strategy, engineering, design, and growth sit under one roof—so we can translate your ambition into experiments, launches, and optimizations that compound over time.",
    mainImage: {
      _type: "image",
      alt: "mondaybrew team collaborating in the studio",
      asset: { _type: "reference", _ref: mainImageId },
    },
    stats: [
      {
        _type: "stat",
        value: "15+",
        label: "Digital specialists on the core team",
        icon: {
          _type: "image",
          alt: "Build icon",
          asset: { _type: "reference", _ref: statIconBuildId },
        },
      },
      {
        _type: "stat",
        value: "120",
        label: "Products launched across Europe",
        icon: {
          _type: "image",
          alt: "Launch icon",
          asset: { _type: "reference", _ref: statIconLaunchId },
        },
      },
      {
        _type: "stat",
        value: "72",
        label: "Average client NPS over the past year",
        icon: {
          _type: "image",
          alt: "Impact icon",
          asset: { _type: "reference", _ref: statIconImpactId },
        },
      },
    ],
    cta: {
      _type: "button",
      label: "Meet the team",
      href: "/kontakt",
      variant: "default",
    },
  };

  const patch = client.patch(pageId).setIfMissing({ sections: [] });

  // Replace any existing aboutSection in sections
  patch.unset(["sections[_type == 'aboutSection']"]);
  patch.insert("after", "sections[-1]", [aboutSection]);

  await patch.commit();

  console.log(`About section seeded on page ${pageId}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
