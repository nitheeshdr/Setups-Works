import { productHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = productHandlers.getOne;
export const PUT = productHandlers.update;
export const DELETE = productHandlers.remove;
