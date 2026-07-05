import { z } from "zod";
import { requireDB } from "@/lib/db";
import { User } from "@/models";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, parseBody, badRequest, unauthorized, serverError } from "@/lib/api-utils";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const { data, error } = await parseBody(req, schema);
  if (error) return error;

  try {
    await requireDB();
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) return unauthorized("Invalid email or password");

    const valid = await verifyPassword(data.password, user.password);
    if (!valid) return unauthorized("Invalid email or password");

    const session = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = signToken(session);
    await setAuthCookie(token);

    return ok({ user: session });
  } catch (err) {
    console.error("[auth/login]", err);
    return serverError("Login failed. Please try again.");
  }
}
