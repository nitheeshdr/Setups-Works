export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves the IndexNow key so search engines can verify we own this host.
 * The key is public by design — it only proves control of this domain and
 * grants nothing on any other host.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new Response("IndexNow key not configured.", { status: 404 });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
