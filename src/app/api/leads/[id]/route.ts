import { requireDB } from "@/lib/db";
import { Lead } from "@/models";
import {
  ok,
  requireAuth,
  serverError,
  notFoundResponse,
} from "@/lib/api-utils";

export const runtime = "nodejs";

/**
 * Single-lead routes. The admin table's delete action calls
 * DELETE /api/leads/:id, so this must exist alongside the collection route —
 * without it the button fails with a 404.
 *
 * There is no PUT: leads are a record of what someone submitted, not something
 * we rewrite. PATCH only flips the `handled` flag.
 */

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await ctx.params;
  try {
    await requireDB();
    const doc = await Lead.findById(id).lean();
    if (!doc) return notFoundResponse();
    return ok(JSON.parse(JSON.stringify(doc)));
  } catch (err) {
    console.error("[leads.getOne]", err);
    return serverError();
  }
}

/** Mark a lead handled / unhandled. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await ctx.params;
  try {
    const body = (await req.json().catch(() => ({}))) as { handled?: boolean };
    await requireDB();
    const doc = await Lead.findByIdAndUpdate(
      id,
      { handled: Boolean(body.handled) },
      { new: true },
    ).lean();
    if (!doc) return notFoundResponse();
    return ok(JSON.parse(JSON.stringify(doc)));
  } catch (err) {
    console.error("[leads.patch]", err);
    return serverError();
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await ctx.params;
  try {
    await requireDB();
    await Lead.findByIdAndDelete(id);
    return ok({ success: true });
  } catch (err) {
    console.error("[leads.remove]", err);
    return serverError();
  }
}
