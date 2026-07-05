"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSpinner,
  faXmark,
  faCloudArrowUp,
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "@/lib/admin/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

/* --------------------------- Page header -------------------------- */
export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <FontAwesomeIcon icon={faPlus} className="size-3.5" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ----------------------------- Fields ----------------------------- */
const baseField =
  "w-full rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500/60";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(baseField, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(baseField, "resize-y", props.className)} />;
}

export function SelectInput({
  options,
  ...props
}: InputHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)} className={cn(baseField, "appearance-none")}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* --------------------------- Tag input ---------------------------- */
export function TagInput({
  value,
  onChange,
  placeholder = "Add and press Enter",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  };
  return (
    <div className={cn(baseField, "flex flex-wrap items-center gap-2")}>
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-500">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
            <FontAwesomeIcon icon={faXmark} className="size-2.5" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder}
        className="min-w-24 flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}

/* -------------------------- Image uploader ------------------------ */
export function ImageUploader({
  value,
  onChange,
  label = "Image",
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handle(file?: File) {
    if (!file) return;
    setLoading(true);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-surface-2">
        {value ? (
          <Image src={value} alt={label} fill sizes="80px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center text-muted-foreground">
            <FontAwesomeIcon icon={faCloudArrowUp} className="size-5" />
          </span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-surface-2/60 px-4 py-2 text-sm font-medium transition-colors hover:border-brand-500/40">
          <FontAwesomeIcon icon={loading ? faSpinner : faCloudArrowUp} className={cn("size-3.5", loading && "animate-spin")} />
          {loading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handle(e.target.files?.[0])}
          />
        </label>
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          className="w-full rounded-lg border border-border/60 bg-surface-2/60 px-3 py-2 text-xs outline-none focus:border-brand-500/60"
        />
      </div>
    </div>
  );
}

/* ------------------------ Multi-image uploader -------------------- */
export function MultiImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-border/60">
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <FontAwesomeIcon icon={faTrash} className="size-2.5" />
            </button>
          </div>
        ))}
      </div>
      <ImageUploader onChange={(url) => onChange([...value, url])} />
    </div>
  );
}

/* --------------------------- Confirm delete ----------------------- */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  loading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span className="mb-2 grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <FontAwesomeIcon icon={faTriangleExclamation} className="size-5" />
          </span>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border/60 px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && <FontAwesomeIcon icon={faSpinner} className="size-3.5 animate-spin" />}
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------- Status badge ------------------------ */
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-500/15 text-emerald-500",
    live: "bg-emerald-500/15 text-emerald-500",
    draft: "bg-muted text-muted-foreground",
    scheduled: "bg-sky-500/15 text-sky-500",
    "coming-soon": "bg-amber-500/15 text-amber-500",
    beta: "bg-violet-500/15 text-violet-400",
    archived: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", styles[status] ?? "bg-muted text-muted-foreground")}>
      {status.replace("-", " ")}
    </span>
  );
}

/* ---------------------------- Empty state ------------------------- */
export function EmptyState({ label, action }: { label: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/60 py-16 text-center">
      <p className="text-muted-foreground">{label}</p>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white">
          <FontAwesomeIcon icon={faPlus} className="size-3.5" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <FontAwesomeIcon icon={faSpinner} className="size-6 animate-spin text-brand-500" />
    </div>
  );
}
