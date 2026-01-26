"use client";
import React, { useState, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import {
  Upload,
  Download,
  ImageIcon,
  RefreshCcw,
  ShieldCheck,
  Sliders,
  Zap,
  X,
  CheckCircle2,
  Loader2,
  Layers,
  HardDrive,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ConverterProps {
  defaultTarget?: string;
  title?: string;
  isOptimizer?: boolean;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "completed" | "error";
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
}

export default function ImageConverter({
  defaultTarget = "image/png",
  title,
  isOptimizer = false,
}: ConverterProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [targetFormat, setTargetFormat] = useState(defaultTarget);
  const [quality, setQuality] = useState(isOptimizer ? 0.7 : 0.92);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTargetFormat(defaultTarget);
  }, [defaultTarget]);

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizes = ["B", "KB", "MB"];
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newImages: ImageFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
      originalSize: file.size,
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === "completed") continue;
      updatedImages[i].status = "processing";
      setImages([...updatedImages]);
      try {
        const options = {
          maxSizeMB: 2,
          useWebWorker: true,
          initialQuality: quality,
          fileType: targetFormat as any,
        };
        const compressedBlob = await imageCompression(
          updatedImages[i].file,
          options,
        );
        updatedImages[i].compressedSize = compressedBlob.size;
        updatedImages[i].compressedBlob = compressedBlob;
        updatedImages[i].status = "completed";
      } catch (error) {
        updatedImages[i].status = "error";
      }
      setImages([...updatedImages]);
    }
    setIsProcessingAll(false);
    toast.success("Batch Complete");
  };

  const handleDownload = async () => {
    const completed = images.filter((img) => img.compressedBlob);
    if (completed.length === 0) return;
    if (completed.length === 1) {
      const img = completed[0];
      const ext = targetFormat.split("/")[1].replace("jpeg", "jpg");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(img.compressedBlob!);
      link.download = `optimized-${img.file.name.split(".")[0]}.${ext}`;
      link.click();
    } else {
      const zip = new JSZip();
      completed.forEach((img) => {
        const ext = targetFormat.split("/")[1].replace("jpeg", "jpg");
        zip.file(`${img.file.name.split(".")[0]}.${ext}`, img.compressedBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `wrklyst-batch.zip`;
      link.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-0 md:p-6 lg:p-10 space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between p-6 md:p-0 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-indigo-500" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Processing Engine
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
            Image <span className="text-indigo-600">Studio</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full w-fit border border-emerald-500/20">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase text-emerald-700">
            Client-Side Only
          </span>
        </div>
      </div>

      {/* --- CONTROL HUB --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-6 bg-slate-900 md:bg-transparent rounded-none md:rounded-0">
        {/* Settings Module */}
        <div className="lg:col-span-7 p-6 md:p-10 bg-slate-900 text-white rounded-none md:rounded-[48px] shadow-2xl space-y-8 border border-white/5">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                <Sliders size={14} /> Quality Profile
              </label>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {quality > 0.8
                  ? "Lossless Priority"
                  : quality > 0.4
                    ? "Balanced Load"
                    : "High Compression"}
              </p>
            </div>
            <div className="text-3xl font-black text-white tabular-nums">
              {Math.round(quality * 100)}%
            </div>
          </div>

          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["image/png", "image/jpeg", "image/webp", "image/bmp"].map(
              (fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    targetFormat === fmt
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                  }`}
                >
                  {fmt.split("/")[1].replace("jpeg", "jpg")}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Global Stats Module */}
        <div className="lg:col-span-5 p-6 md:p-10 bg-white border border-slate-200 rounded-none md:rounded-[48px] shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <HardDrive size={18} className="text-slate-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Storage Overview
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Total Files
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {images.length}
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl">
                <p className="text-[9px] font-black text-indigo-400 uppercase">
                  Ready
                </p>
                <p className="text-2xl font-black text-indigo-600">
                  {images.filter((i) => i.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={processAll}
            disabled={isProcessingAll || images.length === 0}
            className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30"
          >
            {isProcessingAll ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Zap size={16} />
            )}
            Initialize Batch
          </button>
        </div>
      </div>

      {/* --- UPLOAD & LIST --- */}
      <div className="px-4 md:px-0 space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-12 md:py-20 border-2 border-dashed border-slate-200 rounded-[32px] md:rounded-[48px] flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-all cursor-pointer group"
        >
          <div className="p-5 bg-white shadow-sm rounded-3xl group-hover:scale-110 transition-transform">
            <Upload className="text-indigo-600" size={32} />
          </div>
          <p className="font-black text-slate-400 text-[10px] md:text-xs uppercase tracking-[0.2em]">
            Drop Media Payload
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-24">
            <AnimatePresence>
              {images.map((img) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={img.id}
                  className="p-3 bg-white border border-slate-200 rounded-3xl flex items-center gap-4 relative group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={img.preview}
                      className="w-full h-full object-cover"
                      alt="prev"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-800 truncate uppercase tracking-tight">
                      {img.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-slate-400">
                        {formatSize(img.originalSize)}
                      </span>
                      <ArrowRight size={10} className="text-slate-300" />
                      <span className="text-[10px] font-black text-indigo-600">
                        {img.compressedSize
                          ? formatSize(img.compressedSize)
                          : "..."}
                      </span>
                    </div>
                  </div>

                  {img.compressedSize && (
                    <div className="bg-emerald-500/10 px-2 py-1 rounded text-[9px] font-black text-emerald-600">
                      -
                      {Math.round(
                        (1 - img.compressedSize / img.originalSize) * 100,
                      )}
                      %
                    </div>
                  )}

                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-2 text-slate-300 hover:text-rose-500"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* --- STICKY FOOTER ACTION --- */}
      {images.some((i) => i.status === "completed") && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
          <button
            onClick={handleDownload}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Download size={18} />
            Export {images.filter((i) => i.status === "completed").length}{" "}
            Optimized Assets
          </button>
        </div>
      )}
    </div>
  );
}
