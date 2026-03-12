"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileText,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { formatFileSize, uint8ArrayToBlob } from "@/app/lib/pdf-utils";
import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { useHistory } from "@/app/context/HistoryContext";
import { EducationalContent } from "@/app/components/layout/EducationalContent";

export function TextToPDFClient() {
  const { addToHistory } = useHistory();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".txt")) {
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

    try {
      const textContent = await file.text();

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;
      const margin = 50;
      const lineHeight = fontSize * 1.4;

      const lines = textContent.split("\n");
      let currentPage = pdfDoc.addPage();
      const { width, height } = currentPage.getSize();
      let y = height - margin;

      for (const line of lines) {
        const words = line.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (testWidth > width - margin * 2) {
            if (y < margin + lineHeight) {
              currentPage = pdfDoc.addPage();
              y = height - margin;
            }
            currentPage.drawText(currentLine, {
              x: margin,
              y,
              size: fontSize,
              font,
            });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          if (y < margin + lineHeight) {
            currentPage = pdfDoc.addPage();
            y = height - margin;
          }
          currentPage.drawText(currentLine, {
            x: margin,
            y,
            size: fontSize,
            font,
          });
          y -= lineHeight;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = uint8ArrayToBlob(pdfBytes);
      const blobUrl = URL.createObjectURL(blob);

      const outputName = file.name.replace(/\.txt$/i, ".pdf") || "document.pdf";

      const payload = {
        url: blobUrl,
        name: outputName,
        mime: "application/pdf",
      };

      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory("Text to PDF", file.name, "Converted to PDF");

      setStatus("success");

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=Text+to+PDF&name=${encodeURIComponent(outputName)}&local=true`,
        );
      }, 1200);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to convert text to PDF",
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
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
                title="Text to PDF"
                description="Convert plain .txt files to clean PDF documents entirely in your browser — no uploads, no accounts."
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
                    accept=".txt"
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
                        <FileText className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="mb-1 text-lg font-semibold text-gray-800">
                        Drop your .txt file here
                      </p>
                      <p className="text-sm text-gray-400">
                        or click to browse your files
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
                    icon: Zap,
                    label: "Instant",
                    desc: "Converts in milliseconds",
                  },
                  {
                    icon: Globe,
                    label: "Universal",
                    desc: "Opens on any device",
                  },
                  {
                    icon: Shield,
                    label: "Zero Uploads",
                    desc: "Private browser conversion",
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
              title="Converting Text..."
              description="Generating your PDF layout..."
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
              <h2 className="mb-2 text-3xl font-bold">Conversion Failed</h2>
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
            title: "How to Convert Text to PDF",
            steps: [
              "Upload your plain text (.txt) file — nothing leaves your device.",
              "The tool lays out your text with clean margins and standard fonts.",
              "Download your PDF instantly from the next page.",
            ],
          }}
          benefits={{
            title: "Why use Text to PDF?",
            items: [
              {
                title: "Permanent Format",
                desc: "PDFs look identical everywhere, unlike .txt files which vary by viewer.",
              },
              {
                title: "Browser Based",
                desc: "No software needed. Everything happens right here in your browser.",
              },
              {
                title: "100% Privacy",
                desc: "Your text is never uploaded to any server. It stays on your machine.",
              },
              {
                title: "Lightning Fast",
                desc: "Convert small or large text files in a fraction of a second.",
              },
            ],
          }}
          faqs={[
            {
              question: "Will it handle emojis?",
              answer:
                "Currently we support standard alphanumeric characters and common symbols. Emoji support is coming soon!",
            },
            {
              question: "Is there a file size limit?",
              answer:
                "There's no hard limit, but very large files (50MB+) may take a moment to process.",
            },
            {
              question: "Can I use bold or formatted text?",
              answer:
                "This tool is for plain text (.txt). For rich formatting, try our Word to PDF tool.",
            },
          ]}
        />
      </div>
    </div>
  );
}
