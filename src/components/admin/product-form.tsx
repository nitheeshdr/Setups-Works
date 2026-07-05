"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSpinner, faArrowLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Field,
  TextInput,
  TextArea,
  SelectInput,
  TagInput,
  ImageUploader,
  MultiImageUploader,
} from "@/components/admin/ui";
import { useResourceMutations } from "@/lib/admin/hooks";
import { slugify } from "@/lib/helpers";
import type { Product } from "@/lib/types";

const RichEditor = dynamic(
  () => import("@/components/admin/rich-editor").then((m) => m.RichEditor),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-64 place-items-center rounded-xl border border-border/60 bg-surface-2/60 text-sm text-muted-foreground">
        Loading editor…
      </div>
    ),
  },
);

const empty: Partial<Product> = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  content: "",
  logo: "",
  banner: "",
  screenshots: [],
  features: [],
  technologies: [],
  category: "Developer Tools",
  status: "coming-soon",
  version: "",
  downloadLink: "",
  githubLink: "",
  docsLink: "",
  releaseNotes: "",
};

export function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState<Partial<Product>>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const { create, update } = useResourceMutations<Product>("products", "Product");

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));
  const features = form.features ?? [];
  const setFeature = (i: number, key: "title" | "description", val: string) => {
    const next = [...features];
    next[i] = { ...next[i], [key]: val };
    set("features", next);
  };

  function save() {
    if (!form.name || !form.description) {
      toast.error("Name and description are required.");
      return;
    }
    if (isEdit) {
      update.mutate({ id: initial!._id!, data: form }, { onSuccess: () => router.push("/admin/products") });
    } else {
      create.mutate(form, { onSuccess: () => router.push("/admin/products") });
    }
  }
  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="grid size-9 place-items-center rounded-lg border border-border/60">
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {isEdit ? "Edit product" : "New product"}
          </h1>
        </div>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          <FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} className={saving ? "size-4 animate-spin" : "size-4"} />
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))} />
            </Field>
            <Field label="Slug">
              <TextInput value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
            </Field>
          </div>
          <Field label="Tagline">
            <TextInput value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Short description" hint="Plain text, shown in cards & meta">
            <TextArea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label="Full details" hint="Rich text — shown on the product page">
            <RichEditor value={form.content ?? ""} onChange={(html) => set("content", html)} />
          </Field>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Features</p>
              <button type="button" onClick={() => set("features", [...features, { title: "", description: "" }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500">
                <FontAwesomeIcon icon={faPlus} className="size-3" /> Add
              </button>
            </div>
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <TextInput value={f.title} placeholder="Feature title" onChange={(e) => setFeature(i, "title", e.target.value)} />
                  <TextInput value={f.description} placeholder="Feature description" onChange={(e) => setFeature(i, "description", e.target.value)} />
                </div>
                <button type="button" onClick={() => set("features", features.filter((_, x) => x !== i))} className="grid size-9 place-items-center self-start rounded-lg text-muted-foreground hover:text-destructive">
                  <FontAwesomeIcon icon={faTrash} className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <Field label="Release notes">
            <TextArea rows={3} value={form.releaseNotes ?? ""} onChange={(e) => set("releaseNotes", e.target.value)} />
          </Field>
        </div>

        <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Status">
              <SelectInput value={form.status} onChange={(e) => set("status", (e.target as HTMLSelectElement).value as Product["status"])} options={[
                { value: "coming-soon", label: "Coming Soon" },
                { value: "beta", label: "Beta" },
                { value: "live", label: "Live" },
                { value: "archived", label: "Archived" },
              ]} />
            </Field>
            <Field label="Category">
              <TextInput value={form.category} onChange={(e) => set("category", e.target.value)} />
            </Field>
            <Field label="Version">
              <TextInput value={form.version ?? ""} onChange={(e) => set("version", e.target.value)} />
            </Field>
            <Field label="Technologies">
              <TagInput value={form.technologies ?? []} onChange={(t) => set("technologies", t)} />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Logo"><ImageUploader value={form.logo} onChange={(u) => set("logo", u)} label="Logo" /></Field>
            <Field label="Banner"><ImageUploader value={form.banner} onChange={(u) => set("banner", u)} label="Banner" /></Field>
            <Field label="Screenshots"><MultiImageUploader value={form.screenshots ?? []} onChange={(u) => set("screenshots", u)} /></Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <p className="text-sm font-semibold">Links</p>
            <Field label="Download"><TextInput value={form.downloadLink ?? ""} onChange={(e) => set("downloadLink", e.target.value)} /></Field>
            <Field label="GitHub"><TextInput value={form.githubLink ?? ""} onChange={(e) => set("githubLink", e.target.value)} /></Field>
            <Field label="Docs"><TextInput value={form.docsLink ?? ""} onChange={(e) => set("docsLink", e.target.value)} /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}
