export interface NavLink {
  label: string;
  href: string;
  /** Short blurb used for sitelink structured data. Nav rendering ignores it. */
  description?: string;
}

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
];

/**
 * Curated set of key destinations exposed as SiteNavigationElement structured
 * data on the homepage. These are the pages we want Google to consider for
 * search sitelinks (the indented sub-links under the main result).
 *
 * Ordering matters: it is one of the inputs Google weighs when picking which
 * subset to promote, so the most commercially valuable pages come first.
 * Descriptions give each destination a distinct identity — sitelink candidates
 * that look interchangeable tend to get collapsed into a single link.
 */
export const sitelinkNav: NavLink[] = [
  {
    label: "Services",
    href: "/services",
    description:
      "Web development, mobile apps, AI products, UI/UX design, and SEO services from Setups Works.",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    description:
      "Selected websites, apps, and digital products built by Setups Works.",
  },
  {
    label: "Products",
    href: "/products",
    description:
      "In-house software and SaaS products built and maintained by Setups Works.",
  },
  {
    label: "About",
    href: "/about",
    description:
      "The story, team, and founder behind Setups Works, a digital agency based in Chennai, India.",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    description:
      "In-depth breakdowns of client engagements and the results Setups Works delivered.",
  },
  {
    label: "Blog",
    href: "/blog",
    description:
      "Articles on web development, design, and AI from the Setups Works team.",
  },
  {
    label: "Contact",
    href: "/contact",
    description:
      "Start a project with Setups Works — get in touch by email, phone, or the enquiry form.",
  },
  {
    label: "Careers",
    href: "/careers",
    description:
      "Open roles and what it is like to work at Setups Works.",
  },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services/website-development" },
      { label: "React & Next.js", href: "/services/nextjs" },
      { label: "Mobile Apps", href: "/services/mobile-app-development" },
      { label: "AI Development", href: "/services/ai-development" },
      { label: "UI/UX Design", href: "/services/ui-ux-design" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Products", href: "/products" },
      { label: "Search", href: "/search" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
