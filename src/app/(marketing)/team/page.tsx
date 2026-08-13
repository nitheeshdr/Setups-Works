import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import { getTeam, getFounder } from "@/lib/content";
import {
  JsonLd,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  webPageSchema,
  breadcrumbSchema,
  teamListSchema,
  teamPath,
  FOUNDER_PATH,
} from "@/components/seo/json-ld";
import { pageMetadata, siteConfig } from "@/lib/site";

const description =
  "The designers, engineers and strategists behind Setups Works — the people who actually build your website, app or AI product.";

export const metadata: Metadata = pageMetadata({
  title: "Team",
  description,
  path: "/team",
});

export const revalidate = 300;

export default async function TeamPage() {
  const [team, founder] = await Promise.all([getTeam(), getFounder()]);

  const fp = siteConfig.founderProfile;
  /**
   * The founder is shown here but is deliberately NOT a team row.
   *
   * He already has a profile at /about/nitheesh-rajendran carrying a Person
   * node with @id `#founder`, entity anchors and his filmography. Giving him a
   * /team/... row as well would mint a second ProfilePage and a second Person
   * @id for one human — splitting exactly the entity the rest of this work
   * exists to consolidate. So the card links to the page he already has.
   */
  const founderCard = {
    name: founder.name || fp.name,
    role: founder.role || fp.jobTitle,
    short: founder.bio || fp.description,
    photo: founder.photo || fp.image.url,
    location: founder.location || fp.homeLocation,
    href: FOUNDER_PATH,
  };

  // The list covers everyone on the page, founder included, by URL.
  const listed = [
    { name: founderCard.name, url: `${siteConfig.url}${FOUNDER_PATH}` },
    ...team.map((m) => ({ name: m.name, url: `${siteConfig.url}${teamPath(m.slug)}` })),
  ];

  return (
    <>
      <JsonLd
        data={[
          // The org node carries `employee` edges to these same people, so the
          // list and the company entity describe one set rather than two.
          organizationSchema(undefined, team),
          localBusinessSchema(),
          websiteSchema(),
          webPageSchema({
            path: "/team",
            name: `Team · ${siteConfig.name}`,
            description,
          }),
          breadcrumbSchema([{ name: "Team", url: "/team" }]),
          teamListSchema(listed),
        ]}
      />

      <PageHeader
        eyebrow="Our team"
        title="The people behind the work"
        description={description}
        crumbs={[{ label: "Team" }]}
      />

      <Section className="pt-4">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <Link
                href={founderCard.href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-500/30 bg-card/50 transition-colors hover:border-brand-500/60"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-2">
                  <Image
                    src={founderCard.photo}
                    alt={`${founderCard.name}, ${founderCard.role} of ${siteConfig.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    preload
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-lg font-bold tracking-tight">
                    {founderCard.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-brand-500">{founderCard.role}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {founderCard.short}
                  </p>
                  {founderCard.location && (
                    <p className="mt-auto pt-3 text-xs text-muted-foreground">
                      {founderCard.location}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>

            {team.map((m, i) => (
              <Reveal key={m.slug} delay={(i + 1) * 0.05}>
                  <Link
                    href={teamPath(m.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/50 transition-colors hover:border-brand-500/40"
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-2">
                      {m.photo && (
                        <Image
                          src={m.photo}
                          alt={`${m.name}, ${m.role} at ${siteConfig.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-lg font-bold tracking-tight">
                        {m.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-brand-500">{m.role}</p>
                      {m.short && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {m.short}
                        </p>
                      )}
                      {m.location && (
                        <p className="mt-auto pt-3 text-xs text-muted-foreground">
                          {m.location}
                        </p>
                      )}
                    </div>
                  </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
