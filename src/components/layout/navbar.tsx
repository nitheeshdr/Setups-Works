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
import { MagneticButton } from "@/components/interactive";
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
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8",
          scrolled
            ? "my-2 rounded-2xl border border-border/60 bg-background/70 py-2.5 backdrop-blur-xl sm:my-3"
            : "border border-transparent py-4",
        )}
      >
        <Logo priority />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
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
        <div className="flex items-center gap-2">
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
            <MagneticButton href="/contact" size="default" icon={faArrowRight} strength={2}>
              Start a project
            </MagneticButton>
          </div>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-grid size-9 place-items-center rounded-lg border border-border/60 bg-surface-2/60 text-foreground lg:hidden"
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="size-4" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-3 mt-1 rounded-2xl border border-border/60 bg-background/95 p-4 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col">
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
              <MagneticButton href="/contact" className="mt-3 w-full" icon={faArrowRight}>
                Start a project
              </MagneticButton>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-1/2 top-full z-50 w-[min(92vw,720px)] -translate-x-1/2 pt-3"
    >
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-3">
        {serviceCategories.map((cat) => (
          <div key={cat} className="p-2">
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {cat}
            </p>
            {services
              .filter((s) => s.category === cat)
              .slice(0, 4)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-surface-2"
                >
                  <span className="grid size-7 place-items-center rounded-md bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <FontAwesomeIcon icon={s.icon} className="size-3" />
                  </span>
                  <span className="text-foreground">{s.title}</span>
                </Link>
              ))}
          </div>
        ))}
        <div className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-gradient-to-r from-brand-500/15 to-violet-500/10 p-3 md:col-span-3">
          <p className="text-sm font-medium">Not sure what you need?</p>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:gap-2.5 transition-all"
          >
            Book a free consult
            <FontAwesomeIcon icon={faArrowRight} className="size-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
