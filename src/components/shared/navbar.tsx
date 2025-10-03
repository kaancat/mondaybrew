import { fetchSanity } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import {
  NavbarBrand,
  NavbarClient,
  NavbarCta,
  NavbarMegaGroup,
  NavbarSection,
} from "./navbar.client";

const DEFAULT_BRAND = "mondaybrew";
const DEFAULT_LOCALE = "da";

type SanityNavigationLink = {
  label?: string;
  description?: string;
  href?: string;
  reference?: {
    slug?: string | null;
    locale?: string | null;
  } | null;
};

type SanityNavigationSection = {
  title?: string;
  variant?: string;
  link?: SanityNavigationLink | null;
  groups?: Array<{
    title?: string;
    description?: string;
    items?: SanityNavigationLink[];
  }>;
};

type SanityLogo = {
  asset?: {
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
  alt?: string;
} | null;

type SiteSettingsResult = {
  title?: string;
  logo?: SanityLogo;
  logoOnDark?: SanityLogo;
  mainNavigation?: SanityNavigationSection[];
  headerCta?: SanityNavigationLink | null;
};

function resolveHref(link?: SanityNavigationLink | null): string | undefined {
  if (!link) return undefined;
  if (link.href) return link.href;

  const slug = link.reference?.slug?.replace(/^\/+/, "") ?? "";
  const locale = link.reference?.locale ?? DEFAULT_LOCALE;
  const localePrefix = locale && locale !== DEFAULT_LOCALE ? `/${locale}` : "";

  if (!slug) {
    return localePrefix || "/";
  }

  return `${localePrefix}/${slug}`;
}

function mapGroups(section?: SanityNavigationSection["groups"]): NavbarMegaGroup[] {
  if (!section) return [];

  return section.map((group) => ({
    title: group.title ?? undefined,
    description: group.description ?? undefined,
    items:
      group.items?.map((item) => ({
        label: item.label ?? "Untitled",
        description: item.description ?? undefined,
        href: resolveHref(item),
      })) ?? [],
  }));
}

function mapSections(sections?: SanityNavigationSection[]): NavbarSection[] {
  if (!sections) return [];

  return sections
    .map((section) => {
      const kind = section.variant === "mega" ? "mega" : section.variant === "link" ? "link" : "link";
      if (kind === "mega") {
        return {
          kind,
          label: section.title ?? "",
          groups: mapGroups(section.groups),
        } satisfies NavbarSection;
      }

      return {
        kind: "link",
        label: section.title ?? "",
        href: resolveHref(section.link),
      } satisfies NavbarSection;
    })
    .filter((section) => section.label);
}

function mapBrand(settings?: SiteSettingsResult): NavbarBrand {
  const title = settings?.title || DEFAULT_BRAND;
  const toUi = (entry?: SanityLogo | null) => {
    const url = entry?.asset?.url;
    const dims = entry?.asset?.metadata?.dimensions;
    return url
      ? {
          url,
          alt: entry?.alt || title,
          width: dims?.width,
          height: dims?.height,
        }
      : null;
  };

  return {
    title,
    logoLight: toUi(settings?.logo),
    logoDark: toUi(settings?.logoOnDark),
    // Fallback for existing consumers
    logo: toUi(settings?.logoOnDark) ?? toUi(settings?.logo),
  };
}

function mapCta(link?: SanityNavigationLink | null): NavbarCta {
  return {
    label: link?.label || "Let\u2019s talk",
    href: resolveHref(link) ?? "/kontakt",
  };
}

export async function Navbar() {
  const settings = await fetchSanity<SiteSettingsResult>(siteSettingsQuery, {});
  if (process.env.NODE_ENV !== "production") {
    console.log("Fetched site settings", {
      hasLogo: Boolean(settings?.logo?.asset?.url),
      hasLogoOnDark: Boolean(settings?.logoOnDark?.asset?.url),
    });
  }

  const sections = mapSections(settings?.mainNavigation);
  const brand = mapBrand(settings);
  const cta = mapCta(settings?.headerCta);

  return (
    <NavbarClient
      brand={brand}
      sections={sections}
      cta={cta}
      locales={{ available: ["da", "en"], defaultLocale: DEFAULT_LOCALE }}
    />
  );
}
