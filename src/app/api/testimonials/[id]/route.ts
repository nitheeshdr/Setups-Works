import { testimonialHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = testimonialHandlers.getOne;
export const PUT = testimonialHandlers.update;
export const DELETE = testimonialHandlers.remove;
