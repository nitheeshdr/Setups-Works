import { requireDB } from "@/lib/db";
import { Settings } from "@/models";
import { ok, requireAuth, serverError } from "@/lib/api-utils";

export const runtime = "nodejs";

const serialize = (d: unknown) => JSON.parse(JSON.stringify(d));

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;
  try {
    await requireDB();
    let doc = await Settings.findOne({ key: "site" }).lean();
    if (!doc) doc = (await Settings.create({ key: "site" })).toObject();
    return ok(serialize(doc));
  } catch (err) {
    console.error("[settings.GET]", err);
    return serverError();
  }
}

export async function PUT(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;
  try {
    const body = await req.json();
    delete body._id;
    delete body.key;
    await requireDB();
    const doc = await Settings.findOneAndUpdate(
      { key: "site" },
      { ...body, key: "site" },
      { new: true, upsert: true },
    ).lean();
    return ok(serialize(doc));
  } catch (err) {
    console.error("[settings.PUT]", err);
    return serverError();
  }
}
