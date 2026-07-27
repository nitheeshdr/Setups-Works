"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faRotate,
  faReply,
  faTrash,
  faStar,
  faPaperPlane,
  faSpinner,
  faPaperclip,
  faPenToSquare,
  faXmark,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, Spinner, EmptyState } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface MailSummary {
  uid: number;
  mailbox: string;
  subject: string;
  from: { name: string; address: string };
  to: string;
  date: string;
  seen: boolean;
  flagged: boolean;
  answered: boolean;
  hasAttachments: boolean;
}

interface MailDetail extends MailSummary {
  html: string;
  text: string;
  messageId: string;
  references: string[];
  attachments: { filename: string; size: number; contentType: string }[];
}

const FOLDERS = [
  { path: "INBOX", label: "Inbox" },
  { path: "INBOX.Sent", label: "Sent" },
  { path: "INBOX.Drafts", label: "Drafts" },
  { path: "INBOX.Trash", label: "Trash" },
];

export default function AdminInboxPage() {
  const qc = useQueryClient();
  const [mailbox, setMailbox] = useState("INBOX");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [openUid, setOpenUid] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);

  const list = useQuery({
    queryKey: ["mailbox", mailbox, search],
    queryFn: () =>
      api
        .get(
          `/mailbox?mailbox=${encodeURIComponent(mailbox)}&limit=30&search=${encodeURIComponent(search)}`,
        )
        .then((r) => r.data as { items: MailSummary[]; total: number }),
    retry: false,
  });

  const detail = useQuery({
    queryKey: ["mailbox-msg", mailbox, openUid],
    queryFn: () =>
      api
        .get(`/mailbox/${openUid}?mailbox=${encodeURIComponent(mailbox)}`)
        .then((r) => r.data as MailDetail),
    enabled: openUid !== null,
    retry: false,
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["mailbox"] });
  };

  const remove = useMutation({
    mutationFn: (uid: number) =>
      api.delete(`/mailbox/${uid}?mailbox=${encodeURIComponent(mailbox)}`),
    onSuccess: () => {
      toast.success("Message deleted");
      setOpenUid(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const flag = useMutation({
    mutationFn: ({ uid, flagged }: { uid: number; flagged: boolean }) =>
      api.patch(`/mailbox/${uid}`, { flagged, mailbox }),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  // A failed list is nearly always configuration, so say which and how to fix.
  if (list.isError) {
    return (
      <>
        <AdminHeader title="Inbox" description="Read and reply to mail sent to your business address." />
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="mt-0.5 size-4 shrink-0 text-amber-500"
            />
            <div>
              <p className="font-semibold">Can&apos;t reach the mail server</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(list.error as Error).message}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                The inbox needs IMAP credentials in your environment:{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">IMAP_HOST</code>,{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">IMAP_PORT</code>,{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">IMAP_USER</code>,{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">IMAP_PASS</code>.
                It falls back to <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">SMTP_USER</code>/
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">SMTP_PASS</code> when the IMAP ones are unset.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Inbox"
        description="Read and reply to mail sent to your business address."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FOLDERS.map((f) => (
          <button
            key={f.path}
            type="button"
            onClick={() => {
              setMailbox(f.path);
              setOpenUid(null);
            }}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              mailbox === f.path
                ? "bg-brand-500/10 text-brand-500"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
              placeholder="Search mail…"
              className="rounded-lg border border-border/60 bg-surface-2/60 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500/60"
            />
          </div>
          <button
            type="button"
            onClick={refresh}
            className="grid size-9 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Refresh"
          >
            <FontAwesomeIcon
              icon={faRotate}
              className={cn("size-3.5", list.isFetching && "animate-spin")}
            />
          </button>
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="size-3.5" />
            Compose
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* List */}
        <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-border/60 bg-card/40">
          {list.isLoading ? (
            <Spinner />
          ) : !list.data?.items.length ? (
            <EmptyState label="No messages here." />
          ) : (
            <ul className="divide-y divide-border/60">
              {list.data.items.map((m) => (
                <li key={m.uid}>
                  <button
                    type="button"
                    onClick={() => setOpenUid(m.uid)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors hover:bg-surface-2/60",
                      openUid === m.uid && "bg-brand-500/10",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!m.seen && (
                        <span className="size-2 shrink-0 rounded-full bg-brand-500" />
                      )}
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm",
                          m.seen ? "text-muted-foreground" : "font-semibold",
                        )}
                      >
                        {m.from.name || m.from.address || "(unknown)"}
                      </span>
                      {m.hasAttachments && (
                        <FontAwesomeIcon
                          icon={faPaperclip}
                          className="size-3 shrink-0 text-muted-foreground"
                        />
                      )}
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDate(m.date)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1 truncate text-sm",
                        m.seen ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {m.subject}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reading pane */}
        <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-border/60 bg-card/40">
          {openUid === null ? (
            <div className="grid h-full min-h-64 place-items-center p-10 text-center text-sm text-muted-foreground">
              Select a message to read it.
            </div>
          ) : detail.isLoading ? (
            <Spinner />
          ) : detail.isError ? (
            <div className="p-6 text-sm text-destructive">
              {(detail.error as Error).message}
            </div>
          ) : detail.data ? (
            <MessageView
              msg={detail.data}
              onDelete={() => remove.mutate(detail.data!.uid)}
              onFlag={() =>
                flag.mutate({ uid: detail.data!.uid, flagged: !detail.data!.flagged })
              }
              deleting={remove.isPending}
              onSent={() => {
                refresh();
                qc.invalidateQueries({ queryKey: ["mailbox-msg"] });
              }}
            />
          ) : null}
        </div>
      </div>

      {composing && (
        <Composer
          onClose={() => setComposing(false)}
          onSent={() => {
            setComposing(false);
            refresh();
          }}
        />
      )}
    </>
  );
}

function MessageView({
  msg,
  onDelete,
  onFlag,
  deleting,
  onSent,
}: {
  msg: MailDetail;
  onDelete: () => void;
  onFlag: () => void;
  deleting: boolean;
  onSent: () => void;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold tracking-tight">
            {msg.subject}
          </h2>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {msg.from.name || msg.from.address}
            </span>{" "}
            &lt;{msg.from.address}&gt;
          </p>
          <p className="text-xs text-muted-foreground">
            to {msg.to} · {formatDate(msg.date)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onFlag}
            aria-label="Flag"
            className={cn(
              "grid size-9 place-items-center rounded-lg transition-colors hover:bg-surface-2",
              msg.flagged ? "text-amber-400" : "text-muted-foreground",
            )}
          >
            <FontAwesomeIcon icon={faStar} className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            aria-label="Delete"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <FontAwesomeIcon
              icon={deleting ? faSpinner : faTrash}
              className={cn("size-3.5", deleting && "animate-spin")}
            />
          </button>
        </div>
      </div>

      {msg.attachments.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {msg.attachments.map((a) => (
            <span
              key={a.filename}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface-2/60 px-3 py-1.5 text-xs"
            >
              <FontAwesomeIcon icon={faPaperclip} className="size-3 text-muted-foreground" />
              {a.filename}
              <span className="text-muted-foreground">
                {(a.size / 1024).toFixed(0)} KB
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Mail HTML is third-party content, so it renders inside a sandboxed
          iframe with no scripts and no same-origin access. Injecting it into
          the admin DOM would hand any sender a scripting foothold. */}
      <div className="mt-5 overflow-hidden rounded-xl border border-border/60 bg-white">
        <iframe
          title={msg.subject}
          sandbox=""
          className="h-[420px] w-full"
          srcDoc={
            msg.html ||
            `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap;padding:16px;color:#0a0b0f">${msg.text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")}</pre>`
          }
        />
      </div>

      {!replying ? (
        <button
          type="button"
          onClick={() => setReplying(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <FontAwesomeIcon icon={faReply} className="size-3.5" />
          Reply
        </button>
      ) : (
        <Composer
          inline
          replyTo={msg}
          onClose={() => setReplying(false)}
          onSent={() => {
            setReplying(false);
            onSent();
          }}
        />
      )}
    </div>
  );
}

function Composer({
  replyTo,
  inline,
  onClose,
  onSent,
}: {
  replyTo?: MailDetail;
  inline?: boolean;
  onClose: () => void;
  onSent: () => void;
}) {
  const [to, setTo] = useState(replyTo?.from.address ?? "");
  const [subject, setSubject] = useState(
    replyTo
      ? replyTo.subject.replace(/^(re:\s*)*/i, "Re: ")
      : "",
  );
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast.error("To, subject, and message are all required.");
      return;
    }
    setSending(true);
    try {
      await api.post("/mailbox/send", {
        to,
        subject,
        body,
        inReplyTo: replyTo?.messageId,
        references: replyTo
          ? [...replyTo.references, replyTo.messageId].filter(Boolean)
          : [],
        replyToUid: replyTo?.uid,
        mailbox: replyTo?.mailbox,
        quote: replyTo
          ? {
              from: replyTo.from.name || replyTo.from.address,
              date: new Date(replyTo.date).toLocaleString(),
              html: replyTo.html || replyTo.text,
            }
          : undefined,
      });
      toast.success("Message sent");
      onSent();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const fields = (
    <div className="space-y-3">
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="To"
        className="w-full rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-sm outline-none focus:border-brand-500/60"
      />
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full rounded-xl border border-border/60 bg-surface-2/60 px-4 py-2.5 text-sm outline-none focus:border-brand-500/60"
      />
      <textarea
        rows={inline ? 6 : 10}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your message…"
        className="w-full resize-y rounded-xl border border-border/60 bg-surface-2/60 px-4 py-3 text-sm outline-none focus:border-brand-500/60"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={send}
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={sending ? faSpinner : faPaperPlane}
            className={cn("size-3.5", sending && "animate-spin")}
          />
          {sending ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border/60 px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand-500/40"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (inline) return <div className="mt-5 border-t border-border/60 pt-5">{fields}</div>;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border/60 bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold tracking-tight">
            New message
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2"
          >
            <FontAwesomeIcon icon={faXmark} className="size-4" />
          </button>
        </div>
        {fields}
      </div>
    </div>
  );
}
