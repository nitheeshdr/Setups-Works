"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, Field, TextInput, TextArea, ImageUploader, Spinner } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";

interface Founder {
  name?: string;
  role?: string;
  handle?: string;
  status?: string;
  photo?: string;
  quote?: string;
  twitter?: string;
  linkedin?: string;
}
interface Settings {
  siteName?: string;
  tagline?: string;
  description?: string;
  logoLight?: string;
  logoDark?: string;
  email?: string;
  phone?: string;
  location?: string;
  social?: Record<string, string>;
  seo?: { title?: string; description?: string; ogImage?: string };
  analytics?: { googleAnalyticsId?: string; searchConsoleId?: string };
  founder?: Founder;
}

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings").then((r) => r.data),
  });
  const [form, setForm] = useState<Settings>({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (payload: Settings) => api.put("/settings", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Spinner />;

  const set = (k: keyof Settings, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const setNested = (group: "social" | "seo" | "analytics" | "founder", k: string, v: string) =>
    setForm((f) => ({ ...f, [group]: { ...(f[group] as object), [k]: v } }));

  const card = "space-y-4 rounded-2xl border border-border/60 bg-card/50 p-6";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <AdminHeader title="Settings" description="Manage your website configuration." />
        <button type="button" onClick={() => save.mutate(form)} disabled={save.isPending} className="mb-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          <FontAwesomeIcon icon={save.isPending ? faSpinner : faFloppyDisk} className={save.isPending ? "size-4 animate-spin" : "size-4"} />
          Save
        </button>
      </div>

      <div className="space-y-6">
        <div className={card}>
          <p className="text-sm font-semibold">General</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name"><TextInput value={form.siteName ?? ""} onChange={(e) => set("siteName", e.target.value)} /></Field>
            <Field label="Tagline"><TextInput value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} /></Field>
          </div>
          <Field label="Description"><TextArea rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Email"><TextInput value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Phone"><TextInput value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Location"><TextInput value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field>
          </div>
        </div>
        <div className={card}>
          <p className="text-sm font-semibold">Website Logos</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Light Mode Logo" hint="For light backgrounds (dark text/symbol)">
              <ImageUploader value={form.logoLight} onChange={(url) => set("logoLight", url)} label="Upload light mode logo" />
            </Field>
            <Field label="Dark Mode Logo" hint="For dark backgrounds (light text/symbol)">
              <ImageUploader value={form.logoDark} onChange={(url) => set("logoDark", url)} label="Upload dark mode logo" />
            </Field>
          </div>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">Founder (About page)</p>
          <Field label="Photo">
            <ImageUploader value={form.founder?.photo} onChange={(url) => setNested("founder", "photo", url)} label="Founder photo" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><TextInput value={form.founder?.name ?? ""} onChange={(e) => setNested("founder", "name", e.target.value)} /></Field>
            <Field label="Role"><TextInput value={form.founder?.role ?? ""} onChange={(e) => setNested("founder", "role", e.target.value)} /></Field>
            <Field label="Handle" hint="without @"><TextInput value={form.founder?.handle ?? ""} onChange={(e) => setNested("founder", "handle", e.target.value)} /></Field>
            <Field label="Status"><TextInput value={form.founder?.status ?? ""} onChange={(e) => setNested("founder", "status", e.target.value)} /></Field>
            <Field label="Twitter URL"><TextInput value={form.founder?.twitter ?? ""} onChange={(e) => setNested("founder", "twitter", e.target.value)} /></Field>
            <Field label="LinkedIn URL"><TextInput value={form.founder?.linkedin ?? ""} onChange={(e) => setNested("founder", "linkedin", e.target.value)} /></Field>
          </div>
          <Field label="Quote / note"><TextArea rows={3} value={form.founder?.quote ?? ""} onChange={(e) => setNested("founder", "quote", e.target.value)} /></Field>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">Social links</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {["twitter", "github", "linkedin", "dribbble", "instagram"].map((s) => (
              <Field key={s} label={s[0].toUpperCase() + s.slice(1)}>
                <TextInput value={form.social?.[s] ?? ""} onChange={(e) => setNested("social", s, e.target.value)} />
              </Field>
            ))}
          </div>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">SEO</p>
          <Field label="Default SEO title"><TextInput value={form.seo?.title ?? ""} onChange={(e) => setNested("seo", "title", e.target.value)} /></Field>
          <Field label="Default SEO description"><TextArea rows={2} value={form.seo?.description ?? ""} onChange={(e) => setNested("seo", "description", e.target.value)} /></Field>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">Analytics</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Google Analytics ID" hint="G-XXXXXXX"><TextInput value={form.analytics?.googleAnalyticsId ?? ""} onChange={(e) => setNested("analytics", "googleAnalyticsId", e.target.value)} /></Field>
            <Field label="Search Console ID"><TextInput value={form.analytics?.searchConsoleId ?? ""} onChange={(e) => setNested("analytics", "searchConsoleId", e.target.value)} /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}
