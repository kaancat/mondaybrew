import { NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.client";

export const revalidate = 0;

export async function GET() {
  try {
    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || "production";
    const hasToken = Boolean(process.env.SANITY_API_READ_TOKEN);
    const count = await serverClient.fetch<number>("count(*[_type=='caseStudy'])");
    return NextResponse.json({ ok: true, projectId, dataset, hasToken, count });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

