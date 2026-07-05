"use client";

import { useState } from "react";
import Image from "next/image";
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
  ImageUploader,
  Spinner,
  EmptyState,
  ConfirmDialog,
} from "@/components/admin/ui";
import { useResourceList, useResourceMutations } from "@/lib/admin/hooks";
import type { ClientLogo } from "@/lib/types";

export default function AdminLogosPage() {
  const { data, isLoading } = useResourceList<ClientLogo>("logos", { limit: 100 });
  const { create, update, remove } = useResourceMutations<ClientLogo>("logos", "Logo");

  const [draft, setDraft] = useState<{ name: string; logo: string; url: string }>({
    name: "",
    logo: "",
    url: "",
  });
  const [toDelete, setToDelete] = useState<string | null>(null);

  const logos = data?.items ?? [];

  function addLogo() {
    if (!draft.name || !draft.logo) {
      toast.error("A name and an uploaded image are required.");
      return;
    }
    create.mutate(
      { ...draft, order: logos.length },
      { onSuccess: () => setDraft({ name: "", logo: "", url: "" }) },
    );
  }

  function move(index: number, dir: -1 | 1) {
    const a = logos[index];
    const b = logos[index + dir];
    if (!a || !b) return;
    update.mutate({ id: a._id!, data: { order: b.order } });
    update.mutate({ id: b._id!, data: { order: a.order } });
  }

  return (
    <>
      <AdminHeader
        title="Client Logos"
        description="Manage the looping logo marquee on the homepage."
      />

      {/* Add new */}
      <div className="mb-8 rounded-2xl border border-border/60 bg-card/50 p-6">
        <p className="mb-4 text-sm font-semibold">Add a logo</p>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Field label="Logo image" className="lg:col-span-1">
            <ImageUploader value={draft.logo} onChange={(logo) => setDraft((d) => ({ ...d, logo }))} label="Logo" />
          </Field>
          <div className="space-y-3">
            <Field label="Company name">
              <TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Acme Inc." />
            </Field>
            <Field label="Link (optional)">
              <TextInput value={draft.url} onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))} placeholder="https://acme.com" />
            </Field>
          </div>
          <button
            type="button"
            onClick={addLogo}
            disabled={create.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            <FontAwesomeIcon icon={create.isPending ? faSpinner : faPlus} className={create.isPending ? "size-3.5 animate-spin" : "size-3.5"} />
            Add logo
          </button>
        </div>
      </div>

      {/* List */}
      {isLoading && !data ? (
        <Spinner />
      ) : logos.length === 0 ? (
        <EmptyState label="No client logos yet. Add your first above." />
      ) : (
        <div className="space-y-3">
          {logos.map((logo, i) => (
            <LogoRow
              key={logo._id}
              logo={logo}
              isFirst={i === 0}
              isLast={i === logos.length - 1}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
              onSave={(data) => update.mutate({ id: logo._id!, data })}
              onDelete={() => setToDelete(logo._id!)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={remove.isPending}
        title="Delete logo?"
        onConfirm={() => toDelete && remove.mutate(toDelete, { onSuccess: () => setToDelete(null) })}
      />
    </>
  );
}

function LogoRow({
  logo,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onSave,
  onDelete,
}: {
  logo: ClientLogo;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSave: (data: Partial<ClientLogo>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(logo.name);
  const [url, setUrl] = useState(logo.url ?? "");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 sm:flex-row sm:items-center">
      <div className="relative h-12 w-24 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-white/90">
        {logo.logo ? (
          <Image src={logo.logo} alt={logo.name} fill sizes="96px" className="object-contain p-1.5" />
        ) : (
          <span className="grid h-full place-items-center text-xs text-muted-foreground">No image</span>
        )}
      </div>

      <div className="grid flex-1 gap-3 sm:grid-cols-3">
        <ImageUploader value={logo.logo} onChange={(l) => onSave({ logo: l })} label="Logo" />
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name !== logo.name && onSave({ name })}
          placeholder="Company name"
        />
        <TextInput
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => url !== (logo.url ?? "") && onSave({ url })}
          placeholder="https://…"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 self-end sm:self-center">
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
