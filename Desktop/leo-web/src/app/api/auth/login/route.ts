import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession, validateEmail } from "@/lib/auth";
import type { D1Database } from "@cloudflare/workers-types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Get database binding from Cloudflare environment
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const dbBinding = process.env.frontier_agency_db as unknown as D1Database;

    // Import the D1 database adapter
    const { getDatabaseQueries } = await import("@/lib/db");
    const { userQueries, sessionQueries } = getDatabaseQueries(dbBinding);

    // Find user by email
    const userResult = await userQueries.findByEmail
      .bind(email.toLowerCase())
      .first();

    if (!userResult) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = userResult as { id: string; password_hash: string };

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session and set cookie
    const { sessionId, expiresAt } = await createSession(user.id, sessionQueries);

    // Set cookie via response headers
    const cookieStore = await cookies();
    cookieStore.set("frontier_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    return NextResponse.json(
      { success: true, redirect: "/dashboard" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Helper to create session (extracted for clarity)
async function createSession(userId: string, sessionQueries: any): Promise<string> {
  const crypto = await import("crypto");
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  ).toISOString();

  await sessionQueries.create
    .bind(sessionId, userId, expiresAt)
    .run();

  const cookieStore = await cookies();
  cookieStore.set("frontier_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  });

  return sessionId;
}