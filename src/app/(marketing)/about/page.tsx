import type { Metadata } from "next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/page-header";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { StatsSection } from "@/components/sections/stats";
import { TechStackSection } from "@/components/sections/tech-stack";
import { CTASection } from "@/components/sections/cta";
import { companyValues, journey } from "@/data/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "SETUPS WORKS is a premium digital agency of designers, engineers, and strategists building software that moves businesses forward. Meet the team and our story.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="We build software that moves businesses forward"
        description="SETUPS WORKS began as two people with a laptop and a belief: that digital products should be as beautiful as they are fast. Today we're a distributed team shipping that belief worldwide."
        crumbs={[{ label: "About" }]}
      />

      <StatsSection />

      {/* Mission & Vision */}
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: faBullseye,
                label: "Mission",
                title: "Craft digital products people love",
                body: "We exist to help ambitious teams turn ideas into products that are fast, beautiful, and built to last — combining senior engineering with obsessive design.",
              },
              {
                icon: faEye,
                label: "Vision",
                title: "Set the bar for what agencies can be",
                body: "A world where working with an agency feels like adding your best teammates — transparent, invested, and relentlessly focused on outcomes over hours.",
              },
            ].map((card, i) => (
              <Reveal key={card.label} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-border/60 bg-card/50 p-8 sm:p-10">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
                    <FontAwesomeIcon icon={card.icon} className="size-5" />
                  </span>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-500">
                    {card.label}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                    {card.title}
                  </h2>
                  <p className="mt-4 text-muted-foreground">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Founder */}
      <Section>
        <Container>
          <div className="grid items-center gap-10 rounded-3xl border border-border/60 bg-gradient-to-br from-brand-500/10 via-transparent to-violet-500/10 p-8 sm:p-12 lg:grid-cols-[auto_1fr]">
            <Reveal>
              <div className="relative mx-auto size-40 overflow-hidden rounded-3xl border border-border/60 sm:size-48">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                  alt="Founder"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
                  Founder&apos;s note
                </p>
                <blockquote className="mt-4 font-display text-xl font-medium leading-relaxed tracking-tight sm:text-2xl">
                  &ldquo;I started SETUPS WORKS because I was tired of seeing great
                  ideas ruined by mediocre execution. We treat every project like
                  it&apos;s our own product — because that&apos;s the only way to
                  build something remarkable.&rdquo;
                </blockquote>
                <div className="mt-6">
                  <p className="font-semibold">Nitheesh R.</p>
                  <p className="text-sm text-muted-foreground">
                    Founder &amp; Principal Engineer
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Journey timeline */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="The journey"
            title="From a tiny apartment to a global studio"
            description="Eight years of shipping, learning, and growing alongside the teams we serve."
          />
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand-500/60 via-border to-transparent sm:left-1/2" />
            <div className="space-y-8">
              {journey.map((item, i) => (
                <Reveal key={item.year} delay={0.05}>
                  <div
                    className={`relative flex flex-col gap-2 pl-12 sm:w-1/2 sm:pl-0 ${
                      i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                    }`}
                  >
                    <span
                      className={`absolute left-2.5 top-1.5 size-3 rounded-full bg-brand-500 ring-4 ring-brand-500/20 sm:left-auto ${
                        i % 2 === 0 ? "sm:-right-1.5" : "sm:-left-1.5"
                      }`}
                    />
                    <span className="font-mono text-sm font-bold text-brand-500">
                      {item.year}
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="Values that guide every decision"
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companyValues.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 0.06}>
                <div className="h-full rounded-2xl border border-border/60 bg-card/50 p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <FontAwesomeIcon icon={v.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display font-semibold tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <TechStackSection />
      <CTASection />
    </>
  );
}
