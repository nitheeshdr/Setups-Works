"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { BlogCard } from "@/components/cards";
import { cn } from "@/lib/utils";
import type { Blog } from "@/lib/types";

const PER_PAGE = 6;

export function BlogExplorer({
  blogs,
  categories,
}: {
  blogs: Blog[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return blogs.filter((b) => {
      const matchCat = category === "All" || b.category === category;
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [blogs, query, category]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => reset(() => setQuery(e.target.value))}
            placeholder="Search articles…"
            className="w-full rounded-xl border border-border/60 bg-surface-2/60 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-brand-500/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => reset(() => setCategory(cat))}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                category === cat
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-border/60 bg-surface-2/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {pageItems.map((b, i) => (
            <motion.div
              key={b.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, delay: (i % 3) * 0.05 }}
            >
              <BlogCard blog={b} priority={i === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">
          No articles match your search.
        </p>
      )}

      {pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="grid size-10 place-items-center rounded-lg border border-border/60 disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="size-3.5" />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={cn(
                "size-10 rounded-lg border text-sm font-medium transition-colors",
                current === i + 1
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-border/60 hover:border-brand-500/40",
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={current === pages}
            className="grid size-10 place-items-center rounded-lg border border-border/60 disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faChevronRight} className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
