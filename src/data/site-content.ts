import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faRocket,
  faUsers,
  faStar,
  faTrophy,
  faMagnifyingGlass,
  faPenNib,
  faCode,
  faFlask,
  faLifeRing,
  faWandMagicSparkles,
  faShieldHalved,
  faBolt,
  faHandshakeAngle,
  faBullseye,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: IconDefinition;
}

export const stats: Stat[] = [
  { label: "Projects Delivered", value: 240, suffix: "+", icon: faRocket },
  { label: "Happy Clients", value: 120, suffix: "+", icon: faUsers },
  { label: "Avg. Client Rating", value: 4.9, suffix: "/5", icon: faStar },
  { label: "Years of Craft", value: 8, suffix: "+", icon: faTrophy },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: IconDefinition;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "We dig into your goals, users, and constraints — turning fuzzy ideas into a sharp, prioritized plan.",
    icon: faMagnifyingGlass,
  },
  {
    step: "02",
    title: "Design",
    description:
      "Research-driven UI/UX and design systems. Motion-rich prototypes you can click before a line of code.",
    icon: faPenNib,
  },
  {
    step: "03",
    title: "Build",
    description:
      "Clean, typed, tested code shipped in weekly increments. You see progress every single sprint.",
    icon: faCode,
  },
  {
    step: "04",
    title: "Test",
    description:
      "Automated + manual QA, performance budgets, and accessibility audits before anything ships.",
    icon: faFlask,
  },
  {
    step: "05",
    title: "Launch",
    description:
      "Zero-downtime deploys on modern edge infrastructure, with analytics and monitoring wired in.",
    icon: faRocket,
  },
  {
    step: "06",
    title: "Scale",
    description:
      "Ongoing iteration, optimization, and support. We grow the product alongside your business.",
    icon: faLifeRing,
  },
];

export interface TechGroup {
  group: string;
  items: { name: string; color?: string }[];
}

export const techStack: TechGroup[] = [
  {
    group: "Frontend",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
      { name: "GSAP" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "GraphQL" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
    ],
  },
  {
    group: "Mobile",
    items: [
      { name: "React Native" },
      { name: "Expo" },
      { name: "Swift" },
      { name: "Kotlin" },
    ],
  },
  {
    group: "AI & Cloud",
    items: [
      { name: "Claude" },
      { name: "OpenAI" },
      { name: "LangChain" },
      { name: "AWS" },
      { name: "Vercel" },
      { name: "Docker" },
    ],
  },
];

export interface WhyUs {
  title: string;
  description: string;
  icon: IconDefinition;
}

export const whyChooseUs: WhyUs[] = [
  {
    title: "Premium craft",
    description:
      "Every pixel and interaction is intentional. We obsess over the details that make products feel expensive.",
    icon: faWandMagicSparkles,
  },
  {
    title: "Ship fast, ship right",
    description:
      "Weekly increments and battle-tested processes mean you get to market faster — without cutting corners.",
    icon: faBolt,
  },
  {
    title: "Built to scale",
    description:
      "Clean architecture and typed codebases that your team can extend for years, not throw away in months.",
    icon: faShieldHalved,
  },
  {
    title: "True partnership",
    description:
      "We're an extension of your team — transparent, communicative, and invested in your outcomes.",
    icon: faHandshakeAngle,
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "How long does a typical project take?",
    answer:
      "Marketing sites usually take 3–5 weeks, web apps 6–12 weeks depending on scope. We work in weekly sprints so you see progress continuously and can adjust priorities as we go.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Every project is scoped individually. Landing pages start around $3k, full web apps range from $15k–$80k+. We'll give you a fixed, transparent quote after a discovery call — no surprises.",
  },
  {
    question: "Do you work with startups or only established companies?",
    answer:
      "Both. We've helped pre-seed startups launch their MVP and enterprises modernize legacy platforms. We tailor our process and pricing to your stage.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We offer ongoing maintenance and growth retainers — updates, monitoring, performance tuning, and new features. Many clients stay with us for years as their long-term product partner.",
  },
  {
    question: "Which technologies do you specialize in?",
    answer:
      "Our core stack is React, Next.js, Node.js, and the MERN stack, plus React Native for mobile and AI/LLM development. We also handle WordPress, WooCommerce, and Shopify builds.",
  },
  {
    question: "Do you sign NDAs and own IP transfer?",
    answer:
      "Absolutely. We're happy to sign an NDA before any discussion, and you own 100% of the code and IP we produce for you upon final payment.",
  },
];

export interface Value {
  title: string;
  description: string;
  icon: IconDefinition;
}

export const companyValues: Value[] = [
  {
    title: "Craft over quantity",
    description: "We'd rather ship one exceptional thing than ten mediocre ones.",
    icon: faWandMagicSparkles,
  },
  {
    title: "Radical transparency",
    description: "Honest timelines, honest pricing, honest feedback — always.",
    icon: faEye,
  },
  {
    title: "Outcomes, not output",
    description: "We measure success by your growth, not by hours logged.",
    icon: faBullseye,
  },
  {
    title: "Relentless curiosity",
    description: "We stay on the edge of technology so your product does too.",
    icon: faBolt,
  },
];

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export const journey: TimelineItem[] = [
  {
    year: "2017",
    title: "The beginning",
    description:
      "SETUPS WORKS started as a two-person studio building websites for local businesses out of a tiny apartment.",
  },
  {
    year: "2019",
    title: "Going full-stack",
    description:
      "We expanded into full product development — web apps, APIs, and our first mobile launches on the App Store.",
  },
  {
    year: "2021",
    title: "Scaling the team",
    description:
      "Grew to a distributed team of designers, engineers, and strategists serving clients across three continents.",
  },
  {
    year: "2023",
    title: "AI-first",
    description:
      "Launched our AI practice, building LLM-powered products and automation that create real leverage for clients.",
  },
  {
    year: "2025",
    title: "Building products",
    description:
      "Beyond client work, we began building our own products — starting with CodeForge AI, our developer platform.",
  },
];

export interface Client {
  name: string;
}

export const clients: Client[] = [
  { name: "Northwind" },
  { name: "Lumen" },
  { name: "Vertex" },
  { name: "Aperture" },
  { name: "Monolith" },
  { name: "Cobalt" },
  { name: "Skyline" },
  { name: "Quanta" },
  { name: "Nimbus" },
  { name: "Fathom" },
];

export interface JobOpening {
  slug: string;
  title: string;
  team: string;
  type: string;
  location: string;
  description: string;
}

export const jobOpenings: JobOpening[] = [
  {
    slug: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    team: "Engineering",
    type: "Full-time",
    location: "Remote",
    description:
      "Lead the frontend on premium client products using React, Next.js, and TypeScript. You care deeply about performance, motion, and craft.",
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    team: "Design",
    type: "Full-time",
    location: "Remote",
    description:
      "Own product design end-to-end — research, systems, hi-fi UI, and motion. Figma is your home; prototypes are your language.",
  },
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    team: "Intelligence",
    type: "Full-time",
    location: "Remote",
    description:
      "Build LLM-powered products and agents — RAG pipelines, evals, and Claude-driven tools that ship to production.",
  },
  {
    slug: "fullstack-engineer",
    title: "Full-Stack Engineer",
    team: "Engineering",
    type: "Contract",
    location: "Remote",
    description:
      "Ship full features across the MERN stack. Comfortable owning both the database schema and the pixel-perfect UI.",
  },
];

export const benefits = [
  "100% remote, async-friendly",
  "Top-of-market compensation",
  "4-day focus weeks",
  "Learning & conference budget",
  "Latest hardware, your choice",
  "Profit sharing",
];
