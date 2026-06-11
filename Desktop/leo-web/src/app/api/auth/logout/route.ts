import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await destroySession(request.headers);

    // Clear the cookie
    const cookieStore = await cookies();
    cookieStore.delete("frontier_session");

    return NextResponse.json(
      { success: true, redirect: "/login" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}