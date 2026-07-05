"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Field,
  TextInput,
  TextArea,
  TagInput,
  ImageUploader,
  MultiImageUploader,
} from "@/components/admin/ui";
import { useResourceMutations } from "@/lib/admin/hooks";
import { AIGenerate } from "@/components/admin/ai-generate";
import { slugify } from "@/lib/helpers";
import type { Portfolio } from "@/lib/types";

const empty: Partial<Portfolio> = {
  title: "", slug: "", category: "Web App", summary: "", coverImage: "",
  images: [], techStack: [], liveDemo: "", github: "", client: "",
  duration: "", year: "", caseStudy: "", featured: false,
};

export function PortfolioForm({ initial }: { initial?: Portfolio }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState<Partial<Portfolio>>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const { create, update } = useResourceMutations<Portfolio>("portfolio", "Project");
  const set = <K extends keyof Portfolio>(k: K, v: Portfolio[K]) => setForm((f) => ({ ...f, [k]: v }));
  const onAI = (data: Record<string, unknown>) =>
    setForm((f) => {
      const next = { ...f, ...data } as Partial<Portfolio>;
      if (!slugTouched && typeof data.title === "string")
        next.slug = slugify(data.title);
      return next;
    });

  function save() {
    if (!form.title || !form.category) {
      toast.error("Title and category are required.");
      return;
    }
    if (isEdit) update.mutate({ id: initial!._id!, data: form }, { onSuccess: () => router.push("/admin/portfolio") });
    else create.mutate(form, { onSuccess: () => router.push("/admin/portfolio") });
  }
  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/portfolio" className="grid size-9 place-items-center rounded-lg border border-border/60">
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {isEdit ? "Edit project" : "New project"}
          </h1>
        </div>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          <FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} className={saving ? "size-4 animate-spin" : "size-4"} />
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <AIGenerate
            type="portfolio"
            placeholder="e.g. A fintech dashboard for a neobank startup"
            onGenerated={onAI}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title">
              <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))} />
            </Field>
            <Field label="Slug">
              <TextInput value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
            </Field>
          </div>
          <Field label="Summary">
            <TextArea rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <Field label="Case study">
            <TextArea rows={6} value={form.caseStudy ?? ""} onChange={(e) => set("caseStudy", e.target.value)} />
          </Field>
          <Field label="Gallery images">
            <MultiImageUploader value={form.images ?? []} onChange={(u) => set("images", u)} />
          </Field>
        </div>

        <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Cover image"><ImageUploader value={form.coverImage} onChange={(u) => set("coverImage", u)} label="Cover" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category"><TextInput value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
              <Field label="Client"><TextInput value={form.client} onChange={(e) => set("client", e.target.value)} /></Field>
              <Field label="Duration"><TextInput value={form.duration} onChange={(e) => set("duration", e.target.value)} /></Field>
              <Field label="Year"><TextInput value={form.year} onChange={(e) => set("year", e.target.value)} /></Field>
            </div>
            <label className="flex items-center justify-between text-sm font-medium">
              Featured on homepage
              <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-[var(--brand-500)]" />
            </label>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Tech stack"><TagInput value={form.techStack ?? []} onChange={(t) => set("techStack", t)} /></Field>
            <Field label="Live demo URL"><TextInput value={form.liveDemo ?? ""} onChange={(e) => set("liveDemo", e.target.value)} /></Field>
            <Field label="GitHub URL"><TextInput value={form.github ?? ""} onChange={(e) => set("github", e.target.value)} /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}
