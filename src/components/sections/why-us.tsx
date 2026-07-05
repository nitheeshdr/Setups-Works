"use client";

import dynamic from "next/dynamic";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import type { ChromaItem } from "@/components/reactbits/ChromaGrid";

const ChromaGrid = dynamic(() => import("@/components/reactbits/ChromaGrid"), {
  ssr: false,
});

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`;

const items: ChromaItem[] = [
  {
    image: img("1517180102446-f3ece451e9d8"),
    title: "Premium craft",
    subtitle: "Every pixel is intentional",
    handle: "01",
    borderColor: "#4D86F7",
    gradient: "linear-gradient(145deg, #4D86F7, #05060a)",
    url: "/about",
  },
  {
    image: img("1451187580459-43490279c0fa"),
    title: "Ship fast, ship right",
    subtitle: "Weekly increments to market",
    handle: "02",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(145deg, #8B5CF6, #05060a)",
    url: "/about",
  },
  {
    image: img("1558494949-ef010cbdcc31"),
    title: "Built to scale",
    subtitle: "Clean, typed architecture",
    handle: "03",
    borderColor: "#0EA5E9",
    gradient: "linear-gradient(145deg, #0EA5E9, #05060a)",
    url: "/about",
  },
  {
    image: img("1600880292203-757bb62b4baf"),
    title: "True partnership",
    subtitle: "An extension of your team",
    handle: "04",
    borderColor: "#10B981",
    gradient: "linear-gradient(145deg, #10B981, #05060a)",
    url: "/about",
  },
];

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
        <Reveal className="mt-14">
          <div className="why-chroma relative min-h-[420px]">
            <ChromaGrid items={items} radius={320} damping={0.45} fadeOut={0.6} />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
