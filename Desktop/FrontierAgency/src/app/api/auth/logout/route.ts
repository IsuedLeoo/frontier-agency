import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await destroySession();

    const response = NextResponse.json(
      { success: true, redirect: "/login" },
      { status: 200 }
    );
    response.headers.append(
      "Set-Cookie",
      "frontier_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
    );
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}