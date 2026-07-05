import { requireAuth, badRequest, ok, serverError } from "@/lib/api-utils";
import { uploadImage } from "@/lib/upload";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("No file provided");
    if (!ALLOWED.includes(file.type)) return badRequest("Unsupported file type");
    if (file.size > MAX_BYTES) return badRequest("File too large (max 8MB)");

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, file.name);
    return ok(result);
  } catch (err) {
    console.error("[upload]", err);
    return serverError("Upload failed. Please try again.");
  }
}
