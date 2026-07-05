"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/lib/admin/api";

export function AIGenerate({
  type,
  placeholder,
  onGenerated,
}: {
  type: "blog" | "product" | "portfolio";
  placeholder: string;
  onGenerated: (data: Record<string, unknown>) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (prompt.trim().length < 3) {
      toast.error("Enter a short description first.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/generate", { type, prompt });
      onGenerated(res.data);
      toast.success("Draft generated — review and edit before saving.");
    } catch (e) {
      toast.error((e as Error).message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-violet-500/5 p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="size-4 text-brand-500" />
        <p className="text-sm font-semibold">Generate with AI</p>
        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-500">
          Groq
        </span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              generate();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-brand-500/60"
        />
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={loading ? faSpinner : faWandMagicSparkles}
            className={loading ? "size-3.5 animate-spin" : "size-3.5"}
          />
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>
    </div>
  );
}
