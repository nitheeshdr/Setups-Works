import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCode,
  faLayerGroup,
  faMobileScreenButton,
  faCartShopping,
  faPenNib,
  faRobot,
  faDiagramProject,
  faPlug,
  faMagnifyingGlass,
  faBullhorn,
  faPalette,
  faServer,
  faWrench,
  faGlobe,
  faRocket,
  faCubes,
} from "@fortawesome/free-solid-svg-icons";

export interface Service {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: IconDefinition;
  category: "Development" | "Design" | "Growth" | "Platforms" | "Intelligence";
  features: string[];
  deliverables: string[];
}

export const services: Service[] = [
  {
    slug: "website-development",
    title: "Website Development",
    short: "Blazing-fast, SEO-ready marketing sites.",
    description:
      "Custom, hand-crafted websites engineered for speed, accessibility, and conversion. From landing pages to complex multi-market platforms.",
    icon: faGlobe,
    category: "Development",
    features: ["Core Web Vitals 90+", "Headless CMS", "A/B experimentation", "Edge delivery"],
    deliverables: ["Design system", "Responsive build", "Analytics wiring", "Launch + handoff"],
  },
  {
    slug: "react-development",
    title: "React Development",
    short: "Component-driven interfaces at scale.",
    description:
      "Production React apps with clean architecture, type safety, and delightful motion. Design systems that teams can actually maintain.",
    icon: faCode,
    category: "Development",
    features: ["React 19 + TS", "Design systems", "State architecture", "Testing & CI"],
    deliverables: ["Component library", "Storybook", "Typed API layer", "Docs"],
  },
  {
    slug: "nextjs",
    title: "Next.js",
    short: "Full-stack apps with SSR & edge.",
    description:
      "Server components, streaming, and edge rendering for apps that feel instant and rank high. The framework we build the future on.",
    icon: faLayerGroup,
    category: "Development",
    features: ["App Router", "Server Actions", "ISR & streaming", "Edge middleware"],
    deliverables: ["SSR architecture", "API routes", "Auth & RBAC", "Deploy pipeline"],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    short: "Scalable APIs & real-time backends.",
    description:
      "Robust, well-tested backends — REST, GraphQL, and real-time — built to scale with observability baked in.",
    icon: faServer,
    category: "Development",
    features: ["REST & GraphQL", "WebSockets", "Queues & jobs", "Observability"],
    deliverables: ["API design", "Data modeling", "Auth & security", "Load testing"],
  },
  {
    slug: "mern-stack",
    title: "MERN Stack",
    short: "End-to-end JavaScript products.",
    description:
      "MongoDB, Express, React, and Node — one language, full ownership, rapid iteration from idea to production.",
    icon: faCubes,
    category: "Development",
    features: ["Full-stack JS", "MongoDB modeling", "Realtime", "CI/CD"],
    deliverables: ["MVP build", "Admin dashboard", "Deployment", "Maintenance plan"],
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    short: "Custom themes & headless WP.",
    description:
      "Bespoke WordPress builds and headless setups that give editors freedom without sacrificing performance.",
    icon: faPenNib,
    category: "Platforms",
    features: ["Custom themes", "Headless WP", "ACF blocks", "Performance tuning"],
    deliverables: ["Theme build", "Editor training", "Migration", "Hardening"],
  },
  {
    slug: "woocommerce",
    title: "WooCommerce",
    short: "Conversion-focused WP commerce.",
    description:
      "High-converting WooCommerce stores with custom checkout flows, subscriptions, and payment integrations.",
    icon: faCartShopping,
    category: "Platforms",
    features: ["Custom checkout", "Subscriptions", "Payment gateways", "Speed optimization"],
    deliverables: ["Store build", "Product import", "Payment setup", "Launch"],
  },
  {
    slug: "shopify",
    title: "Shopify",
    short: "Premium themes & headless Shopify.",
    description:
      "Custom Shopify themes and Hydrogen storefronts designed to sell — fast, branded, and frictionless.",
    icon: faCartShopping,
    category: "Platforms",
    features: ["Custom themes", "Hydrogen", "App integrations", "Checkout UX"],
    deliverables: ["Storefront", "Theme customization", "Integrations", "Optimization"],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    short: "Interfaces people love to use.",
    description:
      "Research-driven product design — from wireframes to pixel-perfect, motion-rich prototypes and design systems.",
    icon: faPalette,
    category: "Design",
    features: ["Product research", "Design systems", "Prototyping", "Motion design"],
    deliverables: ["User flows", "Hi-fi designs", "Prototype", "Design tokens"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    short: "Native-feel cross-platform apps.",
    description:
      "iOS and Android apps with React Native — one codebase, native performance, delightful interactions.",
    icon: faMobileScreenButton,
    category: "Development",
    features: ["React Native", "Offline-first", "Push & deep links", "Native modules"],
    deliverables: ["App build", "Store assets", "Testing", "Release"],
  },
  {
    slug: "play-store-publishing",
    title: "Play Store Publishing",
    short: "From build to store, handled.",
    description:
      "Complete app store publishing — listings, compliance, screenshots, and release management for Play Store and App Store.",
    icon: faRocket,
    category: "Growth",
    features: ["Store listings", "ASO", "Compliance review", "Release management"],
    deliverables: ["Store assets", "Listing copy", "Submission", "Post-launch"],
  },
  {
    slug: "ai-development",
    title: "AI Development",
    short: "LLM apps, agents & RAG systems.",
    description:
      "Custom AI products — chatbots, agents, RAG pipelines, and Claude-powered tools that create real leverage.",
    icon: faRobot,
    category: "Intelligence",
    features: ["LLM integration", "RAG pipelines", "AI agents", "Evals & guardrails"],
    deliverables: ["AI architecture", "Prompt system", "Vector search", "Monitoring"],
  },
  {
    slug: "automation",
    title: "Automation",
    short: "Workflows that run themselves.",
    description:
      "Business automation that removes busywork — integrations, pipelines, and AI-assisted workflows that scale your team.",
    icon: faDiagramProject,
    category: "Intelligence",
    features: ["Workflow automation", "Integrations", "Scheduled jobs", "AI-in-the-loop"],
    deliverables: ["Automation map", "Integrations", "Dashboards", "Docs"],
  },
  {
    slug: "api-development",
    title: "API Development",
    short: "Well-designed, documented APIs.",
    description:
      "Developer-first APIs — versioned, documented, secure, and built for third-party integrations.",
    icon: faPlug,
    category: "Development",
    features: ["REST & GraphQL", "OpenAPI docs", "Rate limiting", "Webhooks"],
    deliverables: ["API design", "SDK", "Docs portal", "Sandbox"],
  },
  {
    slug: "seo",
    title: "SEO",
    short: "Rank higher, grow organically.",
    description:
      "Technical and content SEO that compounds — Core Web Vitals, structured data, and content strategy.",
    icon: faMagnifyingGlass,
    category: "Growth",
    features: ["Technical SEO", "Structured data", "Content strategy", "Link building"],
    deliverables: ["SEO audit", "Roadmap", "Implementation", "Reporting"],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    short: "Full-funnel growth campaigns.",
    description:
      "Data-driven campaigns across paid, social, and email — creative that converts and analytics that prove it.",
    icon: faBullhorn,
    category: "Growth",
    features: ["Paid & social", "Email automation", "Creative", "Analytics"],
    deliverables: ["Strategy", "Campaigns", "Creative assets", "Reporting"],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity",
    short: "Brands that make an impression.",
    description:
      "Distinctive brand systems — logo, voice, guidelines, and assets that make you unforgettable.",
    icon: faPenNib,
    category: "Design",
    features: ["Logo & marks", "Brand voice", "Guidelines", "Asset library"],
    deliverables: ["Brand book", "Logo suite", "Templates", "Assets"],
  },
  {
    slug: "hosting",
    title: "Hosting",
    short: "Fast, secure, managed hosting.",
    description:
      "Managed hosting on modern edge infrastructure — CDN, SSL, backups, and 99.9% uptime.",
    icon: faServer,
    category: "Platforms",
    features: ["Edge CDN", "Auto SSL", "Daily backups", "99.9% uptime"],
    deliverables: ["Setup", "Migration", "Monitoring", "Support"],
  },
  {
    slug: "maintenance",
    title: "Maintenance",
    short: "Ongoing care & optimization.",
    description:
      "Proactive maintenance — updates, security patches, performance tuning, and feature iteration.",
    icon: faWrench,
    category: "Platforms",
    features: ["Updates & patches", "Security", "Performance", "Feature work"],
    deliverables: ["SLA", "Monthly report", "Priority support", "Roadmap"],
  },
];

export const serviceCategories = [
  "Development",
  "Design",
  "Growth",
  "Platforms",
  "Intelligence",
] as const;

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
