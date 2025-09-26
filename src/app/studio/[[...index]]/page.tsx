"use client";
import { NextStudio } from "next-sanity/studio";
import { embeddedStudioConfig } from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={embeddedStudioConfig} />;
}
