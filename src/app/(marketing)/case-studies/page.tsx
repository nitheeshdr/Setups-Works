import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import { getPortfolio } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/case-studies" },
  title: "Case Studies",
  description:
    "In-depth case studies on how Setups Works solved real problems for clients — the challenge, the approach, and the measurable results.",
};

export const revalidate = 300;

export default async function CaseStudiesPage() {
  const projects = (await getPortfolio()).filter((p) => p.caseStudy);

  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Deep dives into our best work"
        description="Beyond the pretty screenshots — the real problems we solved and the results we delivered."
        crumbs={[{ label: "Case Studies" }]}
      />

      <Section>
        <Container>
          {projects.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border/60 bg-card/30 py-20 text-center">
              <p className="font-display text-xl font-semibold text-muted-foreground">
                Case studies coming soon
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;re preparing detailed write-ups of our best work. Check back shortly.
              </p>
            </div>
          )}
          <div className="space-y-6">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={0.05}>
                <Link
                  href={`/case-studies/${p.slug}`}
                  className="group grid gap-6 overflow-hidden rounded-3xl border border-border/60 bg-card/50 transition-colors hover:border-brand-500/40 md:grid-cols-2"
                >
                  <div
                    className={`relative aspect-[16/10] overflow-hidden md:aspect-auto ${i % 2 ? "md:order-2" : ""}`}
                  >
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                      {p.category} · {p.client}
                    </span>
                    <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
                      {p.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-muted-foreground">
                      {p.caseStudy}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
                      Read case study
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="size-3 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
