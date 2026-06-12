import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession, validateEmail } from "@/lib/auth";
import { getQueries } from "@/lib/db";

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

    const { userQueries, sessionQueries } = await getQueries();

    // Initialize session queries for auth helpers
    const { initDbQueries } = await import("@/lib/auth");
    initDbQueries({ userQueries, sessionQueries });

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
    const { sessionId } = await createSession(user.id);

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json(
      { success: true, redirect: "/dashboard" },
      { status: 200 }
    );
    response.headers.append(
      "Set-Cookie",
      `frontier_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}${isProduction ? "; Secure" : ""}`
    );
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
