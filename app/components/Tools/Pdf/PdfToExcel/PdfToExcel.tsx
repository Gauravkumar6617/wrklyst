"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Loader2,
  UploadCloud,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileType,
  Table,
} from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useHistory } from "@/app/context/HistoryContext";

export default function PdfToExcel() {
  const router = useRouter();
  const { addToHistory } = useHistory();

  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setProgress(0);
    const toastId = toast.loading("Analyzing table structures...");

    try {
      // 1. Dynamic Imports for heavy lifting
      const pdfjsLib = await import("pdfjs-dist");
      const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      const XLSX = await import("xlsx");

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      const allRows: string[][] = [];

      // Heuristic for row clustering
      const ROW_THRESHOLD = 5;

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 100));
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[];

        if (items.length === 0) continue;

        // Group items by Y coordinate with clustering
        const sortedItems = [...items].sort(
          (a, b) => b.transform[5] - a.transform[5],
        );
        const clusteredRows: { y: number; items: any[] }[] = [];

        sortedItems.forEach((item) => {
          const y = item.transform[5];
          const foundRow = clusteredRows.find(
            (r) => Math.abs(r.y - y) < ROW_THRESHOLD,
          );
          if (foundRow) {
            foundRow.items.push(item);
            foundRow.y = (foundRow.y + y) / 2;
          } else {
            clusteredRows.push({ y, items: [item] });
          }
        });

        // Dynamic column gap detection
        const xGaps: number[] = [];
        clusteredRows.forEach((row) => {
          const rowItems = row.items.sort(
            (a, b) => a.transform[4] - b.transform[4],
          );
          for (let j = 0; j < rowItems.length - 1; j++) {
            const gap =
              rowItems[j + 1].transform[4] -
              (rowItems[j].transform[4] + (rowItems[j].width || 0));
            if (gap > 2) xGaps.push(gap);
          }
        });

        const sortedGaps = xGaps.sort((a, b) => a - b);
        const medianGap =
          sortedGaps.length > 0
            ? sortedGaps[Math.floor(sortedGaps.length / 2)]
            : 5;
        const dynamicThreshold = Math.max(medianGap * 3, 20);

        // Process each row into cells
        clusteredRows.forEach((row) => {
          const rowItems = row.items.sort(
            (a, b) => a.transform[4] - b.transform[4],
          );
          const cells: string[] = [];
          let currentCell = "";
          let lastXRight = -1;

          rowItems.forEach((item) => {
            const x = item.transform[4];
            const text = item.str.trim();
            if (!text) return;

            if (lastXRight !== -1 && x - lastXRight > dynamicThreshold) {
              cells.push(currentCell.trim());
              currentCell = text;
            } else {
              currentCell +=
                (currentCell ? (x - lastXRight < 2 ? "" : " ") : "") + text;
            }
            lastXRight = x + (item.width || 0);
          });

          if (currentCell.trim()) cells.push(currentCell.trim());
          if (cells.length > 0) allRows.push(cells);
        });
        page.cleanup();
      }

      if (allRows.length === 0) {
        throw new Error(
          "No table data found. This PDF might be a scanned image.",
        );
      }

      // 2. Generate Excel Blob
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "extracted_data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 3. Hand-off to Download Page
      const blobUrl = URL.createObjectURL(blob);
      const fileId = `local-${Date.now()}`;
      const fileName = file.name.replace(/\.pdf$/i, ".xlsx");

      sessionStorage.setItem(
        "current_download",
        JSON.stringify({
          url: blobUrl,
          name: fileName,
          size: blob.size,
          tool: "PDF to Excel",
        }),
      );

      // 4. Success State
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#1E1F4B"],
      });

      toast.success("Tables extracted!", { id: toastId });
      addToHistory(
        "PDF to Excel",
        file.name,
        `Extracted ${allRows.length} rows`,
      );

      setTimeout(() => {
        router.push(
          `/download/${fileId}?name=${encodeURIComponent(fileName)}&tool=PDF to Excel&local=true`,
        );
      }, 1500);

      await pdfDoc.destroy();
    } catch (err: any) {
      toast.error(err.message || "Could not extract data.", { id: toastId });
      setIsConverting(false);
    }
  };

  const relatedTools = [
    {
      title: "PDF to Word",
      icon: <FileType size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Unlock PDF",
      icon: <ShieldCheck size={20} />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Merge PDF",
      icon: <Zap size={20} />,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* LEFT: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black tracking-widest uppercase">
            Heuristic Table Engine
          </span>
          <h1 className="text-6xl font-black text-[#1E1F4B] mt-6 leading-[1.1]">
            PDF to <br />
            <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">
              Excel Xlsx.
            </span>
          </h1>
          <p className="text-slate-500 text-lg mt-8 max-w-md leading-relaxed">
            Extract tabular data from PDFs directly into structured Excel
            sheets. All processing happens locally on your device for maximum
            privacy.
          </p>

          <div className="flex items-center gap-8 mt-10">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="text-emerald-500" size={24} />
              <span>No Upload</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Zap className="text-emerald-500" size={24} />
              <span>100% Private</span>
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
          onDrop={onDrop}
        >
          <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`relative bg-white border ${
              isDragging ? "border-emerald-500 border-2" : "border-slate-100"
            } rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 min-h-[460px] flex flex-col justify-center transition-all`}
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
                    Select PDF
                  </h3>
                  <p className="text-slate-400 font-medium mt-2 text-lg">
                    or drop tables here
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 p-6 bg-[#1E1F4B] rounded-[32px] text-white">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Table size={32} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold truncate">{file.name}</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                      </p>
                    </div>
                    <X
                      className="cursor-pointer opacity-50 hover:opacity-100"
                      onClick={() => setFile(null)}
                    />
                  </div>

                  <div className="space-y-2">
                    {isConverting && (
                      <div className="flex justify-between text-xs font-black text-[#1E1F4B] mb-1 px-2 uppercase tracking-tighter">
                        <span>Scanning...</span>
                        <span>{progress}%</span>
                      </div>
                    )}
                    <button
                      onClick={handleConvert}
                      disabled={isConverting || isSuccess}
                      className={`group relative w-full py-5 md:py-8 overflow-hidden rounded-[24px] md:rounded-[32px] font-black uppercase tracking-wider transition-all
                      ${
                        isSuccess
                          ? "bg-emerald-500 text-white"
                          : isConverting
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.95]"
                      }`}
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
                              Clustering Rows...
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm md:text-xl">
                              Convert to Excel
                            </span>
                            <ArrowRight
                              className="group-hover:translate-x-1 transition-transform shrink-0"
                              size={20}
                            />
                          </>
                        )}
                      </div>

                      {/* Inner Progress Bar for Converting State */}
                      {isConverting && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-1.5 bg-emerald-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[#1E1F4B]">
            Data Extraction Suite
          </h2>
          <button
            className="flex items-center gap-2 text-[#5D5FEF] font-bold hover:gap-4 transition-all"
            onClick={() => router.push("/tools")}
          >
            View All <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
              <p className="text-slate-400 text-sm mt-1">Wrklyst Engine</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
