"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Lock,
  Upload,
  Loader2,
  ShieldAlert,
  FileLock2,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  Info,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Feature: Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleProtect = async () => {
    if (!file || !password) return toast.error("File and password required");
    setIsProcessing(true);
    setIsSuccess(false);
    const toastId = toast.loading("Encrypting your document...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch("/api/v1/pdf/protect", {
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
          colors: ["#6366f1", "#10b981", "#1E1F4B"],
        });
        toast.success("PDF Protected!", { id: toastId });
        setTimeout(() => {
          router.push(
            `/download/${result.fileId}?name=protected_${file.name}&tool=Protect PDF`,
          );
        }, 1800);
      } else {
        throw new Error(result.error || "Encryption failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile?.type === "application/pdf") setFile(selectedFile);
  };

  return (
    /* Outer wrapper: p-0 on mobile, py-12 px-6 on desktop */
    <div className="min-h-screen bg-[#F8FAFC] p-0 md:py-12 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header: Centered and scaled for mobile */}
        <header className="mb-6 md:mb-12 p-6 md:p-0 text-center md:text-left">
          <span className="px-3 py-1 md:px-4 md:py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase shadow-sm">
            Wrklyst Security
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1E1F4B] mt-4 tracking-tighter">
            Protect <span className="text-indigo-600">PDF</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 items-start">
          {/* LEFT: Live Preview Pane */}
          <div className="lg:col-span-7 order-2 lg:order-1 px-4 md:px-0 mb-8 lg:mb-0">
            <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden h-[50vh] md:h-[75vh] flex flex-col relative">
              <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-2 md:gap-3 font-black text-[#1E1F4B]">
                  <div className="p-1.5 md:p-2 bg-indigo-50 rounded-lg">
                    <Lock size={16} className="text-indigo-600" />
                  </div>
                  <span className="text-sm md:text-base">Preview</span>
                </div>
                {file && (
                  <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 truncate max-w-[200px]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
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
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 px-10 text-center">
                    <motion.div
                      animate={{ scale: [1, 0.95, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="mb-4 opacity-40"
                    >
                      <FileLock2
                        strokeWidth={1}
                        className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
                      />
                    </motion.div>
                    <p className="font-bold text-slate-400">
                      Lock it to see it
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Control Panel */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 md:space-y-6 lg:sticky lg:top-12 px-0 md:px-0">
            <div
              className={`bg-[#1E1F4B] p-6 md:p-10 rounded-none md:rounded-[48px] text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${isSuccess ? "ring-emerald-500 ring-4" : "ring-white/10"}`}
            >
              <div className="absolute -top-10 -right-10 opacity-5 text-white pointer-events-none">
                <ShieldAlert size={200} />
              </div>

              <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-indigo-500 rounded-xl">
                  <Zap size={18} className="text-white" />
                </div>
                Vault Settings
              </h2>

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full py-12 md:py-20 border-2 border-dashed rounded-[32px] md:rounded-[40px] transition-all mb-4 cursor-pointer text-center group
                      ${isDragging ? "bg-indigo-500/20 border-indigo-400" : "border-white/10 hover:bg-white/5"}`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="text-slate-500 group-hover:text-indigo-500" />
                    </div>
                    <p className="font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest">
                      {isDragging ? "Drop PDF Now" : "Select PDF to Secure"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 md:space-y-6 relative z-10"
                  >
                    <div className="bg-white/5 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <label className="text-[9px] md:text-[11px] font-black uppercase text-indigo-400 tracking-[0.2em]">
                          Password
                        </label>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[9px] font-black uppercase text-rose-500"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Your secret key..."
                          className="w-full bg-[#1e1f4b]/50 border-2 border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 outline-none text-base md:text-lg mb-2"
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

                      {/* Password Strength Meter */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Strength</span>
                          <span
                            className={
                              passwordStrength > 75
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }
                          >
                            {passwordStrength === 0
                              ? "None"
                              : passwordStrength < 50
                                ? "Weak"
                                : passwordStrength < 100
                                  ? "Medium"
                                  : "Bulletproof"}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            className={`h-full ${passwordStrength > 75 ? "bg-emerald-500" : "bg-indigo-500"}`}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleProtect}
                      disabled={isProcessing || isSuccess || !password}
                      className={`w-full py-5 md:py-7 rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 text-sm md:text-lg
                        ${isSuccess ? "bg-emerald-500" : isProcessing ? "bg-slate-800" : "bg-indigo-600 active:scale-95"}
                      `}
                    >
                      {isSuccess ? (
                        <CheckCircle2 size={24} />
                      ) : isProcessing ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        "Lock PDF"
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Footer Info */}
            <div className="mx-4 md:mx-0 px-6 py-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm mb-10 lg:mb-0">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Files are processed locally and deleted after 60 mins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
