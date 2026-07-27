import { serviceHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = serviceHandlers.list;
export const POST = serviceHandlers.create;
