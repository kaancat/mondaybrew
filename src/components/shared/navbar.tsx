"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">mondaybrew</Link>
        <NavigationMenu>
          <NavigationMenuList className="gap-4 text-sm">
            <NavigationMenuItem>
              <Link className={`hover:underline ${isActive("/") ? "underline" : ""}`} href="/">Hjem</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link className={`hover:underline ${isActive("/services") ? "underline" : ""}`} href="/services">Services</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link className={`hover:underline ${isActive("/work") ? "underline" : ""}`} href="/work">Cases</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link className={`hover:underline ${isActive("/blog") ? "underline" : ""}`} href="/blog">Blog</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link className={`hover:underline ${isActive("/contact") ? "underline" : ""}`} href="/contact">Kontakt</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

