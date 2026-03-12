"use client";

export const dynamic = "force-dynamic";

import { PageInfo } from "./types/index";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  File,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Copy,
  Maximize2,
  Undo,
  Redo,
  Plus,
  Shield,
  Layers,
  Infinity,
} from "lucide-react";
import Image from "next/image";
import { PDFDocument } from "pdf-lib";
import { uint8ArrayToBlob, formatFileSize } from "@/app/lib/pdf-utils";
import { PDFPreviewModal } from "@/app/components/pdf/PDFPreviewModal";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { EducationalContent } from "@/app/components/layout/EducationalContent";
import { useHistory } from "@/app/context/HistoryContext";

export function DuplicatePagesClient() {
  const { addToHistory } = useHistory();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);

  // History for Undo/Redo
  const [undoRedoHistory, setUndoRedoHistory] = useState<
    { pages: PageInfo[] }[]
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushToUndoRedo = (newPages: PageInfo[]) => {
    const newHistory = undoRedoHistory.slice(0, historyIndex + 1);
    newHistory.push({ pages: [...newPages] });
    if (newHistory.length > 20) newHistory.shift();
    setUndoRedoHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPages(undoRedoHistory[newIndex].pages);
    }
  };

  const redo = () => {
    if (historyIndex < undoRedoHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPages(undoRedoHistory[newIndex].pages);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      await loadPages(droppedFile);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await loadPages(selectedFile);
    }
  };

  const loadPages = async (pdfFile: File) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: true,
        isEvalSupported: false,
      });

      const pdfDoc = await loadingTask.promise;
      const pageCount = pdfDoc.numPages;

      const pageInfos: PageInfo[] = [];
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");

        // FIX: safely handle null context instead of non-null assertion
        const context = canvas.getContext("2d");
        if (!context) {
          console.warn(`Could not get 2D context for page ${i}, skipping.`);
          continue;
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas, // Add this line to satisfy the TypeScript requirement
        }).promise;

        pageInfos.push({
          id: `page-${i - 1}-${Date.now()}`,
          pageNumber: i,
          selected: true,
          image: canvas.toDataURL("image/jpeg", 0.7),
        });

        (page as { cleanup?: () => void }).cleanup?.();
      }

      setPages(pageInfos);
      pushToUndoRedo(pageInfos);
      setStatus("ready");
      await pdfDoc.destroy();
    } catch (error: unknown) {
      console.error("PDF loading error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Failed to load PDF: ${message}`);
      setStatus("error");
    }
  };

  const duplicatePage = (index: number) => {
    const newPages = [...pages];
    const duplicatedPage = {
      ...newPages[index],
      id: `page-dup-${Date.now()}-${Math.random()}`,
    };
    newPages.splice(index + 1, 0, duplicatedPage);
    setPages(newPages);
    pushToUndoRedo(newPages);
  };

  const handleProcess = async () => {
    if (!file || pages.length === 0) return;

    setStatus("processing");
    setErrorMessage("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = pages.map((p) => p.pageNumber - 1);
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = uint8ArrayToBlob(pdfBytes);
      const blobUrl = URL.createObjectURL(blob);

      const outputName = file.name.replace(/\.pdf$/i, "") + "_duplicated.pdf";

      const payload = {
        url: blobUrl,
        name: outputName,
        mime: "application/pdf",
      };

      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory(
        "Duplicated Pages",
        file.name,
        `Final document has ${pages.length} pages`,
      );

      setStatus("success");

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=Duplicate+Pages&name=${encodeURIComponent(outputName)}&local=true`,
        );
      }, 1200);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to duplicate pages";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setStatus("idle");
    setErrorMessage("");
    setUndoRedoHistory([]);
    setHistoryIndex(-1);
  };

  const dupCount =
    pages.length - (undoRedoHistory[0]?.pages.length ?? pages.length);

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
                title="Duplicate PDF Pages"
                description="Clone and multiply specific pages within your PDF — entirely in your browser."
                icon={Copy}
              />

              <ToolCard className="p-8">
                <div
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200
                    ${
                      dragActive
                        ? "border-black bg-gray-50 scale-[1.01]"
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
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition-colors group-hover:bg-gray-200">
                    <Copy className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="mb-1 text-lg font-semibold text-gray-800">
                    Drop your PDF here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse your files
                  </p>
                </div>
              </ToolCard>

              {/* Feature pills */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    label: "100% Private",
                    desc: "Nothing leaves your browser",
                  },
                  {
                    icon: Layers,
                    label: "Instant Cloning",
                    desc: "Duplicate any page with one click",
                  },
                  {
                    icon: Infinity,
                    label: "No Limits",
                    desc: "Duplicate as many pages as you need",
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

          {/* ── LOADING ── */}
          {status === "loading" && (
            <ProcessingState
              title="Loading PDF..."
              description="Preparing pages for duplication..."
            />
          )}

          {/* ── READY ── */}
          {status === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-7xl"
            >
              {/* Toolbar */}
              <div className="mb-8 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/20 bg-white/60 p-6 shadow-sm backdrop-blur-md md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
                    <File className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight text-gray-900">
                      {file?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {pages.length} pages
                      {dupCount > 0 && (
                        <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white">
                          +{dupCount} duplicated
                        </span>
                      )}
                      {" · "}
                      {formatFileSize(file?.size ?? 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
                      title="Undo"
                    >
                      <Undo className="h-4 w-4" />
                    </button>
                    <div className="mx-1.5 h-5 w-px bg-gray-200" />
                    <button
                      onClick={redo}
                      disabled={historyIndex >= undoRedoHistory.length - 1}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
                      title="Redo"
                    >
                      <Redo className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={reset}
                    className="rounded-xl p-2.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Start over"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleProcess}
                    className="btn-primary group flex items-center gap-2 rounded-xl px-8 py-3 shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Copy className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-bold">Generate PDF</span>
                  </button>
                </div>
              </div>

              {/* Page Grid */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {pages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative"
                  >
                    <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-1 shadow-sm transition-all hover:border-black hover:shadow-xl">
                      <div className="relative aspect-[3/4] bg-white">
                        <Image
                          src={page.image}
                          alt={`Page ${index + 1}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />

                        {/* Page number badge */}
                        <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                          P.{index + 1}
                        </div>

                        {/* Hover actions */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                          <button
                            onClick={() => duplicatePage(index)}
                            className="flex scale-90 items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black shadow-xl transition-all group-hover:scale-100 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => {
                              setPreviewPage(index);
                              setPreviewOpen(true);
                            }}
                            className="rounded-full border border-white/30 bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PROCESSING ── */}
          {status === "processing" && (
            <ProcessingState
              title="Generating document..."
              description="Cloning pages and building your new PDF..."
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
                <AlertCircle className="h-10 w-10" />
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
            title: "How to Duplicate PDF Pages",
            steps: [
              "Upload your PDF — nothing leaves your device.",
              "Hover over any page and click 'Duplicate' to insert a copy right after it.",
              "Hit 'Generate PDF' and download your updated document from the next page.",
            ],
          }}
          benefits={{
            title: "Why Clone PDF Pages with Us?",
            items: [
              {
                title: "Instant Cloning",
                desc: "Create multiple copies of any page with a single click.",
              },
              {
                title: "Privacy First",
                desc: "Page duplication happens locally on your machine — nothing is uploaded.",
              },
              {
                title: "Accurate Metadata",
                desc: "Page links and properties are preserved across duplicated copies.",
              },
              {
                title: "Free & Unlimited",
                desc: "Duplicate as many pages as you need without signing up or paying.",
              },
            ],
          }}
          faqs={[
            {
              question: "Why would I need to duplicate a page?",
              answer:
                "Common use cases include forms, repetitive templates, or adding multiple copies of a cover page.",
            },
            {
              question: "Does it increase the file size significantly?",
              answer:
                "It adds the data of the new pages, but we optimise the output to keep it as small as possible.",
            },
            {
              question: "Can I reorder the duplicated pages?",
              answer:
                "Yes — once duplicated, use our Reorder tool to rearrange them however you like.",
            },
          ]}
        />
      </div>

      <PDFPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        images={pages.map((p) => p.image)}
        currentPage={previewPage}
        onPageChange={setPreviewPage}
        title="Page Preview"
      />
    </div>
  );
}
