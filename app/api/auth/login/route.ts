import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Call your FastAPI endpoint
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Authentication failed' },
        { status: response.status }
      );
    }

    // Set the JWT into an HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Set maxAge to match your JWT expiry (e.g., 30 mins or 1 day)
      maxAge: 60 * 60 * 24, 
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}