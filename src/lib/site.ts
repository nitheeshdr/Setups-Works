export const siteConfig = {
  name: "SETUPS WORKS",
  shortName: "Setups Works",
  tagline: "The Digital Agency.",
  description:
    "SETUPS WORKS is a premium digital agency crafting high-performance websites, web & mobile apps, AI products, and brand experiences that move businesses forward.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "info@setups.works",
  phone: "+91 6383984698",
  location: "Chennai",
  ogImage: "/opengraph-image",
  links: {
    linkedin: "https://linkedin.com/company/setups-works",
    instagram: "https://instagram.com/setups.works",
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
