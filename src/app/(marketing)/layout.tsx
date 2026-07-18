import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPaletteProvider } from "@/components/layout/command-palette";
import { PageTransition } from "@/components/layout/page-transition";
import { ScrollProgress } from "@/components/layout/scroll-progress";

import { getSettings } from "@/lib/content";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <CommandPaletteProvider>
      <ScrollProgress />
      <Navbar logoLight={settings.logoLight} logoDark={settings.logoDark} />
      <PageTransition>{children}</PageTransition>
      <Footer logoLight={settings.logoLight} logoDark={settings.logoDark} />
    </CommandPaletteProvider>
  );
}
