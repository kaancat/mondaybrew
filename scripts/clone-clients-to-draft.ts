import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4ot323fc";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN (use: sanity exec scripts/clone-clients-to-draft.ts --with-user-token)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-09-01", token, useCdn: false });

async function run() {
  const pub = await client.fetch<{
    _id: string;
    sections: Array<{ _type?: string; _key?: string; [k: string]: unknown }>;
  }>(`*[_type=="page" && isHome==true && locale == "da"][0]{ _id, sections }`);

  if (!pub?._id) {
    console.error("No published homepage found");
    process.exit(1);
  }

  const draftId = `drafts.${pub._id}`;
  const draft = await client.fetch<{ _id?: string; sections?: unknown[] }>(`*[_id==$id][0]{ _id, sections }`, { id: draftId });

  const clients = (pub.sections || []).find((section) => section?._type === "clientsSection");
  if (!clients) {
    console.log("No clientsSection on published homepage; nothing to clone.");
    return;
  }

  if (!draft?._id) {
    await client.createIfNotExists({ _id: draftId, _type: "page", title: "Forside (draft)", isHome: true, locale: "da" });
  }

  await client
    .patch(draftId)
    .setIfMissing({ sections: [] })
    .insert("after", "sections[-1]", [clients])
    .commit();

  console.log("Cloned clientsSection from published to draft homepage.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
