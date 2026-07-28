import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ServicesStack } from "@/components/sections/services-stack";
import { ProcessSection } from "@/components/sections/process";
import { CTASection } from "@/components/sections/cta";
import { FAQSection } from "@/components/sections/faq";
import { getServices } from "@/lib/content";
import { JsonLd, pageSchemas } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/site";

const description =
  "From software and mobile development to Spring Boot, DevOps, AI, design, and growth — explore the services Setups Works offers to build and scale your product.";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description,
  path: "/services",
});

export const revalidate = 300;

export default async function ServicesPage() {
  // ServicesStack groups by category itself and drops empty ones.
  const services = await getServices();

  return (
    <>
      <JsonLd
        data={pageSchemas({ path: "/services", label: "Services", description, services })}
      />
      <PageHeader
        eyebrow="Our services"
        title="Everything you need to build, launch & grow"
        description="One senior team across design, engineering, AI, and growth — so you never have to stitch together five vendors."
        crumbs={[{ label: "Services" }]}
      />

      <ServicesStack services={services} />

      <ProcessSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
