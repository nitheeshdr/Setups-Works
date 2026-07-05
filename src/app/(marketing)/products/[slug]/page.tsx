import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faReadme,
} from "@fortawesome/free-brands-svg-icons";
import { faBook, faDownload } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import { getProducts, getProductBySlug } from "@/lib/content";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline || product.description,
    openGraph: { images: [product.banner] },
  };
}

const statusLabels: Record<string, string> = {
  "coming-soon": "Coming Soon",
  beta: "Beta",
  live: "Live",
  archived: "Archived",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const links = [
    product.githubLink && { icon: faGithub, label: "GitHub", href: product.githubLink },
    product.docsLink && { icon: faBook, label: "Documentation", href: product.docsLink },
    product.downloadLink && { icon: faDownload, label: "Download", href: product.downloadLink },
  ].filter(Boolean) as { icon: typeof faGithub; label: string; href: string }[];

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Products", url: "/products" },
            { name: product.name, url: `/products/${product.slug}` },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={product.category}
        title={
          <span className="flex flex-wrap items-center gap-4">
            <span className="grid size-14 place-items-center overflow-hidden rounded-2xl border border-border/60 bg-surface-2">
              <Image src={product.logo} alt="" width={36} height={36} className="size-9" />
            </span>
            {product.name}
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-semibold text-amber-500">
              {statusLabels[product.status]}
            </span>
          </span>
        }
        description={product.description}
        crumbs={[{ label: "Products", href: "/products" }, { label: product.name }]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand-500/40"
            >
              <FontAwesomeIcon icon={l.icon} className="size-4" />
              {l.label}
            </a>
          ))}
          {product.version && (
            <span className="rounded-xl border border-border/60 bg-surface-2/60 px-5 py-3 font-mono text-sm text-muted-foreground">
              {product.version}
            </span>
          )}
        </div>
      </PageHeader>

      {/* Banner */}
      <Section className="pt-4">
        <Container>
          <Reveal>
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl border border-border/60">
              <Image
                src={product.banner}
                alt={product.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Capabilities" title="Built to give developers superpowers" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {product.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.08}>
                <div className="flex h-full gap-4 rounded-2xl border border-border/60 bg-card/50 p-6">
                  <FontAwesomeIcon icon={faCircleCheck} className="mt-1 size-5 shrink-0 text-brand-500" />
                  <div>
                    <h3 className="font-display font-semibold tracking-tight">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Screenshots */}
      {product.screenshots.length > 0 && (
        <Section className="py-12">
          <Container>
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
              A look inside
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.screenshots.map((src, i) => (
                <Reveal key={src} delay={(i % 3) * 0.08}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
                    <Image src={src} alt={`${product.name} screenshot ${i + 1}`} fill sizes="33vw" className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Tech + release + waitlist */}
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-8">
                <h3 className="font-display text-xl font-bold tracking-tight">Built with</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.technologies.map((t) => (
                    <span key={t} className="rounded-full border border-border/60 bg-surface-2/60 px-3.5 py-1.5 text-sm font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                {product.releaseNotes && (
                  <>
                    <h3 className="mt-8 font-display text-xl font-bold tracking-tight">Release notes</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{product.releaseNotes}</p>
                  </>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-center rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-violet-500/10 p-8">
                <FontAwesomeIcon icon={faArrowRight} className="size-6 text-brand-500" />
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
                  Join the waitlist
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {product.name} is launching soon. Subscribe to get early access
                  and help shape the roadmap.
                </p>
                <NewsletterForm className="mt-6 max-w-none" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
