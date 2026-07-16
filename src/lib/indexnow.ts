import { siteConfig } from "@/lib/site";

const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Public path that serves the IndexNow key file (see app/indexnow-key.txt). */
export const INDEXNOW_KEY_PATH = "/indexnow-key.txt";

/**
 * Notify IndexNow that URLs were added or changed, so participating engines
 * crawl them within minutes instead of waiting for their next sweep.
 *
 * Participants: Bing, Yandex, Naver, Seznam. Google does NOT participate and
 * ignores IndexNow — Google discovery still comes from sitemap.xml plus
 * Search Console. There is no supported API to push arbitrary pages to Google
 * (its Indexing API is limited to JobPosting and BroadcastEvent).
 *
 * Fire-and-forget: this never throws, so a failed ping can't break a save.
 */
export async function submitToIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  const base = siteConfig.url;
  // Skip localhost — IndexNow only accepts publicly reachable hosts.
  if (!base.startsWith("https://")) return;

  const urlList = Array.from(new Set(paths))
    .filter(Boolean)
    .map((p) => (p.startsWith("http") ? p : `${base}${p}`));
  if (!urlList.length) return;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(base).host,
        key,
        keyLocation: `${base}${INDEXNOW_KEY_PATH}`,
        urlList,
      }),
    });
    if (!res.ok) {
      console.warn("[indexnow] rejected", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.warn("[indexnow] ping failed", err);
  }
}
