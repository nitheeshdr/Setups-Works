import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { AI_CRAWLER_AGENTS } from "@/lib/crawlers";

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
/**
 * Answer-engine crawlers, named explicitly.
 *
 * They already fall under `*` and are allowed by it, so this changes no
 * behaviour — it states the policy. Two reasons to spell it out: an operator
 * reviewing the file can see the answer without reasoning about wildcard
 * precedence, and a future tightening of `*` won't silently revoke access to
 * the engines this business actually wants to be quoted in.
 *
 * The list lives in lib/crawlers.ts alongside the tokens the proxy logs on, so
 * an agent allowed here always shows up in the admin crawler log too. They were
 * separate literals before, which is how a bot could be allowed but invisible.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
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
