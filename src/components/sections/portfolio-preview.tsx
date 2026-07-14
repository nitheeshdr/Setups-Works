import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { PremiumButton } from "@/components/premium-button";
import type { Portfolio } from "@/lib/types";

export function PortfolioPreview({ projects }: { projects: Portfolio[] }) {
  if (!projects.length) return null;

  const items = projects.slice(0, 5);

  return (
    <Section className="relative">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Work we're proud of"
          description="A glimpse at the products, platforms, and experiences we've shipped for clients across industries."
        />

        {/* Scroll-stack: each project pins near the top; the next slides over
            it leaving a small peek. Uniform height keeps the stack clean on
            mobile and desktop. */}
        <div className="relative mx-auto mt-14 flex max-w-5xl flex-col gap-6 sm:gap-8">
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="sticky"
              style={{ top: `${80 + i * 14}px` }}
            >
              <PortfolioStackCard project={p} index={i} />
            </div>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 rounded-xl border border-border/60 px-6 py-3.5 font-semibold transition-colors hover:border-brand-500/40"
          >
            View full portfolio
            <FontAwesomeIcon
              icon={faArrowRight}
              className="size-3.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}

function PortfolioStackCard({
  project: p,
  index,
}: {
  project: Portfolio;
  index: number;
}) {
  const media = p.coverImage || p.images?.[0] || "";

  return (
    <article className="group relative grid overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-lg shadow-black/10 lg:h-96 lg:grid-cols-2">
      {/* Media */}
      <div className="relative order-first h-44 overflow-hidden sm:h-52 lg:h-full">
        {media ? (
          <Image
            src={media}
            alt={p.title}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index === 0}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/25 via-surface-2 to-violet-500/20 p-6 text-center font-display text-2xl font-bold text-foreground/70">
            {p.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-black/45 lg:via-transparent" />
        <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {p.year}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-4 p-7 sm:gap-5 sm:p-10 lg:p-12">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            {p.category}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            {p.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3 sm:text-base lg:text-lg">
          {p.summary}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {p.client && (
            <span>
              <span className="text-foreground/70">Client:</span> {p.client}
            </span>
          )}
          {p.duration && (
            <span>
              <span className="text-foreground/70">Timeline:</span> {p.duration}
            </span>
          )}
        </div>

        {p.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {p.techStack.slice(0, 5).map((t) => (
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
            href={
              p.caseStudy ? `/case-studies/${p.slug}` : `/portfolio/${p.slug}`
            }
            size="md"
            icon={faArrowRight}
            className="whitespace-nowrap"
          >
            {p.caseStudy ? "Read case study" : "View project"}
          </PremiumButton>
          <div className="flex items-center gap-2">
            {p.liveDemo && (
              <IconLink
                href={p.liveDemo}
                label={`${p.title} live demo`}
                icon={faArrowUpRightFromSquare}
              />
            )}
            {p.github && (
              <IconLink
                href={p.github}
                label={`${p.title} on GitHub`}
                icon={faGithub}
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
