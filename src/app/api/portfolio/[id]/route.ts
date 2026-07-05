import { portfolioHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = portfolioHandlers.getOne;
export const PUT = portfolioHandlers.update;
export const DELETE = portfolioHandlers.remove;
