import { getMessage, setFlag, deleteMessage, imapConfigured } from "@/lib/imap";
import {
  ok,
  requireAuth,
  serverError,
  badRequest,
  notFoundResponse,
} from "@/lib/api-utils";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const guard = async () => {
  const { error } = await requireAuth();
  if (error) return error;
  if (!imapConfigured()) return badRequest("IMAP is not configured.");
  return null;
};

/** Full message, including HTML body and attachment metadata. */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ uid: string }> },
) {
  const blocked = await guard();
  if (blocked) return blocked;

  const { uid } = await ctx.params;
  const mailbox = new URL(req.url).searchParams.get("mailbox") || "INBOX";

  try {
    const msg = await getMessage(Number(uid), mailbox);
    if (!msg) return notFoundResponse();
    return ok(msg);
  } catch (err) {
    console.error("[mailbox.get]", err);
    return serverError((err as Error).message);
  }
}

/** Toggle read / flagged. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ uid: string }> },
) {
  const blocked = await guard();
  if (blocked) return blocked;

  const { uid } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as {
    seen?: boolean;
    flagged?: boolean;
    mailbox?: string;
  };
  const mailbox = body.mailbox || "INBOX";

  try {
    if (typeof body.seen === "boolean")
      await setFlag(Number(uid), "\\Seen", body.seen, mailbox);
    if (typeof body.flagged === "boolean")
      await setFlag(Number(uid), "\\Flagged", body.flagged, mailbox);
    return ok({ success: true });
  } catch (err) {
    console.error("[mailbox.patch]", err);
    return serverError((err as Error).message);
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ uid: string }> },
) {
  const blocked = await guard();
  if (blocked) return blocked;

  const { uid } = await ctx.params;
  const mailbox = new URL(req.url).searchParams.get("mailbox") || "INBOX";

  try {
    await deleteMessage(Number(uid), mailbox);
    return ok({ success: true });
  } catch (err) {
    console.error("[mailbox.delete]", err);
    return serverError((err as Error).message);
  }
}
