import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPaletteProvider } from "@/components/layout/command-palette";
import { PageTransition } from "@/components/layout/page-transition";
import { ScrollProgress } from "@/components/layout/scroll-progress";

import { getSettings, getServices } from "@/lib/content";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  // Services are DB-backed, and both the mega menu and the command palette are
  // client components — so this server layout fetches once and passes them down
  // rather than each of them importing a static array.
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <CommandPaletteProvider services={services}>
      <ScrollProgress />
      <Navbar
        logoLight={settings.logoLight}
        logoDark={settings.logoDark}
        services={services}
      />
      <PageTransition>{children}</PageTransition>
      <Footer logoLight={settings.logoLight} logoDark={settings.logoDark} />
    </CommandPaletteProvider>
  );
}
