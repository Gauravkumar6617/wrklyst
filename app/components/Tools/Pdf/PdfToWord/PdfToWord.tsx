"use client";
import React, { useState } from "react";
import {
  FileText,
  Loader2,
  UploadCloud,
  X,
  ShieldCheck,
  Zap,
  Laptop,
  ArrowRight,
  CheckCircle2,
  FileType,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function PdfToWord() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    setIsSuccess(false);
    const toastId = toast.loading("Optimizing for Microsoft Word...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf/to-word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Conversion failed");
      }

      const data = await response.json();

      if (data.fileId) {
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#5D5FEF", "#1E1F4B"],
        });

        toast.success("Document processed!", { id: toastId });

        const encodedName = encodeURIComponent(
          file.name.replace(".pdf", ".docx"),
        );
        setTimeout(() => {
          router.push(
            `/download/${data.fileId}?name=${encodedName}&tool=PDF to Word`,
          );
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.message || "Could not convert file.", { id: toastId });
      setIsConverting(false);
    }
  };

  const relatedTools = [
    {
      title: "PDF to PPTX",
      icon: <FileType size={20} />,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Word to PDF",
      icon: <FileText size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Merge PDF",
      icon: <Zap size={20} />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Unlock PDF",
      icon: <ShieldCheck size={20} />,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-6">
      {/* MAIN WORKSPACE SECTION */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* LEFT: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-black tracking-widest uppercase">
            Word OCR Engine
          </span>
          <h1 className="text-6xl font-black text-[#1E1F4B] mt-6 leading-[1.1]">
            PDF to <br />
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
              Word Doc.
            </span>
          </h1>
          <p className="text-slate-500 text-lg mt-8 max-w-md leading-relaxed">
            Instantly turn un-editable PDFs into Microsoft Word documents with
            perfect formatting and layout retention.
          </p>

          <div className="flex items-center gap-8 mt-10">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="text-blue-500" size={24} />
              <span>Secure Data</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Zap className="text-blue-500" size={24} />
              <span>AI Accuracy</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: The Tool Box */}
        <div
          className="relative"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`relative bg-white border ${isDragging ? "border-blue-500 border-2" : "border-slate-100"} rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 min-h-[460px] flex flex-col justify-center transition-all`}
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <div
                  onClick={() => document.getElementById("wordInput")?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[40px] py-20 group hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer text-center"
                >
                  <input
                    type="file"
                    id="wordInput"
                    hidden
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                    <UploadCloud
                      className="text-slate-400 group-hover:text-blue-600"
                      size={40}
                    />
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1F4B]">
                    Select PDF
                  </h3>
                  <p className="text-slate-400 font-medium mt-2 text-lg">
                    or drop file here
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 p-6 bg-[#1E1F4B] rounded-[32px] text-white">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <FileText size={32} />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold truncate">{file.name}</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <X
                      className="cursor-pointer opacity-50 hover:opacity-100"
                      onClick={() => setFile(null)}
                    />
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={isConverting || isSuccess}
                    className={`group relative w-full py-5 md:py-8 overflow-hidden rounded-[24px] md:rounded-[32px] font-black uppercase tracking-wider transition-all
                    ${isSuccess ? "bg-emerald-500 text-white" : isConverting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:scale-[0.95]"}`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4 px-4">
                      {isSuccess ? (
                        <>
                          <CheckCircle2
                            className="animate-bounce shrink-0"
                            size={20}
                          />
                          <span className="text-sm md:text-xl">
                            Redirecting...
                          </span>
                        </>
                      ) : isConverting ? (
                        <>
                          <Loader2
                            className="animate-spin shrink-0"
                            size={20}
                          />
                          <span className="text-sm md:text-xl">
                            Magician at work...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm md:text-xl">
                            Convert to Word
                          </span>
                          <FileText
                            className="group-hover:rotate-12 transition-transform shrink-0"
                            size={20}
                          />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* RELATED TOOLS SECTION */}
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[#1E1F4B]">
            Other PDF Utilities
          </h2>
          <button className="flex items-center gap-2 text-[#5D5FEF] font-bold hover:gap-4 transition-all">
            All Tools <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedTools.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all cursor-pointer group"
            >
              <div
                className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {tool.icon}
              </div>
              <h4 className="font-bold text-[#1E1F4B] text-lg">{tool.title}</h4>
              <p className="text-slate-400 text-sm mt-1">Wrklyst Pro</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
