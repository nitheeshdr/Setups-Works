import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCircleCheck,
  faLocationDot,
  faBriefcase,
  faUsers,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import {
  JsonLd,
  breadcrumbSchema,
  jobPostingSchema,
  webPageSchema,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from "@/components/seo/json-ld";
import { jobOpenings, benefits } from "@/data/site-content";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return jobOpenings.map((j) => ({ slug: j.slug }));
}

const getJob = (slug: string) => jobOpenings.find((j) => j.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: "Role not found" };

  const description = `${job.title} at ${siteConfig.name} — ${job.type}, ${job.location}. ${job.description}`.slice(
    0,
    158,
  );

  return {
    title: `${job.title} — Careers`,
    description,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: {
      title: `${job.title} · ${siteConfig.name}`,
      description,
      url: `/careers/${job.slug}`,
    },
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const related = jobOpenings.filter((j) => j.slug !== job.slug).slice(0, 3);
  // Returns null when datePosted is unset, so an unfilled date means no
  // JobPosting markup rather than a fabricated one.
  const posting = jobPostingSchema(job);

  const facts = [
    { icon: faBriefcase, label: "Type", value: job.type },
    { icon: faUsers, label: "Team", value: job.team },
    { icon: faLocationDot, label: "Location", value: job.location },
    ...(job.datePosted
      ? [
          {
            icon: faClock,
            label: "Posted",
            value: new Date(job.datePosted).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        ]
      : []),
  ];

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          localBusinessSchema(),
          websiteSchema(),
          webPageSchema({
            path: `/careers/${job.slug}`,
            name: `${job.title} · ${siteConfig.name}`,
            description: job.description,
          }),
          breadcrumbSchema([
            { name: "Careers", url: "/careers" },
            { name: job.title, url: `/careers/${job.slug}` },
          ]),
          ...(posting ? [posting] : []),
        ]}
      />

      <PageHeader
        eyebrow={job.team}
        title={job.title}
        description={job.description}
        crumbs={[
          { label: "Careers", href: "/careers" },
          { label: job.title },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/get-started?role=${job.slug}`}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600"
          >
            Apply for this role
            <FontAwesomeIcon
              icon={faArrowRight}
              className="size-3.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
          <a
            href={`mailto:careers@setupsworks.com?subject=${encodeURIComponent(`Application — ${job.title}`)}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-6 py-3.5 font-semibold transition-colors hover:border-brand-500/40"
          >
            Email us instead
          </a>
        </div>
      </PageHeader>

      <Section className="pt-4">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              {job.responsibilities && job.responsibilities.length > 0 && (
                <Reveal>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      What you&apos;ll do
                    </h2>
                    <ul className="mt-5 space-y-3">
                      {job.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-3">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="mt-1 size-4 shrink-0 text-brand-500"
                          />
                          <span className="text-muted-foreground">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <Reveal delay={0.05}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      What we&apos;re looking for
                    </h2>
                    <ul className="mt-5 space-y-3">
                      {job.requirements.map((r) => (
                        <li key={r} className="flex items-start gap-3">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="mt-1 size-4 shrink-0 text-brand-500"
                          />
                          <span className="text-muted-foreground">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    What we offer
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {benefits.map((b) => (
                      <div key={b} className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="mt-1 size-4 shrink-0 text-brand-500"
                        />
                        <span className="text-muted-foreground">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="space-y-4">
              <Reveal>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                  <h2 className="font-display text-base font-semibold tracking-tight">
                    Role details
                  </h2>
                  <dl className="mt-4 space-y-3.5 text-sm">
                    {facts.map((f) => (
                      <div key={f.label} className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={f.icon}
                          className="mt-0.5 size-3.5 shrink-0 text-brand-500"
                        />
                        <div>
                          <dt className="text-xs text-muted-foreground">
                            {f.label}
                          </dt>
                          <dd className="font-medium">{f.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              {related.length > 0 && (
                <Reveal delay={0.05}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                    <h2 className="font-display text-base font-semibold tracking-tight">
                      Other open roles
                    </h2>
                    <div className="mt-4 space-y-2">
                      {related.map((r) => (
                        <Link
                          key={r.slug}
                          href={`/careers/${r.slug}`}
                          className="group block rounded-xl border border-border/60 bg-surface-2/40 p-3 transition-colors hover:border-brand-500/40"
                        >
                          <p className="text-sm font-medium group-hover:text-brand-500">
                            {r.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.team} · {r.type}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
