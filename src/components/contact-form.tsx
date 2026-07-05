"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  budget: z.string().optional(),
  subject: z.string().min(2, "Add a subject"),
  message: z.string().min(10, "Tell us a bit more (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;

const budgets = ["< $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not sure yet"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setSent(true);
        reset();
        toast.success("Message sent! We'll be in touch within one business day.");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to send. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-brand-500/30 bg-card/50 p-12 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-500/15 text-brand-500">
          <FontAwesomeIcon icon={faCircleCheck} className="size-8" />
        </span>
        <h3 className="font-display text-2xl font-bold tracking-tight">
          Message received!
        </h3>
        <p className="max-w-sm text-muted-foreground">
          Thanks for reaching out. Our team will get back to you within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 text-sm font-semibold text-brand-500"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-border/60 bg-surface-2/60 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500/60";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl border border-border/60 bg-card/50 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name *</label>
          <input {...register("name")} className={field} placeholder="Jane Doe" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email *</label>
          <input {...register("email")} className={field} placeholder="jane@company.com" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Company</label>
          <input {...register("company")} className={field} placeholder="Acme Inc." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Budget</label>
          <select {...register("budget")} className={cn(field, "appearance-none")} defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Subject *</label>
        <input {...register("subject")} className={field} placeholder="I'd like to build…" />
        {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Message *</label>
        <textarea
          {...register("message")}
          rows={5}
          className={cn(field, "resize-none")}
          placeholder="Tell us about your project, goals, and timeline…"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600 disabled:opacity-60"
      >
        <FontAwesomeIcon
          icon={isSubmitting ? faSpinner : faPaperPlane}
          className={cn("size-4", isSubmitting && "animate-spin")}
        />
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
