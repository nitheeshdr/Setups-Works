"use client";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import type { TeamMember } from "@/lib/types";

const columns: Column<TeamMember>[] = [
  {
    header: "Member",
    cell: (m) => (
      <div className="flex items-center gap-3">
        {m.photo && (
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full border border-border/60">
            <Image src={m.photo} alt="" fill sizes="36px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{m.name}</p>
          <p className="truncate text-xs text-muted-foreground">{m.role}</p>
        </div>
      </div>
    ),
  },
  { header: "Location", cell: (m) => <span className="text-muted-foreground">{m.location || "—"}</span> },
  { header: "Order", cell: (m) => <span className="text-muted-foreground">{m.order ?? 0}</span> },
  {
    header: "Status",
    cell: (m) =>
      m.status === "draft" ? (
        <span className="text-muted-foreground">Draft</span>
      ) : (
        <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-500">
          Published
        </span>
      ),
  },
];

export default function AdminTeamPage() {
  return (
    <>
      <AdminHeader
        title="Team"
        description="Manage team members. Each published member gets a profile page and becomes an employee edge on the company's schema."
        action={{ label: "New member", href: "/admin/team/new" }}
      />
      <ResourceTable<TeamMember> resource="team" label="Team" columns={columns} editHref={(id) => `/admin/team/${id}`} />
    </>
  );
}
