"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Section } from "@/components/section";
import { AuroraBackground } from "@/components/backgrounds";
import { MagneticButton } from "@/components/interactive";
import SplitText from "@/components/reactbits/SplitText";

export function CTASection() {
  return (
    <Section>
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-border/60 bg-card/40 px-6 py-16 text-center sm:px-12 sm:py-24">
          <AuroraBackground opacity={0.6} className="mask-fade-b" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40"
          />
          <SplitText
            text="Ready to build something great?"
            tag="h2"
            className="mx-auto max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl"
            splitType="words"
            delay={40}
            duration={0.7}
            textAlign="center"
          />
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground text-balance">
            Whether you have a fully-specced project or just a spark of an idea,
            we&apos;d love to hear it. Book a free, no-pressure consultation.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton href="/contact" size="lg" icon={faArrowRight}>
              Start a project
            </MagneticButton>
            <Link
              href="/portfolio"
              className="rounded-xl border border-border/60 bg-background/50 px-6 py-3 font-semibold backdrop-blur-sm transition-colors hover:border-brand-500/40"
            >
              Explore our work
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
