"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileText,
  ArrowRight,
  Shield,
  Search,
  Layers,
} from "lucide-react";
import { formatFileSize } from "@/app/lib/pdf-utils";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { useHistory } from "@/app/context/HistoryContext";
import { EducationalContent } from "@/app/components/layout/EducationalContent";

export function PDFToTextClient() {
  const { addToHistory } = useHistory();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [textContent, setTextContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") setFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleExtract = async () => {
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
      const pdf = await loadingTask.promise;

      let fullText = "";
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 100));
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => (item as { str: string }).str)
          .join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setTextContent(fullText);
      setStatus("success");
      addToHistory("PDF to Text", file.name, "Extracted text");
      await pdf.destroy();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to extract text from PDF",
      );
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!textContent) return;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      file?.name.replace(/\.pdf$/i, ".txt") || "extracted_text.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setTextContent("");
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
                title="PDF to Text"
                description="Extract plain text from any PDF instantly — entirely in your browser."
                icon={FileText}
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
                    accept=".pdf"
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
                        <FileText className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.size)} · Ready to extract
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Click to choose a different file
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition-colors group-hover:bg-gray-200">
                        <FileText className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="mb-1 text-lg font-semibold text-gray-800">
                        Drop your PDF here
                      </p>
                      <p className="text-sm text-gray-400">
                        or click to browse your files
                      </p>
                    </>
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
                        onClick={handleExtract}
                        className="btn-primary group flex items-center gap-3 px-14 py-4 text-lg font-semibold shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.99]"
                      >
                        Extract Text
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
                    label: "100% Private",
                    desc: "No files leave your browser",
                  },
                  {
                    icon: Search,
                    label: "Searchable",
                    desc: "Clean text ready for search",
                  },
                  {
                    icon: Layers,
                    label: "All Pages",
                    desc: "Extracts every page at once",
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
              title="Extracting Text..."
              description="Analysing PDF content across all pages..."
              progress={progress}
            />
          )}

          {/* ── SUCCESS ── */}
          {/* Text output stays inline — no redirect needed for .txt files */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-4xl flex-col items-center py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h2 className="mb-1 text-3xl font-bold">Extraction Complete!</h2>
              <p className="mb-8 text-gray-500">
                Successfully extracted text from all pages.
              </p>

              {/* Text preview */}
              <div
                className="mb-8 w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm"
                style={{ maxHeight: "16rem" }}
              >
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-600">
                  {textContent.substring(0, 2000)}
                  {textContent.length > 2000 &&
                    "\n\n… (preview truncated — full content in the downloaded file)"}
                </pre>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center gap-2 px-10 py-4 text-lg"
                >
                  <Download className="h-5 w-5" />
                  Download .TXT
                </button>
                <button
                  onClick={reset}
                  className="btn-outline flex items-center gap-2 px-10 py-4 text-lg"
                >
                  <RefreshCw className="h-5 w-5" />
                  Extract Another
                </button>
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
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg shadow-red-100">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h2 className="mb-2 text-3xl font-bold">Extraction Failed</h2>
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
            title: "How to Extract Text from PDF",
            steps: [
              "Upload your PDF — nothing leaves your device.",
              "The tool scans every page and extracts all selectable text.",
              "Preview the result and download it as a clean .txt file.",
            ],
          }}
          benefits={{
            title: "Unlock PDF Content",
            items: [
              {
                title: "No Server Needed",
                desc: "Extraction happens entirely in your browser. Your data stays 100% private.",
              },
              {
                title: "Preserve Order",
                desc: "Text is extracted page-by-page, maintaining the logical reading flow.",
              },
              {
                title: "Lightweight Results",
                desc: "Plain text files are tiny — perfect for storage or sending by email.",
              },
              {
                title: "Developer Friendly",
                desc: "Easily get text content for use in other apps, scripts, or AI prompts.",
              },
            ],
          }}
          faqs={[
            {
              question: "Can it extract text from images in the PDF?",
              answer:
                "This tool works on PDFs with selectable text. For scanned images use our OCR PDF tool.",
            },
            {
              question: "Will the formatting be saved?",
              answer:
                "This tool extracts plain text focused on content rather than fonts or layout. For layout preservation, consider PDF to Word.",
            },
            {
              question: "Is there a page limit?",
              answer:
                "No — you can extract text from documents with hundreds of pages without any issues.",
            },
          ]}
        />
      </div>
    </div>
  );
}
