import { connectDB } from "@/lib/db";
import {
  Blog,
  Product,
  Portfolio,
  Testimonial,
  ClientLogo,
  Settings,
  Milestone,
} from "@/models";
import { journey as defaultJourney } from "@/data/site-content";
import type {
  Blog as TBlog,
  Product as TProduct,
  Portfolio as TPortfolio,
  Testimonial as TTestimonial,
  ClientLogo as TClientLogo,
  Milestone as TMilestone,
  SiteSettings,
  Founder,
  Paginated,
} from "@/lib/types";

const DEFAULT_FOUNDER: Founder = {
  name: "Nitheesh R.",
  role: "Founder & Principal Engineer",
  handle: "setupsworks",
  status: "Available",
  photo: "",
  quote:
    "I started Setups Works because I was tired of seeing great ideas ruined by mediocre execution. We treat every project like it's our own product.",
};

/** Deep-serialize a Mongoose lean doc to a plain JSON object. */
function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

const emptyPage = <T>(page = 1, limit = 9): Paginated<T> => ({
  items: [],
  total: 0,
  page,
  pages: 1,
  limit,
});

/* ----------------------------- BLOGS ----------------------------- */
interface BlogQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

export async function getBlogs(q: BlogQuery = {}): Promise<Paginated<TBlog>> {
  const page = Math.max(1, q.page ?? 1);
  const limit = q.limit ?? 9;
  const conn = await connectDB();
  if (!conn) return emptyPage<TBlog>(page, limit);

  const filter: Record<string, unknown> = { status: "published" };
  if (q.category && q.category !== "All") filter.category = q.category;
  if (q.tag) filter.tags = q.tag;
  if (q.featured) filter.featured = true;
  if (q.search) filter.$text = { $search: q.search };

  const total = await Blog.countDocuments(filter);
  const items = await Blog.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    items: serialize<TBlog[]>(items),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}

export async function getBlogBySlug(slug: string): Promise<TBlog | null> {
  const conn = await connectDB();
  if (!conn) return null;
  const doc = await Blog.findOne({ slug }).lean();
  return doc ? serialize<TBlog>(doc) : null;
}

export async function getRelatedBlogs(blog: TBlog, limit = 3): Promise<TBlog[]> {
  const { items } = await getBlogs({ limit: 20 });
  return items
    .filter((b) => b.slug !== blog.slug)
    .sort((a, b) => {
      const score = (x: TBlog) =>
        (x.category === blog.category ? 2 : 0) +
        x.tags.filter((t) => blog.tags.includes(t)).length;
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export async function getFeaturedBlogs(limit = 3): Promise<TBlog[]> {
  const { items } = await getBlogs({ featured: true, limit });
  if (items.length >= limit) return items;
  const { items: recent } = await getBlogs({ limit });
  return recent.slice(0, limit);
}

export async function getBlogCategories(): Promise<string[]> {
  const { items } = await getBlogs({ limit: 200 });
  return ["All", ...Array.from(new Set(items.map((b) => b.category)))];
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const { items } = await getBlogs({ limit: 500 });
  return items.map((b) => b.slug);
}

/* ---------------------------- PRODUCTS --------------------------- */
export async function getProducts(): Promise<TProduct[]> {
  const conn = await connectDB();
  if (!conn) return [];
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  return serialize<TProduct[]>(docs);
}

export async function getProductBySlug(slug: string): Promise<TProduct | null> {
  const conn = await connectDB();
  if (!conn) return null;
  const doc = await Product.findOne({ slug }).lean();
  return doc ? serialize<TProduct>(doc) : null;
}

/* --------------------------- PORTFOLIO --------------------------- */
export async function getPortfolio(category?: string): Promise<TPortfolio[]> {
  const conn = await connectDB();
  if (!conn) return [];
  const docs = await Portfolio.find().sort({ createdAt: -1 }).lean();
  let items = serialize<TPortfolio[]>(docs);
  if (category && category !== "All")
    items = items.filter((p) => p.category === category);
  return items;
}

export async function getPortfolioBySlug(slug: string): Promise<TPortfolio | null> {
  const conn = await connectDB();
  if (!conn) return null;
  const doc = await Portfolio.findOne({ slug }).lean();
  return doc ? serialize<TPortfolio>(doc) : null;
}

export async function getPortfolioCategories(): Promise<string[]> {
  const items = await getPortfolio();
  return ["All", ...Array.from(new Set(items.map((p) => p.category)))];
}

/* ---------------------------- SETTINGS --------------------------- */
export async function getSettings(): Promise<SiteSettings> {
  const conn = await connectDB();
  if (!conn) return {};
  const doc = await Settings.findOne({ key: "site" }).lean();
  return doc ? serialize<SiteSettings>(doc) : {};
}

export async function getFounder(): Promise<Founder> {
  const settings = await getSettings();
  return { ...DEFAULT_FOUNDER, ...(settings.founder ?? {}) };
}

/** Timeline milestones — DB-managed, falling back to the built-in journey. */
export async function getTimeline(): Promise<TMilestone[]> {
  const conn = await connectDB();
  if (conn) {
    const docs = await Milestone.find().sort({ order: 1, year: 1 }).lean();
    if (docs.length) return serialize<TMilestone[]>(docs);
  }
  return defaultJourney.map((j, i) => ({ ...j, order: i }));
}

/* -------------------------- CLIENT LOGOS ------------------------- */
export async function getClientLogos(): Promise<TClientLogo[]> {
  const conn = await connectDB();
  if (!conn) return [];
  const docs = await ClientLogo.find().sort({ order: 1, createdAt: 1 }).lean();
  return serialize<TClientLogo[]>(docs);
}

/* -------------------------- TESTIMONIALS ------------------------- */
export async function getTestimonials(homeOnly = false): Promise<TTestimonial[]> {
  const conn = await connectDB();
  if (!conn) return [];
  const docs = await Testimonial.find().sort({ createdAt: -1 }).lean();
  let items = serialize<TTestimonial[]>(docs);
  if (homeOnly) items = items.filter((t) => t.showOnHome);
  return items;
}
