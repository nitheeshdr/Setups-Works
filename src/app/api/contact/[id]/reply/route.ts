import { z } from "zod";
import { requireDB } from "@/lib/db";
import { Contact } from "@/models";
import {
  ok,
  parseBody,
  requireAuth,
  serverError,
  badRequest,
  notFoundResponse,
} from "@/lib/api-utils";
import { sendReply, replyTemplate, mailConfigured } from "@/lib/mailer";

export const runtime = "nodejs";
export const maxDuration = 30;

const schema = z.object({
  body: z.string().min(1, "Write a reply first"),
});

/**
 * Reply to a contact message from inside the admin.
 *
 * The reply is recorded on the message either way — sent or failed. A failed
 * send that left no trace would look identical to never having replied, which
 * is the one outcome worth engineering against when the thread is the record
 * of what you told a customer.
 */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  if (!mailConfigured()) {
    return badRequest(
      "SMTP is not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS in your environment.",
    );
  }

  const { id } = await ctx.params;
  const { data, error: bodyErr } = await parseBody(req, schema);
  if (bodyErr) return bodyErr;

  try {
    await requireDB();
    const message = await Contact.findById(id);
    if (!message) return notFoundResponse();

    // Keep the thread in one mail conversation for the recipient too.
    const subject = /^re:/i.test(message.subject)
      ? message.subject
      : `Re: ${message.subject}`;

    const res = await sendReply({
      to: message.email,
      subject,
      html: replyTemplate(data.body, {
        from: message.name,
        date: new Date(message.createdAt).toLocaleString(),
        html: `<p>${String(message.message).replace(/</g, "&lt;")}</p>`,
      }),
      text: data.body,
    });

    message.replies.push({
      body: data.body,
      sentAt: new Date(),
      sentBy: user?.email ?? "admin",
      status: res.ok ? "sent" : "failed",
      error: res.ok ? undefined : (res.error ?? "").slice(0, 300),
    });
    // Only a delivered reply counts as replied.
    if (res.ok) message.replied = true;
    await message.save();

    if (!res.ok) {
      return serverError(res.error || "The reply could not be delivered.");
    }
    return ok({ success: true });
  } catch (err) {
    console.error("[contact.reply]", err);
    return serverError((err as Error).message || "Could not send the reply.");
  }
}
