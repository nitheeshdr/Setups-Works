import { connectDB } from "@/lib/db";
import { Blog, Product, Portfolio, Testimonial } from "@/models";
import {
  seedBlogs,
  seedProducts,
  seedPortfolio,
  seedTestimonials,
} from "@/data/seed-content";
import type {
  Blog as TBlog,
  Product as TProduct,
  Portfolio as TPortfolio,
  Testimonial as TTestimonial,
  Paginated,
} from "@/lib/types";

/** Deep-serialize a Mongoose lean doc to a plain JSON object. */
function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

async function db() {
  return connectDB();
}

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
  const conn = await db();

  if (conn && (await Blog.estimatedDocumentCount()) > 0) {
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

  // Seed fallback
  let items = seedBlogs.filter((b) => b.status === "published");
  if (q.category && q.category !== "All")
    items = items.filter((b) => b.category === q.category);
  if (q.tag) items = items.filter((b) => b.tags.includes(q.tag!));
  if (q.featured) items = items.filter((b) => b.featured);
  if (q.search) {
    const s = q.search.toLowerCase();
    items = items.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.excerpt.toLowerCase().includes(s) ||
        b.tags.some((t) => t.toLowerCase().includes(s)),
    );
  }
  const total = items.length;
  const paged = items.slice((page - 1) * limit, page * limit);
  return {
    items: paged,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}

export async function getBlogBySlug(slug: string): Promise<TBlog | null> {
  const conn = await db();
  if (conn) {
    const doc = await Blog.findOne({ slug }).lean();
    if (doc) return serialize<TBlog>(doc);
  }
  return seedBlogs.find((b) => b.slug === slug) ?? null;
}

export async function getRelatedBlogs(
  blog: TBlog,
  limit = 3,
): Promise<TBlog[]> {
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
  const { items } = await getBlogs({ limit: 100 });
  return ["All", ...Array.from(new Set(items.map((b) => b.category)))];
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const { items } = await getBlogs({ limit: 500 });
  return items.map((b) => b.slug);
}

/* ---------------------------- PRODUCTS --------------------------- */
export async function getProducts(): Promise<TProduct[]> {
  const conn = await db();
  if (conn && (await Product.estimatedDocumentCount()) > 0) {
    const docs = await Product.find().sort({ createdAt: -1 }).lean();
    return serialize<TProduct[]>(docs);
  }
  return seedProducts;
}

export async function getProductBySlug(slug: string): Promise<TProduct | null> {
  const conn = await db();
  if (conn) {
    const doc = await Product.findOne({ slug }).lean();
    if (doc) return serialize<TProduct>(doc);
  }
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

/* --------------------------- PORTFOLIO --------------------------- */
export async function getPortfolio(category?: string): Promise<TPortfolio[]> {
  const conn = await db();
  let items: TPortfolio[];
  if (conn && (await Portfolio.estimatedDocumentCount()) > 0) {
    const docs = await Portfolio.find().sort({ createdAt: -1 }).lean();
    items = serialize<TPortfolio[]>(docs);
  } else {
    items = seedPortfolio;
  }
  if (category && category !== "All")
    items = items.filter((p) => p.category === category);
  return items;
}

export async function getPortfolioBySlug(
  slug: string,
): Promise<TPortfolio | null> {
  const conn = await db();
  if (conn) {
    const doc = await Portfolio.findOne({ slug }).lean();
    if (doc) return serialize<TPortfolio>(doc);
  }
  return seedPortfolio.find((p) => p.slug === slug) ?? null;
}

export async function getPortfolioCategories(): Promise<string[]> {
  const items = await getPortfolio();
  return ["All", ...Array.from(new Set(items.map((p) => p.category)))];
}

/* -------------------------- TESTIMONIALS ------------------------- */
export async function getTestimonials(homeOnly = false): Promise<TTestimonial[]> {
  const conn = await db();
  let items: TTestimonial[];
  if (conn && (await Testimonial.estimatedDocumentCount()) > 0) {
    const docs = await Testimonial.find().sort({ createdAt: -1 }).lean();
    items = serialize<TTestimonial[]>(docs);
  } else {
    items = seedTestimonials;
  }
  if (homeOnly) items = items.filter((t) => t.showOnHome);
  return items;
}
