"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Presentation,
  ArrowRight,
  FileText,
  Zap,
  Shield,
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

export function PPTToPDFClient() {
  const { addToHistory } = useHistory();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".pptx")) {
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
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(file);
      setProgress(20);

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const slideFiles = Object.keys(zip.files)
        .filter(
          (name) =>
            name.startsWith("ppt/slides/slide") && name.endsWith(".xml"),
        )
        .sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)\.xml$/)?.[1] ?? "0");
          const numB = parseInt(b.match(/slide(\d+)\.xml$/)?.[1] ?? "0");
          return numA - numB;
        });

      const numSlides = slideFiles.length;
      if (numSlides === 0)
        throw new Error("No slides found in this PowerPoint file.");

      setProgress(30);

      for (let i = 0; i < numSlides; i++) {
        setProgress(30 + Math.round(((i + 1) / numSlides) * 60));

        const slideXml = await zip.file(slideFiles[i])?.async("string");
        if (!slideXml) continue;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(slideXml, "text/xml");
        const textNodes = xmlDoc.getElementsByTagName("a:t");

        const PAGE_W = 841.89;
        const PAGE_H = 595.28;
        const MARGIN = 50;
        const MAX_WIDTH = PAGE_W - MARGIN * 2;

        const slidePage = pdfDoc.addPage([PAGE_W, PAGE_H]);

        // Slide background
        slidePage.drawRectangle({
          x: 0,
          y: 0,
          width: PAGE_W,
          height: PAGE_H,
          color: rgb(0.98, 0.98, 0.99),
        });

        // Top accent bar
        slidePage.drawRectangle({
          x: 0,
          y: PAGE_H - 8,
          width: PAGE_W,
          height: 8,
          color: rgb(0.1, 0.1, 0.1),
        });

        // Slide number badge
        const slideLabel = `${i + 1} / ${numSlides}`;
        slidePage.drawText(slideLabel, {
          x: PAGE_W - MARGIN - 40,
          y: PAGE_H - 30,
          size: 9,
          font: boldFont,
          color: rgb(0.6, 0.6, 0.6),
        });

        let y = PAGE_H - 55;
        let isFirstText = true;

        for (let j = 0; j < textNodes.length; j++) {
          const rawText = textNodes[j].textContent || "";
          const text = rawText.trim();
          if (!text) continue;

          const currentFont = isFirstText ? boldFont : font;
          const currentSize = isFirstText ? 18 : 12;
          const currentColor = isFirstText
            ? rgb(0.08, 0.08, 0.08)
            : rgb(0.25, 0.25, 0.25);
          const lineH = isFirstText ? 26 : 18;

          // Word wrap using actual font metrics
          const words = text.split(" ");
          let currentLine = "";

          for (const word of words) {
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const testWidth = currentFont.widthOfTextAtSize(
              testLine,
              currentSize,
            );

            if (testWidth > MAX_WIDTH && currentLine) {
              if (y < MARGIN + lineH) break;
              slidePage.drawText(currentLine, {
                x: MARGIN,
                y,
                size: currentSize,
                font: currentFont,
                color: currentColor,
              });
              y -= lineH;
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }

          if (currentLine && y >= MARGIN) {
            slidePage.drawText(currentLine, {
              x: MARGIN,
              y,
              size: currentSize,
              font: currentFont,
              color: currentColor,
            });
            y -= lineH + (isFirstText ? 8 : 2);
          }

          if (isFirstText) {
            // Divider after title
            slidePage.drawLine({
              start: { x: MARGIN, y: y + 4 },
              end: { x: PAGE_W - MARGIN, y: y + 4 },
              thickness: 0.5,
              color: rgb(0.85, 0.85, 0.88),
            });
            y -= 10;
          }

          isFirstText = false;
          if (y < MARGIN) break;
        }
      }

      setProgress(95);

      const pdfBytes = await pdfDoc.save();
      const blob = uint8ArrayToBlob(pdfBytes);
      const blobUrl = URL.createObjectURL(blob);

      const outputName =
        file.name.replace(/\.pptx$/i, ".pdf") || "presentation.pdf";

      const payload = {
        url: blobUrl,
        name: outputName,
        mime: "application/pdf",
      };

      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory("PowerPoint to PDF", file.name, "Converted slides to PDF");

      setProgress(100);
      setStatus("success");

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=PowerPoint+to+PDF&name=${encodeURIComponent(outputName)}&local=true`,
        );
      }, 1200);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to convert PowerPoint to PDF",
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
                title="PowerPoint to PDF"
                description="Convert .pptx presentations to PDF entirely in your browser — no uploads, no accounts."
                icon={Presentation}
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
                    accept=".pptx"
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
                        <Presentation className="h-8 w-8" />
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
                        <Presentation className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="mb-1 text-lg font-semibold text-gray-800">
                        Drop your .pptx file here
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
                    icon: Shield,
                    label: "100% Private",
                    desc: "Runs entirely in your browser",
                  },
                  {
                    icon: Zap,
                    label: "Fast Conversion",
                    desc: "Slides extracted in seconds",
                  },
                  {
                    icon: FileText,
                    label: "Free Forever",
                    desc: "No limits, no sign-up needed",
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
              title="Converting Slides..."
              description="Parsing your presentation and building your PDF..."
              progress={progress}
            />
          )}

          {/* ── SUCCESS ── (briefly shown before redirect) */}
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
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
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
            title: "How to Convert PPTX to PDF",
            steps: [
              "Upload your PowerPoint (.pptx) file — nothing leaves your device.",
              "The tool parses each slide and extracts text content directly in your browser.",
              "Download your PDF instantly from the next page.",
            ],
          }}
          benefits={{
            title: "Why Convert to PDF?",
            items: [
              {
                title: "Universal Compatibility",
                desc: "PDFs look identical on every device, even without PowerPoint installed.",
              },
              {
                title: "Browser-Only Privacy",
                desc: "Your slides are never uploaded to any server.",
              },
              {
                title: "Smaller File Size",
                desc: "PDFs are often much smaller than .pptx files — great for email.",
              },
              {
                title: "Print Ready",
                desc: "Get clean, high-quality pages perfect for handouts.",
              },
            ],
          }}
          faqs={[
            {
              question: "Are animations or transitions preserved?",
              answer:
                "PDF is a static format, so animations and transitions are not included. Each slide is captured in its final state.",
            },
            {
              question: "Can I convert older .ppt files?",
              answer:
                "We support the modern .pptx format. For older .ppt files, open them in PowerPoint or LibreOffice and save as .pptx first.",
            },
            {
              question: "Is there a slide limit?",
              answer:
                "No limits — convert presentations of any length for free.",
            },
          ]}
        />
      </div>
    </div>
  );
}
