import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST() {
  await clearAuthCookie();
  return ok({ success: true });
}
