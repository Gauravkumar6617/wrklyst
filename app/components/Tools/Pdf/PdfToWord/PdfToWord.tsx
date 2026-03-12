"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileText,
  ArrowRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { formatFileSize } from "@/app/lib/pdf-utils";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { EducationalContent } from "@/app/components/layout/EducationalContent";
import { useHistory } from "@/app/context/HistoryContext";

export function PdfToWord() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMessage("");
    setProgress(0);

    try {
      console.log("Loading pdfjs-dist...");
      const pdfjsLib = await import("pdfjs-dist");
      const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

      const docx = await import("docx");

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: true,
        isEvalSupported: false,
      });

      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      const paragraphs: unknown[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 100));

        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();

        // Group by Y position to form lines
        const items = textContent.items as {
          transform: number[];
          str: string;
        }[];
        const lines: { [y: number]: string[] } = {};

        items.forEach((item) => {
          const y = Math.round(item.transform[5]);
          if (!lines[y]) lines[y] = [];
          lines[y].push(item.str);
        });

        // Sort by Y position (top to bottom)
        const sortedYs = Object.keys(lines)
          .map(Number)
          .sort((a, b) => b - a);

        // Add page header
        if (i > 1) {
          paragraphs.push(
            new docx.Paragraph({
              children: [],
              spacing: { before: 400 },
            }),
          );
        }

        // Add text lines
        for (const y of sortedYs) {
          const lineText = lines[y].join(" ").trim();
          if (lineText) {
            paragraphs.push(
              new docx.Paragraph({
                children: [new docx.TextRun({ text: lineText })],
                spacing: { after: 100 },
              }),
            );
          }
        }

        (page as { cleanup?: () => void }).cleanup?.();
      }

      // Create Word document
      const doc = new docx.Document({
        sections: [
          {
            properties: {},
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            children: paragraphs as any,
          },
        ],
      });

      const buffer = await docx.Packer.toBlob(doc);
      setResultBlob(buffer);
      setStatus("success");

      if (file) {
        addToHistory("PDF to Word", file.name, "Converted to Word");
      }

      // automatically send to download page for consistent flow
      try {
        const blobUrl = URL.createObjectURL(buffer);
        const payload = {
          url: blobUrl,
          name: `wrklyst-${file?.name.replace(/\.pdf$/i, ".docx") || "document.docx"}`,
          mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
        sessionStorage.removeItem("wrklyst_pending_file");
        sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

        const fileId = `local-${Date.now()}`;
        setTimeout(() => {
          router.push(
            `/download/${fileId}?tool=PDF to Word&name=${encodeURIComponent(
              payload.name,
            )}&local=true`,
          );
        }, 1500);
      } catch (e) {
        console.error("redirect to download failed", e);
      }

      await pdfDoc.destroy();
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err);
      setErrorMessage(err.message || "Failed to convert PDF to Word");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;

    const blobUrl = URL.createObjectURL(resultBlob);
    const payload = {
      url: blobUrl,
      name: `wrklyst-${file?.name.replace(/\.pdf$/i, ".docx") || "document.docx"}`,
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    sessionStorage.removeItem("wrklyst_pending_file");
    sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

    addToHistory("PDF to Word", file?.name || "Unknown", "Converted to Word");

    // Redirect to download page for ads and better UX
    const fileId = `local-${Date.now()}`;
    setTimeout(() => {
      router.push(
        `/download/${fileId}?tool=PDF to Word&name=${encodeURIComponent(
          payload.name,
        )}&local=true`,
      );
    }, 1000);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setResultBlob(null);
    setErrorMessage("");
    setProgress(0);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden pt-24 pb-16">
      <AnimatedBackground />
      <FloatingDecorations />

      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-6xl"
            >
              <ToolHeader
                title="PDF to Word Converter"
                description="Transform your PDF documents into fully editable Word files. Perfect for making changes, extracting content, or repurposing documents."
                icon={FileText}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <ToolCard className="p-8 lg:p-12">
                  <div
                    className={`drop-zone relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50 scale-105"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    } cursor-pointer group`}
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
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Upload Your PDF
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Drag & drop your PDF file here, or click to browse
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>100% Private & Secure</span>
                      </div>
                    </div>
                  </div>
                </ToolCard>

                <div className="space-y-6">
                  <ToolCard className="p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Why Choose Our Converter?
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Editable Word Files</div>
                          <div className="text-sm text-gray-600">
                            Get fully editable .docx files you can modify in
                            Word
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Preserve Structure</div>
                          <div className="text-sm text-gray-600">
                            Maintains paragraphs, spacing, and text flow
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Browser-Based</div>
                          <div className="text-sm text-gray-600">
                            No uploads required - everything stays private
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium">Universal Format</div>
                          <div className="text-sm text-gray-600">
                            Works with Word, Google Docs, and LibreOffice
                          </div>
                        </div>
                      </div>
                    </div>
                  </ToolCard>

                  <ToolCard className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Privacy & Security
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Files never leave your device</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>No account registration required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Completely free, no watermarks</span>
                      </div>
                    </div>
                  </ToolCard>
                </div>
              </div>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <ToolCard className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{file.name}</h4>
                          <p className="text-gray-600">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleConvert}
                        className="btn-primary group flex items-center gap-3 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                      >
                        Convert to Word
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </ToolCard>
                </motion.div>
              )}
            </motion.div>
          )}

          {status === "processing" && (
            <ProcessingState
              message="Converting to Word..."
              description="Extracting text and formatting from your PDF..."
              progress={progress}
            />
          )}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h2 className="mb-2 text-3xl font-bold">
                PDF Converted Successfully!
              </h2>
              <p className="mb-6 text-gray-600">
                Your document has been converted to Word format.
              </p>
              <div className="mb-8 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Text extracted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Word document created</span>
                </div>
              </div>
              <p className="text-gray-500">Redirecting to download studio...</p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="h-10 w-10" />
              </div>
              <h2 className="mb-2 text-3xl font-bold">Conversion Failed</h2>
              <p className="mb-6 text-gray-600 leading-relaxed px-4">
                {errorMessage ||
                  "An unexpected error occurred while converting your PDF."}
              </p>
              <div className="mb-8 text-sm text-gray-500 space-y-1">
                <p>• Make sure your PDF file is valid and not corrupted</p>
                <p>• Check that your browser has JavaScript enabled</p>
                <p>• Try with a different PDF file</p>
              </div>
              <button
                onClick={reset}
                className="btn-primary group flex items-center justify-center gap-3 rounded-2xl px-12 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <RefreshCw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <EducationalContent
          howItWorks={{
            title: "How to Convert PDF to Word",
            steps: [
              "Upload your PDF document to our secure conversion tool.",
              "Our intelligent engine extracts text, paragraphs, and formatting structure.",
              "Download your fully editable Word document (.docx) instantly.",
            ],
          }}
          benefits={{
            title: "Editable Documents Made Easy",
            items: [
              {
                title: "Preserve Formatting",
                desc: "We maintain your original layout, paragraphs, and text flow as much as possible.",
              },
              {
                title: "100% Private",
                desc: "Conversion happens right in your browser. Your confidential documents never leave your device.",
              },
              {
                title: "Universal Compatibility",
                desc: "The generated .docx files work perfectly with Microsoft Word, Google Docs, and LibreOffice.",
              },
              {
                title: "Fast & Free",
                desc: "Convert unlimited documents instantly without any watermarks or hidden fees.",
              },
            ],
          }}
          faqs={[
            {
              question: "Will my document look exactly the same?",
              answer:
                "We strive for high accuracy. While complex layouts might need minor adjustments, we preserve paragraphs, lists, and basic formatting excellently.",
            },
            {
              question: "Is it safe to convert sensitive files?",
              answer:
                "Absolutely. SimplyPDF runs entirely in your browser, so your files are never uploaded to any server. Your privacy is guaranteed.",
            },
            {
              question: "Can I convert scanned PDFs?",
              answer:
                "For scanned documents (images), use our 'OCR PDF' tool instead. This tool is best for PDFs that already contain selectable text.",
            },
          ]}
        />
      </div>
    </div>
  );
}
