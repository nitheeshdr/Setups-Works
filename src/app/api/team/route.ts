import { teamMemberHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = teamMemberHandlers.list;
export const POST = teamMemberHandlers.create;
