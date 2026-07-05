"use client";

import Image from "next/image";
import { AdminHeader, StatusBadge } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import { formatDate } from "@/lib/helpers";
import type { Blog } from "@/lib/types";

const columns: Column<Blog>[] = [
  {
    header: "Title",
    cell: (b) => (
      <div className="flex items-center gap-3">
        {b.featuredImage && (
          <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60">
            <Image src={b.featuredImage} alt="" fill sizes="40px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{b.title}</p>
          <p className="truncate text-xs text-muted-foreground">/{b.slug}</p>
        </div>
      </div>
    ),
  },
  { header: "Category", cell: (b) => <span className="text-muted-foreground">{b.category}</span> },
  { header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
  { header: "Date", cell: (b) => <span className="text-muted-foreground">{formatDate(b.publishedAt || b.createdAt)}</span> },
];

export default function AdminBlogsPage() {
  return (
    <>
      <AdminHeader
        title="Blog Posts"
        description="Create, edit, and publish articles."
        action={{ label: "New post", href: "/admin/blogs/new" }}
      />
      <ResourceTable<Blog>
        resource="blogs"
        label="Posts"
        columns={columns}
        editHref={(id) => `/admin/blogs/${id}`}
        statusOptions={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
          { value: "scheduled", label: "Scheduled" },
        ]}
      />
    </>
  );
}
