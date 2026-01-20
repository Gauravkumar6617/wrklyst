import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const fileId = `wk_unlock_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `${fileId}_in.pdf`);
  const outputPath = path.join(tempDir, `${fileId}.pdf`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    if (!file || !password) {
      return NextResponse.json(
        { status: "error", message: "File and password are required" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    /**
     * QPDF UNLOCK COMMAND
     * --password=[pass]: The user provided password
     * --decrypt: Removes all encryption and restrictions
     */
    const qpdfCmd = `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`;

    try {
      await execPromise(qpdfCmd);
    } catch (qpdfError: any) {
      // QPDF returns exit code 2 if the password is wrong
      console.error("QPDF_DECRYPT_FAIL:", qpdfError.stderr);
      return NextResponse.json(
        {
          status: "error",
          message: "Incorrect password or file is not encrypted.",
        },
        { status: 401 },
      );
    }

    const stats = await fs.stat(outputPath);

    return NextResponse.json({
      status: "success",
      fileId: fileId,
      data: {
        file_size: stats.size,
        download_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/files/retrieve/${fileId}`,
      },
    });
  } catch (error: any) {
    console.error("UNLOCK_API_ERROR:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error during decryption" },
      { status: 500 },
    );
  } finally {
    // Cleanup the original locked file
    await fs.unlink(inputPath).catch(() => {});
  }
}
