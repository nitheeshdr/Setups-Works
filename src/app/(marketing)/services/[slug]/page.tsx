import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ServiceCard } from "@/components/cards";
import { CTASection } from "@/components/sections/cta";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { services, getService } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Services", url: "/services" },
          { name: service.title, url: `/services/${service.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={service.category}
        title={service.title}
        description={service.description}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600"
          >
            Get a quote
            <FontAwesomeIcon icon={faArrowRight} className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-8">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
                  <FontAwesomeIcon icon={service.icon} className="size-6" />
                </span>
                <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">
                  What&apos;s included
                </h2>
                <ul className="mt-6 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="mt-1 size-4 shrink-0 text-brand-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-8">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  What you&apos;ll get
                </h2>
                <div className="mt-6 grid gap-4">
                  {service.deliverables.map((d, i) => (
                    <div
                      key={d}
                      className="flex items-center gap-4 rounded-xl border border-border/60 bg-surface-2/50 p-4"
                    >
                      <span className="font-mono text-sm font-bold text-brand-500">
                        0{i + 1}
                      </span>
                      <span className="font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="py-12">
          <Container>
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
              Related {service.category.toLowerCase()} services
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((s, i) => (
                <Reveal key={s.slug} delay={(i % 4) * 0.05}>
                  <ServiceCard service={s} />
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
