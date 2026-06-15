import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getQueries } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { userQueries, sessionQueries } = await getQueries();

    // Get session ID from cookie
    const sessionId = request.cookies.get("frontier_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Delete expired sessions first
    await sessionQueries.deleteExpired.bind().run();

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
      role: string;
      created_at: string;
      password_hash: string;
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
