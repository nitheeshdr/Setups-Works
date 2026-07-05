import { productHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = productHandlers.list;
export const POST = productHandlers.create;
