import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faLocationDot,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import { jobOpenings, benefits } from "@/data/site-content";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers",
  description:
    "Join Setups Works — a remote-first team of designers, engineers, and strategists building premium digital products. See our open roles.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build the future with us"
        description="We're a remote-first team that cares deeply about craft. If you sweat the details and love shipping great work, you'll fit right in."
        crumbs={[{ label: "Careers" }]}
      />

      {/* Benefits */}
      <Section className="py-12">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Perks & benefits"
            title="We take care of our team"
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b} delay={(i % 3) * 0.06}>
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
                  <span className="grid size-8 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                    <FontAwesomeIcon icon={faCheck} className="size-3.5" />
                  </span>
                  <span className="text-sm font-medium">{b}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Openings */}
      <Section>
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Open roles"
            title="Positions we're hiring for"
          />
          <div className="mt-10 space-y-4">
            {jobOpenings.map((job, i) => (
              <Reveal key={job.slug} delay={i * 0.06}>
                <div className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-6 transition-colors hover:border-brand-500/40 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {job.title}
                      </h3>
                      <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-500">
                        {job.team}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      {job.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="size-3"
                        />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="size-3"
                        />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/contact?role=${job.slug}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    Apply
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="size-3 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center">
              <p className="font-medium">Don&apos;t see your role?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;re always looking for exceptional people. Send us your
                portfolio at{" "}
                <a
                  href="mailto:careers@setupsworks.com"
                  className="text-brand-500"
                >
                  careers@setupsworks.com
                </a>
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
