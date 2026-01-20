import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import fsSync from "fs";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import path from "path";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const tempDir = os.tmpdir();
  const fileId = `wrklyst_${uuidv4()}`;
  const inputPath = path.join(tempDir, `${fileId}.pdf`);
  const outputPath = path.join(tempDir, `${fileId}.docx`);

  console.log("--- START CONVERSION ---");
  console.log(`[1] File ID generated: ${fileId}`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("DEBUG: No file found in FormData");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`[2] Uploaded Filename: ${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);
    console.log(`[3] Input saved to: ${inputPath}`);

    // The HOME variable fix for Linux
    const command = `export HOME=/tmp && soffice --headless --nodefault --nofirststartwizard --infilter="writer_pdf_import" --convert-to docx --outdir ${tempDir} ${inputPath}`;

    console.log(`[4] Executing LibreOffice...`);
    await execPromise(command);

    if (fsSync.existsSync(outputPath)) {
      console.log(`[5] SUCCESS: Output created at ${outputPath}`);

      // Clean up input PDF
      await fs.unlink(inputPath).catch(() => {});

      return NextResponse.json({
        success: true,
        fileId: fileId,
        fileName: file.name.replace(/\.[^/.]+$/, "") + ".docx",
      });
    } else {
      console.error(`[5] ERROR: Output file not found after conversion.`);
      throw new Error("LibreOffice output missing");
    }
  } catch (error: any) {
    console.error("--- CONVERSION FAILED ---");
    console.error("Error Detail:", error.message);
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 },
    );
  }
}
