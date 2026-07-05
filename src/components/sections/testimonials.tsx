"use client";

import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { TestimonialCard } from "@/components/cards";
import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;
  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[140px]"
      />
      <Container>
        <SectionHeading
          eyebrow="Loved by clients"
          title="Don't just take our word for it"
          description="We measure success by the results and relationships we build. Here's what our clients say."
        />
        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {testimonials.map((t, i) => (
            <Reveal key={t._id ?? t.name} delay={(i % 3) * 0.08}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
