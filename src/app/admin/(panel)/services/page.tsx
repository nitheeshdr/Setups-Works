"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminHeader, StatusBadge } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import { resolveServiceIcon } from "@/lib/service-icons";
import type { Service } from "@/lib/types";

const columns: Column<Service>[] = [
  {
    header: "Service",
    cell: (s) => (
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
          <FontAwesomeIcon icon={resolveServiceIcon(s.icon)} className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{s.title}</p>
          <p className="truncate text-xs text-muted-foreground">{s.short}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Category",
    cell: (s) => <span className="text-muted-foreground">{s.category}</span>,
  },
  {
    header: "Order",
    cell: (s) => <span className="font-mono text-muted-foreground">{s.order ?? 0}</span>,
  },
  { header: "Status", cell: (s) => <StatusBadge status={s.status ?? "published"} /> },
];

export default function AdminServicesPage() {
  return (
    <>
      <AdminHeader
        title="Services"
        description="Manage the services shown across the site, the mega menu, and each detail page."
        action={{ label: "New service", href: "/admin/services/new" }}
      />
      <ResourceTable<Service>
        resource="services"
        label="Services"
        columns={columns}
        editHref={(id) => `/admin/services/${id}`}
        statusOptions={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
        ]}
      />
    </>
  );
}
