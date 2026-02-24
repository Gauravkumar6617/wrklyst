"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
  Loader2,
  FileText,
  FileVideo,
  FileJson,
  Languages,
  ShieldCheck,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  AnimatedBackground,
  FloatingDecorations,
  ToolHeader,
  ToolCard,
} from "@/app/components/ui/ToolPageElements";
import { useHistory } from "@/app/context/HistoryContext";
import { toast } from "react-hot-toast";

export function HTMLToPDFClient() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [file, setFile] = useState<File | null>(null);
  const [htmlInput, setHtmlInput] = useState("");
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const relatedTools = [
    {
      title: "PDF to Word",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "HTML to Image",
      icon: <FileVideo className="w-5 h-5" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "JSON to PDF",
      icon: <FileJson className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Translator",
      icon: <Languages className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const handleConvert = async () => {
    let content = htmlInput;
    if (mode === "upload" && file) content = await file.text();
    if (!content.trim()) {
      toast.error("Please provide HTML content.");
      return;
    }

    setIsConverting(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const jsPDF = (await import("jspdf")).default;
      await import("html2canvas");
      const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

      const container = document.createElement("div");
      container.innerHTML = content;
      Object.assign(container.style, {
        width: "595pt",
        padding: "40pt",
        backgroundColor: "white",
        color: "black",
        position: "fixed",
        top: "0",
        left: "0",
        opacity: "0.01",
        zIndex: "-9999",
      });
      document.body.appendChild(container);

      await new Promise((resolve) => setTimeout(resolve, 150));

      const pdfBlob = await new Promise<Blob>((resolve, reject) => {
        doc.html(container, {
          callback: (doc) => {
            if (document.body.contains(container))
              document.body.removeChild(container);
            resolve(doc.output("blob"));
          },
          x: 0,
          y: 0,
          width: 595,
          windowWidth: 800,
          html2canvas: {
            scale: 0.75,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
        });
      });

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = () => {
        const fileName =
          file?.name.replace(/\.html?$/i, ".pdf") || "converted_webpage.pdf";
        sessionStorage.setItem(
          "current_download",
          JSON.stringify({ data: reader.result, name: fileName }),
        );
        setIsSuccess(true);
        addToHistory("HTML to PDF", fileName, "Converted");
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        toast.success("Ready!", { id: toastId });
        setTimeout(() => {
          router.push(
            `/download/local-${Date.now()}?name=${encodeURIComponent(fileName)}&tool=HTML to PDF&local=true`,
          );
        }, 1500);
      };
    } catch (error) {
      setIsConverting(false);
      toast.error("Error generating PDF");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-8 md:py-16 px-4 overflow-hidden">
      <AnimatedBackground />
      <FloatingDecorations />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left"
        >
          <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase">
            Web-to-PDF Engine
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1E1F4B] mt-6 leading-tight">
            Professional <br />
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
              PDF Documents.
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg mt-6 max-w-md mx-auto lg:mx-0">
            Convert HTML files or raw code into vector-perfect documents in
            seconds.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
              <ShieldCheck className="text-blue-500 w-5 h-5" /> Privacy First
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
              <Zap className="text-blue-500 w-5 h-5" /> Instant Build
            </div>
          </div>
        </motion.div>

        {/* Tool Section */}
        <div className="relative w-full max-w-[500px] mx-auto lg:max-w-none">
          <div className="absolute -inset-4 md:-inset-10 bg-blue-500/5 blur-3xl rounded-full" />
          <ToolCard className="relative bg-white border border-slate-100 rounded-[32px] md:rounded-[50px] shadow-2xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <div className="space-y-6">
                  <div className="flex p-1 bg-slate-50 rounded-xl w-fit mx-auto">
                    <button
                      onClick={() => setMode("upload")}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${mode === "upload" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setMode("paste")}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${mode === "paste" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
                    >
                      Paste
                    </button>
                  </div>

                  {mode === "upload" ? (
                    <div
                      onClick={() =>
                        !isConverting &&
                        document.getElementById("fileIn")?.click()
                      }
                      className="border-2 border-dashed border-slate-200 rounded-[30px] py-14 md:py-20 group hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer text-center"
                    >
                      <input
                        type="file"
                        id="fileIn"
                        hidden
                        accept=".html,.htm"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <Upload className="mx-auto mb-4 text-slate-300 group-hover:text-blue-500 w-10 h-10 md:w-12 md:h-12 transition-all" />
                      <h3 className="text-lg font-black text-[#1E1F4B] px-4 truncate">
                        {file ? file.name : "Choose HTML File"}
                      </h3>
                    </div>
                  ) : (
                    <textarea
                      value={htmlInput}
                      onChange={(e) => setHtmlInput(e.target.value)}
                      placeholder="<html><body>...</body></html>"
                      className="w-full h-40 p-5 bg-slate-50 rounded-[24px] font-mono text-xs outline-none focus:ring-4 ring-blue-500/5 transition-all resize-none"
                    />
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={isConverting || (!file && !htmlInput)}
                    className="w-full py-4 md:py-6 bg-[#1E1F4B] text-white rounded-[24px] md:rounded-[32px] font-black text-lg md:text-xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        Generate PDF <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1E1F4B]">
                    PDF Ready!
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    Transferring to download area...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </ToolCard>
        </div>
      </div>

      {/* Related Tools Grid */}
      <div className="w-full max-w-6xl relative z-10">
        <h2 className="text-xl md:text-2xl font-black text-[#1E1F4B] mb-8 text-center lg:text-left">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedTools.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4 lg:flex-col lg:items-start"
            >
              <div
                className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                {tool.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#1E1F4B] text-lg">
                  {tool.title}
                </h4>
                <p className="text-slate-400 text-xs mt-1">Utility Tool</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
