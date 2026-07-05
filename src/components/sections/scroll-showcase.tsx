"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Section, SectionHeading } from "@/components/section";
import { processSteps } from "@/data/site-content";

const gradients = [
  "from-brand-500/25 to-violet-500/10",
  "from-violet-500/25 to-fuchsia-500/10",
  "from-sky-500/25 to-brand-500/10",
  "from-emerald-500/25 to-teal-500/10",
  "from-amber-500/25 to-orange-500/10",
  "from-rose-500/25 to-brand-500/10",
];

export function ScrollShowcase() {
  const n = processSteps.length;

  return (
    <Section className="relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A process built to ship"
          description="Six deliberate stages that turn ambitious ideas into products people love — with progress you can see every week."
        />
      </Container>

      {/* Sticky scroll-stack (desktop) */}
      <Container className="mt-8 hidden lg:block">
        <div className="relative">
          {processSteps.map((step, i) => (
            <div key={step.step} className="h-[62vh]">
              <div
                className="sticky mx-auto w-full max-w-4xl"
                style={{ top: `${120 + i * 22}px` }}
              >
                <div
                  className={`flex items-center gap-8 rounded-[2rem] border border-border/60 bg-gradient-to-br ${gradients[i]} p-10 shadow-2xl shadow-black/10 backdrop-blur-xl`}
                  style={{ transform: `scale(${1 - (n - 1 - i) * 0.03})` }}
                >
                  <span className="hidden shrink-0 font-display text-8xl font-bold text-foreground/10 sm:block">
                    {step.step}
                  </span>
                  <div className="flex-1">
                    <span className="grid size-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                      <FontAwesomeIcon icon={step.icon} className="size-6" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Mobile fallback */}
      <Container className="mt-12 lg:hidden">
        <div className="space-y-4">
          {processSteps.map((step, i) => (
            <div
              key={step.step}
              className={`rounded-2xl border border-border/60 bg-gradient-to-br ${gradients[i]} p-6 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-500 text-white">
                  <FontAwesomeIcon icon={step.icon} className="size-5" />
                </span>
                <span className="font-mono text-3xl font-bold text-foreground/15">{step.step}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
