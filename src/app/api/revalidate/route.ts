import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  const slug = searchParams.get("slug");
  const tag = searchParams.get("tag");
  try {
    if (tag) revalidateTag(tag);
    if (slug) revalidatePath(slug, "page");
    revalidateTag("sanity:site");
    return NextResponse.json({ ok: true, revalidated: { slug, tag } });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const rawSlug: string | undefined = body?.slug || body?.document?.slug?.current || body?.slug?.current;
  const locale: string | undefined = body?.locale || body?.document?.locale;
  const slug = rawSlug ? `${locale === "en" ? "/en" : ""}/${rawSlug}`.replace(/\/+/, "/") : undefined;
  const tag = body?.tag || undefined;
  try {
    if (tag) revalidateTag(tag);
    if (slug) revalidatePath(slug.startsWith("/") ? slug : `/${slug}`, "page");
    revalidateTag("sanity:site");
    return NextResponse.json({ ok: true, revalidated: { slug, tag } });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
