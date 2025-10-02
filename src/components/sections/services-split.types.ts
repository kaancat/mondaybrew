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
  id: string;
  label: string;
  href: string;
  style?: "primary" | "secondary";
  target?: string;
  rel?: string;
};

export type ServicesSplitService = {
  id: string;
  title: string;
  detailTitle?: string;
  summary?: string;
  description?: string;
  media?: ServicesSplitMedia | null;
  ctas?: ServicesSplitCta[];
};

export type ServicesSplitTab = {
  id: string;
  label: string;
  headline?: string;
  description?: string;
  services: ServicesSplitService[];
};

export interface ServicesSplitProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  tabs?: ServicesSplitTab[];
}
