import { listMessages, listMailboxes, imapConfigured } from "@/lib/imap";
import { ok, requireAuth, serverError, badRequest } from "@/lib/api-utils";

export const runtime = "nodejs";
export const maxDuration = 60;
// The mailbox is live state — never serve it from a cache.
export const dynamic = "force-dynamic";

/** Admin: paginated message list for a mailbox. */
export async function GET(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  if (!imapConfigured()) {
    return badRequest(
      "IMAP is not configured. Set IMAP_HOST/IMAP_USER/IMAP_PASS (or reuse SMTP_USER/SMTP_PASS) in your environment.",
    );
  }

  const url = new URL(req.url);
  const mailbox = url.searchParams.get("mailbox") || "INBOX";
  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 25);
  const search = url.searchParams.get("search") || "";

  try {
    if (url.searchParams.get("folders") === "1") {
      return ok({ folders: await listMailboxes() });
    }
    const data = await listMessages({ mailbox, page, limit, search });
    return ok(data);
  } catch (err) {
    console.error("[mailbox.GET]", err);
    return serverError(
      (err as Error).message || "Could not reach the mail server.",
    );
  }
}
