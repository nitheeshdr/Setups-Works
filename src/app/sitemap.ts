import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { services } from "@/data/services";
import { getBlogs, getPortfolio, getProducts } from "@/lib/content";

export const revalidate = 3600;

const base = siteConfig.url;

/**
 * Split the sitemap into one file per content type. Next generates a sitemap
 * INDEX at /sitemap.xml that points to each section at /sitemap/<id>.xml
 * (e.g. /sitemap/blog.xml). This keeps each file small, lets crawlers fetch
 * only what changed, and scales past Google's 50,000-URL-per-file limit.
 */
export async function generateSitemaps() {
  return [
    { id: "pages" },
    { id: "services" },
    { id: "blog" },
    { id: "portfolio" },
    { id: "case-studies" },
    { id: "products" },
  ];
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const section = await id;
  const now = new Date();

  switch (section) {
    case "pages":
      return pageRoutes(now);
    case "services":
      return serviceRoutes(now);
    case "blog":
      return blogRoutes(now);
    case "portfolio":
      return portfolioRoutes(now);
    case "case-studies":
      return caseStudyRoutes(now);
    case "products":
      return productRoutes(now);
    default:
      return [];
  }
}

/* ------------------------------ Static pages --------------------------- */
function pageRoutes(now: Date): MetadataRoute.Sitemap {
  return [
    { path: "", priority: 1, freq: "daily" as const },
    { path: "/about", priority: 0.9, freq: "monthly" as const },
    { path: "/services", priority: 0.9, freq: "monthly" as const },
    { path: "/products", priority: 0.9, freq: "weekly" as const },
    { path: "/portfolio", priority: 0.9, freq: "weekly" as const },
    { path: "/case-studies", priority: 0.8, freq: "weekly" as const },
    { path: "/blog", priority: 0.9, freq: "daily" as const },
    { path: "/careers", priority: 0.7, freq: "weekly" as const },
    { path: "/contact", priority: 0.8, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
  ].map(({ path, priority, freq }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}

/* -------------------------------- Services ----------------------------- */
function serviceRoutes(now: Date): MetadataRoute.Sitemap {
  return services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}

/* ---------------------------------- Blog ------------------------------- */
async function blogRoutes(now: Date): Promise<MetadataRoute.Sitemap> {
  const { items: blogs } = await getBlogs({ limit: 1000 });
  return blogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt || b.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

/* ------------------------------- Portfolio ----------------------------- */
async function portfolioRoutes(now: Date): Promise<MetadataRoute.Sitemap> {
  const portfolio = await getPortfolio();
  return portfolio.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: new Date(p.createdAt || now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}

/* ------------------------------ Case studies --------------------------- */
async function caseStudyRoutes(now: Date): Promise<MetadataRoute.Sitemap> {
  const portfolio = await getPortfolio();
  return portfolio
    .filter((p) => p.caseStudy)
    .map((p) => ({
      url: `${base}/case-studies/${p.slug}`,
      lastModified: new Date(p.createdAt || now),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
}

/* -------------------------------- Products ----------------------------- */
async function productRoutes(now: Date): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt || now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
