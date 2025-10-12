import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4ot323fc";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_USER_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN (use: sanity exec scripts/seed-testimonials-section.ts --with-user-token)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-09-01", token, useCdn: false });

type ImageField = {
  _type: "imageWithAlt";
  alt: string;
  image: { _type: "image"; asset: { _type: "reference"; _ref: string } };
};

type ButtonField = { _type: "button"; label: string; href: string; variant?: string };

type TestimonialSeed = {
  variant: "quote" | "imageQuote" | "image";
  background?: string;
  logo?: ImageField;
  image?: ImageField;
  quote?: string;
  author?: string;
  role?: string;
  cta?: ButtonField;
};

const imageRef = (id: string): ImageField => ({
  _type: "imageWithAlt",
  alt: "",
  image: { _type: "image", asset: { _type: "reference", _ref: id } },
});

const card = (props: TestimonialSeed) => ({ _type: "testimonialCard", ...props });

async function fetchBuffer(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download asset: ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadImage(url: string, filename: string) {
  const buffer = await fetchBuffer(url);
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

async function getHomeId() {
  const id = await client.fetch<string | null>(`*[_type=="page" && isHome==true && locale=="da"][0]._id`);
  if (id) return id;
  const _id = `page-home-da`;
  await client.create({ _id, _type: "page", title: "Forside", slug: { _type: "slug", current: "" }, locale: "da", isHome: true, sections: [] });
  return _id;
}

async function run() {
  const homeId = await getHomeId();

  // Upload a few logos & images (royalty-free placeholders)
  const logoA = await uploadImage("https://dummyimage.com/200x80/111111/ffffff.png&text=SONY", "logo-sony.png");
  const logoB = await uploadImage("https://dummyimage.com/200x80/111111/ffffff.png&text=FIRECLAY", "logo-fireclay.png");
  const logoC = await uploadImage("https://dummyimage.com/200x80/111111/ffffff.png&text=SIEMENS", "logo-siemens.png");

  const imgA = await uploadImage("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop", "testimonial-a.jpg");
  const imgB = await uploadImage("https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop", "testimonial-b.jpg");
  const imgC = await uploadImage("https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop", "testimonial-c.jpg");

  const section = {
    _type: "testimonialsMarquee" as const,
    eyebrow: "What our clients say",
    headline: "Results that earn trust.",
    subheading: "A few snapshots from product, growth, and brand collaborations.",
    speedTop: 28,
    speedBottom: 22,
    top: [
      card({ variant: "quote", background: "#F5F7FD", logo: imageRef(logoA), quote: "mondaybrew helped us cut time-to-ship by 40% across two quarters.", author: "Walter Gross", role: "Senior Marketing Manager", cta: { _type: "button", label: "View Sony case study", href: "/cases" } }),
      card({ variant: "imageQuote", background: "#CDE8DF", logo: imageRef(logoB), image: imageRef(imgA), quote: "Getting people out of email and into our flows increased ownership across teams.", author: "Jamie Chappell", role: "Creative Director", cta: { _type: "button", label: "View Fireclay Tile", href: "/cases" } }),
      card({ variant: "image", image: imageRef(imgB), cta: { _type: "button", label: "Explore project", href: "/cases" } }),
    ],
    bottom: [
      card({ variant: "imageQuote", background: "#E9C6D0", logo: imageRef(logoA), image: imageRef(imgC), quote: "Built to serve the needs of a rapidly moving planning process.", author: "Dawn Jensen", role: "Senior Program Manager", cta: { _type: "button", label: "Read more", href: "/cases" } }),
      card({ variant: "quote", background: "#49444B", logo: imageRef(logoC), quote: "The partnership model gave us velocity without compromising quality.", author: "Michael Stenberg", role: "Head of Digital Marketing", cta: { _type: "button", label: "View Siemens", href: "/cases" } }),
      card({ variant: "image", image: imageRef(imgA), cta: { _type: "button", label: "See launch", href: "/cases" } }),
    ],
  };

  const patch = client.patch(homeId).setIfMissing({ sections: [] });
  // remove older instances
  patch.unset(["sections[_type == 'testimonialsMarquee']"]);
  patch.insert("after", "sections[-1]", [section]);
  await patch.commit();
  console.log(`Seeded testimonialsMarquee on home page ${homeId}`);
}

run().catch((err) => { console.error(err); process.exit(1); });
