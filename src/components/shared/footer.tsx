import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} mondaybrew. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="/legal">Legal</Link>
          <Link href="/sitemap">Sitemap</Link>
        </nav>
      </div>
    </footer>
  );
}

