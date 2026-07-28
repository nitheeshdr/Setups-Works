import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedinIn,
  faGithub,
  faXTwitter,
  faYoutube,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { CTASection } from "@/components/sections/cta";
import {
  JsonLd,
  personSchema,
  profilePageSchema,
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  FOUNDER_PATH,
} from "@/components/seo/json-ld";
import { getFounder } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

/**
 * The founder's own page.
 *
 * Split out of /about deliberately. That page is visibly about the company —
 * its title, H1 and description all describe the agency — while carrying
 * ProfilePage schema claiming a person as its subject. Google weights title and
 * H1 heavily for name queries, so a page that never states the name in either
 * will not rank for it no matter what the markup asserts.
 *
 * Everything here comes from the founder record in Settings, editable at
 * /admin/settings. Nothing about the person is written into this file.
 */

const p = siteConfig.founderProfile;

export async function generateMetadata(): Promise<Metadata> {
  const founder = await getFounder();
  const name = founder.name || p.name;
  const role = founder.role || p.jobTitle;

  // Leads with the name, because that is the query this page exists to answer.
  const description = (
    founder.bio ||
    `${name} is the ${role} of ${siteConfig.name}, a digital agency in ${siteConfig.address.region}, India building websites, mobile apps and AI products.`
  ).slice(0, 158);

  return {
    title: { absolute: `${name} — ${role} of ${siteConfig.name}` },
    description,
    alternates: { canonical: FOUNDER_PATH },
    openGraph: {
      type: "profile",
      title: `${name} — ${role} of ${siteConfig.name}`,
      description,
      url: FOUNDER_PATH,
      ...(founder.photo ? { images: [founder.photo] } : {}),
    },
  };
}

export default async function FounderPage() {
  const founder = await getFounder();
  const name = founder.name || p.name;
  const role = founder.role || p.jobTitle;
  const photo = founder.photo || p.image.url;
  // Admin values win; siteConfig is the fallback so the page is never blank
  // before Settings has been filled in.
  const education = founder.education || p.alumniOf.name;
  const educationUrl = founder.educationUrl || p.alumniOf.url;
  const skills = founder.skills?.length ? founder.skills : p.knowsAbout;

  // Profiles Google already associates with this person. Linking out to them
  // from a page that states the name is what lets an unknown page borrow
  // relevance from established ones.
  const profiles = [
    { icon: faLinkedinIn, label: "LinkedIn", href: founder.linkedin || p.sameAs.find((u) => u.includes("linkedin")) },
    { icon: faGithub, label: "GitHub", href: founder.github || p.sameAs.find((u) => u.includes("github")) },
    { icon: faImdb, label: "IMDb", href: founder.imdb || p.sameAs.find((u) => u.includes("imdb")) },
    { icon: faYoutube, label: "YouTube", href: founder.youtube || p.sameAs.find((u) => u.includes("youtube")) },
    { icon: faXTwitter, label: "X", href: founder.twitter },
  ].filter((x): x is { icon: typeof faGithub; label: string; href: string } => !!x.href);

  return (
    <>
      <JsonLd
        data={[
          profilePageSchema(founder),
          personSchema(founder),
          organizationSchema(),
          websiteSchema(),
          breadcrumbSchema([
            { name: "About", url: "/about" },
            { name, url: FOUNDER_PATH },
          ]),
        ]}
      />

      {/* The name is the H1 — this page exists to answer a name query. */}
      <PageHeader
        eyebrow={role}
        title={name}
        description={
          founder.bio ||
          `${role} of ${siteConfig.name}, a digital agency building websites, mobile apps and AI products.`
        }
        crumbs={[{ label: "About", href: "/about" }, { label: name }]}
      />

      <Section className="pt-4">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
            <div className="space-y-6">
              <Reveal>
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/60">
                  <Image
                    src={photo}
                    alt={`${name}, ${role} of ${siteConfig.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Reveal>

              {profiles.length > 0 && (
                <Reveal delay={0.05}>
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
                </Reveal>
              )}
            </div>

            <div className="space-y-6">
              <Reveal>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    About {name.split(" ")[0]}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {founder.bio || p.description}
                  </p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {name} founded{" "}
                    <Link href="/" className="text-brand-500 hover:underline">
                      {siteConfig.name}
                    </Link>{" "}
                    in {siteConfig.foundingDate.slice(0, 4)}. The agency works across
                    web, mobile, AI, design and growth from {siteConfig.address.region},
                    India, for clients worldwide.
                  </p>
                </div>
              </Reveal>

              {founder.quote && (
                <Reveal delay={0.05}>
                  <figure className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <FontAwesomeIcon icon={faQuoteLeft} className="size-5 text-brand-500" />
                    <blockquote className="mt-4 text-lg leading-relaxed">
                      {founder.quote}
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-muted-foreground">
                      {name}, {role}
                    </figcaption>
                  </figure>
                </Reveal>
              )}

              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
                    <FontAwesomeIcon icon={faGraduationCap} className="size-4 text-brand-500" />
                    Education
                  </h2>
                  <p className="mt-3">
                    {educationUrl ? (
                      <a
                        href={educationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-brand-500"
                      >
                        {education}
                      </a>
                    ) : (
                      <span className="font-medium">{education}</span>
                    )}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    Works on
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-border/60 bg-surface-2/50 px-3 py-1.5 text-sm text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <Link
                  href="/get-started"
                  className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600"
                >
                  Work with {name.split(" ")[0]}&apos;s team
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="size-3.5 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
