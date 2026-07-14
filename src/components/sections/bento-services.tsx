"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

const layout = [
  { slug: "nextjs", span: "lg:col-span-2 lg:row-span-2", big: true },
  { slug: "ai-development", span: "" },
  { slug: "ui-ux-design", span: "" },
  { slug: "mobile-app-development", span: "lg:col-span-2" },
  { slug: "mern-stack", span: "" },
  { slug: "seo", span: "" },
];

export function BentoServices() {
  return (
    <Section id="services" className="relative">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="What we do"
            title={
              <>
                One team for design,
                <br className="hidden sm:block" /> engineering &amp; growth
              </>
            }
            description="A full-service studio covering everything from first pixel to production scale."
          />
          <Reveal>
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/60 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-500/40"
            >
              All 19 services
              <FontAwesomeIcon icon={faArrowRight} className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(180px,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {layout.map((item, i) => {
            const s = services.find((x) => x.slug === item.slug);
            if (!s) return null;
            return (
              <Reveal key={s.slug} delay={(i % 4) * 0.06} className={cn("min-h-0", item.span)}>
                <Link href={`/services/${s.slug}`} className="group block h-full">
                  <div className="h-full rounded-2xl">
                    <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 transition-colors group-hover:border-brand-500/40">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "grid place-items-center rounded-xl bg-brand-500/10 text-brand-500 transition-all group-hover:bg-brand-500 group-hover:text-white",
                            item.big ? "size-14" : "size-11",
                          )}
                        >
                          <FontAwesomeIcon icon={s.icon} className={item.big ? "size-6" : "size-5"} />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {s.category}
                        </span>
                      </div>

                      <div className="mt-auto pt-6">
                        <h3
                          className={cn(
                            "font-display font-semibold tracking-tight",
                            item.big ? "text-2xl sm:text-3xl" : "text-lg",
                          )}
                        >
                          {s.title}
                        </h3>
                        <p className={cn("mt-2 text-muted-foreground", item.big ? "text-base max-w-md" : "text-sm")}>
                          {item.big ? s.description : s.short}
                        </p>
                        {item.big && (
                          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500">
                            Explore
                            <FontAwesomeIcon icon={faArrowRight} className="size-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
