import { teamMemberHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = teamMemberHandlers.getOne;
export const PUT = teamMemberHandlers.update;
export const DELETE = teamMemberHandlers.remove;
