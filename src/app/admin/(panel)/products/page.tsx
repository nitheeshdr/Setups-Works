"use client";

import Image from "next/image";
import { AdminHeader, StatusBadge } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import type { Product } from "@/lib/types";

const columns: Column<Product>[] = [
  {
    header: "Product",
    cell: (p) => (
      <div className="flex items-center gap-3">
        {p.logo && (
          <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-surface-2">
            <Image src={p.logo} alt="" fill sizes="40px" className="object-contain p-1.5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{p.name}</p>
          <p className="truncate text-xs text-muted-foreground">{p.category}</p>
        </div>
      </div>
    ),
  },
  { header: "Version", cell: (p) => <span className="text-muted-foreground">{p.version || "—"}</span> },
  { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
];

export default function AdminProductsPage() {
  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage your software products."
        action={{ label: "New product", href: "/admin/products/new" }}
      />
      <ResourceTable<Product>
        resource="products"
        label="Products"
        columns={columns}
        editHref={(id) => `/admin/products/${id}`}
        statusOptions={[
          { value: "live", label: "Live" },
          { value: "beta", label: "Beta" },
          { value: "coming-soon", label: "Coming Soon" },
          { value: "archived", label: "Archived" },
        ]}
      />
    </>
  );
}
