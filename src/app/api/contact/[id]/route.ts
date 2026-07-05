import { z } from "zod";
import { requireDB } from "@/lib/db";
import { Contact } from "@/models";
import {
  ok,
  parseBody,
  requireAuth,
  serverError,
  notFoundResponse,
} from "@/lib/api-utils";

export const runtime = "nodejs";

const schema = z.object({ replied: z.boolean() });

// Admin: mark replied / unreplied
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  const { data, error: bodyErr } = await parseBody(req, schema);
  if (bodyErr) return bodyErr;

  try {
    await requireDB();
    const doc = await Contact.findByIdAndUpdate(id, { replied: data.replied }, { new: true }).lean();
    if (!doc) return notFoundResponse();
    return ok(JSON.parse(JSON.stringify(doc)));
  } catch (err) {
    console.error("[contact.PATCH]", err);
    return serverError();
  }
}

// Admin: delete a message
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  try {
    await requireDB();
    await Contact.findByIdAndDelete(id);
    return ok({ success: true });
  } catch (err) {
    console.error("[contact.DELETE]", err);
    return serverError();
  }
}
