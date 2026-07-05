import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { ProductCard } from "@/components/cards";
import type { Product } from "@/lib/types";

export function ProductsHome({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[140px]"
      />
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our products"
            title="Software we build for ourselves"
            description="Beyond client work, we build products that push what's possible."
          />
          <Reveal>
            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/60 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-500/40"
            >
              All products
              <FontAwesomeIcon icon={faArrowRight} className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
