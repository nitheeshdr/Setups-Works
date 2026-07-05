import { clientLogoHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = clientLogoHandlers.getOne;
export const PUT = clientLogoHandlers.update;
export const DELETE = clientLogoHandlers.remove;
