import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

/**
 * IMAP mailbox access for the admin inbox.
 *
 * Credentials reuse the SMTP mailbox by default (same account on Hostinger),
 * with IMAP_* overrides for the case where reading and sending ever diverge.
 *
 * Every helper opens and closes its own connection rather than holding a pool.
 * IMAP connections are stateful and serverless invocations are short-lived, so
 * a cached connection would routinely be found dead — reconnecting per request
 * is slower but is the behaviour that actually works.
 */

const host = () => process.env.IMAP_HOST || "imap.hostinger.com";
const port = () => Number(process.env.IMAP_PORT || 993);
const user = () => process.env.IMAP_USER || process.env.SMTP_USER || "";
const pass = () => process.env.IMAP_PASS || process.env.SMTP_PASS || "";

export const imapConfigured = () => Boolean(host() && user() && pass());

export interface MailSummary {
  uid: number;
  mailbox: string;
  subject: string;
  from: { name: string; address: string };
  to: string;
  date: string;
  seen: boolean;
  flagged: boolean;
  answered: boolean;
  preview: string;
  hasAttachments: boolean;
}

export interface MailDetail extends MailSummary {
  html: string;
  text: string;
  messageId: string;
  references: string[];
  attachments: { filename: string; size: number; contentType: string }[];
}

async function connect(): Promise<ImapFlow> {
  if (!imapConfigured()) throw new Error("IMAP is not configured.");
  const client = new ImapFlow({
    host: host(),
    port: port(),
    secure: port() === 993,
    auth: { user: user(), pass: pass() },
    logger: false,
    // Hostinger can be slow to greet; fail loudly rather than hang a request.
    greetingTimeout: 10000,
    socketTimeout: 30000,
  });
  await client.connect();
  return client;
}

/** Run `fn` against an open connection and always tear the connection down. */
async function withClient<T>(fn: (c: ImapFlow) => Promise<T>): Promise<T> {
  const client = await connect();
  try {
    return await fn(client);
  } finally {
    try {
      await client.logout();
    } catch {
      // A failed logout must never mask the real result.
    }
  }
}

const addr = (a: unknown): { name: string; address: string } => {
  const v = a as { value?: { name?: string; address?: string }[] } | undefined;
  const first = v?.value?.[0];
  return { name: first?.name || "", address: first?.address || "" };
};

/** List mailbox folders, so the UI can offer Inbox / Sent / etc. */
export async function listMailboxes(): Promise<string[]> {
  return withClient(async (c) => {
    const boxes = await c.list();
    return boxes.map((b) => b.path);
  });
}

/**
 * Newest-first page of messages. IMAP sequence numbers are ascending by
 * arrival, so the newest page is the tail of the range.
 */
export async function listMessages(opts: {
  mailbox?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ items: MailSummary[]; total: number; page: number; pages: number }> {
  const mailbox = opts.mailbox || "INBOX";
  const limit = Math.min(opts.limit ?? 25, 100);
  const page = Math.max(1, opts.page ?? 1);

  return withClient(async (c) => {
    const lock = await c.getMailboxLock(mailbox);
    try {
      let uids: number[];
      if (opts.search?.trim()) {
        const q = opts.search.trim();
        // OR across the fields people actually search by.
        uids = await c.search({ or: [{ subject: q }, { from: q }, { body: q }] }) || [];
      } else {
        uids = (await c.search({ all: true })) || [];
      }

      const total = uids.length;
      const pages = Math.max(1, Math.ceil(total / limit));
      // Newest first: reverse, then slice the requested page.
      const pageUids = uids.slice().reverse().slice((page - 1) * limit, page * limit);
      if (!pageUids.length) return { items: [], total, page, pages };

      const items: MailSummary[] = [];
      for await (const msg of c.fetch(
        { uid: pageUids.join(",") },
        { uid: true, envelope: true, flags: true, bodyStructure: true, size: true },
      )) {
        const env = msg.envelope;
        const flags = msg.flags ?? new Set<string>();
        items.push({
          uid: msg.uid,
          mailbox,
          subject: env?.subject || "(no subject)",
          from: {
            name: env?.from?.[0]?.name || "",
            address: env?.from?.[0]?.address || "",
          },
          to: env?.to?.map((t) => t.address).filter(Boolean).join(", ") || "",
          date: (env?.date ?? new Date()).toISOString(),
          seen: flags.has("\\Seen"),
          flagged: flags.has("\\Flagged"),
          answered: flags.has("\\Answered"),
          preview: "",
          hasAttachments: Boolean(
            msg.bodyStructure?.childNodes?.some(
              (n) => n.disposition === "attachment",
            ),
          ),
        });
      }

      // fetch() yields in sequence order; restore newest-first.
      items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      return { items, total, page, pages };
    } finally {
      lock.release();
    }
  });
}

/** Full message body. Marks it read, which is what opening a mail implies. */
export async function getMessage(
  uid: number,
  mailbox = "INBOX",
): Promise<MailDetail | null> {
  return withClient(async (c) => {
    const lock = await c.getMailboxLock(mailbox);
    try {
      const msg = await c.fetchOne(
        String(uid),
        { uid: true, source: true, envelope: true, flags: true },
        { uid: true },
      );
      if (!msg || !msg.source) return null;

      const parsed = await simpleParser(msg.source);
      const flags = msg.flags ?? new Set<string>();

      await c.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true }).catch(() => {});

      return {
        uid,
        mailbox,
        subject: parsed.subject || "(no subject)",
        from: addr(parsed.from),
        to: Array.isArray(parsed.to)
          ? parsed.to.map((t) => t.text).join(", ")
          : (parsed.to?.text ?? ""),
        date: (parsed.date ?? new Date()).toISOString(),
        seen: true,
        flagged: flags.has("\\Flagged"),
        answered: flags.has("\\Answered"),
        preview: (parsed.text || "").slice(0, 200),
        hasAttachments: (parsed.attachments?.length ?? 0) > 0,
        html: parsed.html || "",
        text: parsed.text || "",
        messageId: parsed.messageId || "",
        references: Array.isArray(parsed.references)
          ? parsed.references
          : parsed.references
            ? [parsed.references]
            : [],
        attachments: (parsed.attachments ?? []).map((a) => ({
          filename: a.filename || "attachment",
          size: a.size ?? 0,
          contentType: a.contentType || "application/octet-stream",
        })),
      };
    } finally {
      lock.release();
    }
  });
}

export async function setFlag(
  uid: number,
  flag: "\\Seen" | "\\Flagged",
  on: boolean,
  mailbox = "INBOX",
): Promise<void> {
  await withClient(async (c) => {
    const lock = await c.getMailboxLock(mailbox);
    try {
      if (on) await c.messageFlagsAdd(String(uid), [flag], { uid: true });
      else await c.messageFlagsRemove(String(uid), [flag], { uid: true });
    } finally {
      lock.release();
    }
  });
}

/** Mark deleted. Falls back to the \Deleted flag when no Trash folder exists. */
export async function deleteMessage(uid: number, mailbox = "INBOX"): Promise<void> {
  await withClient(async (c) => {
    const lock = await c.getMailboxLock(mailbox);
    try {
      await c.messageDelete(String(uid), { uid: true });
    } finally {
      lock.release();
    }
  });
}

/** Mark a message answered after a reply is sent. */
export async function markAnswered(uid: number, mailbox = "INBOX"): Promise<void> {
  await setFlagRaw(uid, "\\Answered", mailbox);
}

async function setFlagRaw(uid: number, flag: string, mailbox: string) {
  await withClient(async (c) => {
    const lock = await c.getMailboxLock(mailbox);
    try {
      await c.messageFlagsAdd(String(uid), [flag], { uid: true });
    } finally {
      lock.release();
    }
  });
}

/** Append a sent message to the Sent folder — SMTP alone does not do this. */
export async function appendToSent(raw: Buffer | string): Promise<void> {
  await withClient(async (c) => {
    const boxes = await c.list();
    const sent =
      boxes.find((b) => b.specialUse === "\\Sent")?.path ||
      boxes.find((b) => /^sent/i.test(b.path))?.path;
    if (!sent) return;
    await c.append(sent, raw, ["\\Seen"]);
  });
}
