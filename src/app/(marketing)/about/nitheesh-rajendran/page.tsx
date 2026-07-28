import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faQuoteLeft,
  faGraduationCap,
  faLocationDot,
  faLanguage,
  faTrophy,
  faMicrophone,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedinIn,
  faGithub,
  faXTwitter,
  faYoutube,
  faImdb,
  faGooglePlay,
  faSpotify,
  faApple,
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
import { getFounder, getProducts, getTimeline } from "@/lib/content";
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
  // Everything on this page is either an admin-editable founder field or a real
  // record from the database. Nothing about the person is asserted from this
  // file — an invented biography detail is exactly what an entity audit
  // penalises.
  const [founder, products, timeline] = await Promise.all([
    getFounder(),
    getProducts(),
    getTimeline(),
  ]);
  const name = founder.name || p.name;
  const role = founder.role || p.jobTitle;
  const photo = founder.photo || p.image.url;
  // Admin values win; siteConfig is the fallback so the page is never blank
  // before Settings has been filled in.
  const education = founder.education || p.alumniOf.name;
  const educationUrl = founder.educationUrl || p.alumniOf.url;
  const skills = founder.skills?.length ? founder.skills : p.knowsAbout;
  const location =
    founder.location || `${siteConfig.address.locality}, ${siteConfig.address.region}`;
  const titles = founder.titles ?? [];
  const languages = founder.languages ?? [];
  const awards = founder.awards ?? [];
  // Apps he publishes under the verified Play developer account.
  const published = products.filter((x) => x.downloadLink);
  const skillGroups = founder.skillGroups ?? [];

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
          personSchema(founder, published),
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
        media={
          // The portrait sits with the H1 so the name and the face are the
          // first thing both a reader and an image crawler see.
          <div className="relative aspect-square w-40 overflow-hidden rounded-3xl border border-border/60 sm:w-52 lg:w-full">
            <Image
              src={photo}
              alt={`${name}, ${role} of ${siteConfig.name}`}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 208px, 300px"
              className="object-cover"
              preload
            />
          </div>
        }
      />

      <Section className="pt-4">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
            <div className="space-y-6">
              <Reveal delay={0.04}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                  <dl className="space-y-3.5 text-sm">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faBriefcase} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                      <div>
                        <dt className="text-xs text-muted-foreground">Role</dt>
                        <dd className="font-medium">
                          {[role, ...titles].join(" · ")}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faLocationDot} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                      <div>
                        <dt className="text-xs text-muted-foreground">Based in</dt>
                        <dd className="font-medium">{location}</dd>
                      </div>
                    </div>
                    {languages.length > 0 && (
                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faLanguage} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                        <div>
                          <dt className="text-xs text-muted-foreground">Languages</dt>
                          <dd className="font-medium">{languages.join(", ")}</dd>
                        </div>
                      </div>
                    )}
                  </dl>
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
                  {founder.story ? (
                    // Long-form biography, authored in the admin.
                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{ __html: founder.story }}
                    />
                  ) : (
                    <>
                      <h2 className="font-display text-xl font-bold tracking-tight">
                        About {name.split(" ")[0]}
                      </h2>
                      <p className="mt-4 leading-relaxed text-muted-foreground">
                        {founder.bio || p.description}
                      </p>
                    </>
                  )}
                  <p className="mt-6 border-t border-border/60 pt-6 leading-relaxed text-muted-foreground">
                    {name} founded{" "}
                    <Link href="/" className="text-brand-500 hover:underline">
                      {siteConfig.name}
                    </Link>{" "}
                    in {siteConfig.foundingDate.slice(0, 4)}, offering{" "}
                    <Link href="/services" className="text-brand-500 hover:underline">
                      22 services
                    </Link>{" "}
                    across web, mobile, AI, design and growth from{" "}
                    {siteConfig.address.region}, India.
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
                  {founder.degree && (
                    <p className="mt-3 font-medium">{founder.degree}</p>
                  )}
                  {founder.fieldOfStudy && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {founder.fieldOfStudy}
                    </p>
                  )}
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
                    {(founder.educationStart || founder.educationEnd) && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {founder.educationStart}
                        {founder.educationStart && founder.educationEnd ? " – " : ""}
                        {founder.educationEnd}
                      </span>
                    )}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    Technical skills
                  </h2>
                  {skillGroups.length > 0 ? (
                    <div className="mt-5 space-y-5">
                      {skillGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                            {group.label}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                              <span
                                key={item}
                                className="rounded-lg border border-border/60 bg-surface-2/50 px-3 py-1.5 text-sm text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
                </div>
              </Reveal>

              {published.length > 0 && (
                <Reveal delay={0.16}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
                      <FontAwesomeIcon icon={faGooglePlay} className="size-4 text-brand-500" />
                      Apps &amp; products published
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {published.map((prod) => (
                        <Link
                          key={prod.slug}
                          href={`/products/${prod.slug}`}
                          className="group rounded-xl border border-border/60 bg-surface-2/40 p-4 transition-colors hover:border-brand-500/40"
                        >
                          <p className="font-medium group-hover:text-brand-500">{prod.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {prod.tagline || prod.category}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.17}>
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
                    <FontAwesomeIcon icon={faMicrophone} className="size-4 text-brand-500" />
                    Podcast
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    {name} hosts the {siteConfig.name} podcast — conversations about
                    building digital products.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={siteConfig.links.podcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface-2/50 px-3 py-2 text-sm transition-colors hover:border-brand-500/40 hover:text-brand-500"
                    >
                      <FontAwesomeIcon icon={faSpotify} className="size-3.5" />
                      Spotify
                    </a>
                    <a
                      href={siteConfig.links.podcastApple}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface-2/50 px-3 py-2 text-sm transition-colors hover:border-brand-500/40 hover:text-brand-500"
                    >
                      <FontAwesomeIcon icon={faApple} className="size-3.5" />
                      Apple Podcasts
                    </a>
                  </div>
                </div>
              </Reveal>

              {awards.length > 0 && (
                <Reveal delay={0.18}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
                      <FontAwesomeIcon icon={faTrophy} className="size-4 text-brand-500" />
                      Recognition
                    </h2>
                    <ul className="mt-4 space-y-2">
                      {awards.map((a) => (
                        <li key={a} className="text-muted-foreground">{a}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              {timeline.length > 0 && (
                <Reveal delay={0.19}>
                  <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      Milestones at {siteConfig.name}
                    </h2>
                    <ol className="mt-5 space-y-4">
                      {timeline.map((mi) => (
                        <li key={`${mi.year}-${mi.title}`} className="flex gap-4">
                          <span className="w-14 shrink-0 font-mono text-sm font-semibold text-brand-500">
                            {mi.year}
                          </span>
                          <span>
                            <span className="block font-medium">{mi.title}</span>
                            {mi.description && (
                              <span className="mt-0.5 block text-sm text-muted-foreground">
                                {mi.description}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              )}

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
