import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { PortfolioCard } from "@/components/cards";
import { CTASection } from "@/components/sections/cta";
import { JsonLd, breadcrumbSchema, portfolioSchema } from "@/components/seo/json-ld";
import { getPortfolio, getPortfolioBySlug } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getPortfolio();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/portfolio/${project.slug}`,
      images: [project.coverImage],
    },
    twitter: { card: "summary_large_image", images: [project.coverImage] },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) notFound();

  const all = await getPortfolio();
  const related = all.filter((p) => p.slug !== project.slug).slice(0, 2);

  const meta = [
    { label: "Client", value: project.client },
    { label: "Category", value: project.category },
    { label: "Duration", value: project.duration },
    { label: "Year", value: project.year },
  ].filter((m) => m.value);

  return (
    <>
      <JsonLd
        data={[
          portfolioSchema(project),
          breadcrumbSchema([
            { name: "Portfolio", url: "/portfolio" },
            { name: project.title, url: `/portfolio/${project.slug}` },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={project.category}
        title={project.title}
        description={project.summary}
        crumbs={[{ label: "Portfolio", href: "/portfolio" }, { label: project.title }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Live demo
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-3.5" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-6 py-3.5 font-semibold transition-colors hover:border-brand-500/40"
            >
              <FontAwesomeIcon icon={faGithub} className="size-4" />
              Source
            </a>
          )}
        </div>
      </PageHeader>

      <Section className="pt-4">
        <Container>
          <Reveal>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60">
              <Image src={project.coverImage} alt={project.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
            <Reveal>
              <div className="prose-invert max-w-none">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  The challenge &amp; outcome
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {project.caseStudy || project.summary}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-6 rounded-2xl border border-border/60 bg-card/50 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {meta.map((m) => (
                    <div key={m.label}>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {m.label}
                      </p>
                      <p className="mt-1 font-medium">{m.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Tech stack
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.map((t) => (
                      <span key={t} className="rounded-full border border-border/60 bg-surface-2/60 px-2.5 py-1 text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {project.images.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {project.images.map((src, i) => (
                <Reveal key={src} delay={(i % 2) * 0.08}>
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60">
                    <Image src={src} alt={`${project.title} ${i + 1}`} fill sizes="50vw" className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="py-12">
          <Container>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                More work
              </h2>
              <Link href="/portfolio" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
                View all
                <FontAwesomeIcon icon={faArrowRight} className="size-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <PortfolioCard project={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTASection />
    </>
  );
}
