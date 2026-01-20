import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

// GET handles Download Testing
export async function GET() {
  const size = 15 * 1024 * 1024; // Increased to 15MB for better accuracy on fast lines
  const buffer = randomBytes(size);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Content-Length": size.toString(),
    },
  });
}

// POST handles Upload Testing
export async function POST(req: NextRequest) {
  try {
    const start = performance.now();
    const blob = await req.blob(); // Consume the data sent by the browser
    const end = performance.now();

    return NextResponse.json({
      status: "success",
      received_bytes: blob.size,
      duration_ms: end - start,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
