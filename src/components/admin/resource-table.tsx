"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useResourceList, useResourceMutations } from "@/lib/admin/hooks";
import { Spinner, EmptyState, ConfirmDialog } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function ResourceTable<T extends { _id?: string }>({
  resource,
  label,
  columns,
  editHref,
  statusOptions,
}: {
  resource: string;
  label: string;
  columns: Column<T>[];
  editHref: (id: string) => string;
  statusOptions?: { value: string; label: string }[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const { data, isLoading } = useResourceList<T>(resource, {
    search,
    status: status === "All" ? "" : status,
    page,
    limit: 10,
  });
  const { remove } = useResourceMutations<T>(resource, label);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full rounded-xl border border-border/60 bg-surface-2/60 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500/60"
          />
        </div>
        {statusOptions && (
          <div className="flex flex-wrap gap-1.5">
            {[{ value: "All", label: "All" }, ...statusOptions].map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setStatus(o.value);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  status === o.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && !data ? (
        <Spinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState label={`No ${label.toLowerCase()} found.`} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-surface-2/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {columns.map((c) => (
                    <th key={c.header} className={cn("px-4 py-3 font-semibold", c.className)}>
                      {c.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr key={row._id} className="border-b border-border/40 last:border-0 hover:bg-surface-2/30">
                    {columns.map((c) => (
                      <td key={c.header} className={cn("px-4 py-3 align-middle", c.className)}>
                        {c.cell(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={editHref(row._id!)}
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-500"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} className="size-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(row._id!)}
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <FontAwesomeIcon icon={faTrash} className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.pages} · {data.total} total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={data.page === 1}
              className="grid size-9 place-items-center rounded-lg border border-border/60 disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="size-3" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={data.page === data.pages}
              className="grid size-9 place-items-center rounded-lg border border-border/60 disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faChevronRight} className="size-3" />
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={remove.isPending}
        onConfirm={() => {
          if (toDelete)
            remove.mutate(toDelete, { onSuccess: () => setToDelete(null) });
        }}
      />
    </div>
  );
}
