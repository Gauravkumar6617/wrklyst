"use client";
import React, { useState, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  ImageIcon,
  RefreshCcw,
  ShieldCheck,
  Sliders,
  Zap,
  FileWarning,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ConverterProps {
  defaultTarget?: string;
  title?: string;
  isOptimizer?: boolean;
}

export default function ImageConverter({
  defaultTarget = "image/png",
  title,
  isOptimizer = false,
}: ConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState(defaultTarget);
  const [quality, setQuality] = useState(isOptimizer ? 0.7 : 0.92);
  const [isConverting, setIsConverting] = useState(false);
  const [stats, setStats] = useState<{
    original: number;
    compressed: number | null;
  }>({
    original: 0,
    compressed: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTargetFormat(defaultTarget);
  }, [defaultTarget]);

  // Format bytes to readable string
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStats({ original: selectedFile.size, compressed: null });
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const processImage = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
        initialQuality: quality,
        fileType: targetFormat as any,
      };

      // Advanced Compression
      const compressedBlob = await imageCompression(file, options);
      setStats((prev) => ({ ...prev, compressed: compressedBlob.size }));

      // Trigger Download
      const downloadUrl = URL.createObjectURL(compressedBlob);
      const link = document.createElement("a");
      let ext = targetFormat.split("/")[1];
      if (ext === "jpeg") ext = "jpg";

      link.download = `${file.name.split(".")[0]}-wrklyst.${ext}`;
      link.href = downloadUrl;
      link.click();

      const savings = Math.round((1 - compressedBlob.size / file.size) * 100);
      toast.success(
        savings > 0 ? `Saved ${savings}% in file size!` : "Image Optimized!"
      );
    } catch (error) {
      console.error(error);
      toast.error("Error processing image.");
    } finally {
      setIsConverting(false);
    }
  };

  const savingsPercent = stats.compressed
    ? Math.round((1 - stats.compressed / stats.original) * 100)
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5D5FEF]/10 rounded-lg text-[#5D5FEF]">
            <ImageIcon size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
            {title || "Pro Image Tool"}
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span className="text-[9px] font-black uppercase text-emerald-600">
            Secure Offline Processing
          </span>
        </div>
      </div>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-80 border-4 border-dashed border-slate-100 rounded-[48px] flex flex-col items-center justify-center gap-4 hover:border-[#5D5FEF]/20 hover:bg-slate-50 transition-all cursor-pointer group"
        >
          <Upload
            className="text-slate-300 group-hover:text-[#5D5FEF] transition-colors"
            size={48}
          />
          <div className="text-center">
            <p className="font-black text-slate-600">Upload to Optimize</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-widest italic">
              Your data never leaves your browser
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Area */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-[40px] border border-slate-100 flex items-center justify-center relative min-h-[320px]">
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 rounded-2xl shadow-2xl object-contain"
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                }}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors"
              >
                <RefreshCcw size={16} />
              </button>
            </div>

            {/* Size Stats Badge */}
            <div className="flex flex-wrap gap-2">
              <div className="px-4 py-2 bg-slate-100 rounded-2xl text-[11px] font-bold text-slate-600">
                Original: {formatSize(stats.original)}
              </div>
              {stats.compressed && (
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] font-bold text-emerald-600 flex items-center gap-2">
                  <Zap size={12} fill="currentColor" />
                  Optimized: {formatSize(stats.compressed)} ({savingsPercent}%
                  smaller)
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            {/* Quality Slider */}
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={12} /> Compression Level
                </label>
                <span className="text-xs font-black text-[#5D5FEF]">
                  {Math.round(quality * 100)}% Quality
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D5FEF]"
              />
              <p className="text-[9px] text-slate-400 font-medium italic px-2">
                Lower quality = smaller file size. Recommended: 70-80%
              </p>
            </div>

            <div className="bg-white p-8 border-2 border-slate-50 rounded-[40px] shadow-sm space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Output Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["image/png", "image/jpeg", "image/webp", "image/bmp"].map(
                  (fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        targetFormat === fmt
                          ? "bg-[#5D5FEF] text-white shadow-lg"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {fmt.split("/")[1]}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              onClick={processImage}
              disabled={isConverting}
              className="w-full py-6 bg-[#1E1F4B] text-white rounded-[32px] font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-[#5D5FEF] transition-all shadow-xl disabled:opacity-50"
            >
              {isConverting ? "Optimizing..." : `Process & Download`}
              <Download size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
