import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <Container className="py-10 text-sm text-muted-foreground flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} mondaybrew. Alle rettigheder forbeholdes.</p>
        <nav className="flex gap-4">
          <Link href="/legal">Legal</Link>
          <Link href="/sitemap">Sitemap</Link>
        </nav>
      </Container>
    </footer>
  );
}
