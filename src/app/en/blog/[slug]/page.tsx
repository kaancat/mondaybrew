/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSanity } from "@/lib/sanity.client";
import { postBySlugQuery } from "@/lib/sanity.queries";
import { seoToMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { jsonLd } from "@/lib/jsonld";

type Post = {
  title: string;
  slug: { current: string };
  locale?: "da" | "en";
  date?: string;
  excerpt?: string;
  seo?: { title?: string; description?: string; image?: unknown; canonical?: string };
  authorName?: string;
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = await fetchSanity<Post>(postBySlugQuery, { slug: params.slug, locale: "en" });
  if (!post) return {};
  return seoToMetadata({
    seo: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      image: post.seo?.image,
      canonical: post.seo?.canonical,
    },
    pathname: `/en/blog/${post.slug.current}`,
    locale: "en",
  });
}

export default async function PostPageEN({ params }: any) {
  const post = await fetchSanity<Post>(postBySlugQuery, { slug: params.slug, locale: "en" });
  if (!post) return notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app";
  const url = `${base}/en/blog/${post.slug.current}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <JsonLd id="breadcrumbs" data={jsonLd.breadcrumb([{ name: "Home", item: `${base}/en` }, { name: "Blog", item: `${base}/en/blog` }, { name: post.title, item: url }])} />
      <JsonLd
        id="article"
        data={jsonLd.article({
          headline: post.title,
          description: post.excerpt,
          authorName: post.authorName || "mondaybrew",
          datePublished: post.date || new Date().toISOString(),
          url,
          publisherName: "mondaybrew",
        })}
      />
      <h1 className="text-3xl font-bold">{post.title}</h1>
      {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
      <p className="text-sm text-muted-foreground">(Content coming from Sanity will render here.)</p>
    </div>
  );
}
