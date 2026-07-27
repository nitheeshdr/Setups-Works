import type { Service, ServiceCategory } from "@/lib/types";

export type { Service } from "@/lib/types";

/**
 * Built-in service catalogue.
 *
 * Services are database-backed and managed from /admin/services. This array is
 * the fallback used when the database is empty or unreachable (same pattern as
 * `getTimeline`), and it is also what `scripts/seed-services.ts` imports on
 * first run — so the site never renders an empty /services page.
 *
 * `icon` is a key into `lib/service-icons.ts`, not a FontAwesome object: the
 * same records have to survive a round-trip through Mongo.
 *
 * Note on empty fields: `outcomes`, `startingPrice`, `timeline`, and `faqs` are
 * intentionally left unset here. Those are real business claims (metrics,
 * pricing, delivery windows) that belong to the business, not to seed data, so
 * the detail page simply omits those sections until an admin fills them in.
 */
export const services: Service[] = [
  {
    slug: "software-development",
    title: "Software Development",
    short: "Custom software, built to fit.",
    description:
      "Bespoke software for the problems off-the-shelf tools can't solve — internal platforms, SaaS products, and line-of-business systems built to your workflow.",
    overview:
      "Most teams outgrow their tools before they outgrow their business. We build the software that fits the way you already work, instead of forcing your process into someone else's product.",
    icon: "laptop",
    category: "Development",
    features: ["Custom architecture", "Legacy modernization", "Third-party integrations", "Automated testing"],
    deliverables: ["Technical discovery", "Production build", "Test suite", "Handover & docs"],
    idealFor: ["Teams hitting the limits of spreadsheets or SaaS", "Businesses with a workflow no product matches", "Companies modernizing a legacy system"],
    techStack: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
    order: 0,
  },
  {
    slug: "website-development",
    title: "Website Development",
    short: "Blazing-fast, SEO-ready marketing sites.",
    description:
      "Custom, hand-crafted websites engineered for speed, accessibility, and conversion. From landing pages to complex multi-market platforms.",
    overview:
      "A marketing site is usually the first thing a customer meets and the first thing they judge. We build sites that load fast, rank well, and read as carefully made — because all three come from the same engineering decisions.",
    icon: "globe",
    category: "Development",
    features: ["Core Web Vitals 90+", "Headless CMS", "A/B experimentation", "Edge delivery"],
    deliverables: ["Design system", "Responsive build", "Analytics wiring", "Launch + handoff"],
    idealFor: ["Brands whose current site is slow or dated", "Companies launching a new product or market", "Teams that need editors to publish without a developer"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS"],
    order: 1,
  },
  {
    slug: "react-development",
    title: "React Development",
    short: "Component-driven interfaces at scale.",
    description:
      "Production React apps with clean architecture, type safety, and delightful motion. Design systems that teams can actually maintain.",
    overview:
      "React makes it easy to ship a screen and hard to keep shipping them. We focus on the architecture underneath — state, types, and a component library your team can extend without a rewrite in a year.",
    icon: "code",
    category: "Development",
    features: ["React 19 + TS", "Design systems", "State architecture", "Testing & CI"],
    deliverables: ["Component library", "Storybook", "Typed API layer", "Docs"],
    idealFor: ["Teams scaling a React codebase past its first architecture", "Products needing a real design system", "Companies replacing a legacy frontend"],
    techStack: ["React 19", "TypeScript", "Storybook", "Vitest"],
    order: 2,
  },
  {
    slug: "nextjs",
    title: "Next.js",
    short: "Full-stack apps with SSR & edge.",
    description:
      "Server components, streaming, and edge rendering for apps that feel instant and rank high. The framework we build the future on.",
    overview:
      "Next.js is our default for anything that has to be both fast and findable. Server components and streaming let a page start rendering before the data finishes loading, which is what makes the difference on real networks.",
    icon: "layers",
    category: "Development",
    features: ["App Router", "Server Actions", "ISR & streaming", "Edge middleware"],
    deliverables: ["SSR architecture", "API routes", "Auth & RBAC", "Deploy pipeline"],
    idealFor: ["Products that need SEO and app-like interactivity", "Teams migrating off a client-only SPA", "Companies consolidating frontend and API"],
    techStack: ["Next.js", "React", "TypeScript", "Vercel"],
    order: 3,
  },
  {
    slug: "nodejs",
    title: "Node.js",
    short: "Scalable APIs & real-time backends.",
    description:
      "Robust, well-tested backends — REST, GraphQL, and real-time — built to scale with observability baked in.",
    overview:
      "Backends fail in production, not in development. We build Node services with the boring parts handled up front: structured logging, health checks, queues, and load testing before launch rather than after the first incident.",
    icon: "server",
    category: "Development",
    features: ["REST & GraphQL", "WebSockets", "Queues & jobs", "Observability"],
    deliverables: ["API design", "Data modeling", "Auth & security", "Load testing"],
    idealFor: ["Products needing real-time features", "Teams whose API is the bottleneck", "Companies splitting a monolith into services"],
    techStack: ["Node.js", "TypeScript", "Redis", "PostgreSQL"],
    order: 4,
  },
  {
    slug: "spring-boot-development",
    title: "Spring Boot Development",
    short: "Enterprise-grade Java backends.",
    description:
      "Production Spring Boot services — microservices, REST APIs, and batch systems with the reliability and security enterprise workloads demand.",
    overview:
      "Spring Boot is what we reach for when a system has to satisfy auditors as well as users. Mature security, transaction handling, and a testing story that holds up when the service is processing money or regulated data.",
    icon: "leaf",
    category: "Development",
    features: ["Spring Boot & JPA", "Microservices", "Spring Security", "JUnit & integration tests"],
    deliverables: ["Service architecture", "API implementation", "Database layer", "Deployment config"],
    idealFor: ["Enterprises standardized on the JVM", "Regulated workloads with audit requirements", "Teams running batch or transactional systems"],
    techStack: ["Java", "Spring Boot", "PostgreSQL", "Maven"],
    order: 5,
  },
  {
    slug: "mern-stack",
    title: "MERN Stack",
    short: "End-to-end JavaScript products.",
    description:
      "MongoDB, Express, React, and Node — one language, full ownership, rapid iteration from idea to production.",
    overview:
      "One language across the whole stack means less context-switching and faster iteration, which matters most when you're still finding product-market fit and the shape of the app is still changing weekly.",
    icon: "cubes",
    category: "Development",
    features: ["Full-stack JS", "MongoDB modeling", "Realtime", "CI/CD"],
    deliverables: ["MVP build", "Admin dashboard", "Deployment", "Maintenance plan"],
    idealFor: ["Startups building a first version", "Founders validating an idea quickly", "Teams that want one stack end to end"],
    techStack: ["MongoDB", "Express", "React", "Node.js"],
    order: 6,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    short: "Native-feel cross-platform apps.",
    description:
      "iOS and Android apps with React Native — one codebase, native performance, delightful interactions.",
    overview:
      "One codebase covering both stores, without the app feeling like a website in a shell. We drop to native modules where it matters and keep everything else shared.",
    icon: "mobile",
    category: "Development",
    features: ["React Native", "Offline-first", "Push & deep links", "Native modules"],
    deliverables: ["App build", "Store assets", "Testing", "Release"],
    idealFor: ["Products needing both iOS and Android", "Teams with web React experience", "Apps that must work offline"],
    techStack: ["React Native", "TypeScript", "Expo", "Firebase"],
    order: 7,
  },
  {
    slug: "api-development",
    title: "API Development",
    short: "Well-designed, documented APIs.",
    description:
      "Developer-first APIs — versioned, documented, secure, and built for third-party integrations.",
    overview:
      "An API is a product with developers as its users, and it gets judged in the first ten minutes. We design for that first session: clear errors, honest docs, and a sandbox you can call before signing anything.",
    icon: "plug",
    category: "Development",
    features: ["REST & GraphQL", "OpenAPI docs", "Rate limiting", "Webhooks"],
    deliverables: ["API design", "SDK", "Docs portal", "Sandbox"],
    idealFor: ["Companies opening a platform to partners", "Products with third-party integrations", "Teams whose API predates their docs"],
    techStack: ["OpenAPI", "TypeScript", "GraphQL", "Postman"],
    order: 8,
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    short: "Interfaces people love to use.",
    description:
      "Research-driven product design — from wireframes to pixel-perfect, motion-rich prototypes and design systems.",
    overview:
      "Design decisions are cheapest before code exists. We work from research to clickable prototype so the expensive questions get answered while they're still cheap to change.",
    icon: "palette",
    category: "Design",
    features: ["Product research", "Design systems", "Prototyping", "Motion design"],
    deliverables: ["User flows", "Hi-fi designs", "Prototype", "Design tokens"],
    idealFor: ["Products with usability or drop-off problems", "Teams without a consistent design language", "Companies preparing a redesign"],
    techStack: ["Figma", "Design tokens", "Framer Motion"],
    order: 9,
  },
  {
    slug: "brand-identity",
    title: "Brand Identity",
    short: "Brands that make an impression.",
    description:
      "Distinctive brand systems — logo, voice, guidelines, and assets that make you unforgettable.",
    overview:
      "A brand is what survives contact with every channel you don't control. We build systems — marks, type, voice, rules — so the brand still reads as itself in places you never designed for.",
    icon: "pen",
    category: "Design",
    features: ["Logo & marks", "Brand voice", "Guidelines", "Asset library"],
    deliverables: ["Brand book", "Logo suite", "Templates", "Assets"],
    idealFor: ["New companies establishing an identity", "Businesses that have outgrown their original branding", "Teams with inconsistent assets across channels"],
    techStack: ["Figma", "Illustrator", "Brand guidelines"],
    order: 10,
  },
  {
    slug: "play-store-publishing",
    title: "Play Store Publishing",
    short: "From build to store, handled.",
    description:
      "Complete app store publishing — listings, compliance, screenshots, and release management for Play Store and App Store.",
    overview:
      "Store review is where finished apps go to wait. We handle listings, compliance, and the policy details that cause rejections, so the release calendar survives contact with the review queue.",
    icon: "rocket",
    category: "Growth",
    features: ["Store listings", "ASO", "Compliance review", "Release management"],
    deliverables: ["Store assets", "Listing copy", "Submission", "Post-launch"],
    idealFor: ["Teams shipping their first app", "Companies that have hit review rejections", "Products needing ongoing release management"],
    techStack: ["Play Console", "App Store Connect", "Fastlane"],
    order: 11,
  },
  {
    slug: "seo",
    title: "SEO",
    short: "Rank higher, grow organically.",
    description:
      "Technical and content SEO that compounds — Core Web Vitals, structured data, and content strategy.",
    overview:
      "SEO is the one channel that gets cheaper over time, and the one that punishes shortcuts hardest. We start with the technical foundation — crawlability, Core Web Vitals, structured data — because content strategy on a broken site is wasted work.",
    icon: "search",
    category: "Growth",
    features: ["Technical SEO", "Structured data", "Content strategy", "Link building"],
    deliverables: ["SEO audit", "Roadmap", "Implementation", "Reporting"],
    idealFor: ["Sites that don't rank for their own brand", "Businesses over-reliant on paid acquisition", "Companies planning a migration or redesign"],
    techStack: ["Search Console", "Schema.org", "Core Web Vitals", "Analytics"],
    order: 12,
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    short: "Full-funnel growth campaigns.",
    description:
      "Data-driven campaigns across paid, social, and email — creative that converts and analytics that prove it.",
    overview:
      "Campaigns are only as good as the measurement behind them. We wire up attribution first, so the decision to scale or kill a channel is made on numbers rather than instinct.",
    icon: "megaphone",
    category: "Growth",
    features: ["Paid & social", "Email automation", "Creative", "Analytics"],
    deliverables: ["Strategy", "Campaigns", "Creative assets", "Reporting"],
    idealFor: ["Companies scaling past word of mouth", "Teams unsure which channels actually work", "Products with a launch to support"],
    techStack: ["Google Ads", "Meta Ads", "Analytics", "Email automation"],
    order: 13,
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    short: "Custom themes & headless WP.",
    description:
      "Bespoke WordPress builds and headless setups that give editors freedom without sacrificing performance.",
    overview:
      "WordPress earns its place when non-technical editors need to publish daily. We build custom themes, or go headless, so that editorial freedom doesn't come at the cost of a slow site.",
    icon: "pen",
    category: "Platforms",
    features: ["Custom themes", "Headless WP", "ACF blocks", "Performance tuning"],
    deliverables: ["Theme build", "Editor training", "Migration", "Hardening"],
    idealFor: ["Content teams publishing frequently", "Sites weighed down by plugins", "Companies moving off a page builder"],
    techStack: ["WordPress", "PHP", "ACF", "REST API"],
    order: 14,
  },
  {
    slug: "woocommerce",
    title: "WooCommerce",
    short: "Conversion-focused WP commerce.",
    description:
      "High-converting WooCommerce stores with custom checkout flows, subscriptions, and payment integrations.",
    overview:
      "Most WooCommerce revenue is lost at checkout. We tune that path first — fewer steps, faster pages, payment methods your customers actually use — before touching anything else.",
    icon: "cart",
    category: "Platforms",
    features: ["Custom checkout", "Subscriptions", "Payment gateways", "Speed optimization"],
    deliverables: ["Store build", "Product import", "Payment setup", "Launch"],
    idealFor: ["Stores with high cart abandonment", "Businesses adding subscriptions", "Merchants already invested in WordPress"],
    techStack: ["WooCommerce", "WordPress", "Payment gateways", "PHP"],
    order: 15,
  },
  {
    slug: "shopify",
    title: "Shopify",
    short: "Premium themes & headless Shopify.",
    description:
      "Custom Shopify themes and Hydrogen storefronts designed to sell — fast, branded, and frictionless.",
    overview:
      "Shopify handles payments, tax, and fraud so you don't have to. We spend the time saved on the storefront — a theme that looks like your brand rather than the template it started from.",
    icon: "cart",
    category: "Platforms",
    features: ["Custom themes", "Hydrogen", "App integrations", "Checkout UX"],
    deliverables: ["Storefront", "Theme customization", "Integrations", "Optimization"],
    idealFor: ["Merchants on a generic theme", "Brands wanting a headless storefront", "Stores scaling internationally"],
    techStack: ["Shopify", "Hydrogen", "Liquid", "GraphQL"],
    order: 16,
  },
  {
    slug: "devops",
    title: "DevOps",
    short: "Ship faster, break less.",
    description:
      "CI/CD pipelines, containerized infrastructure, and observability that turn deploys into a non-event — from first commit to production rollback.",
    overview:
      "Deploying should be boring. We build the pipeline, the container setup, and the monitoring that make shipping a routine event instead of a scheduled risk — including the rollback path you hope never to use.",
    icon: "infinity",
    category: "Platforms",
    features: ["CI/CD pipelines", "Docker & Kubernetes", "Infrastructure as code", "Monitoring & alerting"],
    deliverables: ["Pipeline setup", "Infra provisioning", "Observability stack", "Runbooks"],
    idealFor: ["Teams deploying manually or rarely", "Companies with no rollback story", "Products scaling past a single server"],
    techStack: ["Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    order: 17,
  },
  {
    slug: "hosting",
    title: "Hosting",
    short: "Fast, secure, managed hosting.",
    description:
      "Managed hosting on modern edge infrastructure — CDN, SSL, backups, and 99.9% uptime.",
    overview:
      "Managed hosting on edge infrastructure, with the operational work — certificates, backups, CDN configuration, monitoring — handled rather than left as a to-do nobody owns.",
    icon: "server",
    category: "Platforms",
    features: ["Edge CDN", "Auto SSL", "Daily backups", "99.9% uptime"],
    deliverables: ["Setup", "Migration", "Monitoring", "Support"],
    idealFor: ["Businesses without an ops team", "Sites on slow legacy hosting", "Companies needing a managed migration"],
    techStack: ["Edge CDN", "Cloudflare", "Automated backups"],
    order: 18,
  },
  {
    slug: "maintenance",
    title: "Maintenance",
    short: "Ongoing care & optimization.",
    description:
      "Proactive maintenance — updates, security patches, performance tuning, and feature iteration.",
    overview:
      "Software decays whether or not anyone touches it — dependencies age, certificates expire, patches pile up. Maintenance is the difference between an ordinary Tuesday and an emergency.",
    icon: "wrench",
    category: "Platforms",
    features: ["Updates & patches", "Security", "Performance", "Feature work"],
    deliverables: ["SLA", "Monthly report", "Priority support", "Roadmap"],
    idealFor: ["Companies without in-house developers", "Sites running outdated dependencies", "Teams needing guaranteed response times"],
    techStack: ["Dependency scanning", "Uptime monitoring", "Automated backups"],
    order: 19,
  },
  {
    slug: "ai-development",
    title: "AI Development",
    short: "LLM apps, agents & RAG systems.",
    description:
      "Custom AI products — chatbots, agents, RAG pipelines, and Claude-powered tools that create real leverage.",
    overview:
      "The hard part of an AI feature isn't the model call, it's everything around it: retrieval that finds the right context, evals that catch regressions, and guardrails for when the model is confidently wrong.",
    icon: "robot",
    category: "Intelligence",
    features: ["LLM integration", "RAG pipelines", "AI agents", "Evals & guardrails"],
    deliverables: ["AI architecture", "Prompt system", "Vector search", "Monitoring"],
    idealFor: ["Companies with documents users need to search", "Products adding assistant features", "Teams whose AI prototype needs hardening"],
    techStack: ["Claude API", "Vector databases", "RAG", "TypeScript"],
    order: 20,
  },
  {
    slug: "automation",
    title: "Automation",
    short: "Workflows that run themselves.",
    description:
      "Business automation that removes busywork — integrations, pipelines, and AI-assisted workflows that scale your team.",
    overview:
      "Every team has work that a person does only because no system connects two tools. We map those handoffs and automate the ones worth automating, which is rarely all of them.",
    icon: "diagram",
    category: "Intelligence",
    features: ["Workflow automation", "Integrations", "Scheduled jobs", "AI-in-the-loop"],
    deliverables: ["Automation map", "Integrations", "Dashboards", "Docs"],
    idealFor: ["Teams re-keying data between systems", "Businesses with manual recurring reports", "Companies whose tools don't talk to each other"],
    techStack: ["Webhooks", "Job queues", "REST APIs", "Claude API"],
    order: 21,
  },
];

export const serviceCategories = [
  "Development",
  "Design",
  "Growth",
  "Platforms",
  "Intelligence",
] as const satisfies readonly ServiceCategory[];

/** Look up a service in the built-in catalogue (fallback path only). */
export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
