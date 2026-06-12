import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  createSession,
  validateEmail,
  validatePassword,
  validateName,
  generateId,
  initDbQueries,
} from "@/lib/auth";
import { getQueries } from "@/lib/db";

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

    const { userQueries, sessionQueries } = await getQueries();
    initDbQueries({ userQueries, sessionQueries });

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

    // Create session and set cookie
    const { sessionId } = await createSession(userId);

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json(
      { success: true, redirect: "/dashboard" },
      { status: 201 }
    );
    response.headers.append(
      "Set-Cookie",
      `frontier_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}${isProduction ? "; Secure" : ""}`
    );
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", debug: String(error) },
      { status: 500 }
    );
  }
}
