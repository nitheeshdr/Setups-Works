"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSpinner, faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { Field, TextInput, TextArea, ImageUploader } from "@/components/admin/ui";
import { useResourceMutations } from "@/lib/admin/hooks";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

const empty: Partial<Testimonial> = {
  name: "", role: "", company: "", photo: "", rating: 5, review: "", showOnHome: true,
};

export function TestimonialForm({ initial }: { initial?: Testimonial }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState<Partial<Testimonial>>(initial ?? empty);
  const { create, update } = useResourceMutations<Testimonial>("testimonials", "Testimonial");
  const set = <K extends keyof Testimonial>(k: K, v: Testimonial[K]) => setForm((f) => ({ ...f, [k]: v }));

  function save() {
    if (!form.name || !form.review) {
      toast.error("Name and review are required.");
      return;
    }
    if (isEdit) update.mutate({ id: initial!._id!, data: form }, { onSuccess: () => router.push("/admin/testimonials") });
    else create.mutate(form, { onSuccess: () => router.push("/admin/testimonials") });
  }
  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/testimonials" className="grid size-9 place-items-center rounded-lg border border-border/60">
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {isEdit ? "Edit testimonial" : "New testimonial"}
          </h1>
        </div>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          <FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} className={saving ? "size-4 animate-spin" : "size-4"} />
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-6">
        <Field label="Photo"><ImageUploader value={form.photo} onChange={(u) => set("photo", u)} label="Photo" /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name"><TextInput value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Role"><TextInput value={form.role} onChange={(e) => set("role", e.target.value)} /></Field>
        </div>
        <Field label="Company"><TextInput value={form.company} onChange={(e) => set("company", e.target.value)} /></Field>
        <Field label="Rating">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => set("rating", n)}>
                <FontAwesomeIcon icon={faStar} className={cn("size-6", n <= (form.rating ?? 0) ? "text-amber-400" : "text-muted-foreground/30")} />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Review"><TextArea rows={4} value={form.review} onChange={(e) => set("review", e.target.value)} /></Field>
        <label className="flex items-center justify-between text-sm font-medium">
          Show on homepage
          <input type="checkbox" checked={!!form.showOnHome} onChange={(e) => set("showOnHome", e.target.checked)} className="size-4 accent-[var(--brand-500)]" />
        </label>
      </div>
    </div>
  );
}
