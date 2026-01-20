"use client";
import React, { useState } from "react";
import {
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Table,
  Database,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function PdfToExcel() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    setIsSuccess(false);
    const toastId = toast.loading("Extracting tabular data...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf/to-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Extraction failed");

      const data = await response.json();

      if (data.fileId) {
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#107c10", "#5D5FEF", "#1E1F4B"], // Excel Green palette
        });

        toast.success("Tables extracted!", { id: toastId });

        const encodedName = encodeURIComponent(
          file.name.replace(".pdf", ".xlsx"),
        );
        setTimeout(() => {
          router.push(
            `/download/${data.fileId}?name=${encodedName}&tool=PDF to Excel`,
          );
        }, 1500);
      }
    } catch (err: any) {
      toast.error("Could not extract tables.", { id: toastId });
      setIsConverting(false);
    }
  };

  const relatedTools = [
    {
      title: "PDF to Word",
      icon: <FileText size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Merge PDF",
      icon: <Database size={20} />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "JSON Viewer",
      icon: <Database size={20} />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "PDF to CSV",
      icon: <Table size={20} />,
      color: "bg-slate-50 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-6">
      {/* MAIN WORKSPACE */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* LEFT: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black tracking-widest uppercase">
            Data Extraction Engine
          </span>
          <h1 className="text-6xl font-black text-[#1E1F4B] mt-6 leading-[1.1]">
            PDF to <br />
            <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">
              Excel XLSX.
            </span>
          </h1>
          <p className="text-slate-500 text-lg mt-8 max-w-md leading-relaxed">
            Automatically detect tables and convert complex PDF data into clean,
            formatted spreadsheets.
          </p>

          <div className="flex flex-col gap-4 mt-10">
            <div className="flex items-center gap-3 text-slate-800 font-bold">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Table size={20} />
              </div>
              <span>Preserves Cell Formatting</span>
            </div>
            <div className="flex items-center gap-3 text-slate-800 font-bold">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Zap size={20} />
              </div>
              <span>Multi-Page Table Recognition</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Tool Box */}
        <div
          className="relative"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer?.files[0];
            if (droppedFile?.type === "application/pdf") setFile(droppedFile);
          }}
        >
          <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`relative bg-white border ${isDragging ? "border-emerald-500 border-2" : "border-slate-100"} rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 min-h-[460px] flex flex-col justify-center transition-all`}
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <div
                  onClick={() => document.getElementById("excelInput")?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[40px] py-20 group hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer text-center"
                >
                  <input
                    type="file"
                    id="excelInput"
                    hidden
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                    <UploadCloud
                      className="text-slate-400 group-hover:text-emerald-600"
                      size={40}
                    />
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1F4B]">
                    Upload PDF Table
                  </h3>
                  <p className="text-slate-400 font-medium mt-2 text-lg">
                    or drag data here
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 p-6 bg-[#1E1F4B] rounded-[32px] text-white">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <FileSpreadsheet size={32} />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold truncate">{file.name}</p>
                      <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mt-1">
                        Table Detected
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
                    ${isSuccess ? "bg-emerald-500 text-white" : isConverting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.95]"}`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4 px-4">
                      {isSuccess ? (
                        <>
                          <CheckCircle2
                            className="animate-bounce shrink-0"
                            size={20}
                          />
                          <span className="text-sm md:text-xl">
                            Downloading Sheet...
                          </span>
                        </>
                      ) : isConverting ? (
                        <>
                          <Loader2
                            className="animate-spin shrink-0"
                            size={20}
                          />
                          <span className="text-sm md:text-xl">
                            Extracting...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm md:text-xl">
                            Convert to Excel
                          </span>
                          <FileSpreadsheet
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

      {/* RELATED TOOLS */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-black text-[#1E1F4B] mb-8">
          Data & Productivity Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedTools.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all cursor-pointer group"
            >
              <div
                className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {tool.icon}
              </div>
              <h4 className="font-bold text-[#1E1F4B] text-lg">{tool.title}</h4>
              <p className="text-slate-400 text-sm mt-1">Wrklyst Data</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
