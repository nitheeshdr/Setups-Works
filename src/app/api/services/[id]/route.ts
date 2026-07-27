import { serviceHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = serviceHandlers.getOne;
export const PUT = serviceHandlers.update;
export const DELETE = serviceHandlers.remove;
