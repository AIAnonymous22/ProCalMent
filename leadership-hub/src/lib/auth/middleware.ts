import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "leadership_hub_session";

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/api/auth/sign-in", "/api/auth/sign-up"];

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/(hub)") || pathname === "/") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}
