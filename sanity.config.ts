import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import schemas from "./src/sanity/schema";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production";

const baseConfig = {
  name: "default",
  title: "mondaybrew Studio",
  projectId,
  dataset,
  basePath: process.env.SANITY_STUDIO_BASEPATH || "/",
  plugins: [structureTool({ name: "studio", title: "Content" }), visionTool(), muxInput()],
  schema: {
    types: schemas,
  },
};

export const embeddedStudioConfig = defineConfig({
  ...baseConfig,
  basePath: "/studio",
});

export default defineConfig(baseConfig);
