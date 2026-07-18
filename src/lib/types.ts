export type BlogStatus = "draft" | "published" | "scheduled";
export type ProductStatus = "coming-soon" | "beta" | "live" | "archived";

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
