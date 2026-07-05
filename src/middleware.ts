import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "sw_token";

/**
 * Fast edge gate: redirects unauthenticated users away from /admin (except the
 * login page) based on cookie presence. Full JWT verification runs in the admin
 * layout (Node runtime) — this only avoids a flash of protected UI.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const hasToken = req.cookies.has(COOKIE_NAME);

  if (pathname.startsWith("/admin") && !isLogin && !hasToken) {
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

export const config = {
  matcher: ["/admin/:path*"],
};
