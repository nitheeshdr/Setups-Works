import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faGraduationCap, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import { PortfolioCard, ProductCard } from "@/components/cards";
import { getTeamMemberBySlug, getAllTeamSlugs, getPortfolio, getProducts } from "@/lib/content";
import {
  JsonLd,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  breadcrumbSchema,
  teamMemberSchema,
  teamPath,
} from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { stripHtml, truncate } from "@/lib/helpers";

export const revalidate = 300;

/**
 * A team member's own page.
 *
 * Built to the same rules as the founder page: the person's name is the title
 * and the H1, because that is the query the page exists to answer, and the
 * profile links are rendered as real outbound anchors rather than living only
 * in the markup. A Person node whose `sameAs` points at LinkedIn and GitHub is
 * checkable; a name on a card is not.
 */

export async function generateStaticParams() {
  const slugs = await getAllTeamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = await getTeamMemberBySlug(slug);
  if (!m) return { title: "Not found" };

  const description =
    m.short ||
    truncate(stripHtml(m.bio || ""), 158) ||
    `${m.name} is ${m.role} at ${siteConfig.name}.`;

  return {
    // Name first — this page targets the person's name.
    title: { absolute: `${m.name} — ${m.role} at ${siteConfig.name}` },
    description,
    alternates: { canonical: teamPath(m.slug) },
    openGraph: {
      type: "profile",
      title: `${m.name} — ${m.role} at ${siteConfig.name}`,
      description,
      url: teamPath(m.slug),
      ...(m.photo ? { images: [m.photo] } : {}),
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [member, portfolio, allProducts] = await Promise.all([
    getTeamMemberBySlug(slug),
    getPortfolio(),
    getProducts(),
  ]);
  if (!member) notFound();

  // Everything this person is credited on, matched by slug. Client projects
  // and in-house products are separate collections, so both are resolved.
  const projects = portfolio.filter((p) => p.team?.includes(member.slug));
  const products = allProducts.filter((p) => p.team?.includes(member.slug));

  const profiles = [
    { icon: faLinkedinIn, label: "LinkedIn", href: member.linkedin },
    { icon: faGithub, label: "GitHub", href: member.github },
    { icon: faXTwitter, label: "X", href: member.twitter },
  ].filter((x): x is { icon: typeof faGithub; label: string; href: string } => !!x.href);

  const url = `${siteConfig.url}${teamPath(member.slug)}`;

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          localBusinessSchema(),
          websiteSchema(),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": `${url}#profilepage`,
            url,
            name: `${member.name} — ${member.role} at ${siteConfig.name}`,
            mainEntity: { "@id": `${url}#person` },
            isPartOf: { "@id": `${siteConfig.url}/#website` },
          },
          teamMemberSchema(member),
          breadcrumbSchema([
            { name: "Team", url: "/team" },
            { name: member.name, url: teamPath(member.slug) },
          ]),
        ]}
      />

      {/* The name is the H1 — a page that never states it will not rank for it. */}
      <PageHeader
        eyebrow={member.role}
        title={member.name}
        description={member.short}
        crumbs={[{ label: "Team", href: "/team" }, { label: member.name }]}
        media={
          member.photo ? (
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-border/60 lg:aspect-square">
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.role} at ${siteConfig.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-center"
                preload
              />
            </div>
          ) : undefined
        }
      >
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
            <dl className="space-y-3.5 text-sm">
              {member.location && (
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faLocationDot} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Based in</dt>
                    <dd className="font-medium">{member.location}</dd>
                  </div>
                </div>
              )}
              {member.education && (
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faGraduationCap} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Education</dt>
                    <dd className="font-medium">{member.education}</dd>
                  </div>
                </div>
              )}
              {member.email && (
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faEnvelope} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="font-medium">
                      <a href={`mailto:${member.email}`} className="hover:text-brand-500">
                        {member.email}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {/* Rendered as real links, not just sameAs in the markup — an
              outbound anchor to an established profile is what lets a new page
              borrow relevance from one Google already trusts. */}
          {profiles.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Elsewhere
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profiles.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface-2/50 px-3 py-2 text-sm transition-colors hover:border-brand-500/40 hover:text-brand-500"
                  >
                    <FontAwesomeIcon icon={s.icon} className="size-3.5" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageHeader>

      <Section className="pt-4">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
            <div className="space-y-6">
              {member.bio && (
                <Reveal>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      About {member.name.split(" ")[0]}
                    </h2>
                    <div
                      className="article-content mt-4"
                      dangerouslySetInnerHTML={{ __html: member.bio }}
                    />
                  </div>
                </Reveal>
              )}

              {products.length > 0 && (
                <Reveal delay={0.06}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      Products {member.name.split(" ")[0]} built
                    </h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      {products.map((p) => (
                        <ProductCard key={p.slug} product={p} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {projects.length > 0 && (
                <Reveal delay={0.05}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      Projects {member.name.split(" ")[0]} worked on
                    </h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      {projects.map((p) => (
                        <PortfolioCard key={p.slug} project={p} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            <div className="space-y-6">
              {member.skills && member.skills.length > 0 && (
                <Reveal delay={0.04}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Works on
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-lg border border-border/60 bg-surface-2/50 px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.05}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                  <p className="text-sm text-muted-foreground">
                    Part of the team at{" "}
                    <Link href="/about" className="font-medium text-brand-500 hover:underline">
                      {siteConfig.name}
                    </Link>
                    .
                  </p>
                  <Link
                    href="/team"
                    className="mt-3 inline-block text-sm font-medium text-brand-500 hover:underline"
                  >
                    Meet the rest of the team →
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
