"use client";
import React, { useState } from "react";
import {
  Presentation,
  Loader2,
  UploadCloud,
  FileText,
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileVideo,
  FileJson,
  Languages,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // Install: npm install canvas-confetti
import { useRouter } from "next/navigation";
export default function PdfToPpt() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  // 1. Ensure onDrop is correctly updating state
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  // 1. Add a new state
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setIsSuccess(false); // Reset success on new attempt
    const toastId = toast.loading("Analyzing PDF structure...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf/to-pptx", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.fileId) {
        // SET SUCCESS TO TRUE HERE
        setIsSuccess(true);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#5D5FEF", "#FF8A00", "#1E1F4B"],
        });

        toast.success("Slides generated successfully!", { id: toastId });

        setTimeout(() => {
          router.push(
            `/download/${data.fileId}?name=${encodeURIComponent(data.fileName)}&tool=PDF to PPTX`,
          );
        }, 1500);
      }
    } catch (err) {
      console.error("Conversion error:", err);
      toast.error("Conversion failed. Please try again.", { id: toastId });
      setIsConverting(false); // Only reset converting if it fails
    }
    // REMOVED: finally { setIsConverting(false) }
    // We want to keep it in the 'converting' or 'success' state until we leave the page
  };
  const relatedTools = [
    {
      title: "PDF to Word",
      icon: <FileText size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "PPT to Video",
      icon: <FileVideo size={20} />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "JSON Viewer",
      icon: <FileJson size={20} />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Translator",
      icon: <Languages size={20} />,
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
          <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black tracking-widest uppercase">
            AI Document Engine
          </span>
          <h1 className="text-6xl font-black text-[#1E1F4B] mt-6 leading-[1.1]">
            Your PDF, <br />
            <span className="text-orange-500 underline decoration-orange-200 underline-offset-8">
              Now Re-Editable.
            </span>
          </h1>
          <p className="text-slate-500 text-lg mt-8 max-w-md leading-relaxed">
            Don't just view documents. Own them. Convert static PDFs into
            professional, high-fidelity slide decks in seconds.
          </p>

          <div className="flex items-center gap-8 mt-10">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="text-orange-500" size={24} />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Zap className="text-orange-500" size={24} />
              <span>Instant Build</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: The Tool Box */}
        <div
          className="relative"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="absolute -inset-10 bg-orange-500/10 blur-[100px] rounded-full" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-white border border-slate-100 rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 min-h-[460px] flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <div
                  onClick={() => document.getElementById("fileIn")?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[40px] py-20 group hover:border-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer text-center"
                >
                  <input
                    type="file"
                    id="fileIn"
                    hidden
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                    <UploadCloud
                      className="text-slate-400 group-hover:text-orange-500"
                      size={40}
                    />
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1F4B]">
                    Drop PDF File
                  </h3>
                  <p className="text-slate-400 font-medium mt-2 text-lg">
                    or click to browse
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
                        Ready for PPTX
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
    ${
      isSuccess
        ? "bg-emerald-500 text-white shadow-xl shadow-emerald-100"
        : isConverting
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-[#1E1F4B] text-white hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-200 active:scale-[0.95]"
    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4 px-4">
                      {isSuccess ? (
                        <>
                          <CheckCircle2
                            className="animate-bounce shrink-0"
                            size={20}
                          />
                          <span className="text-sm md:text-xl truncate">
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
                            Processing...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm md:text-xl">
                            Convert to PPTX
                          </span>
                          <Presentation
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
            Explore Wrklyst Toolbelt
          </h2>
          <button className="flex items-center gap-2 text-[#5D5FEF] font-bold hover:gap-4 transition-all">
            View All Tools <ArrowRight size={20} />
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
              <p className="text-slate-400 text-sm mt-1">Pro Utility</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
