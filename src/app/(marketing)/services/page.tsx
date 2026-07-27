import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ServiceCard } from "@/components/cards";
import { ProcessSection } from "@/components/sections/process";
import { CTASection } from "@/components/sections/cta";
import { FAQSection } from "@/components/sections/faq";
import { getServices } from "@/lib/content";
import { JsonLd, pageSchemas } from "@/components/seo/json-ld";

const description =
  "From software and mobile development to Spring Boot, DevOps, AI, design, and growth — explore the services Setups Works offers to build and scale your product.";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Services",
  description,
};

export const revalidate = 300;

const CATEGORY_ORDER = [
  "Development",
  "Design",
  "Growth",
  "Platforms",
  "Intelligence",
] as const;

export default async function ServicesPage() {
  const services = await getServices();
  // Only render category sections that actually contain something.
  const serviceCategories = CATEGORY_ORDER.filter((c) =>
    services.some((s) => s.category === c),
  );

  return (
    <>
      <JsonLd
        data={pageSchemas({ path: "/services", label: "Services", description })}
      />
      <PageHeader
        eyebrow="Our services"
        title="Everything you need to build, launch & grow"
        description="One senior team across design, engineering, AI, and growth — so you never have to stitch together five vendors."
        crumbs={[{ label: "Services" }]}
      />

      {serviceCategories.map((cat) => {
        const items = services.filter((s) => s.category === cat);
        return (
          <Section key={cat} className="py-12">
            <Container>
              <Reveal>
                <div className="mb-8 flex items-center gap-4">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {cat}
                  </h2>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {items.length} services
                  </span>
                </div>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((s, i) => (
                  <Reveal key={s.slug} delay={(i % 4) * 0.05}>
                    <ServiceCard service={s} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}

      <ProcessSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
