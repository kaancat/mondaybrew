export type PillarLinkReference = {
  _type?: "page" | "post" | "caseStudy";
  title?: string | null;
  locale?: string | null;
  slug?: string | null;
};

export type PillarsServiceItem = {
  label?: string | null;
  href?: string | null;
  reference?: PillarLinkReference | null;
} | null;

export type PillarsGroup = {
  key?: string | null;
  headline?: string | null;
  description?: string | null;
  chips?: Array<string | null> | null;
  listLabel?: string | null;
  items?: PillarsServiceItem[] | null;
} | null;

export type PillarsSectionData = {
  sectionTitle?: string | null;
  groups?: PillarsGroup[] | null;
};

export function isPillarsSection(
  section: { _type?: string } | null | undefined,
): section is (PillarsSectionData & { _type: "pillars" }) {
  return Boolean(section && section._type === "pillars");
}
