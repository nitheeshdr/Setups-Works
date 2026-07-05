import { z } from "zod";
import { generateContent, groqConfigured } from "@/lib/groq";
import { ok, parseBody, requireAuth, badRequest, serverError } from "@/lib/api-utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  type: z.enum(["blog", "product", "portfolio"]),
  prompt: z.string().min(3, "Enter a longer prompt"),
});

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;
  if (!groqConfigured())
    return badRequest("GROQ_API_KEY is not set. Add it to your environment.");

  const { data, error: bodyErr } = await parseBody(req, schema);
  if (bodyErr) return bodyErr;

  try {
    const result = await generateContent(data.type, data.prompt);
    return ok(result);
  } catch (err) {
    console.error("[generate]", err);
    return serverError((err as Error).message || "Generation failed.");
  }
}
