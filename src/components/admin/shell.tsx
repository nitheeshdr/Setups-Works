"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faNewspaper,
  faCube,
  faBriefcase,
  faComments,
  faEnvelope,
  faUsers,
  faImages,
  faBuildingColumns,
  faGear,
  faRightFromBracket,
  faBars,
  faXmark,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Logo, LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { api } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";
import { initials } from "@/lib/helpers";

const nav = [
  { label: "Dashboard", href: "/admin", icon: faGaugeHigh },
  { label: "Blogs", href: "/admin/blogs", icon: faNewspaper },
  { label: "Products", href: "/admin/products", icon: faCube },
  { label: "Portfolio", href: "/admin/portfolio", icon: faBriefcase },
  { label: "Testimonials", href: "/admin/testimonials", icon: faComments },
  { label: "Client Logos", href: "/admin/logos", icon: faBuildingColumns },
  { label: "Messages", href: "/admin/messages", icon: faEnvelope },
  { label: "Subscribers", href: "/admin/subscribers", icon: faUsers },
  { label: "Media", href: "/admin/media", icon: faImages },
  { label: "Settings", href: "/admin/settings", icon: faGear },
];

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function logout() {
    await api.post("/auth/logout");
    router.push("/admin/login");
    router.refresh();
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <LogoMark className="size-9 text-sm" />
        <span className="font-display text-sm font-bold tracking-tight">
          Setups Works
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-brand-500/10 text-brand-500"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <FontAwesomeIcon icon={item.icon} className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border/60 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-4" />
          View site
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/60 bg-surface-2/40 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border/60 bg-background lg:hidden">
            {SidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/70 px-5 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-grid size-9 place-items-center rounded-lg border border-border/60 lg:hidden"
          >
            <FontAwesomeIcon
              icon={mobileOpen ? faXmark : faBars}
              className="size-4"
            />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-500">
              {initials(user.name)}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
