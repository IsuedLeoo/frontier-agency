import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes — must be authenticated
  if (pathname.startsWith("/admin")) {
    const sessionId = request.cookies.get("frontier_session")?.value;
    if (!sessionId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const sessionId = request.cookies.get("frontier_session")?.value;
    if (!sessionId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
