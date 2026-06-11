import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { SafeUser } from "@/lib/types";
import type { D1Database } from "@cloudflare/workers-types";

export async function GET(request: NextRequest) {
  try {
    // Get database binding from Cloudflare environment
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const dbBinding = process.env.frontier_agency_db as unknown as D1Database;

    // Import and get DB queries
    const { getDatabaseQueries } = await import("@/lib/db");
    const { userQueries, sessionQueries } = getDatabaseQueries(dbBinding);

    // Check if we have the required queries
    if (!userQueries || !sessionQueries) {
      return NextResponse.json(
        { error: "Database queries not available" },
        { status: 500 }
      );
    }

    // Get session ID from cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get("frontier_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Delete expired sessions first
    await sessionQueries.deleteExpired.run();

    // Find the session
    const sessionResult = await sessionQueries.findById.bind(sessionId).first();

    if (!sessionResult) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Find the user
    const userResult = await userQueries.findById.bind(sessionResult.user_id).first();

    if (!userResult) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { password_hash: _, ...safeUser } = userResult as {
      id: string;
      email: string;
      name: string;
      created_at: string;
      password_hash: string
    };

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}