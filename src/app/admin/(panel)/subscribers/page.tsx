"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, Spinner, EmptyState, ConfirmDialog } from "@/components/admin/ui";
import { api, exportCsv, type Paginated } from "@/lib/admin/api";
import { formatDate } from "@/lib/helpers";
import type { Subscriber } from "@/lib/types";

export default function AdminSubscribersPage() {
  const qc = useQueryClient();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery<Paginated<Subscriber>>({
    queryKey: ["newsletter"],
    queryFn: () => api.get("/newsletter?limit=100").then((r) => r.data),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/newsletter/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsletter"] });
      toast.success("Subscriber removed");
      setToDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Subscribers" description={`${data?.total ?? 0} newsletter subscribers`} />

      <div className="mb-5 flex justify-end">
        <button type="button" onClick={() => exportCsv("newsletter")} className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand-500/40">
          <FontAwesomeIcon icon={faDownload} className="size-3.5" /> Export CSV
        </button>
      </div>

      {isLoading && !data ? (
        <Spinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState label="No subscribers yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-surface-2/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Subscribed</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((s) => (
                <tr key={s._id} className="border-b border-border/40 last:border-0 hover:bg-surface-2/30">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="size-3.5 text-muted-foreground" />
                      {s.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setToDelete(s._id!)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive ml-auto">
                      <FontAwesomeIcon icon={faTrash} className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} loading={remove.isPending} onConfirm={() => toDelete && remove.mutate(toDelete)} title="Remove subscriber?" />
    </>
  );
}
