"use client";

import Image from "next/image";
import { AdminHeader } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import type { Portfolio } from "@/lib/types";

const columns: Column<Portfolio>[] = [
  {
    header: "Project",
    cell: (p) => (
      <div className="flex items-center gap-3">
        {p.coverImage && (
          <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60">
            <Image src={p.coverImage} alt="" fill sizes="56px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{p.title}</p>
          <p className="truncate text-xs text-muted-foreground">{p.client}</p>
        </div>
      </div>
    ),
  },
  { header: "Category", cell: (p) => <span className="text-muted-foreground">{p.category}</span> },
  { header: "Year", cell: (p) => <span className="text-muted-foreground">{p.year}</span> },
  {
    header: "Featured",
    cell: (p) =>
      p.featured ? (
        <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-500">Yes</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

export default function AdminPortfolioPage() {
  return (
    <>
      <AdminHeader
        title="Portfolio"
        description="Manage your project case studies."
        action={{ label: "New project", href: "/admin/portfolio/new" }}
      />
      <ResourceTable<Portfolio>
        resource="portfolio"
        label="Projects"
        columns={columns}
        editHref={(id) => `/admin/portfolio/${id}`}
      />
    </>
  );
}
