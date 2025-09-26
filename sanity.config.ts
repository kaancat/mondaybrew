import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import schemas from "./src/sanity/schema";

export default defineConfig({
  name: "default",
  title: "mondaybrew Studio",
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool(), muxInput()],
  schema: {
    types: schemas,
  },
});

