import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  validateEmail,
} from "@/lib/auth";
import { userQueries } from "@/lib/db";

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

    const user = userQueries.findByEmail.get(email.toLowerCase()) as
      | { id: string; password_hash: string }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    let isValid: boolean;
    try {
      isValid = await verifyPassword(password, user.password_hash);
    } catch (err) {
      console.error("Password verification error:", err);
      return NextResponse.json(
        { error: "An error occurred. Please try again." },
        { status: 500 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession(user.id);

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
