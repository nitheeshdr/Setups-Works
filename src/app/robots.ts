import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/search` is deliberately NOT disallowed. It already sends
        // `robots: { index: false }`, and a crawler blocked by robots.txt can
        // never fetch the page to see that header — which is how a blocked URL
        // ends up indexed anyway, as a bare link with no snippet. Letting it be
        // crawled is what actually keeps it out of the index, and it keeps the
        // WebSite SearchAction target reachable.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
