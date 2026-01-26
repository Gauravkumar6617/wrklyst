"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  LockOpen,
  Unlock,
  Upload,
  Loader2,
  Key,
  FileKey2,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  ShieldCheck,
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
    const toastId = toast.loading("Unlocking document...");

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
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#1E1F4B"],
        });
        toast.success("PDF Unlocked!", { id: toastId });
        setTimeout(() => {
          router.push(
            `/download/${result.fileId}?name=unlocked_${file.name}&tool=Unlock PDF`,
          );
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to unlock PDF");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid password", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    /* Outer Container: p-0 for mobile edge-to-edge feel */
    <div className="min-h-screen bg-[#F8FAFC] p-0 md:py-12 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header: Centered on mobile */}
        <header className="mb-6 md:mb-12 p-6 md:p-0 text-center md:text-left">
          <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black tracking-widest uppercase italic shadow-sm">
            Wrklyst Access
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1E1F4B] mt-3 tracking-tighter">
            Unlock <span className="text-amber-500">PDF</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 items-start">
          {/* RIGHT (Moved to Top on Mobile): Control Panel */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 md:space-y-6 lg:sticky lg:top-12">
            <div
              className={`bg-[#1E1F4B] p-6 md:p-10 rounded-none md:rounded-[48px] text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${isSuccess ? "ring-emerald-500 ring-4" : "ring-white/10"}`}
            >
              <div className="absolute -top-10 -right-10 opacity-5 text-white pointer-events-none">
                <LockOpen size={200} />
              </div>

              <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Zap size={18} className="text-white" />
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
                    className="w-full py-12 md:py-20 border-2 border-dashed border-white/10 rounded-[32px] md:rounded-[40px] hover:bg-white/5 transition-all mb-4 cursor-pointer text-center group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20">
                      <Upload
                        className="text-slate-500 group-hover:text-amber-500"
                        size={24}
                      />
                    </div>
                    <p className="font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest">
                      Upload Locked PDF
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 md:space-y-6 relative z-10"
                  >
                    <div className="bg-white/5 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <label className="text-[9px] md:text-[11px] font-black uppercase text-amber-400 tracking-[0.2em]">
                          PDF Password
                        </label>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[9px] font-black uppercase text-rose-400"
                        >
                          Change
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Secret key..."
                          className="w-full bg-[#1e1f4b] border-2 border-white/10 rounded-xl p-4 text-white focus:border-amber-500 transition-all outline-none text-base md:text-lg mb-2"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-slate-500"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <div className="flex gap-2 text-slate-400 text-[9px] md:text-[10px] italic mt-4 leading-snug">
                        <Key size={12} className="shrink-0 text-amber-500" />
                        <span>
                          Authorized access only. We do not store keys.
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleUnlock}
                      disabled={isProcessing || isSuccess || !password}
                      className={`w-full py-5 md:py-7 rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 text-sm md:text-lg
                        ${isSuccess ? "bg-emerald-500" : isProcessing ? "bg-slate-800" : "bg-amber-500 active:scale-95 shadow-xl shadow-amber-500/20"}
                      `}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Decrypting...</span>
                        </>
                      ) : isSuccess ? (
                        "Success!"
                      ) : (
                        "Remove Security"
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mx-4 md:mx-0 px-6 py-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
              <ShieldCheck className="text-amber-600 shrink-0" size={20} />
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Permanent password removal. Document will be shareable
                instantly.
              </p>
            </div>
          </div>

          {/* LEFT (Below on Mobile): Preview Pane */}
          <div className="lg:col-span-7 order-2 lg:order-1 px-4 md:px-0 mt-6 lg:mt-0">
            <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden h-[50vh] md:h-[75vh] flex flex-col relative">
              <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-2 font-black text-[#1E1F4B]">
                  <Unlock size={16} className="text-amber-600" />
                  <span className="text-sm md:text-base">Access Preview</span>
                </div>
                {file && (
                  <span className="hidden sm:inline-block text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 truncate max-w-[180px]">
                    {file.name}
                  </span>
                )}
              </div>

              <div className="flex-1 bg-slate-50 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="opacity-20 mb-4"
                    >
                      <FileKey2
                        className="w-16 h-16 md:w-20 md:h-20"
                        strokeWidth={1}
                      />
                    </motion.div>
                    <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Waiting for file
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
