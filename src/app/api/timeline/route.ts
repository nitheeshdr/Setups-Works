import { milestoneHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = milestoneHandlers.list;
export const POST = milestoneHandlers.create;
