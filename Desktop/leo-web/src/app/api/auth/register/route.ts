import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  createSession,
  validateEmail,
  validatePassword,
  validateName,
  generateId,
} from "@/lib/auth";
import type { D1Database } from "@cloudflare/workers-types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    // Get database binding from Cloudflare environment
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const dbBinding = process.env.frontier_agency_db as unknown as D1Database;

    // Import the D1 database adapter
    const { getDatabaseQueries } = await import("@/lib/db");
    const { userQueries, sessionQueries } = getDatabaseQueries(dbBinding);

    // Check if user already exists
    const existingUser = await userQueries.findByEmail
      .bind(email.toLowerCase())
      .first();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const passwordHash = await hashPassword(password);
    const userId = generateId();
    const createdAt = new Date().toISOString();

    await userQueries.create
      .bind(
        userId,
        email.toLowerCase().trim(),
        passwordHash,
        name.trim(),
        createdAt
      )
      .run();

    // Create session
    await createSession(userId, sessionQueries);

    return NextResponse.json(
      { success: true, redirect: "/dashboard" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
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