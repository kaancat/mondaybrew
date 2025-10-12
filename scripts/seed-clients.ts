import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4ot323fc";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN (use: sanity exec scripts/seed-clients.ts --with-user-token)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-09-01", token, useCdn: false });

type ClientLogoDocument = {
  _type: "clientLogo";
  title: string;
  image: {
    _type: "imageWithAlt";
    alt: string;
    image: { _type: "image"; asset: { _type: "reference"; _ref: string } };
  };
};

const NAMES = [
  "Lunar", "Intersport", "Rains", "Ecco", "Matas", "Velux", "Normann", "Bang & Olufsen",
  "Novo Nordisk", "Carlsberg", "LEGO", "Arla", "Maersk", "Saxo", "Bolia", "Vipp",
  "Mikkeller", "DFDS", "ISS", "GN Audio",
];

function logoUrl(name: string) {
  // Simple high‑contrast PNG served by dummyimage; adequate as placeholders
  const text = encodeURIComponent(name);
  return `https://dummyimage.com/600x320/ffffff/111111.png&text=${text}`;
}

async function uploadLogo(name: string) {
  const res = await fetch(logoUrl(name));
  if (!res.ok) throw new Error(`Failed to fetch image for ${name}`);
  const ab = await res.arrayBuffer();
  const buffer = Buffer.from(ab);
  const filename = `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
  const asset = await client.assets.upload("image", buffer, { filename, contentType: "image/png" });
  return asset;
}

async function run() {
  const home = await client.fetch<{
    _id: string;
    sections?: Array<{ _type?: string; _key?: string } & Record<string, unknown>> | null;
  }>(
    `*[_type=="page" && isHome == true && locale == "da"][0]{ _id, sections }`,
  );
  if (!home?._id) {
    console.error("No homepage document found (isHome==true, locale==da)");
    process.exit(1);
  }

  // Ensure clientsSection exists
  let inserted = false;
  if (!home.sections?.some((section) => section?._type === "clientsSection")) {
    await client
      .patch(home._id)
      .setIfMissing({ sections: [] })
      .insert("after", "sections[-1]", [
        {
          _type: "clientsSection",
          eyebrow: "PARTNERS",
          headline: "Some of our amazing clients",
          subheading:
            "A quick selection of brands we’ve partnered with across campaigns, websites, and growth projects.",
          logos: [],
        },
      ])
      .commit();
    inserted = true;
    console.log("Inserted clientsSection on homepage");
  }

  // Fetch the updated section with path info
  const doc = await client.fetch<{
    _id: string;
    sections: Array<{ _type: string; _key: string; logos?: ClientLogoDocument[] }>;
  }>(`*[_type=="page" && isHome == true && locale == "da"][0]{ _id, sections[]{ _type, _key, logos } }`);

  const idx = doc.sections.findIndex((s) => s._type === "clientsSection");
  if (idx < 0) {
    console.error("clientsSection not found after insert");
    process.exit(1);
  }

  const section = doc.sections[idx];
  const hasEnough = (section.logos || []).length >= 16;
  if (!inserted && hasEnough) {
    // Ensure default 'more' is present
    await client
      .patch(doc._id)
      .setIfMissing({ sections: [] })
      .set({ [`sections[${idx}].more`]: { _type: "button", label: "+ Many more →", href: "/cases", variant: "link" } })
      .commit();
    console.log("clientsSection already had logos; ensured default 'more' link");
    return;
  }

  const uploads = await Promise.all(
    NAMES.slice(0, 20).map(async (name): Promise<ClientLogoDocument | null> => {
      try {
        const asset = await uploadLogo(name);
        return {
          _type: "clientLogo",
          title: name,
          image: {
            _type: "imageWithAlt",
            alt: `${name} logo`,
            image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
          },
        };
      } catch (error) {
        console.warn("Upload failed for", name, error);
        return null;
      }
    }),
  );

  const logos = uploads.filter((logo): logo is ClientLogoDocument => Boolean(logo));
  await client
    .patch(doc._id)
    .setIfMissing({ sections: [] })
    .set({ [`sections[${idx}].logos`]: logos, [`sections[${idx}].more`]: { _type: "button", label: "+ Many more →", href: "/cases", variant: "link" } })
    .commit();

  console.log(`Seeded ${logos.length} logos into clientsSection`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
