"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ScanLine,
  FileText,
  Copy,
  Brain,
  Zap,
  Download,
} from "lucide-react";
import { formatFileSize } from "@/app/lib/pdf-utils";
import { redirectToDownload } from "@/app/lib/redirectToDownload";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { EducationalContent } from "@/app/components/layout/EducationalContent";
import { useHistory } from "@/app/context/HistoryContext";

interface TextContent {
  items: Array<{ str?: string; [key: string]: unknown }>;
}

export function OCRPDFClient() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [extractedText, setExtractedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [customFileName, setCustomFileName] = useState("extracted-text.txt");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setCustomFileName(
        `wrklyst-${droppedFile.name.replace(".pdf", "-text.txt")}`,
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCustomFileName(
        `wrklyst-${selectedFile.name.replace(".pdf", "-text.txt")}`,
      );
    }
  };

  const handleOCR = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMessage("");
    setProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      });

      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Create a single Tesseract worker for the entire document
      // FIX: use createWorker API (Tesseract.js v2/v4) — avoids the
      // TesseractJob / Promise incompatibility and the unsafe cast entirely.
      const { createWorker } = await import("tesseract.js");
      const ocrWorker = await createWorker("eng");

      let fullText = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);

        // First try native text extraction (fast path)
        const textContent = (await page.getTextContent()) as TextContent;
        const pageText = textContent.items
          .map((item) => item.str || "")
          .join(" ");

        if (pageText.trim().length > 50) {
          // Page has selectable text — no OCR needed
          fullText += `\n--- Page ${i} ---\n${pageText}\n`;
          setProgress(Math.round((i / numPages) * 100));
        } else {
          // Scanned / image page — run Tesseract OCR
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Failed to get canvas context");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, canvas, viewport })
            .promise;

          const imageData = canvas.toDataURL("image/png");

          // FIX: use worker.recognize() — fully typed, no cast needed
          const {
            data: { text },
          } = await ocrWorker.recognize(imageData);

          fullText += `\n--- Page ${i} (OCR) ---\n${text}\n`;

          // Update progress based on page completion
          setProgress(Math.round((i / numPages) * 100));

          (page as { cleanup?: () => void }).cleanup?.();
        }
      }

      // Clean up Tesseract worker
      await ocrWorker.terminate();
      await pdfDoc.destroy();

      setExtractedText(fullText.trim());
      setStatus("success");
      addToHistory("OCR PDF", file.name, "Text extracted from PDF");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to process PDF with OCR",
      );
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = async () => {
    const outputName = customFileName || "wrklyst-extracted-text.txt";
    const blob = new Blob([extractedText], { type: "text/plain" });

    // Create blob URL and download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setExtractedText("");
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
              className="mx-auto max-w-6xl"
            >
              <ToolHeader
                title="OCR Text Extractor"
                description="AI-powered text extraction from scanned PDFs. Convert images and scans into searchable, editable text instantly."
                icon={ScanLine}
              />

              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <ToolCard className="p-8 lg:p-12">
                  <div
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                      dragActive
                        ? "scale-[1.01] border-black bg-gray-50"
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
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {file ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 px-6 text-center"
                      >
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
                          <FileText className="h-8 w-8" />
                        </div>
                        <p className="font-bold text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.size)} · Ready to extract
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Click to choose a different file
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg transition-transform group-hover:scale-110">
                          <ScanLine className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">
                          Upload Your PDF
                        </h3>
                        <p className="mb-4 leading-relaxed text-gray-600">
                          Drag & drop your PDF or scanned document here
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Scans, Images & PDFs supported</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Extract button */}
                  <AnimatePresence>
                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mt-6 flex justify-center"
                      >
                        <button
                          onClick={handleOCR}
                          className="btn-primary group flex items-center gap-3 px-14 py-4 text-lg font-semibold shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.99]"
                        >
                          <Brain className="h-5 w-5 transition-transform group-hover:scale-110" />
                          Extract Text with AI
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ToolCard>

                <div className="space-y-6">
                  <ToolCard className="p-6">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI-Powered OCR
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          color: "bg-purple-500",
                          title: "Accurate Recognition",
                          desc: "Tesseract.js engine for 99% accuracy",
                        },
                        {
                          color: "bg-blue-500",
                          title: "All Document Types",
                          desc: "Scans, photos, and digital PDFs",
                        },
                        {
                          color: "bg-indigo-500",
                          title: "Multi-page Support",
                          desc: "Process documents of any length",
                        },
                        {
                          color: "bg-violet-500",
                          title: "Instant Export",
                          desc: "Copy or download editable text files",
                        },
                      ].map(({ color, title, desc }) => (
                        <div key={title} className="flex items-start gap-3">
                          <div
                            className={`mt-2 h-2 w-2 shrink-0 rounded-full ${color}`}
                          />
                          <div>
                            <div className="font-medium">{title}</div>
                            <div className="text-sm text-gray-600">{desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ToolCard>

                  <ToolCard className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Why Choose Our OCR?
                    </h4>
                    <div className="space-y-2 text-sm">
                      {[
                        "Completely free, no limits",
                        "100% private browser processing",
                        "No file storage or tracking",
                        "Works offline after loading",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </ToolCard>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PROCESSING ── */}
          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProcessingState
                title="Analysing content..."
                description="Running AI recognition on your document pages..."
                progress={progress}
              />
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-5xl py-12"
            >
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[40px] bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30"
                >
                  <CheckCircle2 className="h-12 w-12" />
                </motion.div>
                <h2 className="mb-2 text-5xl font-black tracking-tight text-gray-900">
                  Text Extracted!
                </h2>
                <p className="text-lg font-medium text-gray-500">
                  All pages analysed — review and export below.
                </p>
              </div>

              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                {/* Text preview */}
                <div className="lg:col-span-2">
                  <ToolCard className="overflow-hidden border-none bg-white/40 p-10 shadow-2xl backdrop-blur-md">
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider">
                        <FileText className="h-6 w-6" />
                        Text Preview
                      </h3>
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                          copied
                            ? "bg-green-500 text-white"
                            : "border border-gray-100 bg-white shadow-sm hover:border-black"
                        }`}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied ? "Copied!" : "Copy Text"}
                      </button>
                    </div>

                    <div className="max-h-[600px] overflow-y-auto rounded-[32px] border border-white bg-white/60 p-8 shadow-inner">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800">
                        {extractedText ||
                          "No text could be extracted from this document."}
                      </pre>
                    </div>
                  </ToolCard>
                </div>

                {/* Export sidebar */}
                <div className="space-y-6">
                  <ToolCard className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-xl">
                    <h4 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-700">
                      <Download className="h-5 w-5 text-green-600" />
                      Export Your Text
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="px-1 text-xs font-bold uppercase text-gray-600">
                          Filename
                        </label>
                        <input
                          type="text"
                          value={customFileName}
                          onChange={(e) => setCustomFileName(e.target.value)}
                          className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-green-500"
                          placeholder="filename.txt"
                        />
                      </div>
                      <button
                        onClick={handleDownloadText}
                        className="btn-primary group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 font-bold hover:from-green-700 hover:to-emerald-700"
                      >
                        <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                        Download .TXT
                      </button>
                    </div>
                  </ToolCard>

                  <button
                    onClick={reset}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-gray-200 py-4 font-bold text-gray-400 transition-all hover:border-black hover:text-black"
                  >
                    <RefreshCw className="h-5 w-5" />
                    OCR Another
                  </button>
                </div>
              </div>
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
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[40px] bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl shadow-red-500/30">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900">
                OCR Processing Failed
              </h2>
              <p className="mb-8 px-4 text-lg font-medium leading-relaxed text-gray-600">
                {errorMessage ||
                  "An unexpected error occurred while processing your PDF."}
              </p>
              <div className="mb-12 space-y-1 text-sm text-gray-500">
                <p>• Make sure your PDF file is valid</p>
                <p>• Check that your browser has JavaScript enabled</p>
                <p>• Try with a different PDF file</p>
              </div>
              <button
                onClick={reset}
                className="btn-primary group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-16 py-5 text-lg font-bold hover:from-blue-700 hover:to-blue-800"
              >
                <RefreshCw className="h-6 w-6 transition-transform duration-500 group-hover:rotate-180" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto mt-24 px-4">
          <EducationalContent
            howItWorks={{
              title: "How OCR Works",
              steps: [
                "Upload your scanned PDF or image document.",
                "Our AI engine analyses each page for text patterns and structure.",
                "Optical Character Recognition converts pixels into editable text.",
                "Preview the results and download your editable .txt file.",
              ],
            }}
            benefits={{
              title: "Hyper-Premium Extraction",
              items: [
                {
                  title: "Universal Detection",
                  desc: "Recognises text from scans, photos, and non-selectable PDFs effortlessly.",
                },
                {
                  title: "Browser Privacy",
                  desc: "All AI recognition happens in your browser. Your sensitive data never leaves your device.",
                },
                {
                  title: "High Accuracy",
                  desc: "Powered by Tesseract.js, the most accurate open-source OCR engine available today.",
                },
                {
                  title: "One-Click Export",
                  desc: "Instantly copy text or download a clean text file with one click.",
                },
              ],
            }}
            faqs={[
              {
                question: "What languages are supported?",
                answer:
                  "Our current implementation is optimised for English, but it can recognise most Latin-based characters with high accuracy.",
              },
              {
                question: "Does it handle handwriting?",
                answer:
                  "OCR works best with printed text. While it can detect some clear handwriting, specialised handwriting AI is usually required for messy scripts.",
              },
              {
                question: "Is there a page limit?",
                answer:
                  "There's no hard limit, but large documents (50+ pages) may take several minutes as all processing is done locally on your CPU.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
