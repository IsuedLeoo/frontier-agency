import { NextResponse } from "next/server";
import { getSession, initDbQueries } from "@/lib/auth";
import type { D1Database } from "@cloudflare/workers-types";

export async function GET() {
  try {
    // Get database binding from Cloudflare environment
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const dbBinding = process.env.frontier_agency_db as unknown as D1Database;

    // Import and initialize DB queries
    const { getDatabaseQueries } = await import("@/lib/db");
    const { userQueries, sessionQueries } = getDatabaseQueries(dbBinding);
    initDbQueries({ userQueries, sessionQueries });

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: session.user }, { status: 200 });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}