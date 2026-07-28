import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import {
  getBlogs,
  getPortfolio,
  getProducts,
  getServices,
} from "@/lib/content";

export const revalidate = 3600;

const base = siteConfig.url;

/**
 * Single sitemap served at /sitemap.xml, covering every static page and every
 * dynamic item (services, blog posts, portfolio, case studies, products).
 *
 * Note: we intentionally do NOT use `generateSitemaps` here. In Next 16 that
 * emits per-section files at /sitemap/<id>.xml but never serves the root
 * /sitemap.xml index (it 404s), which breaks robots.txt and Search Console.
 * A single file is well within Google's 50,000-URL limit for this site.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [{ items: blogs }, portfolio, products, services] = await Promise.all([
    getBlogs({ limit: 1000 }),
    getPortfolio(),
    getProducts(),
    getServices(),
  ]);

  const pages: MetadataRoute.Sitemap = [
    { path: "", priority: 1, freq: "daily" as const },
    // The conversion page every "Start a project" CTA points at — it was
    // missing here entirely, so it only reached Google via internal links.
    { path: "/get-started", priority: 0.9, freq: "monthly" as const },
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
    // Bare `${base}` for the homepage is deliberate: Next normalizes the
    // `canonical: "/"` alternate to a trailing-slash-free URL, so this is what
    // matches the tag the page actually emits. Don't "fix" this to `${base}/`.
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt || b.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolio.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: new Date(p.createdAt || now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = portfolio
    .filter((p) => p.caseStudy)
    .map((p) => ({
      url: `${base}/case-studies/${p.slug}`,
      lastModified: new Date(p.createdAt || now),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt || now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...pages,
    ...serviceRoutes,
    ...blogRoutes,
    ...portfolioRoutes,
    ...caseStudyRoutes,
    ...productRoutes,
  ];
}
