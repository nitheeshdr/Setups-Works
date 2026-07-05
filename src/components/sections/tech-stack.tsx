"use client";

import LogoLoop from "@/components/reactbits/LogoLoop";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { techStack } from "@/data/site-content";

function Row({
  items,
  direction,
}: {
  items: { name: string }[];
  direction: "left" | "right";
}) {
  const logos = items.map((it) => ({
    node: (
      <span className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border/60 bg-card/60 px-5 py-2.5 font-medium text-foreground/80 backdrop-blur-sm">
        <span className="size-2 rounded-full bg-brand-500" />
        {it.name}
      </span>
    ),
    title: it.name,
  }));
  return (
    <LogoLoop logos={logos} speed={40} direction={direction} gap={20} fadeOut pauseOnHover />
  );
}

export function TechStackSection() {
  return (
    <Section className="relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="Our toolkit"
          title="Built on a modern, battle-tested stack"
          description="We choose technology that's fast, maintainable, and proven at scale — never trends for the sake of trends."
        />
      </Container>
      <div className="mt-14 space-y-5">
        {techStack.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.05}>
            <Row items={group.items} direction={i % 2 === 0 ? "left" : "right"} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
