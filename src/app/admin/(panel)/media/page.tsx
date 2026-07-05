"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faSpinner, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { uploadFile } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

export default function AdminMediaPage() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
      setItems((prev) => [...urls.map((u) => u.url), ...prev]);
      toast.success(`${urls.length} file(s) uploaded`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function copy(url: string) {
    const full = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setCopied(url);
    toast.success("URL copied");
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <>
      <AdminHeader title="Media Library" description="Upload images and copy their URLs for use anywhere." />

      <label className={cn("flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border/60 bg-card/40 py-16 text-center transition-colors hover:border-brand-500/40", loading && "pointer-events-none opacity-70")}>
        <FontAwesomeIcon icon={loading ? faSpinner : faCloudArrowUp} className={cn("size-8 text-brand-500", loading && "animate-spin")} />
        <div>
          <p className="font-medium">{loading ? "Uploading…" : "Click to upload images"}</p>
          <p className="text-sm text-muted-foreground">PNG, JPG, WEBP, SVG · up to 8MB each</p>
        </div>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState label="Uploaded images will appear here." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((url) => (
              <div key={url} className="group overflow-hidden rounded-2xl border border-border/60 bg-card/50">
                <div className="relative aspect-square">
                  <Image src={url} alt="" fill sizes="200px" className="object-cover" />
                </div>
                <button type="button" onClick={() => copy(url)} className="flex w-full items-center justify-center gap-2 border-t border-border/60 py-2.5 text-xs font-medium transition-colors hover:bg-surface-2">
                  <FontAwesomeIcon icon={copied === url ? faCheck : faCopy} className={cn("size-3", copied === url && "text-emerald-500")} />
                  {copied === url ? "Copied" : "Copy URL"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
