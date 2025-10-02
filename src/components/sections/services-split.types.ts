export type ServicesSplitMedia =
  | {
      type: "image";
      src: string;
      alt?: string;
      blurDataURL?: string;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
    };

export type ServicesSplitCta = {
  label: string;
  href: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "secondary";
};

export type ServicesSplitService = {
  id: string;
  label: string;
  title?: string;
  summary?: string;
  description?: string;
  media?: ServicesSplitMedia | null;
  primaryCta?: ServicesSplitCta;
  secondaryCta?: ServicesSplitCta;
};

export type ServicesSplitTab = {
  id: string;
  label: string;
  services: ServicesSplitService[];
};

export interface ServicesSplitProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  tabs?: ServicesSplitTab[];
}
