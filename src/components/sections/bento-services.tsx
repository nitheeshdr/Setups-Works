"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import MagicBento, { type BentoCardProps } from "@/components/reactbits/MagicBento";
import { services } from "@/data/services";

const featured = [
  "nextjs",
  "ai-development",
  "mobile-app-development",
  "ui-ux-design",
  "mern-stack",
  "seo",
];

export function BentoServices() {
  const cards: BentoCardProps[] = featured
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => ({
      color: "#0a0c13",
      label: s!.category,
      title: s!.title,
      description: s!.short,
      href: `/services/${s!.slug}`,
      icon: (
        <span className="grid size-9 place-items-center rounded-xl bg-brand-500/15 text-brand-500">
          <FontAwesomeIcon icon={s!.icon} className="size-4" />
        </span>
      ),
    }));

  return (
    <Section id="services" className="relative overflow-hidden">
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

        <Reveal className="mt-12">
          <div className="bento-brand">
            <MagicBento
              cards={cards}
              glowColor="77, 134, 247"
              enableStars
              enableSpotlight
              enableBorderGlow
              enableTilt
              clickEffect
              spotlightRadius={340}
              particleCount={10}
              textAutoHide={false}
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
