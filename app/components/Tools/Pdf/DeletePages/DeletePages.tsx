"use client";

export const dynamic = "force-dynamic";

import { PageInfo } from "../DuplicatePage/types/index";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  File,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Trash2,
  X,
  Undo,
  Redo,
  Shield,
  Zap,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { PDFDocument } from "pdf-lib";
import { uint8ArrayToBlob, formatFileSize } from "@/app/lib/pdf-utils";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import { EducationalContent } from "@/app/components/layout/EducationalContent";
import { useHistory } from "@/app/context/HistoryContext";

export function DeletePagesClient() {
  const { addToHistory } = useHistory();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pages, setPages] = useState<PageInfo[]>([]);

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
      const numPages = pdfDoc.numPages;

      const pageInfos: PageInfo[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
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
          canvas: canvas, // Fulfills TS requirement
        }).promise;

        pageInfos.push({
          pageNumber: i,
          image: canvas.toDataURL("image/jpeg", 0.7),
          selected: true,
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
      setErrorMessage(`Failed to load PDF pages: ${message}`);
      setStatus("error");
    }
  };

  const togglePage = (pageNumber: number) => {
    const newPages = pages.map((p) =>
      p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p,
    );
    setPages(newPages);
    pushToUndoRedo(newPages);
  };

  const handleDelete = async () => {
    if (!file) return;
    const keptPages = pages.filter((p) => p.selected);
    if (keptPages.length === 0) {
      setErrorMessage(
        "You cannot delete all pages. At least one page must remain.",
      );
      setStatus("error");
      return;
    }

    setStatus("processing");
    setErrorMessage("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = keptPages.map((p) => p.pageNumber - 1);
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = uint8ArrayToBlob(pdfBytes);
      const blobUrl = URL.createObjectURL(blob);

      const deletedCount = pages.length - keptPages.length;
      const outputName = file.name.replace(/\.pdf$/i, "") + "_deleted.pdf";

      const payload = {
        url: blobUrl,
        name: outputName,
        mime: "application/pdf",
      };

      sessionStorage.removeItem("wrklyst_pending_file");
      sessionStorage.setItem("wrklyst_pending_file", JSON.stringify(payload));

      addToHistory(
        "Delete Pages",
        file.name,
        `Removed ${deletedCount} page${deletedCount !== 1 ? "s" : ""}`,
      );

      setStatus("success");

      const fileId = `local-${Date.now()}`;
      setTimeout(() => {
        router.push(
          `/download/${fileId}?tool=Delete+Pages&name=${encodeURIComponent(outputName)}&local=true`,
        );
      }, 1200);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to delete pages";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setPages([]);
    setErrorMessage("");
    setUndoRedoHistory([]);
    setHistoryIndex(-1);
  };

  const deletedCount = pages.filter((p) => !p.selected).length;
  const keptCount = pages.filter((p) => p.selected).length;

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
                title="Delete PDF Pages"
                description="Select and remove unwanted pages from your PDF — entirely in your browser."
                icon={Trash2}
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
                    <Trash2 className="h-8 w-8 text-gray-500" />
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
                    icon: Zap,
                    label: "Visual Editor",
                    desc: "Click pages to mark for deletion",
                  },
                  {
                    icon: RotateCcw,
                    label: "Undo / Redo",
                    desc: "Easily reverse any mistake",
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
              description="Generating page previews..."
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
              <div className="flex flex-col items-start gap-8 lg:flex-row">
                {/* Page grid */}
                <div className="w-full flex-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-black/10">
                        <File className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="mb-0.5 font-bold leading-none text-gray-900">
                          {file?.name}
                        </h3>
                        <p className="text-xs font-medium text-gray-500">
                          {pages.length} pages ·{" "}
                          {formatFileSize(file?.size ?? 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                        <button
                          onClick={undo}
                          disabled={historyIndex <= 0}
                          className="rounded-md p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30"
                          title="Undo"
                        >
                          <Undo className="h-4 w-4" />
                        </button>
                        <div className="mx-1 h-4 w-px bg-gray-200" />
                        <button
                          onClick={redo}
                          disabled={historyIndex >= undoRedoHistory.length - 1}
                          className="rounded-md p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30"
                          title="Redo"
                        >
                          <Redo className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="h-6 w-px bg-gray-200" />
                      <button
                        onClick={reset}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Start over"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="scrollbar-thin scrollbar-thumb-gray-200 max-h-[70vh] overflow-y-auto p-8">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {pages.map((page) => (
                        <div
                          key={page.pageNumber}
                          className="group relative flex flex-col items-center"
                        >
                          <motion.div
                            whileHover={{ y: -4 }}
                            className={`relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl border-2 shadow-sm transition-all duration-200 ${
                              page.selected
                                ? "border-gray-200 hover:border-gray-400"
                                : "border-red-500 opacity-60 ring-4 ring-red-500/10 grayscale-[0.8]"
                            }`}
                            onClick={() => togglePage(page.pageNumber)}
                          >
                            <Image
                              src={page.image}
                              alt={`Page ${page.pageNumber}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {!page.selected && (
                              <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                                <Trash2 className="h-10 w-10 text-red-500" />
                              </div>
                            )}
                            <div
                              className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                                !page.selected
                                  ? "border-red-500 bg-red-500 text-white"
                                  : "scale-90 border-gray-300 bg-white/80 opacity-0 backdrop-blur-sm group-hover:opacity-100"
                              }`}
                            >
                              {!page.selected ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                              )}
                            </div>
                            <div className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-1 text-[10px] font-bold leading-none text-white backdrop-blur-md">
                              P.{page.pageNumber}
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-full space-y-6 lg:sticky lg:top-24 lg:w-[300px]">
                  <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-gray-900">Summary</h4>
                    </div>

                    <div className="mb-5 space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total pages</span>
                        <span className="font-bold text-gray-900">
                          {pages.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-500">To delete</span>
                        <span className="font-bold text-red-600">
                          {deletedCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">To keep</span>
                        <span className="font-bold text-green-600">
                          {keptCount}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleDelete}
                      disabled={keptCount === 0 || deletedCount === 0}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-white shadow-xl shadow-red-500/20 transition-all hover:scale-[1.02] hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      <Trash2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
                      <span className="text-base font-bold">
                        Delete {deletedCount > 0 ? `${deletedCount} ` : ""}
                        {deletedCount === 1 ? "Page" : "Pages"}
                      </span>
                    </button>

                    {deletedCount === 0 && (
                      <p className="mt-3 text-center text-xs text-gray-400">
                        Click a page thumbnail to mark it for deletion
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PROCESSING ── */}
          {status === "processing" && (
            <ProcessingState
              title="Deleting pages..."
              description="Removing selected pages from your document..."
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
              <h2 className="mb-2 text-3xl font-bold">Pages Deleted!</h2>
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
            title: "How to Delete PDF Pages",
            steps: [
              "Upload your PDF — nothing leaves your device.",
              "Click any page thumbnail to mark it for deletion. Click again to unmark.",
              "Hit 'Delete Pages' and download your trimmed PDF from the next page.",
            ],
          }}
          benefits={{
            title: "Why Delete PDF Pages with Us?",
            items: [
              {
                title: "Completely Private",
                desc: "Processing happens entirely in your browser — your data never leaves your device.",
              },
              {
                title: "Fast & Visual",
                desc: "See every page at a glance and remove unwanted ones in seconds.",
              },
              {
                title: "No Size Limits",
                desc: "Whether it's a 5-page flyer or a 500-page manual, we handle it with ease.",
              },
              {
                title: "Undo / Redo",
                desc: "Made a mistake? Instantly undo and refine your selection before saving.",
              },
            ],
          }}
          faqs={[
            {
              question: "Will the remaining pages be renumbered?",
              answer:
                "Yes, the final PDF will contain the remaining pages in their original order.",
            },
            {
              question: "Is there a limit to how many pages I can delete?",
              answer:
                "No, you can delete as many pages as you like as long as at least one page remains.",
            },
            {
              question: "Can I delete pages from a password-protected PDF?",
              answer:
                "You would need to unlock the PDF first using our Unlock PDF tool.",
            },
          ]}
        />
      </div>
    </div>
  );
}
