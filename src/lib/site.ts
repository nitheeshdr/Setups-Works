export const siteConfig = {
  name: "SETUPS WORKS",
  shortName: "Setups Works",
  tagline: "The Digital Agency.",
  description:
    "SETUPS WORKS is a premium digital agency crafting high-performance websites, web & mobile apps, AI products, and brand experiences that move businesses forward.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@setupsworks.com",
  phone: "+1 (415) 555-0142",
  location: "Remote · Worldwide",
  ogImage: "/opengraph-image",
  links: {
    twitter: "https://twitter.com/setupsworks",
    github: "https://github.com/setupsworks",
    linkedin: "https://linkedin.com/company/setupsworks",
    dribbble: "https://dribbble.com/setupsworks",
    instagram: "https://instagram.com/setupsworks",
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
