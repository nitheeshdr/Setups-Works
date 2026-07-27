"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/lead-form";
import { cn } from "@/lib/utils";

/**
 * Popup version of the lead form, used on service detail pages so a visitor
 * can request a quote without losing the page they were reading.
 *
 * The form is keyed on `open` so it remounts each time the dialog opens —
 * otherwise a visitor who submits, closes, and reopens would be looking at the
 * previous submission's success state.
 */
export function LeadFormModal({
  triggerLabel = "Get a quote",
  defaultService,
  services = [],
  source,
  className,
}: {
  triggerLabel?: string;
  defaultService?: string;
  services?: string[];
  source?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600",
          className,
        )}
      >
        {triggerLabel}
        <FontAwesomeIcon
          icon={faArrowRight}
          className="size-3.5 transition-transform group-hover:translate-x-1"
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold tracking-tight">
              {defaultService ? `Enquire about ${defaultService}` : "Start a project"}
            </DialogTitle>
            <DialogDescription>
              Tell us what you need and we&apos;ll reply within one business day.
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            key={String(open)}
            defaultService={defaultService}
            services={services}
            source={source}
            className="mt-2"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
