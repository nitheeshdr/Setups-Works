import { milestoneHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = milestoneHandlers.getOne;
export const PUT = milestoneHandlers.update;
export const DELETE = milestoneHandlers.remove;
