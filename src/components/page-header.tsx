import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { Eyebrow } from "@/components/section";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  media,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  /** Optional visual (portrait, logo) shown beside the title. */
  media?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-32">
      <Container className="relative">
        {crumbs && (
          <Reveal>
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faChevronRight} className="size-2.5" />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-foreground">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        <div
          className={
            media
              ? "grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center lg:gap-14"
              : undefined
          }
        >
          <div className="max-w-3xl">
            {eyebrow && (
              <Reveal>
                <Eyebrow>{eyebrow}</Eyebrow>
              </Reveal>
            )}
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-balance">
                  {description}
                </p>
              </Reveal>
            )}
            {children && <Reveal delay={0.15}>{children}</Reveal>}
          </div>
          {media && (
            <Reveal delay={0.08}>
              <div className="order-first lg:order-0">{media}</div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
