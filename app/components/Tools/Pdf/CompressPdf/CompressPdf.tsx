"use client";
import React, { useState, useEffect } from "react";
import {
  Minimize2,
  FileText,
  Loader2,
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Info,
  UploadCloud,
  Eye,
  ArrowDownCircle,
  ChevronRight,
  Gauge,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState("medium"); // basic, medium, extreme
  const router = useRouter();

  // Handle PDF Preview Generation
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Cleanup memory
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleCompress = async () => {
    if (!file) return toast.error("Please upload a file first");

    setIsProcessing(true);
    setIsSuccess(false);
    const toastId = toast.loading("Shrinking document size...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", compressionLevel);

      const response = await fetch("/api/v1/pdf/compress", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        setIsSuccess(true);
        // --- THE GLITTER MOMENT ---
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#3B82F6", "#1E1F4B"], // Emerald and Blue palette
        });

        toast.success("Compression successful!", { id: toastId });

        setTimeout(() => {
          router.push(
            `/download/${result.fileId || result.id}?name=compressed_${file.name}&tool=Compress PDF`,
          );
        }, 2000);
      } else {
        throw new Error("Compression failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to compress", { id: toastId });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black tracking-widest uppercase italic shadow-sm">
            Wrklyst Optimizer
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-[#1E1F4B] mt-4 tracking-tighter">
            Compress <span className="text-emerald-500">PDF</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Live Preview Pane (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden h-[75vh] flex flex-col relative group">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-3 font-black text-[#1E1F4B]">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Eye size={18} className="text-emerald-600" />
                  </div>
                  <span>Quality Check</span>
                </div>
                {file && (
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 truncate max-w-[200px]">
                    {file.name}
                  </span>
                )}
              </div>

              <div className="flex-1 bg-slate-50 relative">
                {previewUrl ? (
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <motion.div
                      animate={{ scale: [1, 0.95, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="mb-6 opacity-40"
                    >
                      <Minimize2 size={80} strokeWidth={1} />
                    </motion.div>
                    <p className="font-bold text-lg text-slate-400">
                      Upload to preview quality
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Control Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div
              className={`bg-[#1E1F4B] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${isSuccess ? "ring-emerald-500 ring-4" : "ring-white/10"}`}
            >
              <div className="absolute -top-10 -right-10 opacity-5 text-white">
                <ArrowDownCircle size={200} />
              </div>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                  <Gauge size={20} className="text-white" />
                </div>
                Optimization Settings
              </h2>

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="w-full py-20 border-2 border-dashed border-white/10 rounded-[40px] hover:bg-white/5 transition-all mb-6 cursor-pointer text-center group"
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/20 transition-all">
                      <UploadCloud className="text-slate-500 group-hover:text-emerald-500" />
                    </div>
                    <p className="font-bold text-slate-400 group-hover:text-white uppercase tracking-widest text-xs">
                      Select PDF Document
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Compression Levels */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.2em] mb-2 block">
                        Select Intensity
                      </label>
                      {[
                        {
                          id: "basic",
                          label: "Basic Compression",
                          desc: "High Quality, Large size",
                          icon: "💎",
                        },
                        {
                          id: "medium",
                          label: "Recommended",
                          desc: "Good Quality, Great savings",
                          icon: "⚡",
                        },
                        {
                          id: "extreme",
                          label: "Extreme",
                          desc: "Lower Quality, Tiny size",
                          icon: "🌪️",
                        },
                      ].map((level) => (
                        <div
                          key={level.id}
                          onClick={() => setCompressionLevel(level.id)}
                          className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${compressionLevel === level.id ? "border-emerald-500 bg-emerald-500/10" : "border-white/5 bg-white/5 hover:bg-white/10"}`}
                        >
                          <span className="text-2xl">{level.icon}</span>
                          <div className="flex-1">
                            <span className="font-bold text-sm block">
                              {level.label}
                            </span>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                              {level.desc}
                            </p>
                          </div>
                          {compressionLevel === level.id && (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between text-xs mb-3">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">
                          Initial Weight
                        </span>
                        <span className="font-mono text-emerald-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              compressionLevel === "basic"
                                ? "30%"
                                : compressionLevel === "medium"
                                  ? "60%"
                                  : "90%",
                          }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCompress}
                      disabled={isProcessing || isSuccess}
                      className={`w-full py-7 rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 text-lg
                        ${isSuccess ? "bg-emerald-500 shadow-xl shadow-emerald-500/40 scale-[1.02]" : isProcessing ? "bg-slate-800" : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-xl shadow-emerald-500/20"}
                      `}
                    >
                      {isSuccess ? (
                        <>
                          <CheckCircle2 className="animate-bounce" size={24} />
                          <span className="text-sm">Glittering Success!</span>
                        </>
                      ) : isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span>Optimizing...</span>
                        </>
                      ) : (
                        <>Compress PDF</>
                      )}
                    </button>

                    <button
                      onClick={() => setFile(null)}
                      className="w-full text-[10px] font-black uppercase text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      Change Document
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-10 py-6 bg-white rounded-[40px] border border-slate-100 flex items-center gap-4 shadow-sm">
              <ShieldCheck className="text-emerald-500" size={24} />
              <p className="text-[11px] text-slate-500 font-bold uppercase leading-tight tracking-tight">
                Smart-Compress: Data remains 100% private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
