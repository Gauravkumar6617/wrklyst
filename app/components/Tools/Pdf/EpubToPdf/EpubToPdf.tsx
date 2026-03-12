"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Shield,
  Globe,
  Layout,
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

export function EPUBToPDFClient() {
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
    if (droppedFile && droppedFile.name.endsWith(".epub")) {
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
    setProgress(10);

    try {
      const jsPDF = (await import("jspdf")).default;
      const ePub = (await import("epubjs")).default;

      const arrayBuffer = await file.arrayBuffer();
      const book = ePub(arrayBuffer);
      await book.ready;

      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const spine = (book as any).spine;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const totalSections = (spine as any).length;

      for (let i = 0; i < totalSections; i++) {
        setProgress(Math.round(10 + (i / totalSections) * 80));
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const section = (spine as any).get(i);
        await section.load(book.load.bind(book));
        const content = section.contents as HTMLElement;

        const container = document.createElement("div");
        container.style.width = "545pt";
        container.style.padding = "20pt";
        container.innerHTML = content.innerHTML;
        container.style.position = "absolute";
        container.style.left = "-9999px";
        document.body.appendChild(container);

        if (i > 0) doc.addPage();

        const titleNode = container.querySelector("h1, h2, h3");
        if (titleNode) {
          doc.setFont("helvetica", "bold");
          doc.text(titleNode.textContent || "", 30, 40);
          doc.setFont("helvetica", "normal");
        }

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        await (doc as any).html(container, {
          x: 10,
          y: titleNode ? 60 : 10,
          autoPaging: "text",
          width: 545,
          windowWidth: 800,
        });

        document.body.removeChild(container);
        section.unload();
      }

      setProgress(95);

      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);

      const outputName = file.name.replace(/\.epub$/i, ".pdf") || "book.pdf";

      const payload = {
        url: blobUrl,
        name: outputName,
        mime: "application/pdf",
      };

      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory("EPUB to PDF", file.name, "Converted eBook");

      setProgress(100);
      setStatus("success");

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=EPUB+to+PDF&name=${encodeURIComponent(outputName)}&local=true`,
        );
      }, 1200);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to convert EPUB to PDF",
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
                title="EPUB to PDF"
                description="Convert eBooks to PDF entirely in your browser — no uploads, no accounts."
                icon={BookOpen}
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
                    accept=".epub"
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
                        <BookOpen className="h-8 w-8" />
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
                        <BookOpen className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="mb-1 text-lg font-semibold text-gray-800">
                        Drop your .epub file here
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
                    icon: Globe,
                    label: "Universal",
                    desc: "Read on any device",
                  },
                  {
                    icon: Shield,
                    label: "Private",
                    desc: "No eBook data is uploaded",
                  },
                  {
                    icon: Layout,
                    label: "Clean Layout",
                    desc: "Maintains book structure",
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
              title="Converting eBook..."
              description="Parsing chapters and rendering layouts..."
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
            title: "How to Convert EPUB to PDF",
            steps: [
              "Upload your EPUB eBook — nothing leaves your device.",
              "The tool reads the book structure and renders each chapter.",
              "Download your PDF instantly from the next page.",
            ],
          }}
          benefits={{
            title: "Read Anywhere",
            items: [
              {
                title: "No Specific Reader",
                desc: "PDFs open on almost any device without specialised eBook software.",
              },
              {
                title: "Offline Privacy",
                desc: "Conversion happens in your browser. We never see your book collection.",
              },
              {
                title: "Preserve Hierarchy",
                desc: "Chapter breaks and headings are maintained for a natural reading flow.",
              },
              {
                title: "Easy Sharing",
                desc: "PDFs are the standard for sharing documents across all operating systems.",
              },
            ],
          }}
          faqs={[
            {
              question: "Does it support DRM-protected books?",
              answer:
                "No, this tool only works with DRM-free EPUB files. Encrypted books cannot be processed for legal and technical reasons.",
            },
            {
              question: "What about the book cover?",
              answer:
                "We focus on the interior content. The cover may be included if it is part of the standard book flow.",
            },
            {
              question: "Will links work in the PDF?",
              answer:
                "Internal navigation links such as the Table of Contents work in most PDF readers after conversion.",
            },
          ]}
        />
      </div>
    </div>
  );
}
