"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar, faClock } from "@fortawesome/free-solid-svg-icons";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";
import type { Blog, Portfolio, Testimonial, Product } from "@/lib/types";
import type { Service } from "@/data/services";

/* ----------------------------- Service ---------------------------- */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block h-full">
      <SpotlightCard
        className="h-full border-border/60 !bg-card/60 backdrop-blur-sm transition-colors group-hover:border-brand-500/40"
        spotlightColor="rgba(77, 134, 247, 0.15)"
      >
        <div className="flex h-full flex-col gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-brand-500/10 text-brand-500 transition-all group-hover:bg-brand-500 group-hover:text-white">
            <FontAwesomeIcon icon={service.icon} className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {service.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{service.short}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-500">
            Learn more
            <FontAwesomeIcon
              icon={faArrowRight}
              className="size-3 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </SpotlightCard>
    </Link>
  );
}

/* ------------------------------ Blog ------------------------------ */
export function BlogCard({ blog, priority }: { blog: Blog; priority?: boolean }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
          {blog.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand-500">
          {blog.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>{formatDate(blog.publishedAt)}</span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} className="size-3" />
            {blog.readingTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ---------------------------- Portfolio --------------------------- */
export function PortfolioCard({
  project,
  priority,
}: {
  project: Portfolio;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {project.category}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-xl font-bold tracking-tight text-white">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/70">
            {project.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-md"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <span className="absolute right-4 top-4 grid size-9 translate-y-2 place-items-center rounded-full bg-brand-500 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <FontAwesomeIcon icon={faArrowRight} className="size-3.5 -rotate-45" />
        </span>
      </div>
    </Link>
  );
}

/* --------------------------- Testimonial -------------------------- */
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className={cn(
              "size-3.5",
              i < t.rating ? "text-amber-400" : "text-muted-foreground/30",
            )}
          />
        ))}
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{t.review}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-border/60 pt-4">
        {t.photo ? (
          <Image
            src={t.photo}
            alt={t.name}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-11 place-items-center rounded-full bg-brand-500/15 font-semibold text-brand-500">
            {t.name[0]}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">
            {t.role}
            {t.company ? `, ${t.company}` : ""}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/* ----------------------------- Product ---------------------------- */
const statusStyles: Record<string, string> = {
  "coming-soon": "bg-amber-500/15 text-amber-500",
  beta: "bg-violet-500/15 text-violet-400",
  live: "bg-emerald-500/15 text-emerald-500",
  archived: "bg-muted text-muted-foreground",
};
const statusLabels: Record<string, string> = {
  "coming-soon": "Coming Soon",
  beta: "Beta",
  live: "Live",
  archived: "Archived",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={product.banner}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span
          className={cn(
            "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md",
            statusStyles[product.status],
          )}
        >
          {statusLabels[product.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center overflow-hidden rounded-xl border border-border/60 bg-surface-2">
            <Image src={product.logo} alt="" width={28} height={28} className="size-7" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.tagline || product.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-surface-2/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-brand-500">
          Explore product
          <FontAwesomeIcon
            icon={faArrowRight}
            className="size-3 transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
