"use client";

import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop";
import { Container } from "@/components/section";
import type { ClientLogo } from "@/lib/types";

export function ClientsMarquee({ logos }: { logos: ClientLogo[] }) {
  if (!logos.length) return null;

  const items: LogoItem[] = logos.map((c) =>
    c.logo
      ? {
          src: c.logo,
          alt: c.name,
          title: c.name,
          href: c.url || undefined,
          height: 40,
        }
      : {
          node: (
            <span className="select-none whitespace-nowrap font-display text-xl font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-2xl">
              {c.name}
            </span>
          ),
          title: c.name,
          href: c.url || undefined,
        },
  );

  return (
    <div className="py-10">
      <Container>
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by ambitious teams worldwide
        </p>
      </Container>
      <LogoLoop
        logos={items}
        speed={60}
        direction="left"
        gap={72}
        logoHeight={40}
        pauseOnHover
        fadeOut
        ariaLabel="Our clients"
      />
    </div>
  );
}
