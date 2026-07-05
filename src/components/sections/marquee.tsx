"use client";

import LogoLoop from "@/components/reactbits/LogoLoop";
import { Container } from "@/components/section";
import { clients } from "@/data/site-content";

export function ClientsMarquee() {
  const logos = clients.map((c) => ({
    node: (
      <span className="select-none whitespace-nowrap font-display text-xl font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-2xl">
        {c.name}
      </span>
    ),
    title: c.name,
  }));

  return (
    <div className="py-10">
      <Container>
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by ambitious teams worldwide
        </p>
      </Container>
      <LogoLoop
        logos={logos}
        speed={60}
        direction="left"
        gap={72}
        pauseOnHover
        fadeOut
        ariaLabel="Our clients"
      />
    </div>
  );
}
