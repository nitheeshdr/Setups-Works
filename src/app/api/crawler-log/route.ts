import { z } from "zod";
import { requireDB } from "@/lib/db";
import { CrawlerHit } from "@/models";
import { ok, requireAuth, serverError, unauthorized } from "@/lib/api-utils";
import { verifyGoogleRequest } from "@/lib/verify-google";
import { crawlerName } from "@/lib/crawlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  path: z.string().min(1),
  userAgent: z.string().default(""),
  ip: z.string().default(""),
});


/**
 * Records a crawler visit. Called only by proxy.ts, gated on a shared secret —
 * without it anyone could POST fake crawl activity and make the log worthless.
 *
 * Google claims are verified against reverse DNS and Google's published IP
 * ranges before `verified` is set, so a spoofed Googlebot user-agent shows up
 * as an unverified hit rather than being silently believed.
 */
export async function POST(req: Request) {
  const key = process.env.CRAWLER_LOG_KEY;
  if (!key || req.headers.get("x-crawler-log-key") !== key) {
    return unauthorized();
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return serverError("Bad payload");
  const { path, userAgent, ip } = parsed.data;

  const crawler = crawlerName(userAgent);

  // Only Google publishes the data needed to verify; others are recorded as
  // claimed rather than pretending we checked them.
  let verified = false;
  let method: "ip-range" | "dns" | "none" = "none";
  if (crawler.startsWith("Google") && ip) {
    const res = await verifyGoogleRequest(ip).catch(() => null);
    if (res) {
      verified = res.verified;
      method = res.method;
    }
  }

  try {
    await requireDB();
    await CrawlerHit.create({ path, userAgent, ip, crawler, verified, method });
    return ok({ success: true });
  } catch (err) {
    console.error("[crawler-log]", err);
    return serverError();
  }
}

/** Admin: recent crawl activity, plus a summary of who is actually visiting. */
export async function GET(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const url = new URL(req.url);
  const days = Math.min(Number(url.searchParams.get("days") || 7), 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    await requireDB();

    const [items, byCrawler, topPaths, total] = await Promise.all([
      CrawlerHit.find({ createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      CrawlerHit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: "$crawler",
            hits: { $sum: 1 },
            verified: { $sum: { $cond: ["$verified", 1, 0] } },
          },
        },
        { $sort: { hits: -1 } },
      ]),
      CrawlerHit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: "$path", hits: { $sum: 1 } } },
        { $sort: { hits: -1 } },
        { $limit: 15 },
      ]),
      CrawlerHit.countDocuments({ createdAt: { $gte: since } }),
    ]);

    return ok({
      days,
      total,
      items: JSON.parse(JSON.stringify(items)),
      byCrawler,
      topPaths,
    });
  } catch (err) {
    console.error("[crawler-log.GET]", err);
    return serverError();
  }
}
