import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const fileId = `wk_lock_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `${fileId}_in.pdf`);
  const outputPath = path.join(tempDir, `${fileId}.pdf`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    if (!file || !password) {
      return NextResponse.json(
        { error: "File and password are required" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    // QPDF Encryption Command
    // --encrypt [user-password] [owner-password] [key-length]
    // 256-bit AES is the industry standard
    const qpdfCmd = `qpdf --encrypt ${password} ${password} 256 -- "${inputPath}" "${outputPath}"`;

    await execPromise(qpdfCmd);

    return NextResponse.json({
      status: "success",
      fileId: fileId,
      data: {
        download_url: `/api/files/retrieve/${fileId}`,
      },
    });
  } catch (error: any) {
    console.error("PROTECT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to protect PDF" },
      { status: 500 },
    );
  } finally {
    await fs.unlink(inputPath).catch(() => {});
  }
}
