"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  RotateCw,
  RotateCcw,
  ArrowRight,
  Eye,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import { rotatePDF, uint8ArrayToBlob } from "@/app/lib/pdf-utils";
import { PDFPreviewModal } from "@/app/components/pdf/PDFPreviewModal";
import {
  AnimatedBackground,
  ToolHeader,
  ToolCard,
  ProcessingState,
} from "@/app/components/ui/ToolPageElements";
import Link from "next/link";

export default function RotatePdf() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "processing" | "success" | "error"
  >("idle");
  const [pages, setPages] = useState<any[]>([]);
  const [globalRotation, setGlobalRotation] = useState<number>(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);

  const loadPages = async (pdfFile: File) => {
    setStatus("loading");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      const pageInfos = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
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
          rotation: 0,
        });
      }
      setPages(pageInfos);
      setStatus("ready");
      await pdfDoc.destroy();
    } catch (error) {
      toast.error("Failed to read PDF");
      setStatus("error");
    }
  };

  const handleRotateIndividual = (index: number, direction: "cw" | "ccw") => {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i === index) {
          const delta = direction === "cw" ? 90 : -90;
          return {
            ...p,
            rotation: ((((p.rotation ?? 0) + delta) % 360) + 360) % 360,
          };
        }
        return p;
      }),
    );
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus("processing");
    try {
      const rotations = pages.map(
        (p) => ((p.rotation ?? 0) + globalRotation) % 360,
      );
      const pdfBytes = await rotatePDF(file, rotations);
      const blob = uint8ArrayToBlob(pdfBytes);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const downloadUrl = URL.createObjectURL(blob);
      sessionStorage.setItem(
        "current_download",
        JSON.stringify({
          url: downloadUrl,
          name: `rotated_${file.name}`,
          tool: "Rotate PDF",
        }),
      );

      setTimeout(() => {
        router.push(
          `/download/local-rotate?name=${encodeURIComponent(file.name)}&tool=Rotate PDF&local=true`,
        );
      }, 1500);
    } catch (error) {
      toast.error("Process failed");
      setStatus("ready");
    }
  };

  return (
    <div className="relative min-h-screen pt-20 pb-32 bg-[#F8FAFC]">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <ToolHeader
                title="Rotate PDF"
                description="Fix upside-down scans instantly. High-fidelity rotation right in your browser."
                icon={RotateCw}
              />

              <label className="block mt-8 md:mt-12 cursor-pointer group px-2">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    (setFile(e.target.files[0]), loadPages(e.target.files[0]))
                  }
                />
                <ToolCard className="relative overflow-hidden p-8 md:p-20 border-2 border-dashed border-slate-200 hover:border-indigo-500 transition-all bg-white/80 backdrop-blur-md">
                  {/* Animated gradient background for a "Pro" feel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                      <Upload
                        className="text-white"
                        size={window?.innerWidth < 768 ? 24 : 40}
                      />
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-tight">
                      Rotate PDF{" "}
                      <span className="block md:inline text-indigo-600">
                        Instantly
                      </span>
                    </h3>
                    <p className="text-slate-500 mt-2 md:mt-4 font-medium text-sm md:text-lg max-w-xs md:max-w-none">
                      Tap to select or drag your file here.
                      <span className="block text-[10px] md:text-xs mt-1 text-slate-400 uppercase tracking-widest">
                        Local Browser Processing
                      </span>
                    </p>
                  </div>
                </ToolCard>
              </label>

              {/* FEATURES GRID */}
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                {[
                  {
                    icon: Zap,
                    title: "Zero Quality Loss",
                    desc: "Metadata-based rotation.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "100% Private",
                    desc: "Files never leave your PC.",
                  },
                  {
                    icon: RotateCw,
                    title: "Batch Rotation",
                    desc: "Rotate all pages at once.",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <f.icon className="text-indigo-500 mb-3" size={24} />
                    <h4 className="font-bold text-slate-800">{f.title}</h4>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {status === "loading" && (
            <ProcessingState
              message="Preparing Studio..."
              description="Generating high-res page previews..."
            />
          )}

          {status === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto"
            >
              {/* DESKTOP/MOBILE HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <RotateCw className="text-indigo-600" /> Professional
                    Rotator
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {file?.name} • {pages.length} Pages
                  </p>
                </div>

                {/* Global Degree Selector - Hidden on very small screens, shown in bottom bar instead */}
                <div className="hidden md:flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setGlobalRotation(deg)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${globalRotation === deg ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* GRID */}
              {/* GALLERY GRID */}
              {/* GALLERY GRID */}
              {/* GALLERY GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 px-2 pb-32">
                {pages.map((page, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                  >
                    {/* THUMBNAIL */}
                    <div className="relative aspect-[3/4] bg-slate-50 flex items-center justify-center p-2 overflow-hidden">
                      <motion.div
                        animate={{ rotate: page.rotation + globalRotation }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={page.image}
                          fill
                          alt=""
                          className="object-contain shadow-sm"
                          unoptimized
                        />
                      </motion.div>

                      {/* ULTRA-COMPACT MOBILE CONTROLS */}
                      <div className="absolute inset-x-0 top-0 p-1 flex justify-between md:hidden">
                        <button
                          onClick={() => handleRotateIndividual(idx, "ccw")}
                          className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-sm border border-slate-200 text-slate-700 active:bg-indigo-600 active:text-white"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          onClick={() => handleRotateIndividual(idx, "cw")}
                          className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-sm border border-slate-200 text-slate-700 active:bg-indigo-600 active:text-white"
                        >
                          <RotateCw size={14} />
                        </button>
                      </div>
                    </div>

                    {/* INFO FOOTER */}
                    <div className="px-2 py-1.5 flex justify-between items-center bg-white border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400">
                        P. {page.pageNumber}
                      </span>
                      <button
                        onClick={() => {
                          setPreviewPage(idx);
                          setPreviewOpen(true);
                        }}
                        className="text-indigo-600 p-1 md:hidden"
                      >
                        <Eye size={14} />
                      </button>
                      <span className="hidden md:block text-[10px] font-bold text-indigo-500">
                        {(page.rotation + globalRotation) % 360}°
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {status === "processing" && (
            <ProcessingState
              message="Saving Changes..."
              description="Updating document orientation..."
            />
          )}
        </AnimatePresence>
      </div>

      {/* STICKY BOTTOM TOOLBAR (Mobile & Desktop) */}
      {status === "ready" && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={reset}
              className="p-3 text-slate-400 hover:text-red-500 md:flex items-center gap-2 hidden transition-colors"
            >
              <Trash2 size={20} />{" "}
              <span className="text-sm font-bold">Clear</span>
            </button>

            <div className="flex-1 flex justify-center md:hidden">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setGlobalRotation(deg)}
                    className={`px-3 py-1 rounded-md text-xs font-bold ${globalRotation === deg ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleProcess}
                className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Apply & Download <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* RELATED TOOLS COMPONENT (Simplified) */}
      {status === "idle" && (
        <div className="max-w-4xl mx-auto px-4 mt-20">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Related PDF Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolLink
              title="Merge PDF"
              desc="Combine multiple files into one"
              href="/merge-pdf"
            />
            <ToolLink
              title="Split PDF"
              desc="Extract pages from your document"
              href="/split-pdf"
            />
          </div>
        </div>
      )}

      <PDFPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        images={pages.map((p) => p.image)}
        currentPage={previewPage}
        onPageChange={setPreviewPage}
        rotation={(pages[previewPage]?.rotation ?? 0) + globalRotation}
        onDownload={handleProcess}
        title="Page Preview"
      />
    </div>
  );

  function reset() {
    setFile(null);
    setPages([]);
    setStatus("idle");
    setGlobalRotation(0);
  }
}

function ToolLink({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group"
    >
      <div>
        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ChevronRight
        size={18}
        className="text-slate-300 group-hover:text-indigo-500 transition-colors"
      />
    </Link>
  );
}
