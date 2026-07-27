"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faSpinner,
  faArrowLeft,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Field,
  TextInput,
  TextArea,
  SelectInput,
  TagInput,
  ImageUploader,
} from "@/components/admin/ui";
import { useResourceMutations } from "@/lib/admin/hooks";
import { AIGenerate } from "@/components/admin/ai-generate";
import { slugify } from "@/lib/helpers";
import { serviceIcons, serviceIconNames } from "@/lib/service-icons";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

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

const empty: Partial<Service> = {
  title: "",
  slug: "",
  short: "",
  description: "",
  icon: "code",
  category: "Development",
  features: [],
  deliverables: [],
  content: "",
  overview: "",
  process: [],
  faqs: [],
  outcomes: [],
  techStack: [],
  idealFor: [],
  startingPrice: "",
  timeline: "",
  heroImage: "",
  order: 0,
  featured: false,
  status: "published",
};

/** Visual picker so an admin never has to type a raw icon key. */
function IconPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1.5 rounded-xl border border-border/60 bg-surface-2/60 p-2.5 sm:grid-cols-9">
      {serviceIconNames.map((name) => (
        <button
          key={name}
          type="button"
          title={name}
          onClick={() => onChange(name)}
          className={cn(
            "grid aspect-square place-items-center rounded-lg border transition-colors",
            value === name
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          <FontAwesomeIcon icon={serviceIcons[name]} className="size-3.5" />
        </button>
      ))}
    </div>
  );
}

/** Generic add/remove editor for the repeatable two-field sections. */
function RepeatableRows<T extends Record<string, string>>({
  label,
  rows,
  fields,
  onChange,
  blank,
}: {
  label: string;
  rows: T[];
  fields: { key: keyof T; placeholder: string; textarea?: boolean }[];
  onChange: (rows: T[]) => void;
  blank: T;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <button
          type="button"
          onClick={() => onChange([...rows, { ...blank }])}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500"
        >
          <FontAwesomeIcon icon={faPlus} className="size-3" /> Add
        </button>
      </div>
      {rows.length === 0 && (
        <p className="text-xs text-muted-foreground">
          None yet — this section is hidden on the public page until you add one.
        </p>
      )}
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1 space-y-2">
            {fields.map((f) =>
              f.textarea ? (
                <TextArea
                  key={String(f.key)}
                  rows={2}
                  value={row[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => {
                    const next = [...rows];
                    next[i] = { ...next[i], [f.key]: e.target.value };
                    onChange(next);
                  }}
                />
              ) : (
                <TextInput
                  key={String(f.key)}
                  value={row[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => {
                    const next = [...rows];
                    next[i] = { ...next[i], [f.key]: e.target.value };
                    onChange(next);
                  }}
                />
              ),
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, x) => x !== i))}
            className="grid size-9 shrink-0 place-items-center self-start rounded-lg text-muted-foreground hover:text-destructive"
          >
            <FontAwesomeIcon icon={faTrash} className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState<Partial<Service>>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const { create, update } = useResourceMutations<Service>("services", "Service");

  const set = <K extends keyof Service>(k: K, v: Service[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  /**
   * Merge an AI draft into the form. The model is prompted to return our icon
   * keys and category enum, but it is still a model — so anything that would
   * become an invalid database row is dropped rather than trusted, and the
   * slug is derived locally instead of from the response.
   */
  function onAI(data: Record<string, unknown>) {
    setForm((f) => {
      const next = { ...f, ...data } as Partial<Service>;

      if (typeof data.icon === "string" && !(data.icon in serviceIcons)) {
        delete next.icon;
      }
      const categories = [
        "Development",
        "Design",
        "Growth",
        "Platforms",
        "Intelligence",
      ];
      if (typeof data.category === "string" && !categories.includes(data.category)) {
        delete next.category;
      }
      // Never let a generated value decide the public URL.
      delete (next as Record<string, unknown>).slug;
      if (!slugTouched && typeof data.title === "string") {
        next.slug = slugify(data.title);
      } else {
        next.slug = f.slug;
      }
      return next;
    });
  }

  function save() {
    if (!form.title || !form.description) {
      toast.error("Title and description are required.");
      return;
    }
    const done = { onSuccess: () => router.push("/admin/services") };
    if (isEdit) {
      update.mutate({ id: initial!._id!, data: form }, done);
    } else {
      create.mutate(form, done);
    }
  }
  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="grid size-9 place-items-center rounded-lg border border-border/60"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {isEdit ? "Edit service" : "New service"}
          </h1>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={saving ? faSpinner : faFloppyDisk}
            className={saving ? "size-4 animate-spin" : "size-4"}
          />
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <AIGenerate
            type="service"
            placeholder="e.g. Rust backend development for high-throughput APIs"
            onGenerated={onAI}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: slugTouched ? f.slug : slugify(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Slug">
              <TextInput
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
            </Field>
          </div>

          <Field label="Short line" hint="Shown on cards and in the mega menu">
            <TextInput
              value={form.short}
              onChange={(e) => set("short", e.target.value)}
            />
          </Field>

          <Field label="Description" hint="Plain text — used for cards and meta description">
            <TextArea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <Field label="Overview" hint="Opening paragraph on the detail page">
            <TextArea
              rows={4}
              value={form.overview ?? ""}
              onChange={(e) => set("overview", e.target.value)}
            />
          </Field>

          <Field label="Full details" hint="Rich text — the main article body">
            <RichEditor
              value={form.content ?? ""}
              onChange={(html) => set("content", html)}
            />
          </Field>

          <RepeatableRows
            label="Process steps"
            rows={form.process ?? []}
            blank={{ title: "", description: "" }}
            fields={[
              { key: "title", placeholder: "Step title" },
              { key: "description", placeholder: "What happens in this step", textarea: true },
            ]}
            onChange={(rows) => set("process", rows)}
          />

          <RepeatableRows
            label="FAQs"
            rows={form.faqs ?? []}
            blank={{ question: "", answer: "" }}
            fields={[
              { key: "question", placeholder: "Question" },
              { key: "answer", placeholder: "Answer", textarea: true },
            ]}
            onChange={(rows) => set("faqs", rows)}
          />

          <RepeatableRows
            label="Outcomes"
            rows={form.outcomes ?? []}
            blank={{ value: "", label: "" }}
            fields={[
              { key: "value", placeholder: "e.g. 40%" },
              { key: "label", placeholder: "e.g. faster load times" },
            ]}
            onChange={(rows) => set("outcomes", rows)}
          />
        </div>

        <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) =>
                  set("status", (e.target as HTMLSelectElement).value as Service["status"])
                }
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
              />
            </Field>
            <Field label="Category">
              <SelectInput
                value={form.category}
                onChange={(e) =>
                  set("category", (e.target as HTMLSelectElement).value as Service["category"])
                }
                options={[
                  { value: "Development", label: "Development" },
                  { value: "Design", label: "Design" },
                  { value: "Growth", label: "Growth" },
                  { value: "Platforms", label: "Platforms" },
                  { value: "Intelligence", label: "Intelligence" },
                ]}
              />
            </Field>
            <Field label="Order" hint="Lower sorts first">
              <TextInput
                type="number"
                value={String(form.order ?? 0)}
                onChange={(e) => set("order", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Icon">
              <IconPicker value={form.icon} onChange={(n) => set("icon", n)} />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Features" hint="What's included">
              <TagInput
                value={form.features ?? []}
                onChange={(t) => set("features", t)}
              />
            </Field>
            <Field label="Deliverables" hint="What the client receives">
              <TagInput
                value={form.deliverables ?? []}
                onChange={(t) => set("deliverables", t)}
              />
            </Field>
            <Field label="Ideal for">
              <TagInput
                value={form.idealFor ?? []}
                onChange={(t) => set("idealFor", t)}
              />
            </Field>
            <Field label="Tech stack">
              <TagInput
                value={form.techStack ?? []}
                onChange={(t) => set("techStack", t)}
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Starting price" hint="Optional — hidden when blank">
              <TextInput
                value={form.startingPrice ?? ""}
                placeholder="e.g. From $4,000"
                onChange={(e) => set("startingPrice", e.target.value)}
              />
            </Field>
            <Field label="Typical timeline" hint="Optional — hidden when blank">
              <TextInput
                value={form.timeline ?? ""}
                placeholder="e.g. 4–6 weeks"
                onChange={(e) => set("timeline", e.target.value)}
              />
            </Field>
            <Field label="Hero image">
              <ImageUploader
                value={form.heroImage}
                onChange={(u) => set("heroImage", u)}
                label="Hero"
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <p className="text-sm font-semibold">SEO</p>
            <Field label="SEO title">
              <TextInput
                value={form.seoTitle ?? ""}
                onChange={(e) => set("seoTitle", e.target.value)}
              />
            </Field>
            <Field label="SEO description">
              <TextArea
                rows={3}
                value={form.seoDescription ?? ""}
                onChange={(e) => set("seoDescription", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
