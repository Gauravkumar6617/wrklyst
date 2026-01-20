import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const fileId = `wk_comp_${uuidv4()}`;
  const tempDir = os.tmpdir();

  const inputPath = path.join(tempDir, `${fileId}_in.pdf`);
  const outputPath = path.join(tempDir, `${fileId}.pdf`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const level = (formData.get("level") as string) || "medium";

    if (!file)
      return NextResponse.json(
        { status: "error", message: "No file found" },
        { status: 400 },
      );

    const originalSize = file.size;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    /**
     * PASS 1: AGGRESSIVE RE-ENCODING
     * We force DCT (JPEG) encoding and Bicubic downsampling.
     * We also strip "PieceInfo" and "Metadata" which often causes bloat.
     */
    const res = level === "extreme" ? "72" : "144";
    const quality = level === "extreme" ? "50" : "75";

    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen \
      -dNOPAUSE -dQUIET -dBATCH \
      -dDetectDuplicateImages=true \
      -dColorImageDownsampleType=/Bicubic -dColorImageResolution=${res} \
      -dGrayImageDownsampleType=/Bicubic -dGrayImageResolution=${res} \
      -dMonoImageDownsampleType=/Bicubic -dMonoImageResolution=${res} \
      -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true \
      -dAutoFilterColorImages=false -dColorImageFilter=/DCTEncode -dJPEGQ=${quality} \
      -dEmbedAllFonts=false -dSubsetFonts=true \
      -sOutputFile=${outputPath} ${inputPath}`;

    await execPromise(gsCommand);

    // --- SMART-SELECT LOGIC ---
    const stats = await fs.stat(outputPath);
    let finalSize = stats.size;

    // If the "compressed" version is larger than the original (e.g., 3MB vs 600KB),
    // we bypass the output and use the original file.
    if (finalSize >= originalSize) {
      console.log("⚠️ Original was more optimized. Reverting to original.");
      await fs.copyFile(inputPath, outputPath);
      finalSize = originalSize;
    }

    // Cleanup input file only
    await fs.unlink(inputPath).catch(() => {});

    return NextResponse.json({
      status: "success",
      fileId: fileId,
      data: {
        original_bytes: originalSize,
        compressed_bytes: finalSize,
        efficiency:
          finalSize >= originalSize
            ? "0%"
            : ((1 - finalSize / originalSize) * 100).toFixed(2) + "%",
        download_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/files/retrieve/${fileId}`,
        strategy:
          finalSize < originalSize
            ? "Ghostscript DCT-Optimized"
            : "Bypassed (Already Optimized)",
      },
    });
  } catch (error: any) {
    console.error("COMPRESSION_ERROR:", error);
    return NextResponse.json(
      { status: "error", message: "Engine Failure" },
      { status: 500 },
    );
  }
}
