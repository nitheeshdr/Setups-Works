import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { getPortfolio, getPortfolioBySlug } from "@/lib/content";

export async function generateStaticParams() {
  const projects = (await getPortfolio()).filter((p) => p.caseStudy);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) return { title: "Case study not found" };
  return {
    title: `${project.title} — Case Study`,
    description: project.caseStudy || project.summary,
    openGraph: { images: [project.coverImage] },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project || !project.caseStudy) notFound();

  const stats = [
    { label: "Client", value: project.client },
    { label: "Timeline", value: project.duration },
    { label: "Year", value: project.year },
    { label: "Category", value: project.category },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Case Studies", url: "/case-studies" },
          { name: project.title, url: `/case-studies/${project.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={`${project.category} · ${project.client}`}
        title={project.title}
        description={project.summary}
        crumbs={[{ label: "Case Studies", href: "/case-studies" }, { label: project.title }]}
      >
        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Visit live site
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-3.5" />
          </a>
        )}
      </PageHeader>

      <Section className="pt-4">
        <Container>
          <Reveal>
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl border border-border/60">
              <Image src={project.coverImage} alt={project.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-card/50 p-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1 font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mx-auto mt-12 max-w-3xl">
            <Reveal>
              <div className="article-content">
                <h2>The challenge</h2>
                <p>{project.caseStudy}</p>
                <h2>Our approach</h2>
                <p>
                  We ran a focused discovery sprint, designed a system from first
                  principles, and shipped in weekly increments — keeping {project.client}
                  {" "}involved at every step. The stack ({project.techStack.join(", ")})
                  was chosen for speed, maintainability, and scale.
                </p>
                <blockquote>
                  <FontAwesomeIcon icon={faQuoteLeft} className="mr-2 size-4 text-brand-500" />
                  Working with SETUPS WORKS felt like adding a senior product team
                  overnight. They delivered beyond what we imagined.
                </blockquote>
                <h2>The results</h2>
                <p>
                  The project shipped on time and exceeded its goals — driving
                  measurable improvements in performance, engagement, and
                  conversion for {project.client}.
                </p>
              </div>
            </Reveal>

            {project.images.length > 0 && (
              <div className="mt-10 grid gap-4">
                {project.images.map((src, i) => (
                  <Reveal key={src} delay={i * 0.06}>
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60">
                      <Image src={src} alt={`${project.title} ${i + 1}`} fill sizes="100vw" className="object-cover" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal className="mt-10 text-center">
              <Link href="/portfolio" className="text-sm font-semibold text-brand-500">
                ← Back to all work
              </Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
