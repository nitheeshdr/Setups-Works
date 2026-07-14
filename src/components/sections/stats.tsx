"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { AnimatedStat } from "@/components/interactive";
import { stats } from "@/data/site-content";

export function StatsSection() {
  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="By the numbers"
          title="Numbers that speak for themselves"
          description="Eight years of craft, hundreds of launches, and a client roster that keeps coming back."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="h-full rounded-2xl">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <FontAwesomeIcon icon={s.icon} className="size-5" />
                  </span>
                  <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    <AnimatedStat value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
