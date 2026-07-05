import { NextResponse } from "next/server";
import { z, type ZodType } from "zod";
import { getSession, type SessionUser } from "@/lib/auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(error: string, details?: unknown) {
  return NextResponse.json({ error, details }, { status: 400 });
}

export function unauthorized(error = "Unauthorized") {
  return NextResponse.json({ error }, { status: 401 });
}

export function notFoundResponse(error = "Not found") {
  return NextResponse.json({ error }, { status: 404 });
}

export function serverError(error = "Something went wrong") {
  return NextResponse.json({ error }, { status: 500 });
}

/** Parse + validate a JSON body against a Zod schema. */
export async function parseBody<T>(
  req: Request,
  schema: ZodType<T>,
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const json = await req.json();
    const result = schema.safeParse(json);
    if (!result.success) {
      return {
        data: null,
        error: badRequest("Validation failed", z.treeifyError(result.error)),
      };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null, error: badRequest("Invalid JSON body") };
  }
}

/** Require an authenticated admin session. Returns the user or a 401 response. */
export async function requireAuth(): Promise<
  { user: SessionUser; error: null } | { user: null; error: NextResponse }
> {
  const user = await getSession();
  if (!user) return { user: null, error: unauthorized() };
  return { user, error: null };
}

/** Parse pagination + filter params from a request URL. */
export function parseListParams(req: Request) {
  const url = new URL(req.url);
  return {
    page: Math.max(1, Number(url.searchParams.get("page")) || 1),
    limit: Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 12)),
    search: url.searchParams.get("search") || "",
    category: url.searchParams.get("category") || "",
    status: url.searchParams.get("status") || "",
    sort: url.searchParams.get("sort") || "-createdAt",
  };
}
