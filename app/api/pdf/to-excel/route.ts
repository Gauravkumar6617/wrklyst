import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  const fileId = `wrklyst_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `${fileId}.xlsx`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParser = new PDFParser();

    const rows: any[][] = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) =>
        reject(errData.parserError),
      );

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        const result: Record<number, any[]> = {};

        pdfData.Pages.forEach((page: any) => {
          page.Texts.forEach((text: any) => {
            // Group by Y-coordinate (vertical line)
            const y = Math.round(text.y * 100);
            let content = decodeURIComponent(text.R[0].T).trim();

            // Normalize "ﬁ" ligature to "fi"
            content = content.replace(/ﬁ/g, "fi");

            if (!result[y]) result[y] = [];
            result[y].push(content);
          });
        });

        // Reconstruct and Filter Rows
        const sortedRows = Object.keys(result)
          .map(Number)
          .sort((a, b) => a - b)
          .map((key) => result[key])
          .filter((row) => {
            // JOIN the row to see the full sentence (handles split characters like f,i,l,e)
            const fullRowText = row.join("").toLowerCase();

            // --- BULLETPROOF JUNK DETECTION ---
            const isJunkRow =
              fullRowText.includes("file://") ||
              fullRowText.includes("home/") ||
              fullRowText.includes("tmp/") ||
              fullRowText.includes(".html") ||
              /^\d{1,2}\/\d{1,2}\/\d{4}/.test(fullRowText) || // Date: 18/01/2026
              /^\d{1,2}:\d{2}/.test(fullRowText) || // Time: 22:12
              /page\s\d+/.test(fullRowText) || // Page 1
              (row.length === 1 && fullRowText.length === 1); // Stray icons

            // If it's junk, return false to remove the WHOLE row
            return !isJunkRow && row.length > 0;
          });

        resolve(sortedRows);
      });

      pdfParser.parseBuffer(buffer);
    });

    // Generate Workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Auto-width for table readability
    worksheet["!cols"] = [{ wch: 20 }, { wch: 35 }, { wch: 20 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Cleaned Data");

    // Safe Buffer Write
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    await fs.writeFile(outputPath, excelBuffer);

    return NextResponse.json({
      success: true,
      fileId: fileId,
      fileName: file.name.replace(/\.[^/.]+$/, "") + ".xlsx",
    });
  } catch (error: any) {
    console.error("EXCEL_BULLETPROOF_ERROR:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
