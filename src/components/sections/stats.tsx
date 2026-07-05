"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { AnimatedStat } from "@/components/interactive";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { stats } from "@/data/site-content";

export function StatsSection() {
  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <SpotlightCard
                className="!bg-card/50 border-border/60 backdrop-blur-sm"
                spotlightColor="rgba(77, 134, 247, 0.18)"
              >
                <div className="flex flex-col gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                    <FontAwesomeIcon icon={s.icon} className="size-5" />
                  </span>
                  <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    <AnimatedStat value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
