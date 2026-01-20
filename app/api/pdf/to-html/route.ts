import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  const fileId = `wrklyst_${uuidv4()}`;
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `${fileId}.html`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParser = new PDFParser();

    const htmlBody: string = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) =>
        reject(errData.parserError),
      );
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        // 1. Define the Styles for Borders
        let htmlContent = `
    <style>
      .pdf-container { padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
      .pdf-page { background: white; margin-bottom: 30px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px; }
      td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      .header-text { font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1a1a1a; }
    </style>
    <div class="pdf-container">`;

        pdfData.Pages.forEach((page: any, index: number) => {
          htmlContent += `<div class="pdf-page">`;

          const result: Record<number, string[]> = {};
          page.Texts.forEach((text: any) => {
            const y = Math.round(text.y * 100);
            let content = decodeURIComponent(text.R[0].T).trim();
            content = content.replace(/ﬁ/g, "fi");

            if (!result[y]) result[y] = [];
            result[y].push(content);
          });

          htmlContent += `<table>`; // Start a table for the page content

          Object.keys(result)
            .map(Number)
            .sort((a, b) => a - b)
            .forEach((key) => {
              const rowArray = result[key];
              const originalRowText = rowArray.join(" ");
              const compressedText = originalRowText
                .replace(/\s+/g, "")
                .toLowerCase();

              // Bulletproof Junk Filter
              const isJunk =
                compressedText.includes("file://") ||
                compressedText.includes("home/") ||
                compressedText.includes("tmp/") ||
                compressedText.includes(".html") ||
                /^\d{1,2}\/\d{1,2}\/\d{4}/.test(compressedText) ||
                /^\d{1,2}:\d{2}/.test(compressedText);

              if (!isJunk) {
                htmlContent += `<tr>`;
                // If the row has multiple elements, treat them as separate columns
                rowArray.forEach((cellText) => {
                  htmlContent += `<td>${cellText}</td>`;
                });
                htmlContent += `</tr>`;
              }
            });

          htmlContent += `</table></div>`;
        });

        htmlContent += `</div>`;
        resolve(htmlContent);
      });

      pdfParser.parseBuffer(buffer);
    });

    // Wrap in a full HTML Boilerplate
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${file.name.replace(/\.[^/.]+$/, "")}</title>
          <style>body { background: #f4f7f6; display: flex; justify-content: center; } .pdf-container { background: white; max-width: 800px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.08); min-height: 100vh; }</style>
      </head>
      <body>${htmlBody}</body>
      </html>
    `;

    await fs.writeFile(outputPath, fullHtml);

    return NextResponse.json({
      success: true,
      fileId: fileId,
      fileName: file.name.replace(/\.[^/.]+$/, "") + ".html",
    });
  } catch (error: any) {
    console.error("HTML_CONVERSION_ERROR:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
