"use client";
import React, { useState } from "react";
import {
  Archive,
  Upload,
  ShieldCheck,
  FileCheck,
  Loader2,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PdfToPdfA() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleConvert = async () => {
    if (!file) return toast.error("Please upload a PDF first");

    setIsProcessing(true);
    const toastId = toast.loading("Ensuring ISO Compliance...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/pdf/to-pdfa", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success("Converted to PDF/A-2b Standard!", { id: toastId });

        // Redirect to download with metadata
        router.push(
          `/download/${result.fileId}?name=archived_${file.name}&tool=PDF to PDF/A`,
        );
      } else {
        throw new Error(result.error || "Compliance conversion failed");
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Tool Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <History size={14} /> ISO 19005 Standard
        </div>
        <h1 className="text-4xl font-black text-[#1E1F4B] mb-4">
          PDF to <span className="text-indigo-600">PDF/A</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Convert documents to the archival format required for legal,
          government, and long-term storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Upload Zone */}
        <div className="space-y-6">
          {!file ? (
            <div
              onClick={() => document.getElementById("pdfaInput")?.click()}
              className="border-4 border-dashed border-slate-100 rounded-[48px] py-24 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group bg-white"
            >
              <div className="p-6 bg-indigo-50 rounded-3xl group-hover:scale-110 transition-transform mb-4">
                <Upload className="text-indigo-600" size={32} />
              </div>
              <p className="font-black text-[#1E1F4B]">Drop PDF here</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Maximum Compatibility
              </p>
              <input
                id="pdfaInput"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative">
              <button
                onClick={() => setFile(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full text-slate-400"
              >
                <AlertCircle size={20} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="p-5 bg-indigo-600 rounded-3xl text-white mb-4 shadow-xl shadow-indigo-100">
                  <Archive size={32} />
                </div>
                <h3 className="font-black text-[#1E1F4B] break-all">
                  {file.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2">
                  {" "}
                  Ready for Archival
                </p>

                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full mt-8 py-5 bg-[#1E1F4B] hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>Start Conversion</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <h4 className="font-black text-[#1E1F4B] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={18} /> What is
              PDF/A?
            </h4>
            <ul className="space-y-3">
              {[
                "Embeds all fonts for future reading",
                "Removes risky content like JS/Video",
                "Standardized for 50+ year storage",
                "Complies with ISO 19005 standards",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-xs font-bold text-slate-500"
                >
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-indigo-600 rounded-[32px] text-white">
            <h4 className="font-black text-sm uppercase tracking-wider mb-2">
              Legal Ready
            </h4>
            <p className="text-[11px] font-medium text-indigo-100 leading-relaxed">
              This tool converts your document to the **PDF/A-2b** standard, the
              most widely accepted version for court filings and institutional
              archives worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
