"use client";
import React, { useState } from "react";
import {
  Plus,
  Loader2,
  UploadCloud,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Files,
  GripVertical,
  FileText,
  Trash2,
  Database,
  Table,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function MergePdf() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf",
    );
    if (validFiles.length !== Array.from(newFiles).length) {
      toast.error("Some files were skipped (only PDFs allowed)");
    }
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Inside your MergePdf component...

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please select at least 2 files to merge");
      return;
    }

    setIsConverting(true);
    const toastId = toast.loading("Binding documents together...");

    try {
      const formData = new FormData();
      // Files are sent in the order user arranged them in the Reorder.Group
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/v1/pdf/merge", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#5D5FEF", "#8B5CF6", "#1E1F4B"],
        });

        toast.success("Documents Merged!", { id: toastId });

        // Redirect to the download page using the returned fileId
        setTimeout(() => {
          router.push(
            `/download/${result.fileId}?name=merged_document.pdf&tool=Merge PDF`,
          );
        }, 1500);
      } else {
        throw new Error(result.message || "Merging failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not merge files.", { id: toastId });
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
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
        {/* LEFT: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-24"
        >
          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black tracking-widest uppercase">
            Document Binder
          </span>
          <h1 className="text-6xl font-black text-[#1E1F4B] mt-6 leading-[1.1]">
            Merge PDFs <br />
            <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
              Into One.
            </span>
          </h1>
          <p className="text-slate-500 text-lg mt-8 max-w-md leading-relaxed">
            Combine multiple PDF files into a single, organized document. Drag
            and drop to set the perfect page order.
          </p>

          <div className="flex flex-col gap-4 mt-10">
            <div className="flex items-center gap-3 text-slate-800 font-bold">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Files size={20} />
              </div>
              <span>Infinite File Support</span>
            </div>
            <div className="flex items-center gap-3 text-slate-800 font-bold">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Zap size={20} />
              </div>
              <span>Lossless Merging Technology</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Multi-File Tool Box */}
        <div className="relative w-full">
          <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full" />

          <motion.div className="relative bg-white border border-slate-100 rounded-[48px] shadow-2xl p-8 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {files.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => document.getElementById("mergeInput")?.click()}
                  className="flex-1 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center group hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <input
                    type="file"
                    id="mergeInput"
                    hidden
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                    <UploadCloud
                      className="text-slate-400 group-hover:text-indigo-600"
                      size={40}
                    />
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1F4B]">
                    Select Multiple PDFs
                  </h3>
                  <p className="text-slate-400 font-medium mt-2">
                    Combine your files in seconds
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="font-black text-[#1E1F4B] text-xl">
                      File Sequence
                    </h3>
                    <button
                      onClick={() =>
                        document.getElementById("mergeInput")?.click()
                      }
                      className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                      <Plus size={16} /> Add More
                    </button>
                    <input
                      type="file"
                      id="mergeInput"
                      hidden
                      multiple
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e.target.files)}
                    />
                  </div>

                  {/* REORDERABLE LIST */}
                  <Reorder.Group
                    axis="y"
                    values={files}
                    onReorder={setFiles}
                    className="space-y-3 mb-8 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar"
                  >
                    {files.map((file, index) => (
                      <Reorder.Item
                        key={`${file.name}-${index}`}
                        value={file}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical
                          className="text-slate-300 group-hover:text-slate-400 shrink-0"
                          size={20}
                        />
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                          <FileText className="text-indigo-500" size={20} />
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-bold text-[#1E1F4B] text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-black uppercase">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  <button
                    onClick={handleMerge}
                    disabled={isConverting || isSuccess || files.length < 2}
                    className={`mt-auto group relative w-full py-5 md:py-8 overflow-hidden rounded-[24px] md:rounded-[32px] font-black uppercase tracking-wider transition-all
                    ${isSuccess ? "bg-emerald-500 text-white" : isConverting ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.95]"}`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4 px-4">
                      {isSuccess ? (
                        <>
                          <CheckCircle2 className="animate-bounce" size={20} />
                          <span className="text-sm md:text-xl">
                            Merged & Ready!
                          </span>
                        </>
                      ) : isConverting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span className="text-sm md:text-xl">Binding...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm md:text-xl">
                            Merge {files.length} Files
                          </span>
                          <Zap
                            className="group-hover:scale-125 transition-transform"
                            size={20}
                          />
                        </>
                      )}
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

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
