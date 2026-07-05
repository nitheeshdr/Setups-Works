import { z } from "zod";
import { requireDB } from "@/lib/db";
import { Subscriber } from "@/models";
import {
  ok,
  created,
  parseBody,
  requireAuth,
  serverError,
  parseListParams,
} from "@/lib/api-utils";
import { toCSV } from "@/lib/helpers";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().email() });

// Public: subscribe
export async function POST(req: Request) {
  const { data, error } = await parseBody(req, schema);
  if (error) return error;
  try {
    await requireDB();
    const email = data.email.toLowerCase();
    const existing = await Subscriber.findOne({ email });
    if (existing) return ok({ success: true, alreadySubscribed: true });
    await Subscriber.create({ email });
    return created({ success: true });
  } catch (err) {
    console.error("[newsletter.POST]", err);
    return serverError("Could not subscribe. Please try again.");
  }
}

// Admin: list subscribers (with ?export=csv)
export async function GET(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;
  const { page, limit, search } = parseListParams(req);
  const url = new URL(req.url);

  try {
    await requireDB();
    const filter = search ? { email: new RegExp(search, "i") } : {};

    if (url.searchParams.get("export") === "csv") {
      const all = await Subscriber.find(filter).sort({ createdAt: -1 }).lean();
      const csv = toCSV(all.map((s) => ({ email: s.email, subscribed: s.createdAt })));
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="subscribers.csv"`,
        },
      });
    }

    const total = await Subscriber.countDocuments(filter);
    const items = await Subscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return ok({
      items: JSON.parse(JSON.stringify(items)),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[newsletter.GET]", err);
    return serverError();
  }
}
