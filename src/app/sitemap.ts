import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { services } from "@/data/services";
import { getAllBlogSlugs, getPortfolio, getProducts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/products",
    "/portfolio",
    "/case-studies",
    "/blog",
    "/careers",
    "/contact",
    "/search",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const [blogSlugs, portfolio, products] = await Promise.all([
    getAllBlogSlugs(),
    getPortfolio(),
    getProducts(),
  ]);

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const portfolioRoutes = portfolio.flatMap((p) => [
    { url: `${base}/portfolio/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    ...(p.caseStudy ? [{ url: `${base}/case-studies/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }] : []),
  ]);

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...blogRoutes,
    ...portfolioRoutes,
    ...productRoutes,
  ];
}
