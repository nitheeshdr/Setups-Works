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
  const n = items.length;

  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[140px]"
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

        {/* Sticky scroll-stack: each product pins near the top and the ones
            behind sit slightly scaled down for depth. CSS-only, works on
            mobile and desktop. */}
        <div className="relative mx-auto mt-14 flex max-w-5xl flex-col gap-6">
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="sticky"
              style={{ top: `${88 + i * 18}px` }}
            >
              <article
                className="group relative grid overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl shadow-black/25 lg:h-[26rem] lg:grid-cols-2"
                style={{ transform: `scale(${1 - (n - 1 - i) * 0.02})` }}
              >
                {/* Media */}
                <div className="relative order-first h-52 overflow-hidden sm:h-64 lg:order-last lg:h-full">
                  <Image
                    src={p.banner || p.screenshots?.[0] || p.logo}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-l lg:from-black/50 lg:via-transparent" />
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
                <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-12">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/60 bg-surface-2">
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
                      <h3 className="truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        {p.name}
                      </h3>
                    </div>
                    {p.version && (
                      <span className="ml-auto shrink-0 rounded-full border border-border/60 bg-surface-2/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                        v{p.version}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-3 text-base text-muted-foreground sm:text-lg">
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
            </div>
          ))}
          {/* spacer so the last card can unpin cleanly */}
          <div aria-hidden className="h-4" />
        </div>
      </Container>
    </Section>
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
