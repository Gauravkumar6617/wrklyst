"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Table as TableIcon,
  Shield,
  Layers,
  FileCheck,
} from "lucide-react";
import { formatFileSize, uint8ArrayToBlob } from "@/app/lib/pdf-utils";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { useHistory } from "@/app/context/HistoryContext";
import { EducationalContent } from "@/app/components/layout/EducationalContent";

export function ExcelToPDFClient() {
  const { addToHistory } = useHistory();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const isValidFile = (f: File) =>
    f.name.endsWith(".xlsx") ||
    f.name.endsWith(".xls") ||
    f.name.endsWith(".csv");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) setFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMessage("");
    setProgress(10);

    try {
      const XLSX = await import("xlsx");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      setProgress(40);

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 10;
      const margin = 50;

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as string[][];

        if (data.length === 0) continue;

        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        let y = height - margin;

        page.drawText(`Sheet: ${sheetName}`, {
          x: margin,
          y,
          size: 14,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        y -= 30;

        const colCount = Math.max(...data.map((row) => row.length));
        const colWidths: number[] = new Array(colCount).fill(50);

        data.slice(0, 10).forEach((row) => {
          row.forEach((cell, idx) => {
            const len = String(cell || "").length * 6;
            if (len > colWidths[idx]) colWidths[idx] = Math.min(len, 200);
          });
        });

        const totalWidthNeeded = colWidths.reduce((a, b) => a + b, 0);
        const availableWidth = width - margin * 2;
        if (totalWidthNeeded > availableWidth) {
          const scale = availableWidth / totalWidthNeeded;
          for (let i = 0; i < colWidths.length; i++) colWidths[i] *= scale;
        }

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          if (y < margin + 20) {
            page = pdfDoc.addPage();
            y = height - margin;
          }

          let currentX = margin;
          for (let j = 0; j < row.length; j++) {
            const cellValue = String(row[j] || "").trim();
            if (cellValue) {
              const textToDraw =
                cellValue.length * 6 > colWidths[j]
                  ? cellValue.substring(0, Math.floor(colWidths[j] / 6)) + ".."
                  : cellValue;
              page.drawText(textToDraw, {
                x: currentX,
                y,
                size: fontSize,
                font: i === 0 ? boldFont : font,
                color: rgb(0, 0, 0),
              });
            }
            currentX += colWidths[j] + 5;
            if (currentX > width - margin) break;
          }
          y -= 15;
        }
      }

      setProgress(90);
      const pdfBytes = await pdfDoc.save();
      const blob = uint8ArrayToBlob(pdfBytes);
      const blobUrl = URL.createObjectURL(blob);

      const outputName =
        file.name.replace(/\.(xlsx|xls|csv)$/i, ".pdf") || "document.pdf";

      const payload = {
        url: blobUrl,
        name: outputName,
        mime: "application/pdf",
      };

      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory("Excel to PDF", file.name, "Converted to PDF");

      setProgress(100);
      setStatus("success");

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=Excel+to+PDF&name=${encodeURIComponent(outputName)}&local=true`,
        );
      }, 1200);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to convert Excel to PDF",
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
    setProgress(0);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden pt-24 pb-16">
      <AnimatedBackground />
      <FloatingDecorations />

      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* ── IDLE ── */}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl"
            >
              <ToolHeader
                title="Excel to PDF"
                description="Convert spreadsheets to PDF entirely in your browser — no uploads, no accounts."
                icon={TableIcon}
              />

              <ToolCard className="p-8">
                {/* Drop zone */}
                <div
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200
                    ${
                      dragActive
                        ? "border-black bg-gray-50 scale-[1.01]"
                        : file
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400 hover:bg-gray-50/60"
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {file ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
                        <TableIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.size)} · Ready to convert
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Click to choose a different file
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition-colors group-hover:bg-gray-200">
                        <TableIcon className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="mb-1 text-lg font-semibold text-gray-800">
                        Drop your spreadsheet here
                      </p>
                      <p className="text-sm text-gray-400">
                        Supports .xlsx, .xls, and .csv files
                      </p>
                    </>
                  )}
                </div>

                {/* Convert button */}
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="mt-6 flex justify-center"
                    >
                      <button
                        onClick={handleConvert}
                        className="btn-primary group flex items-center gap-3 px-14 py-4 text-lg font-semibold shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.99]"
                      >
                        Convert to PDF
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ToolCard>

              {/* Feature pills */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    label: "Offline First",
                    desc: "No data leaves your device",
                  },
                  {
                    icon: Layers,
                    label: "Multi-Sheet",
                    desc: "All sheets included in the PDF",
                  },
                  {
                    icon: FileCheck,
                    label: "All Formats",
                    desc: "XLS, XLSX, and CSV supported",
                  },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-2xl border border-white/30 bg-white/60 px-5 py-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PROCESSING ── */}
          {status === "processing" && (
            <ProcessingState
              title="Converting to PDF..."
              description="Processing your spreadsheet data..."
              progress={progress}
            />
          )}

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <h2 className="mb-2 text-3xl font-bold">Conversion Complete!</h2>
              <p className="text-lg text-gray-500">
                Redirecting you to the download page…
              </p>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg shadow-red-100">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h2 className="mb-2 text-3xl font-bold">Something went wrong</h2>
              <p className="mb-10 text-lg text-gray-500">{errorMessage}</p>
              <button
                onClick={reset}
                className="btn-primary flex items-center gap-2 px-10 py-4 text-lg"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <EducationalContent
          howItWorks={{
            title: "How to Convert Excel to PDF",
            steps: [
              "Upload your Excel (.xlsx, .xls) or CSV file — nothing leaves your device.",
              "The tool processes all sheets and renders them as clean PDF tables.",
              "Download your formatted PDF instantly from the next page.",
            ],
          }}
          benefits={{
            title: "Professional Reports Made Simple",
            items: [
              {
                title: "No Uploads",
                desc: "Your data stays private. Conversion happens entirely in your browser.",
              },
              {
                title: "Format Preserved",
                desc: "Tabular structure and sheet names are maintained in the output PDF.",
              },
              {
                title: "Completely Free",
                desc: "No watermarks, no registrations, no limits on file size or usage.",
              },
              {
                title: "Shareable Results",
                desc: "PDFs look identical on every device — perfect for sending reports.",
              },
            ],
          }}
          faqs={[
            {
              question: "Does it support multiple sheets?",
              answer:
                "Yes, all sheets in your workbook are processed and included in the final PDF.",
            },
            {
              question: "Is my financial data safe?",
              answer:
                "Absolutely. The file is processed locally on your computer so no one else can see your data.",
            },
            {
              question: "Can I convert CSV files?",
              answer:
                "Yes — .csv, .xls, and .xlsx are all supported for automatic conversion to PDF.",
            },
          ]}
        />
      </div>
    </div>
  );
}
