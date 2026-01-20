import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // 1. AUTHENTICATION (The "Service" part of SaaS)
  const apiKey = req.headers.get("x-api-key");
  // if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fileId = `wrklyst_split_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `${fileId}.pdf`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const range = formData.get("range") as string;

    // 2. ENTERPRISE VALIDATION
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        {
          status: "error",
          message: "A valid PDF file is required.",
        },
        { status: 400 },
      );
    }

    if (!range || !/^[\d\s\-,]+$/.test(range)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid range format. Use '1-3, 5'.",
        },
        { status: 400 },
      );
    }

    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const totalPages = pdfDoc.getPageCount();

    // --- RANGE PARSER LOGIC ---
    const pagesToExtract: number[] = [];
    range.split(",").forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= totalPages) pagesToExtract.push(i - 1);
        }
      } else {
        const pageNum = parseInt(part.trim());
        if (pageNum > 0 && pageNum <= totalPages)
          pagesToExtract.push(pageNum - 1);
      }
    });

    if (pagesToExtract.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Pages out of bounds." },
        { status: 400 },
      );
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    await fs.writeFile(outputPath, pdfBytes);

    // 3. ENHANCED API RESPONSE
    return NextResponse.json({
      status: "success",
      message: "PDF split successfully",
      fileId: fileId, // Top level for your frontend download page
      data: {
        file_id: fileId,
        extracted_pages: pagesToExtract.length,
        original_pages: totalPages,
        output_size_bytes: pdfBytes.length,
        download_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/files/retrieve/${fileId}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Processing failed" },
      { status: 500 },
    );
  }
}
