export type NavLink = {
  title: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  description?: string;
  items: NavLink[];
};

export type NavSection =
  | {
      kind: "mega";
      title: string;
      groups: NavGroup[];
    }
  | {
      kind: "link";
      title: string;
      href: string;
    }
  | {
      kind: "cta";
      title: string;
      href: string;
    };

export const navigation: NavSection[] = [
  {
    kind: "mega",
    title: "Marketing",
    groups: [
      {
        title: "Marketing Services",
        description: "Skalérbare kampagner på tværs af hele funnel'en.",
        items: [
          {
            title: "Full-Funnel Performance",
            description: "Strategi og eksekvering på tværs af awareness til konvertering.",
            href: "/services/marketing/full-funnel-performance",
          },
          {
            title: "Paid Search",
            description: "Datadrevet søgeannoncering med fokus på ROAS.",
            href: "/services/marketing/paid-search",
          },
          {
            title: "Paid Social",
            description: "Kreative, målrettede kampagner på de sociale platforme.",
            href: "/services/marketing/paid-social",
          },
          {
            title: "E-mail Marketing",
            description: "Automatiserede flows og segmenteret kommunikation.",
            href: "/services/marketing/email-marketing",
          },
        ],
      },
    ],
  },
  {
    kind: "mega",
    title: "Web",
    groups: [
      {
        title: "Digitale produkter",
        description: "Hastighed, performance og oplevelse i ét.",
        items: [
          {
            title: "Websites",
            description: "Konverterende websites designet til vækst.",
            href: "/services/web/websites",
          },
          {
            title: "AI",
            description: "AI-værktøjer og automations der løfter oplevelsen.",
            href: "/services/web/ai",
          },
          {
            title: "eCommerce",
            description: "Skalerbare shops med fokus på customer lifetime value.",
            href: "/services/web/ecommerce",
          },
        ],
      },
    ],
  },
  {
    kind: "link",
    title: "Cases",
    href: "/cases",
  },
  {
    kind: "link",
    title: "Om os",
    href: "/om-os",
  },
  {
    kind: "cta",
    title: "Kontakt",
    href: "/kontakt",
  },
];

