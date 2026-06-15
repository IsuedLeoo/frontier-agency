import { NextRequest, NextResponse } from "next/server";
import { getQueries } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * POST /api/admin/promote
 * Body: { "email": "user@example.com", "role": "admin" }
 *
 * Only existing admins can promote other users.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the requesting user is an admin
    const cookies = request.headers.get("cookie") || "";
    const sessionIdMatch = cookies.match(/(?:^|; )frontier_session=([^;]*)/);
    const sessionId = sessionIdMatch ? decodeURIComponent(sessionIdMatch[1]) : null;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { sessionQueries, userQueries } = await getQueries();

    const sessionResult = await sessionQueries.findById.bind(sessionId).first();
    if (!sessionResult) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const adminUser = await userQueries.findById.bind(sessionResult.user_id).first();
    if (!adminUser || (adminUser as { role: string }).role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required" }, { status: 400 });
    }

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const targetUser = await userQueries.findByEmail.bind(email.toLowerCase()).first();
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { getD1Binding } = await import("@/lib/db");
    const rawDb = await getD1Binding();
    await rawDb
      .prepare("UPDATE users SET role = ? WHERE email = ?")
      .bind(role, email.toLowerCase())
      .run();

    return NextResponse.json({ ok: true, email, role });
  } catch (error) {
    console.error("Promote error:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }
}
