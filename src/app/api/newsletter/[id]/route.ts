import { requireDB } from "@/lib/db";
import { Subscriber } from "@/models";
import { ok, requireAuth, serverError } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  try {
    await requireDB();
    await Subscriber.findByIdAndDelete(id);
    return ok({ success: true });
  } catch (err) {
    console.error("[newsletter.DELETE]", err);
    return serverError();
  }
}
