"use client";
import React, { useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import JSZip from "jszip";
import { FileText, Download, Loader2, Upload, X, Files, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfToImageProps {
  format: "image/jpeg" | "image/png";
}

interface ProcessedPage {
  fileName: string;
  id: number;
  blob: Blob;
  preview: string;
}

export default function PdfToImage({ format }: PdfToImageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<ProcessedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const pdfFiles = selectedFiles.filter(f => f.type === "application/pdf");
    if (pdfFiles.length === 0) {
      toast.error("Please select valid PDF files");
      return;
    }

    setFiles(prev => [...prev, ...pdfFiles]);
    processFiles(pdfFiles);
  };

  const processFiles = async (newFiles: File[]) => {
    setIsProcessing(true);
    const toastId = toast.loading(`Processing ${newFiles.length} PDF(s)...`);

    try {
      const allNewPages: ProcessedPage[] = [];

      for (const file of newFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, canvas, viewport }).promise;

            const blob = await new Promise<Blob>((res) =>
              canvas.toBlob((b) => res(b!), format, 0.95)
            );

            allNewPages.push({
              fileName: file.name.replace(".pdf", ""),
              id: i,
              blob,
              preview: canvas.toDataURL(format),
            });
          }
        }
      }

      setPages(prev => [...prev, ...allNewPages]);
      toast.success("Ready for download!", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Error rendering PDFs", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (pages.length === 0) return;
    const ext = format === "image/jpeg" ? "jpg" : "png";

    if (pages.length === 1) {
      const page = pages[0];
      const link = document.createElement("a");
      link.href = URL.createObjectURL(page.blob);
      link.download = `${page.fileName}-page-${page.id}.${ext}`;
      link.click();
      return;
    }

    const zipToast = toast.loading("Bundling images into ZIP...");
    const zip = new JSZip();
    pages.forEach((page) => {
      zip.file(`${page.fileName}/page-${page.id}.${ext}`, page.blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `wrklyst-pdf-export.zip`;
    link.click();
    toast.success("Downloaded!", { id: zipToast });
  };

  const clearAll = () => {
    setFiles([]);
    setPages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`group relative border-4 border-dashed rounded-[40px] py-16 flex flex-col items-center justify-center transition-all cursor-pointer
          ${files.length > 0 ? "border-indigo-100 bg-indigo-50/30" : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"}`}
      >
        <div className="p-5 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
          <Upload className="text-indigo-500" size={32} />
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#1E1F4B]">Click to add PDF files</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-file upload supported</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {pages.length > 0 && (
        <div className="space-y-6">
          {/* Stats & Actions */}
          <div className="flex items-center justify-between bg-[#1E1F4B] p-6 rounded-[32px] text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Files size={24} />
              </div>
              <div>
                <p className="text-xl font-black">{pages.length} Pages</p>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Across {files.length} document(s)</p>
              </div>
            </div>
            <button
              onClick={clearAll}
              className="p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
              title="Clear all"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((p, idx) => (
              <div key={idx} className="group relative aspect-[3/4] border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                <img src={p.preview} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                   <p className="text-[10px] text-white font-black truncate w-full">{p.fileName}</p>
                   <p className="text-[9px] text-indigo-300 font-bold uppercase mt-1">Page {p.id}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[32px] font-black uppercase tracking-[2px] shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <Download size={20} />
                {pages.length === 1 ? `Download ${format.split("/")[1].toUpperCase()}` : `Download All ${pages.length} Pages (ZIP)`}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}