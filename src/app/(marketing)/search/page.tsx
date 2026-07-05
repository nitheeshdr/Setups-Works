import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { SiteSearch } from "@/components/site-search";
import { services } from "@/data/services";
import { getBlogs, getPortfolio, getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search across services, articles, projects, and products at Setups Works.",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [{ items: blogs }, portfolio, products] = await Promise.all([
    getBlogs({ limit: 100 }),
    getPortfolio(),
    getProducts(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="Find anything"
        crumbs={[{ label: "Search" }]}
      />
      <Section className="pt-4">
        <Container className="max-w-3xl">
          <SiteSearch
            initialQuery={q ?? ""}
            blogs={blogs}
            services={services}
            portfolio={portfolio}
            products={products}
          />
        </Container>
      </Section>
    </>
  );
}
