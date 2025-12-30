import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setAuthCookie } from "@/app/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Authentication failed" },
        { status: response.status }
      );
    }

    // ✅ FIX IS HERE
    await setAuthCookie(data.access_token);
    return NextResponse.json({ user: data.user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
