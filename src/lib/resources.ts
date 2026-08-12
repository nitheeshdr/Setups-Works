import { Blog, Product, Portfolio, Service, Testimonial, ClientLogo, Milestone, TeamMember } from "@/models";
import {
  createResource,
  blogCreateSchema,
  blogUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
  portfolioCreateSchema,
  portfolioUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  clientLogoCreateSchema,
  clientLogoUpdateSchema,
  milestoneCreateSchema,
  milestoneUpdateSchema,
  teamMemberCreateSchema,
  teamMemberUpdateSchema,
} from "@/lib/crud";
import { readingTime } from "@/lib/helpers";

export const blogHandlers = createResource({
  model: Blog,
  createSchema: blogCreateSchema,
  updateSchema: blogUpdateSchema,
  searchFields: ["title", "excerpt", "category"],
  slugFrom: "title",
  // Drafts stay unlisted; only published posts get announced.
  urlPaths: (d) =>
    d.status === "published" && d.slug
      ? [`/blog/${d.slug}`, "/blog", "/"]
      : [],
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
  urlPaths: (d) => (d.slug ? [`/products/${d.slug}`, "/products", "/"] : []),
});

export const portfolioHandlers = createResource({
  model: Portfolio,
  createSchema: portfolioCreateSchema,
  updateSchema: portfolioUpdateSchema,
  searchFields: ["title", "summary", "client", "category"],
  slugFrom: "title",
  urlPaths: (d) =>
    d.slug
      ? [
          `/portfolio/${d.slug}`,
          "/portfolio",
          "/",
          ...(d.caseStudy ? [`/case-studies/${d.slug}`, "/case-studies"] : []),
        ]
      : [],
});

export const serviceHandlers = createResource({
  model: Service,
  createSchema: serviceCreateSchema,
  updateSchema: serviceUpdateSchema,
  searchFields: ["title", "short", "description", "category"],
  slugFrom: "title",
  // Services drive the mega menu and the /services index, so a published change
  // affects those alongside its own page.
  defaultSort: "order",
  urlPaths: (d) =>
    d.status === "published" && d.slug
      ? [`/services/${d.slug}`, "/services", "/"]
      : [],
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

export const teamMemberHandlers = createResource({
  model: TeamMember,
  createSchema: teamMemberCreateSchema,
  updateSchema: teamMemberUpdateSchema,
  searchFields: ["name", "role", "short"],
  slugFrom: "name",
  defaultSort: "order",
  // Drafts have no public URL, so nothing is submitted for them.
  urlPaths: (d) =>
    d.slug && d.status !== "draft" ? [`/team/${d.slug}`, "/team", "/about"] : [],
});
