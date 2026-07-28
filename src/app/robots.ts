import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Paths no crawler should fetch.
 *
 * `/search` is deliberately absent. It already sends `robots: { index: false }`,
 * and a crawler blocked by robots.txt can never fetch the page to see that —
 * which is exactly how a blocked URL ends up indexed anyway, as a bare link with
 * no snippet. Letting it be crawled is what actually keeps it out of the index,
 * and it keeps the WebSite SearchAction target reachable.
 */
const DISALLOW = ["/admin", "/api/"];

/**
 * IMPORTANT: a crawler obeys exactly one group — the most specific one matching
 * its token — and ignores every other, including `*`. So naming a crawler means
 * repeating the disallow list for it; omitting it would grant that crawler
 * access to /admin and /api/ that the wildcard group denies. Hence DISALLOW is
 * shared rather than written out per group.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        // Controls whether the site may be used to ground and train Gemini and
        // Vertex AI. Allowed on purpose: being quotable in AI answers is
        // distribution, and this business needs discovery more than it needs to
        // withhold marketing copy. Flip to `disallow: ["/"]` to opt out.
        userAgent: "Google-Extended",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        // Search Console's URL Inspection fetcher. Explicitly allowed so a live
        // test reflects what Googlebot sees rather than a different ruleset.
        userAgent: "Google-InspectionTool",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
