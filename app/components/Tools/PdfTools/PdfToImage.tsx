"use client";
import React, { useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import JSZip from "jszip";
import {
  FileText,
  Download,
  Loader2,
  Upload,
  X,
  Files,
  Trash2,
  ShieldCheck,
  Layers,
  Zap,
  ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfToImageProps {
  format: "image/jpeg" | "image/png";
}

interface ProcessedPage {
  fileName: string;
  id: number;
  blob: Blob;
  preview: string;
}

export default function PdfToImage({ format }: PdfToImageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<ProcessedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const pdfFiles = selectedFiles.filter((f) => f.type === "application/pdf");
    if (pdfFiles.length === 0) return toast.error("Invalid PDF selection");

    setFiles((prev) => [...prev, ...pdfFiles]);
    processFiles(pdfFiles);
  };

  const processFiles = async (newFiles: File[]) => {
    setIsProcessing(true);
    const toastId = toast.loading(`Extracting pages...`);

    try {
      const allNewPages: ProcessedPage[] = [];
      for (const file of newFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, canvas, viewport }).promise;
            const blob = await new Promise<Blob>((res) =>
              canvas.toBlob((b) => res(b!), format, 0.95),
            );
            allNewPages.push({
              fileName: file.name.replace(".pdf", ""),
              id: i,
              blob,
              preview: canvas.toDataURL(format),
            });
          }
        }
      }
      setPages((prev) => [...prev, ...allNewPages]);
      toast.success("Extraction complete", { id: toastId });
    } catch (e) {
      toast.error("Process failed", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (pages.length === 0) return;
    const ext = format === "image/jpeg" ? "jpg" : "png";

    if (pages.length === 1) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pages[0].blob);
      link.download = `${pages[0].fileName}-p${pages[0].id}.${ext}`;
      link.click();
    } else {
      const zipToast = toast.loading("Zipping assets...");
      const zip = new JSZip();
      pages.forEach((page) =>
        zip.file(`${page.fileName}/page-${page.id}.${ext}`, page.blob),
      );
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `pdf-export-bundle.zip`;
      link.click();

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#10b981", "#ffffff"],
      });
      toast.success("Archive Ready", { id: zipToast });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-0 md:p-6 lg:p-10 space-y-4 md:space-y-10">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between p-6 md:p-0 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="text-indigo-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Asset Extraction v4.0
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-[#1E1F4B] tracking-tighter leading-none">
            PDF to <span className="text-indigo-600">IMAGE</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase text-emerald-700">
            100% Client-Side
          </span>
        </div>
      </header>

      {/* --- CONTROL HUB --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 items-start">
        {/* Right Panel (Top on Mobile) */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 md:space-y-6 lg:sticky lg:top-10 px-0">
          <div className="bg-[#1E1F4B] p-6 md:p-10 rounded-none md:rounded-[48px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                  <Zap size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Export Deck
                </h2>
              </div>
              <button
                onClick={() => {
                  setFiles([]);
                  setPages([]);
                }}
                className="p-2 text-white/40 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">
                    Queue
                  </p>
                  <p className="text-2xl font-black text-white">
                    {files.length}{" "}
                    <span className="text-xs opacity-50">Docs</span>
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">
                    Total Pages
                  </p>
                  <p className="text-2xl font-black text-white">
                    {pages.length}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isProcessing || pages.length === 0}
                className="w-full py-5 md:py-7 bg-white text-[#1E1F4B] rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                Export Assets ({format.split("/")[1].toUpperCase()})
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 p-6 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <div className="p-2 bg-slate-50 rounded-lg">
              <ImageIcon className="text-slate-400" size={18} />
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-tight uppercase tracking-wider">
              High-DPI rendering enabled by default. 2.0x Scale factor active.
            </p>
          </div>
        </div>

        {/* Left Panel: Upload & Gallery */}
        <div className="lg:col-span-7 order-2 lg:order-1 space-y-4 px-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group mx-0 md:mx-0 border-2 border-dashed border-slate-200 rounded-none md:rounded-[48px] py-16 md:py-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <div className="p-6 bg-indigo-50 rounded-[32px] group-hover:scale-110 transition-transform mb-4">
              <Upload className="text-indigo-600" size={32} />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
              Load PDF Stream
            </p>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <AnimatePresence>
            {pages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 md:p-0">
                {pages.map((p, idx) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx}
                    className="group relative aspect-[3/4] rounded-2xl md:rounded-[32px] overflow-hidden border border-slate-100 bg-white shadow-sm"
                  >
                    <img
                      src={p.preview}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-[10px] text-white font-black truncate w-full">
                        {p.fileName}
                      </p>
                      <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1 tracking-widest">
                        Page {p.id}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
