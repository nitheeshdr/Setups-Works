"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import GradientText from "@/components/reactbits/GradientText";
import { whyChooseUs } from "@/data/site-content";

export function WhyUsSection() {
  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 size-[420px] rounded-full bg-brand-500/10 blur-[130px]"
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>Why SETUPS WORKS</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
                The difference is in the{" "}
                <GradientText
                  colors={["#4D86F7", "#8B5CF6", "#4D86F7"]}
                  className="inline-block !mx-0"
                >
                  craft
                </GradientText>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-muted-foreground text-balance">
                We&apos;re not a body shop churning out templates. We&apos;re a
                senior team that treats your product like our own — obsessing
                over performance, polish, and the details that make software
                feel premium.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600"
              >
                Our story
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <SpotlightCard
                  className="h-full !bg-card/50 border-border/60 backdrop-blur-sm"
                  spotlightColor="rgba(139, 92, 246, 0.18)"
                >
                  <div className="flex flex-col gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white">
                      <FontAwesomeIcon icon={item.icon} className="size-5" />
                    </span>
                    <h3 className="font-display font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
