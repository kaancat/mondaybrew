import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || "",
    dataset: process.env.SANITY_DATASET || "production",
  },
  // Configure hosted studio hostname (e.g., mondaybrew.sanity.studio)
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  deployment: {
    appId: 'dsznl7dgs53eczktwlrfmr6g',
  },
});
