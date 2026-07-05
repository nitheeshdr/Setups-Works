"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faSpinner,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {
  Field,
  TextInput,
  TextArea,
  SelectInput,
  TagInput,
  ImageUploader,
} from "@/components/admin/ui";
import { useResourceMutations } from "@/lib/admin/hooks";
import { slugify } from "@/lib/helpers";
import type { Blog } from "@/lib/types";

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

export const blogCategories = [
  "Technology",
  "AI",
  "Programming",
  "React",
  "JavaScript",
  "Node.js",
  "WordPress",
  "Business",
  "Marketing",
];

const empty: Partial<Blog> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Technology",
  tags: [],
  featuredImage: "",
  author: "Setups Works",
  authorRole: "",
  authorAvatar: "",
  status: "draft",
  featured: false,
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
};

export function BlogForm({ initial }: { initial?: Blog }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState<Partial<Blog>>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const { create, update } = useResourceMutations<Blog>("blogs", "Post");

  const set = <K extends keyof Blog>(key: K, val: Blog[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const onTitle = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : slugify(title),
    }));
  };

  async function save() {
    if (!form.title || !form.excerpt || !form.content) {
      toast.error("Title, excerpt, and content are required.");
      return;
    }
    const payload = { ...form };
    if (isEdit) {
      update.mutate(
        { id: initial!._id!, data: payload },
        { onSuccess: () => router.push("/admin/blogs") },
      );
    } else {
      create.mutate(payload, { onSuccess: () => router.push("/admin/blogs") });
    }
  }

  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="grid size-9 place-items-center rounded-lg border border-border/60"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {isEdit ? "Edit post" : "New post"}
          </h1>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={saving ? faSpinner : faFloppyDisk}
            className={saving ? "size-4 animate-spin" : "size-4"}
          />
          {saving ? "Saving…" : "Save post"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main */}
        <div className="space-y-5">
          <Field label="Title">
            <TextInput
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="An amazing headline"
            />
          </Field>
          <Field label="Slug" hint="URL path">
            <TextInput
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              placeholder="an-amazing-headline"
            />
          </Field>
          <Field label="Excerpt" hint="Short summary shown in cards">
            <TextArea
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </Field>
          <Field label="Content">
            <RichEditor
              value={form.content ?? ""}
              onChange={(html) => set("content", html)}
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) =>
                  set(
                    "status",
                    (e.target as HTMLSelectElement).value as Blog["status"],
                  )
                }
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "scheduled", label: "Scheduled" },
                ]}
              />
            </Field>
            <Field label="Category">
              <SelectInput
                value={form.category}
                onChange={(e) =>
                  set("category", (e.target as HTMLSelectElement).value)
                }
                options={blogCategories.map((c) => ({ value: c, label: c }))}
              />
            </Field>
            <label className="flex items-center justify-between text-sm font-medium">
              Featured
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="size-4 accent-[var(--brand-500)]"
              />
            </label>
            <Field label="Tags">
              <TagInput
                value={form.tags ?? []}
                onChange={(tags) => set("tags", tags)}
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <Field label="Featured image">
              <ImageUploader
                value={form.featuredImage}
                onChange={(url) => set("featuredImage", url)}
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-5">
            <p className="text-sm font-semibold">Author</p>
            <Field label="Name">
              <TextInput
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
              />
            </Field>
            <Field label="Role">
              <TextInput
                value={form.authorRole ?? ""}
                onChange={(e) => set("authorRole", e.target.value)}
              />
            </Field>
            <Field label="Avatar">
              <ImageUploader
                value={form.authorAvatar}
                onChange={(url) => set("authorAvatar", url)}
                label="Avatar"
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
                rows={2}
                value={form.seoDescription ?? ""}
                onChange={(e) => set("seoDescription", e.target.value)}
              />
            </Field>
            <Field label="OG image">
              <ImageUploader
                value={form.ogImage}
                onChange={(url) => set("ogImage", url)}
                label="OG image"
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
