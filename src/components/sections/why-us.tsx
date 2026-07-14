"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { whyChooseUs } from "@/data/site-content";

export function WhyUsSection() {
  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 size-[420px] rounded-full bg-brand-500/10 blur-[130px]"
      />
      <Container>
        <SectionHeading
          eyebrow="Why Setups Works"
          title="The difference is in the craft"
          description="We're not a body shop churning out templates. We're a senior team that treats your product like our own."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.08}>
              <div className="h-full rounded-3xl">
                <div className="flex h-full flex-col rounded-3xl border border-border/60 bg-card p-6">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/25">
                    <FontAwesomeIcon icon={item.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
