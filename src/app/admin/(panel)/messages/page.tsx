"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faCircle,
  faTrash,
  faEnvelopeOpen,
  faReply,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, Spinner, EmptyState, ConfirmDialog } from "@/components/admin/ui";
import { api, exportCsv, type Paginated } from "@/lib/admin/api";
import { formatDate } from "@/lib/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ContactMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminMessagesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery<Paginated<ContactMessage>>({
    queryKey: ["contact", search],
    queryFn: () => api.get(`/contact?search=${encodeURIComponent(search)}&limit=50`).then((r) => r.data),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["contact"] });

  const toggleReplied = useMutation({
    mutationFn: ({ id, replied }: { id: string; replied: boolean }) =>
      api.patch(`/contact/${id}`, { replied }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      invalidate();
      toast.success("Message deleted");
      setToDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeader title="Messages" description={`${data?.unread ?? 0} unread of ${data?.total ?? 0} total`} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages…" className="w-full rounded-xl border border-border/60 bg-surface-2/60 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500/60" />
        </div>
        <button type="button" onClick={() => exportCsv("contact")} className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand-500/40">
          <FontAwesomeIcon icon={faDownload} className="size-3.5" /> Export CSV
        </button>
      </div>

      {isLoading && !data ? (
        <Spinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState label="No messages yet." />
      ) : (
        <div className="space-y-2">
          {data.items.map((m) => (
            <div key={m._id} className={cn("flex items-center gap-4 rounded-2xl border bg-card/50 p-4 transition-colors", m.replied ? "border-border/60" : "border-brand-500/30")}>
              {!m.replied && <FontAwesomeIcon icon={faCircle} className="size-2 shrink-0 text-brand-500" />}
              <button type="button" onClick={() => setActive(m)} className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{m.name}</p>
                  <span className="truncate text-xs text-muted-foreground">· {m.email}</span>
                </div>
                <p className="truncate text-sm text-muted-foreground">{m.subject} — {m.message}</p>
              </button>
              <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{formatDate(m.createdAt)}</span>
              <div className="flex shrink-0 gap-1">
                <button type="button" title={m.replied ? "Mark unread" : "Mark replied"} onClick={() => toggleReplied.mutate({ id: m._id!, replied: !m.replied })} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-brand-500/10 hover:text-brand-500">
                  <FontAwesomeIcon icon={m.replied ? faEnvelopeOpen : faReply} className="size-3.5" />
                </button>
                <button type="button" onClick={() => setToDelete(m._id!)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <FontAwesomeIcon icon={faTrash} className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read modal */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.subject}</DialogTitle>
            <DialogDescription>
              From {active?.name} · {active?.email}
              {active?.company ? ` · ${active.company}` : ""}
              {active?.budget ? ` · Budget: ${active.budget}` : ""}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{active?.message}</p>
          <div className="flex justify-end gap-2 pt-2">
            <a href={`mailto:${active?.email}?subject=Re: ${active?.subject}`} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Reply by email</a>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} loading={remove.isPending} onConfirm={() => toDelete && remove.mutate(toDelete)} title="Delete message?" />
    </>
  );
}
