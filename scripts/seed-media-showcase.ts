import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4ot323fc";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_KEY || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN/SANITY_API_KEY (use: sanity exec scripts/seed-media-showcase.ts --with-user-token)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-09-01", token, useCdn: false });

async function run() {
  const home = await client.fetch<{ _id?: string; sections?: Array<{ _type?: string }> | null }>(
    `*[_type=="page" && isHome == true && locale == "da"][0]{ _id, sections }`,
  );
  if (!home?._id) {
    console.warn("No homepage document found (isHome==true, locale==da)");
    return;
  }

  const hasShowcase = (home.sections || []).some((s) => s?._type === "mediaShowcase");
  if (hasShowcase) {
    console.log("Homepage already has a Media Showcase section — skipping insert");
    return;
  }

  const section = {
    _type: "mediaShowcase",
    eyebrow: "ABOUT MONDAYBREW",
    headline: "We build digital experiences",
    alignment: "center",
    cta: { _type: "button", label: "Request a quote", href: "/kontakt", variant: "default" },
    media: {
      mode: "video",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    stats: [
      { _type: "stat", value: "12+ years", label: "of industry experience" },
      { _type: "stat", value: "450k miles", label: "driven weekly across the US" },
      { _type: "stat", value: "1500+", label: "satisfied customers" },
      { _type: "stat", value: "300 loads", label: "delivered each week" },
    ],
  } as const;

  await client
    .patch(home._id)
    .setIfMissing({ sections: [] })
    .insert("after", "sections[-1]", [section])
    .commit();

  console.log("Inserted Media Showcase section on homepage");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

