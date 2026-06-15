import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/voice", "/api/analytics"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("fa_admin_session");

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    // If already logged in on login page, redirect to dashboard
    if (pathname === "/login" && sessionCookie?.value) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // All other paths require auth (checked server-side in pages)
  // This middleware just ensures the cookie exists as a first-pass check
  if (!sessionCookie?.value && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
