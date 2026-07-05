import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { PortfolioGrid } from "@/components/filter-grid";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { CTASection } from "@/components/sections/cta";
import { getPortfolio, getPortfolioCategories, getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work from SETUPS WORKS — web apps, AI products, e-commerce, mobile apps, and marketing sites built for clients worldwide.",
};

export const revalidate = 300;

export default async function PortfolioPage() {
  const [projects, categories, testimonials] = await Promise.all([
    getPortfolio(),
    getPortfolioCategories(),
    getTestimonials(true),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Products & platforms we've shipped"
        description="A look at some of the work we're most proud of — spanning fintech, AI, commerce, and everything in between."
        crumbs={[{ label: "Portfolio" }]}
      />

      <Section>
        <Container>
          <PortfolioGrid projects={projects} categories={categories} />
        </Container>
      </Section>

      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}
