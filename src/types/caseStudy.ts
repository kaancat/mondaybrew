export type CaseStudyMedia = {
  mode?: string | null;
  image?: { alt?: string | null; image?: { asset?: { url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } } } } | null;
  videoUrl?: string | null;
  videoFile?: { asset?: { url: string; mimeType?: string } } | null;
  poster?: { alt?: string | null; image?: { asset?: { url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } } } } | null;
};

export type CaseStudy = {
  _id: string;
  title: string;
  client?: string | null;
  excerpt?: string | null;
  slug?: string | null;
  tags?: string[];
  media?: CaseStudyMedia | null;
};

