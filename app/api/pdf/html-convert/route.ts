import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// IMPORTANT: This is a temporary way to store files in memory (for development)
// In production, use Vercel Blob or S3.
const fileStore = new Map<string, { buffer: Buffer; name: string }>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { status: "error", message: "No file" },
        { status: 400 },
      );
    }

    const fileId = uuidv4();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // YOU MUST STORE THE FILE HERE
    // You'll need to update your retrieve route to look in this Map
    // fileStore.set(fileId, { buffer, name: file.name });

    return NextResponse.json({
      status: "success",
      fileId: fileId,
      message: "File stored successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
