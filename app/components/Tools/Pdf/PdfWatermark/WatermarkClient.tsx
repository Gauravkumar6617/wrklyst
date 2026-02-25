"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { 
  FileUp, Image as ImageIcon, Download, 
  RefreshCw, Type, Layers, Palette, 
  RotateCw, MousePointer2, Ghost, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export function WatermarkClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [watermarkImg, setWatermarkImg] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [coords, setCoords] = useState({ x: 100, y: 100 });
  const [rotation, setRotation] = useState(-45);
  const [scale, setScale] = useState(50);
  const [color, setColor] = useState("#EF4444");
  const [opacity, setOpacity] = useState(0.4);
    const router = useRouter();
  const [pageScope, setPageScope] = useState<"all" | "single">("all");
  const [viewPage, setViewPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  // PDF Preview & Metadata
  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPreviewUrl(url);
      const countPages = async () => {
        const bytes = await pdfFile.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        setTotalPages(doc.getPageCount());
      };
      countPages();
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfFile]);

  // Image Preview
  useEffect(() => {
    if (watermarkImg) {
      const url = URL.createObjectURL(watermarkImg);
      setImgPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setImgPreview(null);
  }, [watermarkImg]);

  const getPdfColor = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  };

  const handleProcess = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);
    
    const toastId = toast.loading("Stamping your document...");
  
    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pdfColor = getPdfColor(color);
      
      let embeddedImg = null;
      if (watermarkImg) {
        const imgBytes = await watermarkImg.arrayBuffer();
        const isPng = watermarkImg.type === "image/png" || watermarkImg.name.toLowerCase().endsWith(".png");
        
        try {
          embeddedImg = isPng 
            ? await pdfDoc.embedPng(imgBytes) 
            : await pdfDoc.embedJpg(imgBytes);
        } catch (imgErr) {
          throw new Error("Image format incompatible.");
        }
      }
  
      // --- THE FIX: SELECTIVE PAGE LOGIC ---
      // If "single", we only take the page index currently being viewed.
      // If "all", we take every page index in the document.
      const targetIndices = pageScope === "single" 
        ? [viewPage - 1] 
        : pages.map((_, i) => i);
  
      targetIndices.forEach((idx) => {
        const page = pages[idx];
        const { width, height } = page.getSize();
        
        if (embeddedImg) {
          const imgScale = (width / embeddedImg.width) * (scale / 100);
          const dims = embeddedImg.scale(imgScale);
          page.drawImage(embeddedImg, {
            x: coords.x,
            y: coords.y,
            width: dims.width,
            height: dims.height,
            opacity,
            rotate: degrees(rotation),
          });
        } else {
          page.drawText(text, {
            x: coords.x,
            y: coords.y,
            size: scale,
            font,
            color: pdfColor,
            opacity,
            rotate: degrees(rotation),
          });
        }
      });

      // 1. Save and handle redirect
      const finalPdfBytes = await pdfDoc.save();
      const blob = new Blob([finalPdfBytes], { type: "application/pdf" });
      const reader = new FileReader();
      
      reader.onloadend = () => {
        sessionStorage.setItem("current_download", JSON.stringify({
          data: reader.result,
          name: `watermarked_${pdfFile.name}`
        }));

        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3B82F6", "#60A5FA", "#1E1F4B"],
        });
    
        toast.success("Document Watermarked!", { id: toastId });
        const fileId = `local-${crypto.randomUUID()}`; 
    
        setTimeout(() => {
          router.push(`/download/${fileId}?name=watermarked_${pdfFile.name}&tool=Watermark PDF&local=true`);
        }, 1500);
      };

      reader.readAsDataURL(blob);
  
    } catch (error: any) {
      toast.error(error.message || "Processing failed.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black italic text-xl tracking-tighter">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <RotateCw size={18} />
          </div>
          STAMP.PRO
        </div>
        
        <div className="flex items-center gap-4">
          {pdfFile && (
            <button onClick={() => setPdfFile(null)} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
              CLEAR FILE
            </button>
          )}
          <button 
            onClick={handleProcess}
            disabled={!pdfFile || isProcessing}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-3 disabled:opacity-20 shadow-xl shadow-slate-200"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
            {isProcessing ? "STAMPING..." : "DOWNLOAD PDF"}
          </button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10">
        
        {/* --- LEFT: CONTROL SIDEBAR --- */}
        <aside className="col-span-1 lg:col-span-4 xl:col-span-3 space-y-6 order-2 lg:order-1">
  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl shadow-slate-200/50 space-y-8">
    
    {/* 0. NEW: Scope Control (CRITICAL FIX) */}
    <div className="space-y-4">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Layers size={14} /> Page Scope
      </label>
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => setPageScope("all")} 
          className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${pageScope === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          ALL PAGES
        </button>
        <button 
          onClick={() => setPageScope("single")} 
          className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${pageScope === 'single' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          CURRENT ONLY
        </button>
      </div>
      {pageScope === "single" && (
        <p className="text-[10px] text-blue-500 font-bold text-center animate-pulse">
          Targeting Page {viewPage} only
        </p>
      )}
    </div>

    {/* 1. Mode & Content */}
    <div className="space-y-4 pt-6 border-t border-slate-50">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Palette size={14} /> Style & Content
      </label>
      
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button onClick={() => setWatermarkImg(null)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!watermarkImg ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>TEXT</button>
        <label className={`flex-1 py-2 rounded-xl text-xs font-bold text-center cursor-pointer transition-all ${watermarkImg ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
          IMAGE
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setWatermarkImg(e.target.files?.[0] || null)} />
        </label>
      </div>

      {watermarkImg ? (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 relative">
          <div className="w-12 h-12 bg-white rounded-lg border flex-shrink-0 overflow-hidden">
            {imgPreview && <img src={imgPreview} className="w-full h-full object-contain" alt="stamp" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-blue-400 uppercase">Graphic Loaded</p>
            <p className="text-xs font-black truncate">{watermarkImg.name}</p>
          </div>
          <button onClick={() => setWatermarkImg(null)} className="p-1.5 bg-white rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform"><X size={14}/></button>
        </div>
      ) : (
        <input 
          type="text" value={text} onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-lg focus:ring-2 ring-blue-500 outline-none transition-all"
          placeholder="CONFIDENTIAL"
        />
      )}
    </div>

    {/* 2. Precision Positioning */}
    <div className="space-y-6 pt-6 border-t border-slate-50">
       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <MousePointer2 size={14} /> Placement (X / Y)
      </label>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <span className="text-[10px] text-slate-300 font-bold ml-1 uppercase">X-Offset</span>
                   <input type="number" value={coords.x} onChange={(e) => setCoords({...coords, x: +e.target.value})} className="bg-slate-50 w-full p-3 rounded-xl text-xs font-bold focus:ring-1 ring-blue-500" />
                 </div>
                 <div className="space-y-1">
                   <span className="text-[10px] text-slate-300 font-bold ml-1 uppercase">Y-Offset</span>
                   <input type="number" value={coords.y} onChange={(e) => setCoords({...coords, y: +e.target.value})} className="bg-slate-50 w-full p-3 rounded-xl text-xs font-bold focus:ring-1 ring-blue-500" />
                 </div>
              </div>
              <div className="space-y-2">
                <input type="range" min="0" max="600" value={coords.x} onChange={(e) => setCoords({...coords, x: +e.target.value})} className="w-full accent-blue-600" />
                <input type="range" min="0" max="850" value={coords.y} onChange={(e) => setCoords({...coords, y: +e.target.value})} className="w-full accent-blue-600" />
              </div>
            </div>

            {/* 3. Appearance Tuning */}
            <div className="space-y-6 pt-6 border-t border-slate-50">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rotation</label>
                   <input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(+e.target.value)} className="w-full accent-slate-900" />
                   <div className="text-[10px] font-black text-center">{rotation}°</div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scale %</label>
                   <input type="range" min="5" max="200" value={scale} onChange={(e) => setScale(+e.target.value)} className="w-full accent-slate-900" />
                   <div className="text-[10px] font-black text-center">{scale}%</div>
                </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghosting (Opacity)</label>
                    <span className="text-[10px] font-black">{Math.round(opacity * 100)}%</span>
                 </div>
                 <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-blue-600" />
              </div>
            </div>

          </div>
        </aside>

        {/* --- RIGHT: INTERACTIVE BLUEPRINT --- */}
        <main className="col-span-1 lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
          <div className="bg-slate-900 lg:rounded-[3rem] h-[75vh] min-h-[600px] relative overflow-hidden shadow-2xl border-[12px] border-white group">
            {!pdfFile ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center cursor-pointer">
                <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 shadow-2xl">
                  <FileUp size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Import Blueprint</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">Click or drag a PDF file to enable the real-time visual watermarking engine.</p>
              </div>
            ) : (
              <div className="relative w-full h-full bg-white overflow-hidden">
                {/* 🎯 THE LIVE VIRTUAL STAMP (Simulated Preview) */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-start p-10">
                   <motion.div 
                    animate={{ x: coords.x, y: -coords.y, rotate: -rotation, opacity }}
                    style={{ color: color, fontSize: `${scale}px` }}
                    className="font-black whitespace-nowrap leading-none origin-bottom-left select-none drop-shadow-xl"
                   >
                     {watermarkImg ? (
                       <div className="border-4 border-blue-500/50 bg-blue-500/10 backdrop-blur-sm p-4 rounded-2xl text-[10px] tracking-widest text-blue-600">
                         IMAGE_WATERMARK_SYNCED
                       </div>
                     ) : (
                       text || "PREVIEW"
                     )}
                   </motion.div>
                </div>

                {/* PDF IFRAME (SCROLLABLE) */}
                <iframe 
                  src={`${previewUrl}#page=${viewPage}&toolbar=0&view=FitH`} 
                  className="w-full h-full border-none z-10 pointer-events-auto" 
                  title="Interactive PDF Viewer"
                />
                
                {/* PAGE CONTROLLER FLOATING PILL */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-3xl border border-slate-200 shadow-2xl">
                   <div className="text-[10px] font-black text-slate-400 tracking-[0.2em]">STAMPING PAGE</div>
                   <select 
                    value={viewPage} 
                    onChange={(e) => setViewPage(Number(e.target.value))}
                    className="bg-slate-900 text-white rounded-xl px-4 py-1.5 text-xs font-black outline-none hover:bg-blue-600 transition-colors cursor-pointer"
                   >
                    {[...Array(totalPages)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <div className="w-px h-4 bg-slate-200 mx-2" />
                  <div className="text-[10px] font-black text-slate-600">{pageScope === 'all' ? 'BATCH MODE' : 'SINGLE MODE'}</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}