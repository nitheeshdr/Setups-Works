"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { AdminHeader } from "@/components/admin/ui";
import { ResourceTable, type Column } from "@/components/admin/resource-table";
import type { Testimonial } from "@/lib/types";

const columns: Column<Testimonial>[] = [
  {
    header: "Client",
    cell: (t) => (
      <div className="flex items-center gap-3">
        {t.photo && (
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full border border-border/60">
            <Image src={t.photo} alt="" fill sizes="36px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">{t.role}{t.company ? `, ${t.company}` : ""}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Rating",
    cell: (t) => (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className={i < t.rating ? "size-3 text-amber-400" : "size-3 text-muted-foreground/30"} />
        ))}
      </div>
    ),
  },
  {
    header: "Homepage",
    cell: (t) => (t.showOnHome ? <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-500">Shown</span> : <span className="text-muted-foreground">Hidden</span>),
  },
];

export default function AdminTestimonialsPage() {
  return (
    <>
      <AdminHeader title="Testimonials" description="Manage client reviews." action={{ label: "New testimonial", href: "/admin/testimonials/new" }} />
      <ResourceTable<Testimonial> resource="testimonials" label="Testimonials" columns={columns} editHref={(id) => `/admin/testimonials/${id}`} />
    </>
  );
}
