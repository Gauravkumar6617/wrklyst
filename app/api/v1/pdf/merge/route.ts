import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // Authentication check (Integrate your DB/Stripe here later)
  const apiKey = req.headers.get("x-api-key");

  const fileId = `wrklyst_merge_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `${fileId}.pdf`);

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        {
          status: "error",
          message: "Merge requires at least two PDF files.",
        },
        { status: 400 },
      );
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (file.type !== "application/pdf") continue;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, pdfBytes);

    // STRUCTURED RESPONSE FOR API-AS-A-SERVICE
    return NextResponse.json({
      status: "success",
      message: "PDFs merged successfully",
      fileId: fileId, // Kept at top level for easy frontend access
      data: {
        file_id: fileId,
        file_name: "merged_document.pdf",
        page_count: mergedPdf.getPageCount(),
        download_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/files/retrieve/${fileId}`,
      },
    });
  } catch (error: any) {
    console.error("API_V1_MERGE_ERROR:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
