import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  // 50MB is the industry standard for a more accurate "sustained" test
  const size = 50 * 1024 * 1024;
  const data = new Uint8Array(size);

  // Fill just a tiny bit of random data to avoid browser caching
  const entropy = new Uint8Array(65536);
  crypto.getRandomValues(entropy);
  data.set(entropy, 0);

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": size.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
// POST handles Upload Testing
export async function POST(req: NextRequest) {
  try {
    // Efficiently consume the stream
    const reader = req.body?.getReader();
    if (reader) {
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// HEAD handles Ping Testing (saves bandwidth)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
