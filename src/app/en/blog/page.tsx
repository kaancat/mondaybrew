import Link from "next/link";
import type { Metadata } from "next";
import { fetchSanity } from "@/lib/sanity.client";
import { postsQuery } from "@/lib/sanity.queries";
import { seoToMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return seoToMetadata({
    seo: { title: "Blog — mondaybrew", description: "Latest news and articles from mondaybrew." },
    pathname: "/en/blog",
    locale: "en",
  });
}

type PostListItem = { title: string; slug: { current: string }; date?: string; excerpt?: string };

export default async function BlogIndexEN() {
  const posts = await fetchSanity<PostListItem[]>(postsQuery);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <ul className="space-y-3">
        {posts?.map((p) => (
          <li key={p.slug.current}>
            <Link className="underline" href={`/en/blog/${p.slug.current}`}>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

