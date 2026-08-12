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
  SelectInput,
} from "@/components/admin/ui";
import { RichEditor } from "@/components/admin/rich-editor";
import { useResourceMutations } from "@/lib/admin/hooks";
import type { TeamMember } from "@/lib/types";

const empty: Partial<TeamMember> = {
  name: "",
  role: "",
  short: "",
  bio: "",
  photo: "",
  location: "",
  skills: [],
  order: 0,
  status: "published",
};

export function TeamForm({ initial }: { initial?: TeamMember }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState<Partial<TeamMember>>(initial ?? empty);
  const { create, update } = useResourceMutations<TeamMember>("team", "Team member");
  const set = <K extends keyof TeamMember>(k: K, v: TeamMember[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function save() {
    if (!form.name || !form.role) {
      toast.error("Name and role are required.");
      return;
    }
    const done = { onSuccess: () => router.push("/admin/team") };
    if (isEdit) update.mutate({ id: initial!._id!, data: form }, done);
    else create.mutate(form, done);
  }
  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/team"
            className="grid size-9 place-items-center rounded-lg border border-border/60"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {isEdit ? "Edit team member" : "New team member"}
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

      <div className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-6">
        <Field label="Photo" hint="Used on the team page, the profile page and as the OG image">
          <ImageUploader value={form.photo} onChange={(u) => set("photo", u)} label="Photo" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <TextInput value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Role">
            <TextInput value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} />
          </Field>
          <Field label="Slug" hint="Leave blank to generate from the name">
            <TextInput value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Location">
            <TextInput value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
          </Field>
        </div>
        <Field label="Short bio" hint="One line — shown on the card and used as the meta description">
          <TextArea rows={2} value={form.short ?? ""} onChange={(e) => set("short", e.target.value)} />
        </Field>
        <Field label="Full bio" hint="Long-form, rendered as the profile page body">
          <RichEditor value={form.bio ?? ""} onChange={(v) => set("bio", v)} />
        </Field>
        <Field label="Works on" hint="Topics — emitted as Person.knowsAbout">
          <TagInput value={form.skills ?? []} onChange={(v) => set("skills", v)} />
        </Field>
        <Field label="Education">
          <TextInput value={form.education ?? ""} onChange={(e) => set("education", e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 space-y-5 rounded-2xl border border-border/60 bg-card/50 p-6">
        <p className="text-sm font-semibold">Profiles</p>
        <p className="text-xs text-muted-foreground">
          Emitted as Person.sameAs and rendered as real links. A profile on a site
          Google already trusts is what makes this page describe a verifiable
          person rather than a name on a card — worth filling in.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="LinkedIn URL">
            <TextInput value={form.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <TextInput value={form.github ?? ""} onChange={(e) => set("github", e.target.value)} />
          </Field>
          <Field label="X / Twitter URL">
            <TextInput value={form.twitter ?? ""} onChange={(e) => set("twitter", e.target.value)} />
          </Field>
          <Field label="Personal website">
            <TextInput value={form.website ?? ""} onChange={(e) => set("website", e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="mt-5 grid gap-5 rounded-2xl border border-border/60 bg-card/50 p-6 sm:grid-cols-2">
        <Field label="Order" hint="Lower sorts first on the team page">
          <TextInput
            type="number"
            value={form.order ?? 0}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </Field>
        <Field label="Status" hint="Drafts stay off the site and out of the company's employee schema">
          <SelectInput
            value={form.status ?? "published"}
            onChange={(e) => set("status", e.target.value as TeamMember["status"])}
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}
