"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Section, SectionHeading } from "@/components/section";
import { processSteps } from "@/data/site-content";

// Dummy images — swap these URLs for your own later.
const dummyImages = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=80",
];

function Card({
  i,
  n,
  sticky,
}: {
  i: number;
  n: number;
  sticky?: boolean;
}) {
  const step = processSteps[i];
  return (
    <div
      className="relative h-72 w-full overflow-hidden rounded-[2rem] border border-border/60 shadow-2xl shadow-black/20 sm:h-80"
      style={sticky ? { transform: `scale(${1 - (n - 1 - i) * 0.025})` } : undefined}
    >
      <img
        src={dummyImages[i]}
        alt={step.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
      <div className="relative flex h-full flex-col justify-center p-8 text-white sm:p-12">
        <div className="flex items-center gap-4">
          <span className="grid size-13 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/40 sm:size-14">
            <FontAwesomeIcon icon={step.icon} className="size-6" />
          </span>
          <span className="font-mono text-4xl font-bold text-white/25 sm:text-5xl">{step.step}</span>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {step.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">{step.description}</p>
      </div>
    </div>
  );
}

export function ScrollShowcase() {
  const n = processSteps.length;

  return (
    <Section className="relative">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A process built to ship"
          description="Six deliberate stages that turn ambitious ideas into products people love — with progress you can see every week."
        />

        {/* Sticky deck — cards stack as you scroll, on all breakpoints.
            top clears the fixed header (~72px) plus a per-card offset. */}
        <div className="relative mx-auto mt-12 flex max-w-4xl flex-col gap-6 sm:mt-14">
          {processSteps.map((_, i) => (
            <div key={i} className="sticky" style={{ top: `${88 + i * 16}px` }}>
              <Card i={i} n={n} sticky />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
