"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  LockOpen,
  Unlock,
  Upload,
  X,
  Loader2,
  Key,
  FileKey2,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleUnlock = async () => {
    if (!file || !password)
      return toast.error("Please provide both file and password");

    setIsProcessing(true);
    const toastId = toast.loading("Unlocking your document...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch("/api/v1/pdf/unlock", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#10b981", "#1E1F4B"], // Indigo and Emerald
        });
        toast.success("PDF Decrypted Successfully!", { id: toastId });
        router.push(
          `/download/${result.fileId}?name=unlocked_${file.name}&tool=Unlock PDF`,
        );
      } else {
        throw new Error(result.message || "Failed to unlock PDF");
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="px-4 py-1.5 bg-amber-100 text-amber-600 rounded-full text-xs font-black tracking-widest uppercase italic shadow-sm">
            Wrklyst Access
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-[#1E1F4B] mt-4 tracking-tighter">
            Unlock <span className="text-amber-500">PDF</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Live Preview (Shows a locked state until unlocked) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden h-[75vh] flex flex-col relative">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-3 font-black text-[#1E1F4B]">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Unlock size={18} className="text-amber-600" />
                  </div>
                  <span>Access Preview</span>
                </div>
                {file && (
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 truncate max-w-[200px]">
                    {file.name}
                  </span>
                )}
              </div>

              <div className="flex-1 bg-slate-50 relative flex items-center justify-center">
                {previewUrl ? (
                  <div className="w-full h-full relative group">
                    {/* The iframe will usually show a native "Password Required" screen */}
                    <iframe
                      src={`${previewUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-full border-none"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 px-10 text-center">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                      className="mb-6 opacity-40"
                    >
                      <FileKey2 size={80} strokeWidth={1} />
                    </motion.div>
                    <p className="font-bold text-lg text-[#1E1F4B]">
                      Protected files require a key
                    </p>
                    <p className="text-sm mt-2 font-medium opacity-60 max-w-xs">
                      Upload the encrypted document to begin the decryption
                      process.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Control Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div
              className={`bg-[#1E1F4B] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${isSuccess ? "ring-emerald-500 ring-4" : "ring-white/10"}`}
            >
              <div className="absolute -top-10 -right-10 opacity-5 text-white">
                <LockOpen size={200} />
              </div>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                  <Zap size={20} className="text-white" />
                </div>
                Decryption Key
              </h2>

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-20 border-2 border-dashed border-white/10 rounded-[40px] hover:bg-white/5 transition-all mb-6 cursor-pointer text-center group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-all">
                      <Upload className="text-slate-500 group-hover:text-amber-500" />
                    </div>
                    <p className="font-bold text-slate-400 group-hover:text-white uppercase tracking-widest text-xs">
                      Upload Locked PDF
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-[11px] font-black uppercase text-amber-400 tracking-[0.2em] block">
                          Enter Current Password
                        </label>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[10px] font-black uppercase text-slate-500 hover:text-amber-500 transition-colors"
                        >
                          Change File
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password of the PDF"
                          className="w-full bg-[#1e1f4b] border-2 border-white/10 rounded-2xl p-5 text-white focus:border-amber-500 transition-all outline-none placeholder:text-slate-600 font-bold text-lg mb-2"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-5 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      <div className="flex gap-3 text-slate-400 text-[10px] leading-relaxed italic mt-4">
                        <Key size={14} className="shrink-0 text-amber-500" />
                        <span>
                          You must have the legal right to unlock this document.
                          We do not support brute-force cracking.
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleUnlock}
                      disabled={isProcessing || isSuccess || !password}
                      className={`w-full py-7 rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 text-lg
                        ${isSuccess ? "bg-emerald-500 shadow-xl shadow-emerald-500/40 scale-[1.02]" : isProcessing ? "bg-slate-800" : "bg-amber-500 hover:bg-amber-600 active:scale-95 shadow-xl shadow-amber-500/20"}
                      `}
                    >
                      {isSuccess ? (
                        <>
                          <CheckCircle2 className="animate-bounce" size={24} />
                          <span className="text-sm uppercase">
                            Success! Unlocked.
                          </span>
                        </>
                      ) : isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span>Unlocking...</span>
                        </>
                      ) : (
                        <>Remove Password</>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-10 py-6 bg-white rounded-[40px] border border-slate-100 flex items-center gap-4 shadow-sm">
              <div className="p-2 bg-amber-50 rounded-lg">
                <ShieldCheck className="text-amber-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-[#1E1F4B] font-black uppercase tracking-tight">
                  Authenticated Removal
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">
                  This tool permanently removes encryption so you can share
                  without a key.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
