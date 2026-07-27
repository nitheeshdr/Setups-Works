"use client";

import { AdminHeader } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/types";

/** CRM sync outcome — surfaced so a failed push is visible, not silent. */
function CrmBadge({ lead }: { lead: Lead }) {
  const map = {
    synced: "border-emerald-500/30 bg-emerald-500/15 text-emerald-500",
    failed: "border-red-500/30 bg-red-500/15 text-red-500",
    pending: "border-amber-500/30 bg-amber-500/15 text-amber-500",
  } as const;
  const status = lead.crmStatus ?? "pending";
  return (
    <span
      title={lead.crmError || undefined}
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        map[status],
      )}
    >
      {status}
    </span>
  );
}

const columns: Column<Lead>[] = [
  {
    header: "Lead",
    cell: (l) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{l.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {l.email}
          {l.company ? ` · ${l.company}` : ""}
        </p>
      </div>
    ),
  },
  {
    header: "Type",
    cell: (l) => (
      <span
        className={cn(
          "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
          l.type === "quotation"
            ? "border-brand-500/30 bg-brand-500/15 text-brand-500"
            : "border-violet-500/30 bg-violet-500/15 text-violet-400",
        )}
      >
        {l.type === "quotation" ? "Quotation" : "Enquiry"}
      </span>
    ),
  },
  {
    header: "Service",
    cell: (l) => (
      <span className="text-muted-foreground">{l.service || "—"}</span>
    ),
  },
  {
    header: "Phone",
    cell: (l) => <span className="text-muted-foreground">{l.phonenumber}</span>,
  },
  { header: "CRM", cell: (l) => <CrmBadge lead={l} /> },
];

export default function AdminLeadsPage() {
  return (
    <>
      <AdminHeader
        title="Leads"
        description="Quotation requests and enquiries from the website. Each one is also pushed to Perfex CRM and emailed."
      />
      <ResourceTable<Lead>
        resource="leads"
        label="Leads"
        columns={columns}
        statusOptions={[
          { value: "quotation", label: "Quotation" },
          { value: "enquiry", label: "Enquiry" },
        ]}
      />
    </>
  );
}
