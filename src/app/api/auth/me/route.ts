import { getSession } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSession();
  if (!user) return unauthorized();
  return ok({ user });
}
