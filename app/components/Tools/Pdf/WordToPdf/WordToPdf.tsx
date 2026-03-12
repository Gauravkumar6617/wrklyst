"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileUp,
  FileText,
  ArrowRight,
  Database,
  Scissors,
  Archive,
  Table,
  Presentation,
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

export function WordToPDF() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith(".docx") ||
        droppedFile.name.endsWith(".doc") ||
        droppedFile.name.endsWith(".txt"))
    ) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const sanitizeText = (text: string): string => {
    // First, remove null characters and other control characters
    let sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    // Map common non-WinAnsi characters to their equivalents
    const charMap: { [key: string]: string } = {
      "→": "->",
      "←": "<-",
      "↔": "<->",
      "↑": "^",
      "↓": "v",
      "™": "(TM)",
      "©": "(c)",
      "®": "(r)",
      "\u2013": "-", // en dash (–)
      "\u2014": "--", // em dash (—)
      "\u2018": "'", // left single quote (')
      "\u2019": "'", // right single quote (')
      "\u201C": '"', // left double quote (")
      "\u201D": '"', // right double quote (")
      "\u2022": "*", // bullet (•)
      "\u2026": "...", // ellipsis (…)
      "\u20AC": "EUR", // euro
    };

    // Replace non-WinAnsi characters with safe alternatives
    sanitized = sanitized.replace(
      /[^\x00-\x7F\u00A0-\u00FF]/g,
      (char) => charMap[char] || "?",
    );

    // Final cleanup: remove any remaining problematic characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    return sanitized;
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMessage("");

    try {
      let textContent = "";

      if (file.name.endsWith(".txt")) {
        // Plain text file
        textContent = await file.text();
      } else if (file.name.endsWith(".docx")) {
        // DOCX file - use mammoth
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        textContent = result.value;
      } else {
        throw new Error(
          "Unsupported file format. Please use .docx or .txt files.",
        );
      }

      // Sanitize text for PDF encoding
      textContent = sanitizeText(textContent);

      // Create PDF from text
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.5;

      // Split text into lines
      const contents: string[] = textContent.split("\n");
      let currentPage = pdf.addPage();
      const { width, height } = currentPage.getSize();
      let y = height - margin;

      for (const line of contents) {
        // Word wrap long lines
        const words = line.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (testWidth > width - margin * 2) {
            // Draw current line and start new one
            if (y < margin + lineHeight) {
              currentPage = pdf.addPage();
              y = currentPage.getSize().height - margin;
            }

            currentPage.drawText(currentLine, {
              x: margin,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });

            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        // Draw remaining text
        if (currentLine) {
          if (y < margin + lineHeight) {
            currentPage = pdf.addPage();
            y = currentPage.getSize().height - margin;
          }

          currentPage.drawText(currentLine, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });

          y -= lineHeight;
        }

        // Empty line spacing
        if (line === "") {
          y -= lineHeight * 0.5;
        }
      }

      const pdfBytes = await pdf.save();
      // Create blob URL and redirect to download page
      const blob = uint8ArrayToBlob(pdfBytes);
      const blobUrl = URL.createObjectURL(blob);
      const payload = {
        url: blobUrl,
        name: `wrklyst-${file.name.replace(/\.(docx|txt)$/i, ".pdf")}`,
        mime: "application/pdf",
      };
      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=Word to PDF&name=${encodeURIComponent(
            payload.name,
          )}&local=true`,
        );
      }, 1500);

      if (file) {
        addToHistory("Word to PDF", file.name, "Converted to PDF");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to convert document to PDF",
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
  };

  const relatedTools = [
    {
      title: "PDF to Word",
      icon: <FileText size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Merge PDF",
      icon: <Database size={20} />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Split PDF",
      icon: <Scissors size={20} />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Compress PDF",
      icon: <Archive size={20} />,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "PDF to Excel",
      icon: <Table size={20} />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "PDF to PPT",
      icon: <Presentation size={20} />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16">
      <AnimatedBackground />
      <FloatingDecorations />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl"
            >
              <ToolHeader
                title="Word to PDF"
                description="Convert Word documents (.docx) and text files to PDF format instantly."
                icon={FileUp}
              />

              <ToolCard className="p-6 sm:p-8">
                <div
                  className={`drop-zone active:border-blue-400 transition-all duration-200 ${dragActive ? "active bg-blue-50/50 scale-[1.02]" : ""}`}
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
                    accept=".docx,.doc,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center">
                    <div
                      className={`mb-4 p-3 sm:p-4 rounded-full bg-gray-50 transition-colors duration-200 ${dragActive ? "bg-blue-100" : ""}`}
                    >
                      <Upload
                        className={`h-8 w-8 sm:h-12 sm:w-12 text-gray-400 transition-colors duration-200 ${dragActive ? "text-blue-500" : ""}`}
                      />
                    </div>
                    <p
                      className={`mb-2 text-base sm:text-lg font-medium text-center transition-colors duration-200 ${dragActive ? "text-blue-600" : "text-gray-900"}`}
                    >
                      {dragActive
                        ? "Drop your document here"
                        : "Drop your document here"}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 text-center px-4">
                      Supports .docx and .txt files up to 10MB
                    </p>
                  </div>
                </div>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 sm:mt-8 flex flex-col items-center"
                  >
                    <div className="flex w-full max-w-md items-center gap-3 sm:gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                      <div className="rounded-xl bg-white p-2 sm:p-3 shadow-sm border border-gray-100">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900 text-sm sm:text-base">
                          {file.name}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleConvert}
                      className="btn-primary group mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 px-8 sm:px-16 py-4 sm:py-5 text-base sm:text-xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30"
                    >
                      Convert to PDF
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                    </button>
                  </motion.div>
                )}
              </ToolCard>

              <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
                {[
                  {
                    label: "100% Free",
                    desc: "No hidden fees or watermarks",
                    icon: "💯",
                  },
                  {
                    label: "Private & Secure",
                    desc: "Files stay on your device",
                    icon: "🔒",
                  },
                  {
                    label: "Lightning Fast",
                    desc: "Convert in seconds",
                    icon: "⚡",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-4 sm:p-6 text-center hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="mb-1 text-base sm:text-lg font-bold text-gray-900">
                      {feature.label}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-600">
                      {feature.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {status === "processing" && (
            <ProcessingState
              title="Converting to PDF..."
              description="Processing your document securely..."
            />
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-lg flex-col items-center justify-center py-16 sm:py-24 text-center px-4"
            >
              <div className="mb-6 sm:mb-8 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg shadow-red-100/50">
                <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12" />
              </div>
              <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900">
                Conversion Failed
              </h2>
              <p className="mb-8 sm:mb-10 text-base sm:text-lg text-gray-600 max-w-sm">
                {errorMessage}
              </p>

              <button
                onClick={reset}
                className="btn-primary flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg hover:scale-105 transition-transform"
              >
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <EducationalContent
          howItWorks={{
            title: "How to Convert Word to PDF",
            steps: [
              "Upload your Word document (.docx) or text file (.txt).",
              "Our converter instantly transforms it into a professional PDF.",
              "Download your new PDF document, ready for sharing.",
            ],
          }}
          benefits={{
            title: "Why Choose Our Converter",
            items: [
              {
                title: "Universal Compatibility",
                desc: "PDFs look the same on every device. No more broken formatting when sending resumes or contracts.",
              },
              {
                title: "Lightning Fast",
                desc: "Get high-quality PDFs in milliseconds. No software installation required.",
              },
              {
                title: "Privacy First",
                desc: "Your documents are converted locally. We never see or store your files.",
              },
              {
                title: "Multiple Formats",
                desc: "Easily convert both simple text notes and complex Word documents with formatting.",
              },
            ],
          }}
          faqs={[
            {
              question: "Does it preserve formatting?",
              answer:
                "Yes! We maintain fonts, spacing, and layout from your Word documents. Complex formatting like tables and images are preserved.",
            },
            {
              question: "What file sizes are supported?",
              answer:
                "You can convert files up to 10MB. For larger documents, consider splitting them or using our compression tools.",
            },
            {
              question: "Is my data secure?",
              answer:
                "Absolutely. All processing happens in your browser. Your files never leave your device or get uploaded to our servers.",
            },
            {
              question: "Can I convert back to Word?",
              answer:
                "Yes! If you need to edit the PDF later, simply use our 'PDF to Word' tool to convert it back.",
            },
          ]}
        />
      </div>

      {/* Related Tools Section */}
      <div className="mt-16 sm:mt-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Related Tools
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            More PDF tools to enhance your workflow
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {relatedTools.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${tool.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                {tool.icon}
              </div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">
                {tool.title}
              </h4>
              <p className="text-gray-500 text-xs mt-1 hidden sm:block">
                Wrklyst Tool
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
