import { blogHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = blogHandlers.list;
export const POST = blogHandlers.create;
