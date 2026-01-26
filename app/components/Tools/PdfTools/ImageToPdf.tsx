"use client";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  X,
  Image as ImageIcon,
  Trash2,
  MoveUp,
  MoveDown,
  ShieldCheck,
  Layers,
  FileStack,
  Sliders,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Fixed Type Interfaces
interface ImageData {
  file: File;
  preview: string;
  id: string;
}

interface StatProps {
  label: string;
  value: string | number;
}

export default function ImageToPdfStudio() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.85);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validImages = selectedFiles.filter((f) =>
      f.type.startsWith("image/"),
    );

    if (validImages.length === 0) return toast.error("Invalid file types");

    const newImages = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    const toastId = toast.loading("Synthesizing PDF...");

    try {
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgData = await getImageData(img.preview);
        if (i !== 0) pdf.addPage();

        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;
        let printWidth = pageWidth - 20;
        let printHeight = printWidth / ratio;

        if (printHeight > pageHeight - 20) {
          printHeight = pageHeight - 20;
          printWidth = printHeight * ratio;
        }
        pdf.addImage(imgData, "JPEG", 10, 10, printWidth, printHeight);
      }

      pdf.save("wrklyst-doc.pdf");
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#10b981", "#ffffff"],
      });
      toast.success("Document Generated", { id: toastId });
    } catch (error) {
      toast.error("Process failed", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const getImageData = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = url;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-0 md:p-6 lg:p-10 space-y-4 md:space-y-10">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between p-6 md:p-0 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="text-indigo-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              PDF Mastering Tool
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-[#1E1F4B] tracking-tighter">
            Image to <span className="text-indigo-600">PDF</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full w-fit border border-emerald-500/20">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase text-emerald-700">
            Client-Side Secure
          </span>
        </div>
      </header>

      {/* --- WORKSTATION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 items-start">
        {/* RIGHT: Export Center (Top on Mobile) */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 md:space-y-6 lg:sticky lg:top-10 px-0">
          <div className="bg-[#1E1F4B] p-6 md:p-10 rounded-none md:rounded-[48px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500 rounded-xl">
                  <FileStack size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Export Center
                </h2>
              </div>
              <div className="text-[10px] font-mono text-indigo-300 bg-white/5 px-2 py-1 rounded">
                v2.1
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Page Count" value={images.length} />
                <StatCard label="DPI Profile" value="High Res" />
              </div>

              {/* Detail: Quality Slider */}
              <div className="space-y-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-indigo-300 tracking-widest flex items-center gap-2">
                    <Sliders size={14} /> Export Quality
                  </label>
                  <span className="text-lg font-black tabular-nums">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <button
                onClick={generatePdf}
                disabled={isProcessing || images.length === 0}
                className="w-full py-5 bg-white text-[#1E1F4B] rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                Generate Document
              </button>
            </div>
          </div>

          <div className="mx-4 md:mx-0 p-5 bg-white rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
              <ImageIcon size={18} />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-tight">
              A4 Standards Applied automatically.
            </p>
          </div>
        </div>

        {/* LEFT: Image Assembly (Below on Mobile) */}
        <div className="lg:col-span-7 order-2 lg:order-1 space-y-4 px-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group mx-0 md:mx-0 border-2 border-dashed border-slate-200 rounded-none md:rounded-[48px] py-16 md:py-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <div className="p-5 bg-indigo-50 rounded-3xl group-hover:scale-110 transition-transform mb-4">
              <Upload className="text-indigo-600" size={32} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">
              Import Frames
            </p>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <AnimatePresence>
            <div className="space-y-3 pb-24 px-4 md:px-0">
              {images.map((img, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={img.id}
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm relative group"
                >
                  <div className="text-[10px] font-black text-slate-300 w-4 tabular-nums">
                    {idx + 1}
                  </div>
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 border border-slate-50 shrink-0">
                    <img
                      src={img.preview}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-xs font-black text-slate-800 truncate uppercase tracking-tight">
                      {img.file.name}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase">
                      Size: {(img.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col md:flex-row gap-1">
                      <button
                        onClick={() => moveImage(idx, "up")}
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={() => moveImage(idx, "down")}
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                      >
                        <MoveDown size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 text-rose-300 hover:text-rose-500 transition-colors ml-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: StatProps) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
      <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-lg font-black text-white tabular-nums">{value}</p>
    </div>
  );
}
