import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const COOKIE_NAME = "sw_token";

/**
 * Crawler user-agent tokens worth recording. Matching on the UA string alone
 * proves nothing — anyone can send "Googlebot" — so this is only a cheap filter
 * to decide what is worth the cost of verifying. /api/crawler-log does the
 * actual reverse-DNS and IP-range check before trusting any of it.
 */
const CRAWLER_UA = /googlebot|google-inspectiontool|google-extended|bingbot|duckduckbot|yandex|applebot|slurp|baiduspider|petalbot/i;

/**
 * Runs before every matched request.
 *
 * 1. Fast auth gate for /admin — redirects on cookie presence only. Full JWT
 *    verification happens in the admin layout; this just avoids a flash of
 *    protected UI.
 * 2. Records crawler visits on public routes, so "is Googlebot actually
 *    crawling us?" is answerable from data rather than assumption.
 *
 * The logging call is wrapped in waitUntil so it extends the proxy's lifetime
 * without delaying the response — a crawler must never wait on our bookkeeping.
 */
export function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  /* ------------------------------ admin gate ----------------------------- */
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const hasToken = req.cookies.has(COOKIE_NAME);

    if (!isLogin && !hasToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (isLogin && hasToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  /* ---------------------------- crawler logging -------------------------- */
  const ua = req.headers.get("user-agent") ?? "";
  if (CRAWLER_UA.test(ua)) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "";

    event.waitUntil(
      fetch(new URL("/api/crawler-log", req.nextUrl.origin), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Shared secret so only the proxy can write log entries; without it
          // the endpoint would let anyone forge crawler traffic.
          "x-crawler-log-key": process.env.CRAWLER_LOG_KEY ?? "",
        },
        body: JSON.stringify({ path: pathname, userAgent: ua, ip }),
      }).catch(() => {
        // Logging must never surface as an error to the crawler.
      }),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    /*
     * Public pages only. Excluding _next, api and static assets keeps this off
     * the hot path for the requests that never need it — and excluding /api is
     * also what stops /api/crawler-log from logging its own call.
     */
    "/((?!api|_next/static|_next/image|favicon|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
