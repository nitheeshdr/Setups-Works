import type { Model } from "mongoose";
import { z, type ZodType } from "zod";
import { revalidatePath } from "next/cache";
import { requireDB } from "@/lib/db";
import {
  ok,
  created,
  parseBody,
  requireAuth,
  serverError,
  notFoundResponse,
  parseListParams,
} from "@/lib/api-utils";
import { slugify } from "@/lib/helpers";

interface ResourceOptions<T> {
  model: Model<T>;
  createSchema: ZodType;
  updateSchema: ZodType;
  searchFields?: string[];
  /** Field to auto-slug from when slug is missing (e.g. "title" or "name"). */
  slugFrom?: string;
  /** Transform doc before save (e.g. compute readingTime, publishedAt). */
  transform?: (data: Record<string, unknown>) => Record<string, unknown>;
  /** Sort applied when the request doesn't specify one (default "-createdAt"). */
  defaultSort?: string;
}

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export function createResource<T>(opts: ResourceOptions<T>) {
  const { model, createSchema, updateSchema, searchFields = [], slugFrom, transform, defaultSort } = opts;

  async function ensureSlug(data: Record<string, unknown>, currentId?: string) {
    if (!slugFrom) return data;
    let base = (data.slug as string) || slugify(String(data[slugFrom] ?? ""));
    if (!base) return data;
    let slug = base;
    let n = 1;
    // Ensure uniqueness
    while (
      await model.exists({
        slug,
        ...(currentId ? { _id: { $ne: currentId } } : {}),
      })
    ) {
      slug = `${base}-${n++}`;
    }
    return { ...data, slug };
  }

  // GET list + POST create
  async function list(req: Request) {
    const { error } = await requireAuth();
    if (error) return error;
    const { page, limit, search, category, status, sort } = parseListParams(req);
    const hasSortParam = new URL(req.url).searchParams.has("sort");
    const effectiveSort = hasSortParam ? sort : (defaultSort ?? sort);

    try {
      await requireDB();
      const filter: Record<string, unknown> = {};
      if (search && searchFields.length) {
        filter.$or = searchFields.map((f) => ({ [f]: new RegExp(search, "i") }));
      }
      if (category && category !== "All") filter.category = category;
      if (status && status !== "All") filter.status = status;

      const total = await model.countDocuments(filter);
      const items = await model
        .find(filter)
        .sort(effectiveSort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return ok({
        items: serialize(items),
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit)),
        limit,
      });
    } catch (err) {
      console.error("[crud.list]", err);
      return serverError();
    }
  }

  async function create(req: Request) {
    const { error } = await requireAuth();
    if (error) return error;
    const { data, error: bodyErr } = await parseBody(req, createSchema as ZodType<Record<string, unknown>>);
    if (bodyErr) return bodyErr;

    try {
      await requireDB();
      let payload = transform ? transform({ ...data }) : { ...data };
      payload = await ensureSlug(payload);
      const doc = await model.create(payload as never);
      revalidatePath("/", "layout");
      return created(serialize(doc));
    } catch (err) {
      console.error("[crud.create]", err);
      return serverError("Could not create record.");
    }
  }

  // GET one + PUT update + DELETE
  async function getOne(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { error } = await requireAuth();
    if (error) return error;
    const { id } = await ctx.params;
    try {
      await requireDB();
      const doc = await model.findById(id).lean();
      if (!doc) return notFoundResponse();
      return ok(serialize(doc));
    } catch (err) {
      console.error("[crud.getOne]", err);
      return serverError();
    }
  }

  async function update(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { error } = await requireAuth();
    if (error) return error;
    const { id } = await ctx.params;
    const { data, error: bodyErr } = await parseBody(req, updateSchema as ZodType<Record<string, unknown>>);
    if (bodyErr) return bodyErr;

    try {
      await requireDB();
      let payload = transform ? transform({ ...data }) : { ...data };
      payload = await ensureSlug(payload, id);
      const doc = await model.findByIdAndUpdate(id, payload as never, {
        new: true,
        runValidators: true,
      }).lean();
      if (!doc) return notFoundResponse();
      revalidatePath("/", "layout");
      return ok(serialize(doc));
    } catch (err) {
      console.error("[crud.update]", err);
      return serverError("Could not update record.");
    }
  }

  async function remove(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { error } = await requireAuth();
    if (error) return error;
    const { id } = await ctx.params;
    try {
      await requireDB();
      await model.findByIdAndDelete(id);
      revalidatePath("/", "layout");
      return ok({ success: true });
    } catch (err) {
      console.error("[crud.remove]", err);
      return serverError();
    }
  }

  return { list, create, getOne, update, remove };
}

// Shared field schemas
export const blogCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().min(2),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().default(""),
  author: z.string().default("Setups Works"),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional(),
});
export const blogUpdateSchema = blogCreateSchema.partial();

export const productCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  tagline: z.string().default(""),
  description: z.string().min(1),
  content: z.string().default(""),
  logo: z.string().default(""),
  banner: z.string().default(""),
  screenshots: z.array(z.string()).default([]),
  features: z.array(z.object({ title: z.string(), description: z.string(), icon: z.string().optional() })).default([]),
  technologies: z.array(z.string()).default([]),
  category: z.string().default("Software"),
  status: z.enum(["coming-soon", "beta", "live", "archived"]).default("coming-soon"),
  version: z.string().optional(),
  downloadLink: z.string().optional(),
  githubLink: z.string().optional(),
  docsLink: z.string().optional(),
  releaseNotes: z.string().optional(),
});
export const productUpdateSchema = productCreateSchema.partial();

export const portfolioCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  category: z.string().min(1),
  summary: z.string().default(""),
  coverImage: z.string().default(""),
  images: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  liveDemo: z.string().optional(),
  github: z.string().optional(),
  client: z.string().default(""),
  duration: z.string().default(""),
  year: z.string().default(""),
  caseStudy: z.string().optional(),
  featured: z.boolean().default(false),
});
export const portfolioUpdateSchema = portfolioCreateSchema.partial();

export const milestoneCreateSchema = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  order: z.number().default(0),
});
export const milestoneUpdateSchema = milestoneCreateSchema.partial();

export const clientLogoCreateSchema = z.object({
  name: z.string().min(1),
  logo: z.string().default(""),
  url: z.string().optional(),
  order: z.number().default(0),
});
export const clientLogoUpdateSchema = clientLogoCreateSchema.partial();

export const testimonialCreateSchema = z.object({
  name: z.string().min(2),
  role: z.string().default(""),
  company: z.string().default(""),
  photo: z.string().default(""),
  rating: z.number().min(1).max(5).default(5),
  review: z.string().min(2),
  showOnHome: z.boolean().default(true),
});
export const testimonialUpdateSchema = testimonialCreateSchema.partial();
