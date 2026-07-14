"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
  faChevronDown,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCommandPalette } from "@/components/layout/command-palette";
import { PremiumButton } from "@/components/premium-button";
import { mainNav } from "@/data/nav";
import { services, serviceCategories } from "@/data/services";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { open: openCommand } = useCommandPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4 lg:px-6">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]",
          scrolled
            ? "my-2 rounded-2xl border border-border/60 bg-background/70 py-2.5 backdrop-blur-xl sm:my-3"
            : "border border-transparent py-4",
        )}
      >
        <Logo priority className="justify-self-start" />

        {/* Desktop nav (centered) */}
        <nav className="hidden items-center gap-1 justify-self-center lg:flex">
          {mainNav.map((link) =>
            link.label === "Services" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn(
                      "size-2.5 transition-transform",
                      servicesOpen && "rotate-180",
                    )}
                  />
                </Link>
                <AnimatePresence>
                  {servicesOpen && <MegaMenu />}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                  />
                )}
              </Link>
            ),
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={openCommand}
            aria-label="Search"
            className="hidden items-center gap-2 rounded-lg border border-border/60 bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="size-3" />
            <span>Search</span>
            <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <div className="hidden lg:block">
            <PremiumButton
              href="/contact"
              size="md"
              icon={faArrowRight}
              className="whitespace-nowrap"
            >
              Start a project
            </PremiumButton>
          </div>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-grid size-9 place-items-center rounded-lg border border-border/60 bg-surface-2/60 text-foreground lg:hidden"
          >
            <FontAwesomeIcon
              icon={mobileOpen ? faXmark : faBars}
              className="size-4"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu — shares the header's container so its edges line up
          with the logo and menu button above it. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-7xl px-5 sm:px-8 lg:hidden"
          >
            <nav className="mt-2 flex flex-col rounded-2xl border border-border/60 bg-background/95 p-3 backdrop-blur-xl">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-brand-500/10 text-brand-500"
                      : "text-foreground hover:bg-surface-2",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <PremiumButton
                href="/contact"
                className="mt-3 w-full"
                icon={faArrowRight}
              >
                Start a project
              </PremiumButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-[4.5rem] z-50 w-[min(96vw,1080px)] -translate-x-1/2 px-2"
    >
      {/* invisible hover bridge to the navbar so the menu stays open */}
      <div aria-hidden className="absolute inset-x-0 -top-8 h-8" />
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/90 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="grid lg:grid-cols-[1fr_300px]">
          {/* Services grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 p-5 md:grid-cols-3">
            {serviceCategories.map((cat) => (
              <div key={cat} className="p-1.5">
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-brand-500">
                  {cat}
                </p>
                {services
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-500 transition-all group-hover:bg-brand-500 group-hover:text-white">
                        <FontAwesomeIcon icon={s.icon} className="size-3" />
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {s.title}
                      </span>
                    </Link>
                  ))}
              </div>
            ))}
          </div>

          {/* Featured panel */}
          <div className="relative flex flex-col justify-between gap-4 border-t border-border/60 bg-gradient-to-br from-brand-500/15 via-transparent to-violet-500/10 p-6 lg:border-l lg:border-t-0">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Featured
              </span>
              <h4 className="mt-3 font-display text-lg font-bold tracking-tight">
                CodeForge AI
              </h4>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Our AI-powered platform that helps developers ship software
                faster. Coming soon.
              </p>
              <Link
                href="/products/codeforgeai-io"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 transition-all hover:gap-2.5"
              >
                Join the waitlist
                <FontAwesomeIcon icon={faArrowRight} className="size-3" />
              </Link>
            </div>
            <Link
              href="/contact"
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 text-sm font-medium transition-colors hover:border-brand-500/40"
            >
              Book a free consult
              <FontAwesomeIcon
                icon={faArrowRight}
                className="size-3 text-brand-500"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
