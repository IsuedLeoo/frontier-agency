import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, initDbQueries } from "@/lib/auth";
import type { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";

// Initialize database queries once per request
export async function middleware(request: NextRequest) {
  // Get database binding from Cloudflare environment
  // @ts-ignore - D1 binding available in Cloudflare Workers
  const dbBinding = process.env.frontier_agency_db as unknown as D1Database;

  // Import and initialize DB queries for this request
  const { getDatabaseQueries } = await import("@/lib/db");
  const { userQueries, sessionQueries } = getDatabaseQueries(dbBinding);
  initDbQueries({ userQueries, sessionQueries });

  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get("frontier_session")?.value;

  if (!sessionId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};