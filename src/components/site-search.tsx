"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import type { Blog, Portfolio, Product } from "@/lib/types";
import type { Service } from "@/data/services";

interface Result {
  type: string;
  title: string;
  description: string;
  href: string;
}

export function SiteSearch({
  initialQuery,
  blogs,
  services,
  portfolio,
  products,
}: {
  initialQuery: string;
  blogs: Blog[];
  services: Service[];
  portfolio: Portfolio[];
  products: Product[];
}) {
  const [query, setQuery] = useState(initialQuery);

  const index: Result[] = useMemo(
    () => [
      ...services.map((s) => ({
        type: "Service",
        title: s.title,
        description: s.short,
        href: `/services/${s.slug}`,
      })),
      ...blogs.map((b) => ({
        type: "Article",
        title: b.title,
        description: b.excerpt,
        href: `/blog/${b.slug}`,
      })),
      ...portfolio.map((p) => ({
        type: "Project",
        title: p.title,
        description: p.summary,
        href: `/portfolio/${p.slug}`,
      })),
      ...products.map((p) => ({
        type: "Product",
        title: p.name,
        description: p.tagline,
        href: `/products/${p.slug}`,
      })),
    ],
    [blogs, services, portfolio, products],
  );

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return index.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
    );
  }, [index, query]);

  return (
    <div>
      <div className="relative">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, articles, projects…"
          className="w-full rounded-2xl border border-border/60 bg-surface-2/60 py-4 pl-14 pr-5 text-lg outline-none transition-colors focus:border-brand-500/60"
        />
      </div>

      {query.trim() && (
        <p className="mt-5 text-sm text-muted-foreground">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="mt-6 space-y-3">
        {results.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-brand-500/40"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                {r.type}
              </span>
              <h3 className="mt-1 font-display font-semibold tracking-tight">{r.title}</h3>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{r.description}</p>
            </div>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand-500"
            />
          </Link>
        ))}
      </div>

      {!query.trim() && (
        <p className="py-16 text-center text-muted-foreground">
          Start typing to search across the site.
        </p>
      )}
    </div>
  );
}
