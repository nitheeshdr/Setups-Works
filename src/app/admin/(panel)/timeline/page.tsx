"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faArrowUp,
  faArrowDown,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  AdminHeader,
  Field,
  TextInput,
  TextArea,
  Spinner,
  EmptyState,
  ConfirmDialog,
} from "@/components/admin/ui";
import { useResourceList, useResourceMutations } from "@/lib/admin/hooks";
import type { Milestone } from "@/lib/types";

export default function AdminTimelinePage() {
  const { data, isLoading } = useResourceList<Milestone>("timeline", { limit: 100 });
  const { create, update, remove } = useResourceMutations<Milestone>("timeline", "Milestone");

  const [draft, setDraft] = useState({ year: "", title: "", description: "" });
  const [toDelete, setToDelete] = useState<string | null>(null);
  const items = data?.items ?? [];

  function add() {
    if (!draft.year || !draft.title) {
      toast.error("Year and title are required.");
      return;
    }
    create.mutate(
      { ...draft, order: items.length },
      { onSuccess: () => setDraft({ year: "", title: "", description: "" }) },
    );
  }

  function move(index: number, dir: -1 | 1) {
    const a = items[index];
    const b = items[index + dir];
    if (!a || !b) return;
    update.mutate({ id: a._id!, data: { order: b.order } });
    update.mutate({ id: b._id!, data: { order: a.order } });
  }

  return (
    <>
      <AdminHeader
        title="Timeline"
        description="Manage the journey milestones on the About page."
      />

      <div className="mb-8 rounded-2xl border border-border/60 bg-card/50 p-6">
        <p className="mb-4 text-sm font-semibold">Add a milestone</p>
        <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-start">
          <Field label="Year"><TextInput value={draft.year} onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))} placeholder="2026" /></Field>
          <Field label="Title"><TextInput value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="A milestone" /></Field>
        </div>
        <Field label="Description" className="mt-4"><TextArea rows={2} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} /></Field>
        <button
          type="button"
          onClick={add}
          disabled={create.isPending}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          <FontAwesomeIcon icon={create.isPending ? faSpinner : faPlus} className={create.isPending ? "size-3.5 animate-spin" : "size-3.5"} />
          Add milestone
        </button>
      </div>

      {isLoading && !data ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState label="No milestones yet. Add your first above." />
      ) : (
        <div className="space-y-3">
          {items.map((m, i) => (
            <Row
              key={m._id}
              milestone={m}
              isFirst={i === 0}
              isLast={i === items.length - 1}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
              onSave={(d) => update.mutate({ id: m._id!, data: d })}
              onDelete={() => setToDelete(m._id!)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={remove.isPending}
        title="Delete milestone?"
        onConfirm={() => toDelete && remove.mutate(toDelete, { onSuccess: () => setToDelete(null) })}
      />
    </>
  );
}

function Row({
  milestone,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onSave,
  onDelete,
}: {
  milestone: Milestone;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSave: (d: Partial<Milestone>) => void;
  onDelete: () => void;
}) {
  const [year, setYear] = useState(milestone.year);
  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(milestone.description);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 lg:flex-row lg:items-start">
      <div className="grid flex-1 gap-3 sm:grid-cols-[120px_1fr]">
        <TextInput value={year} onChange={(e) => setYear(e.target.value)} onBlur={() => year !== milestone.year && onSave({ year })} />
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== milestone.title && onSave({ title })} />
        <TextArea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => description !== milestone.description && onSave({ description })} className="sm:col-span-2" />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" disabled={isFirst} onClick={onMoveUp} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2 disabled:opacity-30">
          <FontAwesomeIcon icon={faArrowUp} className="size-3.5" />
        </button>
        <button type="button" disabled={isLast} onClick={onMoveDown} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2 disabled:opacity-30">
          <FontAwesomeIcon icon={faArrowDown} className="size-3.5" />
        </button>
        <button type="button" onClick={onDelete} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <FontAwesomeIcon icon={faTrash} className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
