import { Blog, Product, Portfolio, Testimonial, ClientLogo, Milestone } from "@/models";
import {
  createResource,
  blogCreateSchema,
  blogUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
  portfolioCreateSchema,
  portfolioUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  clientLogoCreateSchema,
  clientLogoUpdateSchema,
  milestoneCreateSchema,
  milestoneUpdateSchema,
} from "@/lib/crud";
import { readingTime } from "@/lib/helpers";

export const blogHandlers = createResource({
  model: Blog,
  createSchema: blogCreateSchema,
  updateSchema: blogUpdateSchema,
  searchFields: ["title", "excerpt", "category"],
  slugFrom: "title",
  transform: (data) => {
    const out = { ...data };
    if (typeof out.content === "string") out.readingTime = readingTime(out.content);
    if (out.status === "published" && !out.publishedAt) {
      out.publishedAt = new Date().toISOString();
    }
    return out;
  },
});

export const productHandlers = createResource({
  model: Product,
  createSchema: productCreateSchema,
  updateSchema: productUpdateSchema,
  searchFields: ["name", "tagline", "category"],
  slugFrom: "name",
});

export const portfolioHandlers = createResource({
  model: Portfolio,
  createSchema: portfolioCreateSchema,
  updateSchema: portfolioUpdateSchema,
  searchFields: ["title", "summary", "client", "category"],
  slugFrom: "title",
});

export const testimonialHandlers = createResource({
  model: Testimonial,
  createSchema: testimonialCreateSchema,
  updateSchema: testimonialUpdateSchema,
  searchFields: ["name", "company", "review"],
});

export const clientLogoHandlers = createResource({
  model: ClientLogo,
  createSchema: clientLogoCreateSchema,
  updateSchema: clientLogoUpdateSchema,
  searchFields: ["name"],
  defaultSort: "order",
});

export const milestoneHandlers = createResource({
  model: Milestone,
  createSchema: milestoneCreateSchema,
  updateSchema: milestoneUpdateSchema,
  searchFields: ["year", "title"],
  defaultSort: "order",
});
