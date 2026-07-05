// Groq AI content generation (OpenAI-compatible chat completions).
// Set GROQ_API_KEY in your environment. Get a key at https://console.groq.com/keys

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export type GenerateType = "blog" | "product" | "portfolio";

export const groqConfigured = () => Boolean(process.env.GROQ_API_KEY);

const systemPrompts: Record<GenerateType, string> = {
  blog: `You are a senior content writer for "Setups Works", a premium digital agency (web, mobile & AI development).
Generate a complete blog post and return ONLY a valid JSON object with these exact keys:
{
  "title": string (compelling, specific headline),
  "excerpt": string (1-2 sentence summary),
  "content": string (rich HTML body using <p>, <h2>, <h3>, <ul><li>, <strong>, <blockquote> — do NOT include <h1> or <html>/<body> wrappers; 4-7 well-developed sections),
  "category": one of ["Technology","AI","Programming","React","JavaScript","Node.js","WordPress","Business","Marketing"],
  "tags": string[] (3-6 relevant tags),
  "seoTitle": string (max 60 chars),
  "seoDescription": string (max 155 chars)
}
Write in an expert, engaging, non-fluffy tone. Return only JSON.`,

  product: `You are a product marketer for "Setups Works", a premium digital agency.
Generate a software product listing and return ONLY a valid JSON object with these exact keys:
{
  "name": string,
  "tagline": string (short punchy line),
  "description": string (2-3 sentence plain-text summary),
  "content": string (rich HTML details using <p>, <h2>, <ul><li>, <strong> — no <h1>),
  "features": Array<{ "title": string, "description": string }> (4-6 features),
  "technologies": string[] (4-8 tech names),
  "category": string,
  "status": one of ["coming-soon","beta","live"]
}
Return only JSON.`,

  portfolio: `You are a case-study writer for "Setups Works", a premium digital agency.
Generate a portfolio project and return ONLY a valid JSON object with these exact keys:
{
  "title": string,
  "category": one of ["Web App","AI Product","E-commerce","Website","Mobile App"],
  "summary": string (1-2 sentences),
  "techStack": string[] (4-7 technologies),
  "client": string (realistic company name),
  "duration": string (e.g. "8 weeks"),
  "year": string (e.g. "2026"),
  "caseStudy": string (2-4 paragraph narrative: the challenge, approach, and measurable results)
}
Return only JSON.`,
};

export async function generateContent(
  type: GenerateType,
  prompt: string,
): Promise<Record<string, unknown>> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured on the server.");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompts[type] },
        {
          role: "user",
          content: `Create a ${type} about: ${prompt}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.75,
      max_tokens: 6000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Groq request failed (${res.status}). ${text.slice(0, 200)}`,
    );
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response.");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Groq returned invalid JSON. Try again.");
  }
}
