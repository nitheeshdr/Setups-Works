export type BlogStatus = "draft" | "published" | "scheduled";
export type ProductStatus = "coming-soon" | "beta" | "live" | "archived";
export type ServiceCategory =
  | "Development"
  | "Design"
  | "Growth"
  | "Platforms"
  | "Intelligence";

/** One numbered step in a service's delivery process. */
export interface ServiceProcessStep {
  title: string;
  description: string;
}

/** A question/answer pair rendered on the service page and as FAQ schema. */
export interface ServiceFaq {
  question: string;
  answer: string;
}

/** A headline metric ("40%", "faster load times"). */
export interface ServiceOutcome {
  value: string;
  label: string;
}

export interface Service {
  _id?: string;
  slug: string;
  title: string;
  /** One-liner used on cards and in the mega menu. */
  short: string;
  /** Plain-text summary used for meta descriptions and card bodies. */
  description: string;
  /**
   * Icon *name*, resolved through `resolveServiceIcon`. Stored as a string
   * because a FontAwesome IconDefinition can't round-trip through Mongo.
   */
  icon: string;
  category: ServiceCategory;
  features: string[];
  deliverables: string[];

  /* --- Rich detail-page fields (all optional; the page degrades cleanly) --- */
  /** Rich-text HTML body rendered as the main article on the detail page. */
  content?: string;
  /** Longer plain-text intro shown above the fold. */
  overview?: string;
  process?: ServiceProcessStep[];
  faqs?: ServiceFaq[];
  outcomes?: ServiceOutcome[];
  techStack?: string[];
  /** Who this is for — bullet list. */
  idealFor?: string[];
  startingPrice?: string;
  timeline?: string;
  heroImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Controls ordering within a category; lower sorts first. */
  order?: number;
  featured?: boolean;
  status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  status: BlogStatus;
  featured?: boolean;
  readingTime: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  content?: string;
  logo: string;
  banner: string;
  screenshots: string[];
  features: { title: string; description: string; icon?: string }[];
  technologies: string[];
  category: string;
  status: ProductStatus;
  version?: string;
  downloadLink?: string;
  githubLink?: string;
  docsLink?: string;
  releaseNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Portfolio {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImage: string;
  images: string[];
  techStack: string[];
  liveDemo?: string;
  github?: string;
  client: string;
  duration: string;
  year: string;
  caseStudy?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  rating: number;
  review: string;
  showOnHome?: boolean;
  createdAt?: string;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  budget?: string;
  subject: string;
  message: string;
  replied: boolean;
  createdAt?: string;
}

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phonenumber: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  /** Perfex numeric country id. */
  country?: string;
  countryName?: string;
  zip?: string;
  type: "quotation" | "enquiry";
  service?: string;
  budget?: string;
  message?: string;
  source?: string;
  crmStatus: "pending" | "synced" | "failed";
  crmError?: string;
  emailStatus: "pending" | "sent" | "failed";
  handled?: boolean;
  createdAt?: string;
}

export interface Subscriber {
  _id?: string;
  email: string;
  createdAt?: string;
}

export interface ClientLogo {
  _id?: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
  createdAt?: string;
}

export interface Milestone {
  _id?: string;
  year: string;
  title: string;
  description: string;
  order: number;
  createdAt?: string;
}

export interface Founder {
  name: string;
  role: string;
  handle?: string;
  status?: string;
  photo?: string;
  quote?: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
}

export interface SiteSettings {
  siteName?: string;
  tagline?: string;
  description?: string;
  logoLight?: string;
  logoDark?: string;
  email?: string;
  phone?: string;
  location?: string;
  social?: Record<string, string>;
  founder?: Founder;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}
