import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  createSession,
  validateEmail,
  validatePassword,
  validateName,
  generateId,
} from "@/lib/auth";
import { userQueries } from "@/lib/db";

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

    const existingUser = userQueries.findByEmail.get(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = generateId();
    const createdAt = new Date().toISOString();

    userQueries.create.run(
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      name.trim(),
      createdAt
    );

    await createSession(userId);

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
