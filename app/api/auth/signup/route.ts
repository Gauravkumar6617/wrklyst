import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
        console.log("FASTAPI ERROR DETAILS:", data.detail);
      return NextResponse.json({ error: data.detail }, { status: response.status });
    }
  
    return NextResponse.json(data, { status: 201 });
  }