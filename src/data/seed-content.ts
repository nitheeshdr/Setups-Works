import type { Blog, Product, Portfolio, Testimonial } from "@/lib/types";

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ------------------------------------------------------------------ *
 *  PRODUCTS — only CodeForge AI ships (per brief)
 * ------------------------------------------------------------------ */
export const seedProducts: Product[] = [
  {
    name: "CodeForge AI",
    slug: "codeforge-ai",
    tagline: "Ship software at the speed of thought.",
    description:
      "CodeForge AI is an AI-powered development platform that helps developers build applications faster using intelligent code generation, automation, debugging assistance, and workflow optimization. It plugs into your editor and CI to turn intent into production-ready code.",
    logo: "/favicon.svg",
    banner: img("1620712943543-bcc4688e7485"),
    screenshots: [
      img("1555066931-4365d14bab8c"),
      img("1517180102446-f3ece451e9d8"),
      img("1461749280684-dccba630e2f6"),
    ],
    features: [
      {
        title: "Intelligent code generation",
        description:
          "Describe a feature in plain English and get production-ready, typed code that matches your codebase conventions.",
        icon: "Sparkles",
      },
      {
        title: "Autonomous debugging",
        description:
          "CodeForge traces errors to their root cause and proposes verified fixes — with tests to prove they work.",
        icon: "Bug",
      },
      {
        title: "Workflow automation",
        description:
          "Automate reviews, refactors, and repetitive tasks across your repo with AI agents that respect your guardrails.",
        icon: "Workflow",
      },
      {
        title: "Deep context awareness",
        description:
          "It reads your whole project — types, patterns, and history — so suggestions actually fit your architecture.",
        icon: "Brain",
      },
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Claude", "Vector DB"],
    category: "Developer Tools",
    status: "coming-soon",
    version: "v0.9 (private beta)",
    githubLink: "https://github.com/setupsworks/codeforge",
    docsLink: "#",
    releaseNotes:
      "Private beta opening soon. Join the waitlist to get early access and help shape the roadmap.",
  },
];

/* ------------------------------------------------------------------ *
 *  BLOG POSTS
 * ------------------------------------------------------------------ */
const body = (intro: string, sections: [string, string][]) => `
<p class="lead">${intro}</p>
${sections
  .map(
    ([h, p]) => `<h2>${h}</h2><p>${p}</p>`,
  )
  .join("\n")}
<blockquote>Great software isn't built by accident — it's the result of relentless craft, tight feedback loops, and a team that cares.</blockquote>
<p>At <strong>SETUPS WORKS</strong>, this is the philosophy behind everything we ship. If you're building something ambitious, we'd love to help.</p>
`;

export const seedBlogs: Blog[] = [
  {
    title: "Why We Bet Everything on the App Router",
    slug: "why-we-bet-on-the-app-router",
    excerpt:
      "Server components changed how we architect apps. Here's what we learned shipping the Next.js App Router to production across a dozen client projects.",
    content: body(
      "The Next.js App Router isn't just a new folder structure — it's a fundamentally different way to think about where your code runs.",
      [
        ["Server components by default", "Rendering on the server means less JavaScript shipped to the client, faster first paint, and data fetching that lives right next to the components that need it. The mental model takes a week to click, then you can't imagine going back."],
        ["Streaming changes the game", "With Suspense boundaries you can stream a page in pieces — show the shell instantly, then hydrate the expensive parts as they resolve. Users perceive the app as dramatically faster."],
        ["The trade-offs are real", "Client/server boundaries require discipline. We built lint rules and conventions to keep 'use client' where it belongs and avoid shipping server secrets to the browser."],
      ],
    ),
    category: "React",
    tags: ["Next.js", "React", "Performance", "Architecture"],
    featuredImage: img("1633356122544-f134324a6cee"),
    author: "Nitheesh R.",
    authorRole: "Founder & Principal Engineer",
    authorAvatar: img("1500648767791-00dcc994a43e", 200),
    status: "published",
    featured: true,
    readingTime: 6,
    publishedAt: "2026-05-18T09:00:00.000Z",
  },
  {
    title: "Designing Motion That Feels Expensive",
    slug: "designing-motion-that-feels-expensive",
    excerpt:
      "The difference between a good interface and a premium one often comes down to 200 milliseconds of motion. A practical guide to animation that elevates.",
    content: body(
      "Motion is the fastest way to make a product feel premium — or cheap. The line between the two is thinner than most teams realize.",
      [
        ["Easing is everything", "Linear motion feels robotic. Spring physics and custom cubic-bezier curves make interfaces feel alive and physical. We default to spring for anything a user directly manipulates."],
        ["Respect the user", "Every animation honors prefers-reduced-motion. Delight should never come at the cost of accessibility or someone's vestibular comfort."],
        ["Purpose over decoration", "The best motion communicates — it shows relationships, guides attention, and confirms actions. Animation without meaning is just noise."],
      ],
    ),
    category: "Technology",
    tags: ["Design", "Animation", "Framer Motion", "UX"],
    featuredImage: img("1550745165-9bc0b252726f"),
    author: "Aria Chen",
    authorRole: "Lead Product Designer",
    authorAvatar: img("1494790108377-be9c29b29330", 200),
    status: "published",
    featured: true,
    readingTime: 5,
    publishedAt: "2026-05-02T09:00:00.000Z",
  },
  {
    title: "Building Production RAG Systems That Don't Hallucinate",
    slug: "production-rag-systems",
    excerpt:
      "Retrieval-augmented generation is easy to prototype and hard to productionize. Here's the architecture we use to ship reliable AI features.",
    content: body(
      "Everyone can build a RAG demo. Shipping one that's accurate, fast, and trustworthy in production is a different sport entirely.",
      [
        ["Retrieval quality is the ceiling", "Your generation is only as good as your retrieval. We invest heavily in chunking strategy, hybrid search, and re-ranking before a single token is generated."],
        ["Evals or it didn't happen", "We treat prompts like code — versioned, tested, and measured against golden datasets. Without evals, you're flying blind on every change."],
        ["Guardrails and citations", "Every answer cites its sources and every output passes through guardrails. Users trust AI that shows its work."],
      ],
    ),
    category: "AI",
    tags: ["AI", "LLM", "RAG", "Claude"],
    featuredImage: img("1526374965328-7f61d4dc18c5"),
    author: "Marcus Vale",
    authorRole: "AI Engineer",
    authorAvatar: img("1507003211169-0a1dd7228f2d", 200),
    status: "published",
    featured: false,
    readingTime: 8,
    publishedAt: "2026-04-20T09:00:00.000Z",
  },
  {
    title: "The MERN Stack in 2026: Still Worth It?",
    slug: "mern-stack-in-2026",
    excerpt:
      "MongoDB, Express, React, Node. The classic full-stack JavaScript combo is a decade old. We break down when it's still the right call.",
    content: body(
      "The MERN stack has been declared dead more times than we can count. Yet here we are, still shipping profitable products on it every quarter.",
      [
        ["One language, full ownership", "A single team can own the entire stack in one language. For startups moving fast, that velocity advantage is enormous."],
        ["When to reach for it", "MVPs, admin-heavy apps, real-time products, and anything where iteration speed beats raw scale. It's a pragmatic default, not a religion."],
        ["When to look elsewhere", "Heavy relational data, strict typing across the wire, or extreme scale might push you toward Postgres, tRPC, or a different architecture entirely."],
      ],
    ),
    category: "Programming",
    tags: ["Node.js", "MongoDB", "JavaScript", "Full-stack"],
    featuredImage: img("1498050108023-c5249f4df085"),
    author: "Nitheesh R.",
    authorRole: "Founder & Principal Engineer",
    authorAvatar: img("1500648767791-00dcc994a43e", 200),
    status: "published",
    featured: false,
    readingTime: 7,
    publishedAt: "2026-03-28T09:00:00.000Z",
  },
  {
    title: "Core Web Vitals: How We Hit 100 on Real Projects",
    slug: "core-web-vitals-100",
    excerpt:
      "Perfect Lighthouse scores aren't a vanity metric — they're revenue. Our practical checklist for shipping genuinely fast websites.",
    content: body(
      "A one-second delay in load time can cut conversions by 7%. Performance isn't an engineering nicety — it's a business lever.",
      [
        ["Images are usually the culprit", "Modern formats, correct sizing, lazy loading, and priority hints for the hero. Next/image handles most of this if you configure it right."],
        ["Ship less JavaScript", "Code-split aggressively, defer non-critical scripts, and lean on server components. The fastest JS is the JS you never send."],
        ["Measure real users", "Lab scores are a start; field data from real users is the truth. We monitor Core Web Vitals in production continuously."],
      ],
    ),
    category: "Technology",
    tags: ["Performance", "SEO", "Web Vitals", "Next.js"],
    featuredImage: img("1460925895917-afdab827c52f"),
    author: "Priya Nair",
    authorRole: "Performance Engineer",
    authorAvatar: img("1438761681033-6461ffad8d80", 200),
    status: "published",
    featured: false,
    readingTime: 6,
    publishedAt: "2026-03-10T09:00:00.000Z",
  },
  {
    title: "From Idea to App Store in 6 Weeks",
    slug: "idea-to-app-store-6-weeks",
    excerpt:
      "A behind-the-scenes look at our rapid mobile development process — how we take a founder's idea to a shipped React Native app in six weeks.",
    content: body(
      "Speed is a feature. Here's exactly how we compress months of typical mobile development into a focused six-week sprint.",
      [
        ["Week 1–2: Design & foundation", "Discovery, user flows, a clickable prototype, and the app skeleton with navigation and design system in place."],
        ["Week 3–4: Core features", "We build the features that matter most first, shipping to TestFlight so stakeholders test on real devices from day one."],
        ["Week 5–6: Polish & launch", "Performance, edge cases, store assets, and submission. We handle the entire App Store and Play Store process for you."],
      ],
    ),
    category: "Business",
    tags: ["Mobile", "React Native", "Product", "Startups"],
    featuredImage: img("1512941937669-90a1b58e7e9c"),
    author: "Aria Chen",
    authorRole: "Lead Product Designer",
    authorAvatar: img("1494790108377-be9c29b29330", 200),
    status: "published",
    featured: false,
    readingTime: 5,
    publishedAt: "2026-02-22T09:00:00.000Z",
  },
];

/* ------------------------------------------------------------------ *
 *  PORTFOLIO
 * ------------------------------------------------------------------ */
export const seedPortfolio: Portfolio[] = [
  {
    title: "Northwind — Fintech Platform",
    slug: "northwind-fintech",
    category: "Web App",
    summary:
      "A complete banking dashboard and onboarding experience for a fast-growing fintech, built on Next.js and Node.",
    coverImage: img("1551288049-bebda4e38f71"),
    images: [img("1460925895917-afdab827c52f"), img("1518186285589-2f7649de83e0")],
    techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Stripe"],
    liveDemo: "#",
    github: "#",
    client: "Northwind",
    duration: "10 weeks",
    year: "2026",
    caseStudy:
      "Northwind needed to replace a clunky legacy dashboard. We designed and built a real-time banking platform that cut support tickets by 40% and doubled activation.",
    featured: true,
  },
  {
    title: "Lumen — AI Writing Assistant",
    slug: "lumen-ai-assistant",
    category: "AI Product",
    summary:
      "An LLM-powered writing tool with RAG over the user's knowledge base, streaming responses, and a delightful editor.",
    coverImage: img("1620712943543-bcc4688e7485"),
    images: [img("1526374965328-7f61d4dc18c5"), img("1555066931-4365d14bab8c")],
    techStack: ["React", "Claude", "LangChain", "Vector DB", "Node.js"],
    liveDemo: "#",
    client: "Lumen",
    duration: "8 weeks",
    year: "2026",
    caseStudy:
      "We built Lumen's core AI experience from scratch — retrieval, evals, and a streaming editor that feels instant. It launched to 10k users in its first month.",
    featured: true,
  },
  {
    title: "Vertex — E-commerce Storefront",
    slug: "vertex-ecommerce",
    category: "E-commerce",
    summary:
      "A headless Shopify storefront with custom checkout and a conversion rate 32% above the industry average.",
    coverImage: img("1556742049-0cfed4f6a45d"),
    images: [img("1441986300917-64674bd600d8"), img("1472851294608-062f824d29cc")],
    techStack: ["Next.js", "Shopify", "Hydrogen", "Tailwind"],
    liveDemo: "#",
    client: "Vertex",
    duration: "6 weeks",
    year: "2025",
    caseStudy:
      "Vertex's conversion rate jumped 32% after we rebuilt their storefront headless — faster pages, a smoother checkout, and a brand that finally matched their product.",
    featured: true,
  },
  {
    title: "Aperture — Photography Portfolio",
    slug: "aperture-portfolio",
    category: "Website",
    summary:
      "An immersive, motion-rich portfolio site for an award-winning photography studio.",
    coverImage: img("1452587925148-ce544e77e70d"),
    images: [img("1500648767791-00dcc994a43e"), img("1470071459604-3b5ec3a7fe05")],
    techStack: ["Next.js", "GSAP", "Framer Motion"],
    liveDemo: "#",
    client: "Aperture Studio",
    duration: "4 weeks",
    year: "2025",
    caseStudy:
      "We gave Aperture a portfolio worthy of their work — buttery scroll animations, full-bleed galleries, and load times under a second.",
    featured: false,
  },
  {
    title: "Monolith — SaaS Marketing Site",
    slug: "monolith-marketing",
    category: "Website",
    summary:
      "A high-converting marketing site and design system for a developer-tools SaaS.",
    coverImage: img("1519389950473-47ba0277781c"),
    images: [img("1517245386807-bb43f82c33c4"), img("1504384308090-c894fdcc538d")],
    techStack: ["Next.js", "TypeScript", "Tailwind", "Sanity"],
    liveDemo: "#",
    client: "Monolith",
    duration: "5 weeks",
    year: "2025",
    caseStudy:
      "Monolith needed a site that spoke to developers. We built a fast, technical, beautifully animated marketing site that lifted signups by 58%.",
    featured: false,
  },
  {
    title: "Nimbus — Mobile Fitness App",
    slug: "nimbus-fitness",
    category: "Mobile App",
    summary:
      "A cross-platform fitness app with offline-first workouts, social features, and Apple Health integration.",
    coverImage: img("1571019613454-1cb2f99b2d8b"),
    images: [img("1517836357463-d25dfeac3438"), img("1534438327276-14e5300c3a48")],
    techStack: ["React Native", "Expo", "Node.js", "MongoDB"],
    liveDemo: "#",
    client: "Nimbus",
    duration: "7 weeks",
    year: "2024",
    caseStudy:
      "Nimbus shipped to both app stores in seven weeks. Offline-first architecture and slick motion earned it a 4.8-star rating out of the gate.",
    featured: false,
  },
];

/* ------------------------------------------------------------------ *
 *  TESTIMONIALS
 * ------------------------------------------------------------------ */
export const seedTestimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "CEO",
    company: "Northwind",
    photo: img("1494790108377-be9c29b29330", 200),
    rating: 5,
    review:
      "SETUPS WORKS delivered beyond our expectations. The platform they built cut our support load in half and our customers constantly compliment the design. A genuine partner.",
    showOnHome: true,
  },
  {
    name: "David Okafor",
    role: "Founder",
    company: "Lumen",
    photo: img("1507003211169-0a1dd7228f2d", 200),
    rating: 5,
    review:
      "They took our AI idea from napkin sketch to 10,000 users in a month. The engineering quality and attention to UX detail is on another level.",
    showOnHome: true,
  },
  {
    name: "Emily Zhang",
    role: "Head of Growth",
    company: "Vertex",
    photo: img("1438761681033-6461ffad8d80", 200),
    rating: 5,
    review:
      "Our conversion rate jumped 32% after the rebuild. Fast, communicative, and obsessed with quality. We won't work with anyone else.",
    showOnHome: true,
  },
  {
    name: "James Carter",
    role: "CTO",
    company: "Monolith",
    photo: img("1633332755192-727a05c4013d", 200),
    rating: 5,
    review:
      "As a technical founder I'm hard to impress. SETUPS WORKS impressed me — clean architecture, thoughtful decisions, and a site that developers actually love.",
    showOnHome: true,
  },
  {
    name: "Olivia Brooks",
    role: "Marketing Director",
    company: "Aperture Studio",
    photo: img("1544005313-94ddf0286df2", 200),
    rating: 5,
    review:
      "The animations, the polish, the speed — everything about our new site feels premium. It perfectly represents our brand. Worth every penny.",
    showOnHome: true,
  },
  {
    name: "Michael Reyes",
    role: "Product Lead",
    company: "Nimbus",
    photo: img("1519345182560-3f2917c472ef", 200),
    rating: 5,
    review:
      "Six weeks from idea to a 4.8-star app in both stores. Their mobile process is a well-oiled machine. Highly recommend.",
    showOnHome: true,
  },
];
