"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faSpinner,
  faTriangleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/lib/admin/api";
import { formatDate } from "@/lib/helpers";
import { initials } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { ContactMessage, MessageReply } from "@/lib/types";

/**
 * Conversation view for a contact message: the inbound message, every reply
 * sent from the admin, and a composer.
 *
 * Replies render right-aligned against the left-aligned inbound message so the
 * direction of each turn is readable at a glance without needing labels.
 */
export function MessageThread({
  message,
  onSent,
}: {
  message: ContactMessage;
  onSent?: () => void;
}) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  // Replies sent during this session. The parent holds a snapshot from the
  // list query, so without this the thread would not show what was just sent
  // until the dialog is closed and reopened.
  const [sent, setSent] = useState<MessageReply[]>([]);

  const reply = useMutation({
    mutationFn: (text: string) =>
      api.post(`/contact/${message._id}/reply`, { body: text }),
    onSuccess: (_res, text) => {
      setSent((s) => [
        ...s,
        { body: text, sentAt: new Date().toISOString(), status: "sent" },
      ]);
      setBody("");
      qc.invalidateQueries({ queryKey: ["contact"] });
      toast.success("Reply sent");
      onSent?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const replies = [...(message.replies ?? []), ...sent];

  return (
    <div className="flex min-h-0 flex-col">
      {/* Conversation */}
      <div className="max-h-[46vh] space-y-4 overflow-y-auto pr-1">
        {/* Inbound */}
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-muted-foreground">
            {initials(message.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl rounded-tl-sm border border-border/60 bg-surface-2/50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </p>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {message.name} · {formatDate(message.createdAt ?? "")}
            </p>
          </div>
        </div>

        {/* Outbound */}
        {replies.map((r, i) => (
          <div key={i} className="flex items-start justify-end gap-3">
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "rounded-2xl rounded-tr-sm border p-4",
                  r.status === "failed"
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-brand-500/30 bg-brand-500/10",
                )}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {r.body}
                </p>
              </div>
              <p className="mt-1.5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                {r.status === "failed" ? (
                  <>
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="size-3 text-destructive"
                    />
                    <span className="text-destructive" title={r.error}>
                      Not delivered
                    </span>
                  </>
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="size-3 text-emerald-500"
                  />
                )}
                {r.sentBy ?? "admin"} · {formatDate(r.sentAt)}
              </p>
            </div>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500/15 text-[11px] font-semibold text-brand-500">
              SW
            </span>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="mt-4 border-t border-border/60 pt-4">
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            // Cmd/Ctrl+Enter sends, matching every other mail client.
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && body.trim()) {
              e.preventDefault();
              reply.mutate(body);
            }
          }}
          placeholder={`Reply to ${message.name}…`}
          className="w-full resize-y rounded-xl border border-border/60 bg-surface-2/60 px-4 py-3 text-sm outline-none focus:border-brand-500/60"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Sends to {message.email} · ⌘↵ to send
          </p>
          <button
            type="button"
            onClick={() => body.trim() && reply.mutate(body)}
            disabled={reply.isPending || !body.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            <FontAwesomeIcon
              icon={reply.isPending ? faSpinner : faPaperPlane}
              className={cn("size-3.5", reply.isPending && "animate-spin")}
            />
            {reply.isPending ? "Sending…" : "Send reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
