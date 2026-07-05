import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { PortfolioCard } from "@/components/cards";
import type { Portfolio } from "@/lib/types";

export function PortfolioPreview({ projects }: { projects: Portfolio[] }) {
  if (!projects.length) return null;
  return (
    <Section className="relative">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Work we're proud of"
          description="A glimpse at the products, platforms, and experiences we've shipped for clients across industries."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <PortfolioCard project={p} priority={i < 2} />
            </Reveal>
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
