import { z } from "zod";
import { sendReply, replyTemplate, mailConfigured } from "@/lib/mailer";
import { markAnswered, appendToSent, imapConfigured } from "@/lib/imap";
import {
  ok,
  parseBody,
  requireAuth,
  serverError,
  badRequest,
} from "@/lib/api-utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  to: z.string().min(3, "Recipient is required"),
  cc: z.string().optional().default(""),
  bcc: z.string().optional().default(""),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Write a message"),
  /** Present when replying — used for threading and the Answered flag. */
  inReplyTo: z.string().optional().default(""),
  references: z.array(z.string()).optional().default([]),
  replyToUid: z.number().optional(),
  mailbox: z.string().optional().default("INBOX"),
  /** Quoted original, shown beneath the reply. */
  quote: z
    .object({ from: z.string(), date: z.string(), html: z.string() })
    .optional(),
});

/** Admin: send a new mail or reply to one in the inbox. */
export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  if (!mailConfigured()) {
    return badRequest(
      "SMTP is not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS in your environment.",
    );
  }

  const { data, error: bodyErr } = await parseBody(req, schema);
  if (bodyErr) return bodyErr;

  try {
    const html = replyTemplate(data.body, data.quote);

    const res = await sendReply({
      to: data.to,
      cc: data.cc || undefined,
      bcc: data.bcc || undefined,
      subject: data.subject,
      html,
      text: data.body,
      inReplyTo: data.inReplyTo || undefined,
      references: data.references,
    });

    if (!res.ok) return serverError(res.error || "Could not send the message.");

    // Both follow-ups are best-effort: the mail is already delivered, and
    // failing to file a copy or set a flag must not report the send as failed.
    if (imapConfigured()) {
      if (res.raw) {
        await appendToSent(res.raw).catch((e) =>
          console.warn("[mailbox.send] could not append to Sent:", e.message),
        );
      }
      if (typeof data.replyToUid === "number") {
        await markAnswered(data.replyToUid, data.mailbox).catch((e) =>
          console.warn("[mailbox.send] could not flag answered:", e.message),
        );
      }
    }

    return ok({ success: true });
  } catch (err) {
    console.error("[mailbox.send]", err);
    return serverError((err as Error).message || "Could not send the message.");
  }
}
