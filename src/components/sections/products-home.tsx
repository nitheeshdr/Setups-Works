import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { PremiumButton } from "@/components/premium-button";
import type { Product, ProductStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProductStatus, string> = {
  "coming-soon": "border-amber-500/30 bg-amber-500/15 text-amber-500",
  beta: "border-violet-500/30 bg-violet-500/15 text-violet-400",
  live: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  archived: "border-zinc-500/30 bg-zinc-500/15 text-zinc-400",
};

const statusLabels: Record<ProductStatus, string> = {
  "coming-soon": "Coming soon",
  beta: "Beta",
  live: "Live",
  archived: "Archived",
};

export function ProductsHome({ products }: { products: Product[] }) {
  if (!products.length) return null;

  const items = products.slice(0, 5);

  return (
    // NOTE: no `overflow-hidden` here — it would clip the sticky ancestor and
    // break the scroll-stack. The blur blob is contained by `body { overflow-x: clip }`.
    <Section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[140px]"
      />
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our products"
            title="Software we build for ourselves"
            description="Beyond client work, we build products that push what's possible. Scroll to explore them."
          />
          <Reveal>
            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/60 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-500/40"
            >
              All products
              <FontAwesomeIcon
                icon={faArrowRight}
                className="size-3 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        {/* Scroll-stack: each card pins near the top; the next slides over it
            leaving a small peek. Uniform card height keeps the stack clean on
            both mobile and desktop. */}
        <div className="relative mx-auto mt-14 flex max-w-5xl flex-col gap-6 sm:gap-8">
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="sticky"
              style={{ top: `${80 + i * 14}px` }}
            >
              <ProductStackCard product={p} index={i} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProductStackCard({
  product: p,
  index,
}: {
  product: Product;
  index: number;
}) {
  const media = p.banner || p.screenshots?.[0] || "";

  return (
    <article className="group relative grid h-[27rem] overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl shadow-black/25 lg:h-96 lg:grid-cols-2">
      {/* Media */}
      <div className="relative order-first h-44 overflow-hidden sm:h-52 lg:order-last lg:h-full">
        {media ? (
          <Image
            src={media}
            alt={p.name}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index === 0}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/25 via-surface-2 to-violet-500/20">
            <Image
              src={p.logo}
              alt={p.name}
              width={72}
              height={72}
              className="size-16 object-contain opacity-90"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent lg:bg-gradient-to-l lg:from-black/45 lg:via-transparent" />
        <span
          className={cn(
            "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md",
            statusStyles[p.status],
          )}
        >
          {statusLabels[p.status]}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-4 p-7 sm:gap-5 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/60 bg-surface-2 sm:size-12">
            <Image
              src={p.logo}
              alt=""
              width={30}
              height={30}
              className="size-7 object-contain"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              {p.category}
            </p>
            <h3 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {p.name}
            </h3>
          </div>
          {p.version && (
            <span className="ml-auto shrink-0 rounded-full border border-border/60 bg-surface-2/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              v{p.version}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3 sm:text-base lg:text-lg">
          {p.tagline || p.description}
        </p>

        {p.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {p.technologies.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/60 bg-surface-2/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <PremiumButton
            href={`/products/${p.slug}`}
            size="md"
            icon={faArrowRight}
          >
            Explore product
          </PremiumButton>
          <div className="flex items-center gap-2">
            {p.githubLink && (
              <IconLink
                href={p.githubLink}
                label={`${p.name} on GitHub`}
                icon={faGithub}
              />
            )}
            {p.docsLink && (
              <IconLink
                href={p.docsLink}
                label={`${p.name} documentation`}
                icon={faArrowUpRightFromSquare}
              />
            )}
            {p.downloadLink && (
              <IconLink
                href={p.downloadLink}
                label={`Download ${p.name}`}
                icon={faDownload}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function IconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: typeof faGithub;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-xl border border-border/60 bg-surface-2/60 text-muted-foreground transition-colors hover:border-brand-500/40 hover:text-brand-500"
    >
      <FontAwesomeIcon icon={icon} className="size-4" />
    </a>
  );
}
