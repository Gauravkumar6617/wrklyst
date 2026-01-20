import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import fsSync from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const tempDir = os.tmpdir();
  const fileId = `wrklyst_${uuidv4()}`;
  const inputPath = path.join(tempDir, `${fileId}.pdf`);
  const outputPath = path.join(tempDir, `${fileId}.pptx`);

  console.log(`\n--- 🚀 STARTING PPTX CONVERSION [${fileId}] ---`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("❌ Error: No file found in request body.");
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    console.log(`📂 Received file: ${file.name} (${file.size} bytes)`);

    // 1. Save Input File
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);
    console.log(`📥 Input PDF saved to: ${inputPath}`);

    // 2. Prepare LibreOffice Command
    // Filter: impress_pdf_import is the specific LibreOffice filter for presentations
    const command = `export HOME=/tmp && soffice --headless --nodefault --nofirststartwizard --infilter="impress_pdf_import" --convert-to pptx --outdir ${tempDir} ${inputPath}`;

    console.log(`⚙️ Executing: ${command}`);

    // 3. Run Conversion
    const startTime = Date.now();
    await execPromise(command);
    const duration = Date.now() - startTime;

    console.log(`⏱️ Engine finished in ${duration}ms`);

    // 4. Verify Output
    if (!fsSync.existsSync(outputPath)) {
      console.error(
        `❌ FAILURE: Expected output at ${outputPath} but it does not exist.`,
      );
      throw new Error("Conversion failed: Output file not created by engine.");
    }

    console.log(`✅ SUCCESS: Created ${outputPath}`);

    // 5. Cleanup Input
    await fs
      .unlink(inputPath)
      .catch((err) =>
        console.warn(`⚠️ Minor: Failed to delete input PDF: ${err.message}`),
      );
    console.log(`🧹 Cleaned up input PDF.`);

    // 6. Respond
    console.log(`--- ✨ CONVERSION COMPLETE [${fileId}] ---\n`);

    return NextResponse.json({
      success: true,
      fileId: fileId,
      fileName: file.name.replace(/\.[^/.]+$/, "") + ".pptx",
    });
  } catch (error: any) {
    console.error(`\n🔴 PPTX_API_CRASH [${fileId}]:`);
    console.error(error);

    // Attempt to clean up input on failure
    if (fsSync.existsSync(inputPath)) {
      await fs.unlink(inputPath).catch(() => {});
    }

    return NextResponse.json(
      {
        error: "Server Error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
