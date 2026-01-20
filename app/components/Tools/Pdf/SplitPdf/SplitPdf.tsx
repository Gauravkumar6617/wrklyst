"use client";
import React, { useState, useEffect } from "react";
import {
  Scissors,
  FileText,
  Loader2,
  X,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
  Info,
  UploadCloud,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // Make sure to: npm install canvas-confetti

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSplit = async () => {
    if (!file || !range)
      return toast.error("Please provide a file and page range");

    setIsProcessing(true);
    setIsSuccess(false);
    const toastId = toast.loading("Slicing document into parts...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("range", range);

      const response = await fetch("/api/v1/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // --- THE MAGIC MOMENT ---
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F43F5E", "#FB7185", "#1E1F4B"], // Rose/Pink palette for Split tool
        });

        toast.success("Extraction complete!", { id: toastId });

        const result = await response.json();
        setTimeout(() => {
          router.push(
            `/download/${result.fileId || result.id}?name=split_document.pdf&tool=Split PDF`,
          );
        }, 1800); // Slightly longer delay to enjoy the glitter
      } else {
        throw new Error("Server Error");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to split", { id: toastId });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-black tracking-widest uppercase italic shadow-sm">
            Wrklyst Precision
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-[#1E1F4B] mt-4 tracking-tighter">
            Split & Extract <span className="text-rose-500">Pages</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Live Document Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden h-[75vh] flex flex-col relative group">
              {/* Subtle animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-3 font-black text-[#1E1F4B]">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <Eye size={18} className="text-rose-500" />
                  </div>
                  <span>Live Document View</span>
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
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="mb-6 opacity-40"
                    >
                      <FileText size={80} strokeWidth={1} />
                    </motion.div>
                    <p className="font-bold text-lg text-slate-400">
                      Upload a file to activate viewer
                    </p>
                    <p className="text-sm mt-2 font-medium opacity-60">
                      Visual splitting helps avoid mistakes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Control Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div
              className={`bg-[#1E1F4B] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden ring-1 transition-all duration-500 ${isSuccess ? "ring-emerald-500 ring-4" : "ring-white/10"}`}
            >
              {/* Background Icon Decoration */}
              <div className="absolute -top-10 -right-10 opacity-5 text-white">
                <Scissors size={200} />
              </div>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/20">
                  <Zap size={20} className="text-white" />
                </div>
                Split Setup
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
                    className="w-full py-16 border-2 border-dashed border-white/10 rounded-[32px] hover:bg-white/5 transition-all mb-6 cursor-pointer text-center group"
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-500/20 transition-all">
                      <UploadCloud className="text-slate-500 group-hover:text-rose-500 transition-colors" />
                    </div>
                    <p className="font-bold text-slate-400 group-hover:text-white">
                      Select PDF Document
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-[11px] font-black uppercase text-rose-400 tracking-[0.2em] block">
                          Extraction Range
                        </label>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[10px] font-black uppercase text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1"
                        >
                          <X size={12} /> Remove
                        </button>
                      </div>

                      <input
                        placeholder="e.g. 1-2, 5, 10-15"
                        className="w-full bg-[#1e1f4b] border-2 border-white/10 rounded-2xl p-5 text-white focus:border-rose-500 transition-all outline-none placeholder:text-slate-600 font-mono text-xl mb-4"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                      />

                      <div className="flex gap-3 text-slate-400 text-xs leading-relaxed italic">
                        <Info size={16} className="shrink-0 text-rose-500" />
                        <span>
                          Reference the Live View on the left to confirm page
                          numbers.
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSplit}
                      disabled={isProcessing || isSuccess || !file || !range}
                      className={`w-full py-7 rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 text-lg
                        ${isSuccess ? "bg-emerald-500 shadow-xl shadow-emerald-500/40 scale-[1.02]" : isProcessing ? "bg-slate-800" : "bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/30 active:scale-95"}
                      `}
                    >
                      {isSuccess ? (
                        <>
                          <CheckCircle2 className="animate-bounce" size={24} />
                          <span className="text-sm">
                            Glittering Success! Redirecting...
                          </span>
                        </>
                      ) : isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span>Slicing...</span>
                        </>
                      ) : (
                        <>Extract Selected Pages</>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-10 py-6 bg-white rounded-[40px] border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ShieldCheck className="text-emerald-500" size={20} />
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-tight uppercase tracking-tight">
                Military-grade local encryption active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
