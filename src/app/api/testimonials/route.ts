import { testimonialHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = testimonialHandlers.list;
export const POST = testimonialHandlers.create;
