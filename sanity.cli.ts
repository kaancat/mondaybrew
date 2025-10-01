import * as sanityCli from "sanity/cli";

const { defineCliConfig } = sanityCli;

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "4ot323fc";

const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  // Configure hosted studio hostname (e.g., mondaybrew.sanity.studio)
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  deployment: {
    appId: 'dsznl7dgs53eczktwlrfmr6g',
  },
});
