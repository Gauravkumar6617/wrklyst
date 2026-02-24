import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { status: "error", message: "No file received" },
        { status: 400 },
      );
    }

    // SIMULATION: In a real app, you'd save this 'file' to S3, Uploadthing, or local temp storage
    // For now, we generate a valid ID that your /download/[id] page expects
    const fileId = uuidv4();

    return NextResponse.json({
      status: "success",
      fileId: fileId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { status: "error", message: "Upload failed" },
      { status: 500 },
    );
  }
}
