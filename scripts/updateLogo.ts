import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

async function main() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  if (!projectId) {
    throw new Error("SANITY_PROJECT_ID is required");
  }

  const filePath = path.resolve("public/brand/MondayBrew - Logo Stor - 1.png");
  const file = await readFile(filePath);

  const client = getCliClient({ apiVersion: "2024-09-01" });

  const asset = await client.assets.upload("image", file, {
    filename: "mondaybrew-logo.png",
  });

  await client
    .patch("siteSettings")
    .set({
      logo: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
    })
    .commit();

  console.log(`Updated logo with asset ${asset._id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
