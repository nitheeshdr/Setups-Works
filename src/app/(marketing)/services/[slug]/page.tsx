import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faArrowRight,
  faTag,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ServiceCard } from "@/components/cards";
import { LeadFormModal } from "@/components/lead-form-modal";
import { CTASection } from "@/components/sections/cta";
import { JsonLd, breadcrumbSchema, serviceSchema, faqSchema, organizationSchema, localBusinessSchema, websiteSchema } from "@/components/seo/json-ld";
import { getServices, getServiceBySlug } from "@/lib/content";
import { resolveServiceIcon } from "@/lib/service-icons";
import { processSteps } from "@/data/site-content";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  const description = service.seoDescription || service.description;
  return {
    title: service.seoTitle || service.title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} · ${siteConfig.name}`,
      description,
      url: `/services/${service.slug}`,
      ...(service.heroImage ? { images: [service.heroImage] } : {}),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
  ]);
  if (!service) notFound();

  const related = allServices
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  // A service can define its own process; otherwise fall back to the agency's
  // standard delivery process rather than showing nothing.
  const steps =
    service.process && service.process.length > 0
      ? service.process
      : processSteps.map((p) => ({ title: p.title, description: p.description }));

  const hasMeta = !!(service.startingPrice || service.timeline);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          localBusinessSchema(),
          websiteSchema(),
          serviceSchema(service),
          breadcrumbSchema([
            { name: "Services", url: "/services" },
            { name: service.title, url: `/services/${service.slug}` },
          ]),
          ...(service.faqs?.length ? [faqSchema(service.faqs)] : []),
        ]}
      />
      <PageHeader
        eyebrow={service.category}
        title={service.title}
        description={service.overview || service.description}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {/* Opens the lead form in a modal so the visitor keeps their place on
              the page they were reading. */}
          <LeadFormModal
            triggerLabel="Get a quote"
            defaultService={service.title}
            services={allServices.map((s) => s.title)}
            source={`/services/${service.slug}`}
          />
          {hasMeta && (
            <div className="flex flex-wrap items-center gap-2">
              {service.startingPrice && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/50 px-4 py-3 text-sm">
                  <FontAwesomeIcon icon={faTag} className="size-3.5 text-brand-500" />
                  {service.startingPrice}
                </span>
              )}
              {service.timeline && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/50 px-4 py-3 text-sm">
                  <FontAwesomeIcon icon={faClock} className="size-3.5 text-brand-500" />
                  {service.timeline}
                </span>
              )}
            </div>
          )}
        </div>
      </PageHeader>

      {/* Outcomes — only rendered when the business has supplied real numbers. */}
      {service.outcomes && service.outcomes.length > 0 && (
        <Section className="py-8">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.outcomes.map((o, i) => (
                <Reveal key={`${o.value}-${o.label}`} delay={(i % 4) * 0.05}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 text-center">
                    <p className="font-display text-3xl font-bold tracking-tight text-brand-500">
                      {o.value}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{o.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {service.heroImage && (
        <Section className="py-8">
          <Container>
            <Reveal>
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/60">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-8">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
                  <FontAwesomeIcon
                    icon={resolveServiceIcon(service.icon)}
                    className="size-6"
                  />
                </span>
                <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">
                  What&apos;s included
                </h2>
                <ul className="mt-6 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="mt-1 size-4 shrink-0 text-brand-500"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-8">
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
                        {String(i + 1).padStart(2, "0")}
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

      {/* Rich-text body, authored in the admin. */}
      {service.content && (
        <Section className="py-12">
          <Container className="max-w-3xl">
            <Reveal>
              <div
                className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-500"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* How we work */}
      <Section className="py-12">
        <Container>
          <Reveal>
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
              How we deliver it
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={(i % 3) * 0.05}>
                <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-6">
                  <span className="font-mono text-sm font-bold text-brand-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Ideal for + tech stack */}
      {((service.idealFor?.length ?? 0) > 0 ||
        (service.techStack?.length ?? 0) > 0) && (
        <Section className="py-12">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2">
              {service.idealFor && service.idealFor.length > 0 && (
                <Reveal>
                  <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-8">
                    <h2 className="font-display text-2xl font-bold tracking-tight">
                      Who it&apos;s for
                    </h2>
                    <ul className="mt-6 space-y-3">
                      {service.idealFor.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="mt-1 size-4 shrink-0 text-brand-500"
                          />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
              {service.techStack && service.techStack.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-8">
                    <h2 className="font-display text-2xl font-bold tracking-tight">
                      What we build it with
                    </h2>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.techStack.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg border border-border/60 bg-surface-2/50 px-3 py-1.5 text-sm font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Service-specific FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <Section className="py-12">
          <Container className="max-w-3xl">
            <Reveal>
              <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
                Frequently asked
              </h2>
            </Reveal>
            <div className="space-y-3">
              {service.faqs.map((f, i) => (
                <Reveal key={f.question} delay={(i % 4) * 0.04}>
                  <details className="group rounded-2xl border border-border/60 bg-card/50 p-6">
                    <summary className="cursor-pointer list-none font-semibold marker:hidden">
                      {f.question}
                    </summary>
                    <p className="mt-3 text-muted-foreground">{f.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

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
