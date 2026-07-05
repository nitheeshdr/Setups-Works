import { portfolioHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = portfolioHandlers.list;
export const POST = portfolioHandlers.create;
