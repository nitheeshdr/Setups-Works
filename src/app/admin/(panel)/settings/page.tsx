"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, Field, TextInput, TextArea, TagInput, ImageUploader, Spinner } from "@/components/admin/ui";
import type { FounderFilm } from "@/lib/types";
import { api } from "@/lib/admin/api";

interface Founder {
  bio?: string;
  github?: string;
  imdb?: string;
  youtube?: string;
  education?: string;
  educationUrl?: string;
  skills?: string[];
  titles?: string[];
  languages?: string[];
  awards?: string[];
  films?: FounderFilm[];
  location?: string;
  birthDate?: string;
  birthPlace?: string;
  story?: string;
  degree?: string;
  fieldOfStudy?: string;
  educationStart?: string;
  educationEnd?: string;
  credentialCategory?: string;
  educationalLevel?: string;
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

  /* ----------------------------- filmography ---------------------------- */
  const films = () => form.founder?.films ?? [];
  const putFilms = (next: FounderFilm[]) =>
    setForm((f) => ({ ...f, founder: { ...f.founder, films: next } }));
  const setFilm = (i: number, patch: Partial<FounderFilm>) =>
    putFilms(films().map((f, n) => (n === i ? { ...f, ...patch } : f)));
  const addFilm = () => putFilms([...films(), { title: "" }]);
  const removeFilm = (i: number) => putFilms(films().filter((_, n) => n !== i));

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
          <p className="text-sm font-semibold">Founder profile</p>
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
            <Field label="GitHub URL"><TextInput value={form.founder?.github ?? ""} onChange={(e) => setNested("founder", "github", e.target.value)} /></Field>
            <Field label="IMDb URL"><TextInput value={form.founder?.imdb ?? ""} onChange={(e) => setNested("founder", "imdb", e.target.value)} /></Field>
            <Field label="YouTube URL"><TextInput value={form.founder?.youtube ?? ""} onChange={(e) => setNested("founder", "youtube", e.target.value)} /></Field>
            <Field label="Education"><TextInput value={form.founder?.education ?? ""} onChange={(e) => setNested("founder", "education", e.target.value)} /></Field>
            <Field label="Education URL"><TextInput value={form.founder?.educationUrl ?? ""} onChange={(e) => setNested("founder", "educationUrl", e.target.value)} /></Field>
            <Field label="Location" hint="City / region"><TextInput value={form.founder?.location ?? ""} onChange={(e) => setNested("founder", "location", e.target.value)} /></Field>
            <Field label="Date of birth" hint="YYYY-MM-DD — emitted as Person.birthDate"><TextInput type="date" value={form.founder?.birthDate ?? ""} onChange={(e) => setNested("founder", "birthDate", e.target.value)} /></Field>
            <Field label="Birthplace"><TextInput value={form.founder?.birthPlace ?? ""} onChange={(e) => setNested("founder", "birthPlace", e.target.value)} /></Field>
            <Field label="Degree"><TextInput value={form.founder?.degree ?? ""} onChange={(e) => setNested("founder", "degree", e.target.value)} /></Field>
            <Field label="Field of study"><TextInput value={form.founder?.fieldOfStudy ?? ""} onChange={(e) => setNested("founder", "fieldOfStudy", e.target.value)} /></Field>
            <Field label="Study start year"><TextInput value={form.founder?.educationStart ?? ""} onChange={(e) => setNested("founder", "educationStart", e.target.value)} /></Field>
            <Field label="Study end year"><TextInput value={form.founder?.educationEnd ?? ""} onChange={(e) => setNested("founder", "educationEnd", e.target.value)} /></Field>
            <Field label="Credential" hint='e.g. "Bachelor&apos;s degree" — leave blank until conferred'><TextInput value={form.founder?.credentialCategory ?? ""} onChange={(e) => setNested("founder", "credentialCategory", e.target.value)} /></Field>
            <Field label="Educational level" hint='e.g. "Bachelor"'><TextInput value={form.founder?.educationalLevel ?? ""} onChange={(e) => setNested("founder", "educationalLevel", e.target.value)} /></Field>
          </div>
          <Field label="Quote / note"><TextArea rows={3} value={form.founder?.quote ?? ""} onChange={(e) => setNested("founder", "quote", e.target.value)} /></Field>
          <Field label="Full biography" hint="HTML — rendered as the body of the founder page. Use <h2> for sections.">
            <TextArea rows={14} value={form.founder?.story ?? ""} onChange={(e) => setNested("founder", "story", e.target.value)} />
          </Field>
          <Field label="Bio" hint="Longer profile text — shown on the founder page and used as its meta description">
            <TextArea rows={5} value={form.founder?.bio ?? ""} onChange={(e) => setNested("founder", "bio", e.target.value)} />
          </Field>
          <Field label="Other titles" hint="Beyond the main role — e.g. Director, Web Designer">
            <TagInput value={form.founder?.titles ?? []} onChange={(titles) => setForm((f) => ({ ...f, founder: { ...f.founder, titles } }))} />
          </Field>
          <Field label="Languages" hint="Emitted as Person.knowsLanguage">
            <TagInput value={form.founder?.languages ?? []} onChange={(languages) => setForm((f) => ({ ...f, founder: { ...f.founder, languages } }))} />
          </Field>
          <Field label="Awards & recognition" hint="Only real ones — these appear publicly and in schema">
            <TagInput value={form.founder?.awards ?? []} onChange={(awards) => setForm((f) => ({ ...f, founder: { ...f.founder, awards } }))} />
          </Field>
          <Field label="Works on" hint="Topics shown on the founder page and emitted as Person.knowsAbout">
            <TagInput
              value={form.founder?.skills ?? []}
              onChange={(skills) =>
                setForm((f) => ({ ...f, founder: { ...f.founder, skills } }))
              }
            />
          </Field>

          <Field
            label="Filmography"
            hint="Directing / writing credits. Emitted as Movie schema pointing back at the Person, so these must match IMDb exactly — a title that disagrees weakens both."
          >
            <div className="space-y-3">
              {(form.founder?.films ?? []).map((film, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-surface-2/40 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <TextInput
                      placeholder="Title"
                      value={film.title ?? ""}
                      onChange={(e) => setFilm(i, { title: e.target.value })}
                    />
                    <TextInput
                      placeholder="Year — e.g. 2024"
                      value={film.year ?? ""}
                      onChange={(e) => setFilm(i, { year: e.target.value })}
                    />
                    <TextInput
                      placeholder="Role — Director, Writer"
                      value={film.role ?? ""}
                      onChange={(e) => setFilm(i, { role: e.target.value })}
                    />
                    <TextInput
                      placeholder="Format — Short film, Feature"
                      value={film.format ?? ""}
                      onChange={(e) => setFilm(i, { format: e.target.value })}
                    />
                  </div>
                  <div className="mt-2 grid gap-2">
                    <TextInput
                      placeholder="URL — IMDb or YouTube"
                      value={film.url ?? ""}
                      onChange={(e) => setFilm(i, { url: e.target.value })}
                    />
                    <TextInput
                      placeholder="Short description (optional)"
                      value={film.description ?? ""}
                      onChange={(e) => setFilm(i, { description: e.target.value })}
                    />
                    <TextInput
                      placeholder="Poster image URL — required by Google for Movie results"
                      value={film.image ?? ""}
                      onChange={(e) => setFilm(i, { image: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFilm(i)}
                    className="mt-2 text-xs font-medium text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFilm}
                className="rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:border-brand-500/40 hover:text-brand-500"
              >
                + Add credit
              </button>
            </div>
          </Field>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">Social links</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {["twitter", "github", "linkedin", "instagram"].map((s) => (
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
