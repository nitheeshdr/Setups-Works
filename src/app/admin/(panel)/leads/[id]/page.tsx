"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faPhone,
  faTrash,
  faSpinner,
  faCircleCheck,
  faTriangleExclamation,
  faLocationDot,
  faBuilding,
  faTag,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import { useResourceItem } from "@/lib/admin/hooks";
import { api } from "@/lib/admin/api";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/types";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useResourceItem<Lead>("leads", id);

  const setHandled = useMutation({
    mutationFn: (handled: boolean) => api.patch(`/leads/${id}`, { handled }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["leads", id] });
      toast.success("Updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/leads/${id}`),
    onSuccess: () => {
      toast.success("Lead deleted");
      router.push("/admin/leads");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This lead no longer exists. It may have been deleted."
        backHref="/admin/leads"
        backLabel="Back to leads"
      />
    );

  const lead = data;
  const isQuote = lead.type === "quotation";

  const address = [lead.address, lead.city, lead.state, lead.countryName, lead.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="grid size-9 place-items-center rounded-lg border border-border/60"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="size-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              {lead.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(lead.createdAt ?? "")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHandled.mutate(!lead.handled)}
            disabled={setHandled.isPending}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
              lead.handled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                : "border-border/60 hover:border-brand-500/40",
            )}
          >
            <FontAwesomeIcon icon={faCircleCheck} className="size-3.5" />
            {lead.handled ? "Handled" : "Mark handled"}
          </button>
          <button
            type="button"
            onClick={() => remove.mutate()}
            disabled={remove.isPending}
            aria-label="Delete lead"
            className="grid size-10 place-items-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <FontAwesomeIcon
              icon={remove.isPending ? faSpinner : faTrash}
              className={cn("size-3.5", remove.isPending && "animate-spin")}
            />
          </button>
        </div>
      </div>

      {/* Status strip — makes a failed CRM push or email impossible to miss. */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatusCard
          label="Type"
          value={isQuote ? "Quotation request" : "General enquiry"}
          tone={isQuote ? "brand" : "violet"}
        />
        <StatusCard
          label="Perfex CRM"
          value={lead.crmStatus === "synced" ? "Synced" : lead.crmStatus === "failed" ? "Failed" : "Pending"}
          tone={lead.crmStatus === "synced" ? "good" : lead.crmStatus === "failed" ? "bad" : "warn"}
          detail={lead.crmError}
        />
        <StatusCard
          label="Notification email"
          value={lead.emailStatus === "sent" ? "Sent" : lead.emailStatus === "failed" ? "Failed" : "Pending"}
          tone={lead.emailStatus === "sent" ? "good" : lead.emailStatus === "failed" ? "bad" : "warn"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {lead.message ? (
            <Panel title="Project details">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {lead.message}
              </p>
            </Panel>
          ) : (
            <Panel title="Project details">
              <p className="text-sm text-muted-foreground">
                No project details were provided.
              </p>
            </Panel>
          )}

          <Panel title="Contact">
            <div className="space-y-3 text-sm">
              <Row icon={faEnvelope} label="Email">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-brand-500 hover:underline"
                >
                  {lead.email}
                </a>
              </Row>
              <Row icon={faPhone} label="Phone">
                <a
                  href={`tel:${lead.phonenumber.replace(/\s/g, "")}`}
                  className="text-brand-500 hover:underline"
                >
                  {lead.phonenumber}
                </a>
              </Row>
              {lead.company && (
                <Row icon={faBuilding} label="Company">
                  {lead.company}
                </Row>
              )}
              {address && (
                <Row icon={faLocationDot} label="Address">
                  {address}
                </Row>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Enquiry">
            <div className="space-y-3 text-sm">
              {lead.service && (
                <Row icon={faTag} label="Service">
                  {lead.service}
                </Row>
              )}
              {lead.budget && (
                <Row icon={faTag} label="Budget">
                  {lead.budget}
                </Row>
              )}
              {lead.source && (
                <Row icon={faLink} label="Submitted from">
                  <Link href={lead.source} className="text-brand-500 hover:underline">
                    {lead.source}
                  </Link>
                </Row>
              )}
            </div>
          </Panel>

          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(
              isQuote ? `Your quotation request — ${lead.service || "Setups Works"}` : `Re: your enquiry`,
            )}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <FontAwesomeIcon icon={faEnvelope} className="size-3.5" />
            Reply by email
          </a>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6">
      <h2 className="mb-4 font-display text-base font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: typeof faEnvelope;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <FontAwesomeIcon icon={icon} className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="break-words">{children}</div>
      </div>
    </div>
  );
}

function StatusCard({
  label,
  value,
  tone,
  detail,
}: {
  label: string;
  value: string;
  tone: "good" | "bad" | "warn" | "brand" | "violet";
  detail?: string;
}) {
  const tones = {
    good: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    bad: "border-red-500/30 bg-red-500/10 text-red-500",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    brand: "border-brand-500/30 bg-brand-500/10 text-brand-500",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  } as const;

  return (
    <div className={cn("rounded-2xl border p-4", tones[tone])}>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="mt-1 flex items-center gap-2 font-semibold">
        {tone === "bad" && (
          <FontAwesomeIcon icon={faTriangleExclamation} className="size-3.5" />
        )}
        {value}
      </p>
      {detail && (
        <p className="mt-1.5 text-xs opacity-80" title={detail}>
          {detail.slice(0, 90)}
          {detail.length > 90 ? "…" : ""}
        </p>
      )}
    </div>
  );
}
