export const siteConfig = {
  name: "Setups Works",
  shortName: "Setups Works",
  tagline: "The Digital Agency.",
  description:
    "Setups Works is a premium digital agency crafting high-performance websites, web & mobile apps, AI products, and brand experiences that move businesses forward.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "info@setups.works",
  phone: "+91 6383984698",
  location: "Chennai, Tamil Nadu, India",
  /** ISO 8601. Full dates are preferred over a bare year. */
  foundingDate: "2020-06-20",
  priceRange: "$$",
  address: {
    /**
     * Street address for LocalBusiness schema. Google treats a PostalAddress
     * without a street as a weak local signal, and it should match the Google
     * Business Profile listing exactly. Left blank rather than guessed —
     * emitted only when filled in.
     */
    street: "1009g,govintha reddy street,elavur,gummidipoondi",
    locality: "Chennai",
    region: "Tamil Nadu",
    postalCode: "601201",
    country: "IN",
  },
  /**
   * Business identifiers Google lists as recommended Organization properties
   * (developers.google.com/search/docs/appearance/structured-data/organization).
   * Each is emitted only when non-empty — a blank identifier is worse than an
   * absent one. Nothing here is guessed; fill in what the business actually has.
   *
   * For an Indian services business, realistically only two of these apply:
   *   taxID            — your GSTIN (or PAN). The one worth filling in.
   *   numberOfEmployees — a plain count, e.g. "12".
   *
   * The rest are registry-specific and only apply if you're enrolled:
   *   vatID   — EU/UK VAT. India uses GST, so normally blank.
   *   duns    — Dun & Bradstreet, only if you hold a DUNS number.
   *   leiCode — ISO 17442, effectively finance-sector only.
   *   naics   — North American industry classification.
   *   globalLocationNumber — GS1, supply-chain/retail.
   */
  identifiers: {
    taxID: "",
    vatID: "",
    duns: "",
    leiCode: "",
    naics: "",
    globalLocationNumber: "",
  },
  /** Headcount for Organization.numberOfEmployees. Blank = not emitted. */
  numberOfEmployees: "10",
  geo: { lat: 13.459948725379245, lng: 80.11290785179675 },
  googleBusiness: "https://share.google/Du9pH2y5ZFtvl847t",
  /** Canonical Google Maps listing URL (CID form) — stable entity anchor for hasMap. */
  googleMaps: "https://maps.google.com/?cid=12795956607791697816",
  /** Google Maps embed for the contact page. */
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.096180109854!2d80.11040097442232!3d13.459936386902154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d8367c3c32a81%3A0xb1945ebd28bc8f98!2sSetups%20Works!5e1!3m2!1sen!2sin!4v1784478521137!5m2!1sen!2sin",
  wikidata: "https://www.wikidata.org/wiki/Q140500419",
  areaServed: ["Chennai", "Tamil Nadu", "India", "Worldwide"],
  founderProfile: {
    name: "Nitheesh Rajendran",
    jobTitle: "Founder & CEO",
    description:
      "Founder & CEO of Setups Works. Passionate about Artificial Intelligence, software engineering, and building developer tools that help programmers prepare for coding interviews.",
    alumniOf: "Vels University",
    knowsAbout: [
      "Artificial Intelligence",
      "Software Engineering",
      "Competitive Programming",
      "Data Structures and Algorithms",
      "Technical Interview Preparation",
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
      "Machine Learning",
      "Web Development",
    ],
    sameAs: [
      "https://www.linkedin.com/in/nitheeshdr/",
      "https://github.com/nitheeshdr",
      "https://www.imdb.com/name/nm16304237/",
      "https://www.youtube.com/@nitheeshrajendran",
      "https://www.wikidata.org/wiki/Q140500455",
      // Google Knowledge Panel share link — helps Google reconcile this Person
      // entity with its existing panel.
      "https://share.google/R49gz3hj0ZA74MmQt",
    ],
  },
  ogImage: "/opengraph-image",
  links: {
    twitter: "https://x.com/setupsworks",
    github: "https://github.com/nitheeshdr",
    linkedin: "https://linkedin.com/company/setups-works",
    instagram: "https://instagram.com/setups.works",
    /**
     * Google Play developer page. A strong entity signal: it is a Google-owned
     * property carrying a verified developer identity, which corroborates the
     * organization independently of anything we publish about ourselves.
     */
    playStore: "https://play.google.com/store/apps/dev?id=5478157836712207943",
  },
  keywords: [
    "digital agency",
    "web development",
    "react development",
    "next.js agency",
    "MERN stack",
    "UI UX design",
    "mobile app development",
    "AI development",
    "SEO",
    "branding",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
