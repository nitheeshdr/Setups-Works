import { clientLogoHandlers } from "@/lib/resources";

export const runtime = "nodejs";

export const GET = clientLogoHandlers.list;
export const POST = clientLogoHandlers.create;
