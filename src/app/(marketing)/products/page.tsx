import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ProductCard } from "@/components/cards";
import { CTASection } from "@/components/sections/cta";
import { getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Beyond client work, SETUPS WORKS builds its own products — starting with CodeForge AI, an AI-powered development platform.",
};

export const revalidate = 300;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        eyebrow="Our products"
        title="Software we build for ourselves"
        description="We don't just build for clients — we build products that push the boundaries of what's possible. Here's what we're working on."
        crumbs={[{ label: "Products" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <ProductCard product={p} />
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 bg-card/30 p-8 text-center">
                <span className="font-display text-2xl font-bold text-muted-foreground">
                  More on the way
                </span>
                <p className="max-w-xs text-sm text-muted-foreground">
                  We&apos;re always cooking up something new. Subscribe to our
                  newsletter to be the first to know.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
