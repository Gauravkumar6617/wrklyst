import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const fileId = `wk_pdfa_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `${fileId}_in.pdf`);
  const outputPath = path.join(tempDir, `${fileId}.pdf`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json(
        { status: "error", error: "No file" },
        { status: 400 },
      );

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    // --- CRITICAL CHECK: Does Ghostscript exist? ---
    // If you get an error here, it means Ubuntu doesn't have 'gs' installed
    const gsCommand = `gs -dPDFA=2 -dBATCH -dNOPAUSE -dNOOUTERSAVE -sColorConversionStrategy=UseDeviceDependentColor -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 -sOutputFile="${outputPath}" "${inputPath}"`;

    await execPromise(gsCommand);

    // Return a structured JSON
    return NextResponse.json({
      status: "success",
      fileId: fileId,
    });
  } catch (error: any) {
    console.error("PDFA_BACKEND_ERROR:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  } finally {
    // Cleanup input
    await fs.unlink(inputPath).catch(() => {});
  }
}
