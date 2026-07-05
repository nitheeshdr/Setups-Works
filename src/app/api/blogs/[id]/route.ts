import { blogHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = blogHandlers.getOne;
export const PUT = blogHandlers.update;
export const DELETE = blogHandlers.remove;
