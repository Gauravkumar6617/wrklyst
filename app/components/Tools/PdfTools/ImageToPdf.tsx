"use client";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { Upload, FileText, Download, Loader2, X, Image as ImageIcon, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ImageToPdf() {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validImages = selectedFiles.filter(f => f.type.startsWith("image/"));
    
    if (validImages.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    const newImages = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgData = await getImageData(img.preview);
        
        // If not the first page, add a new page
        if (i !== 0) pdf.addPage();

        // Calculate aspect ratio to fit image on A4
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;
        let printWidth = pageWidth - 20; // 10mm margin
        let printHeight = printWidth / ratio;

        if (printHeight > pageHeight - 20) {
          printHeight = pageHeight - 20;
          printWidth = printHeight * ratio;
        }

        pdf.addImage(imgData, 'JPEG', 10, 10, printWidth, printHeight);
      }

      pdf.save("wrklyst-converted.pdf");
      toast.success("PDF Downloaded!", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to get Base64/DataURL from Blob URL
  const getImageData = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };
      img.src = url;
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="group border-4 border-dashed border-slate-100 rounded-[40px] py-16 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
      >
        <div className="p-5 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
          <ImageIcon className="text-indigo-500" size={32} />
        </div>
        <p className="text-lg font-black text-[#1E1F4B]">Upload Images to Convert</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select multiple JPG, PNG, or WebP files</p>
        <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[#1E1F4B] uppercase tracking-widest text-xs">{images.length} Images Selected</h3>
            <button onClick={() => setImages([])} className="text-xs font-bold text-red-500 hover:underline">Clear All</button>
          </div>

          {/* List View with Reordering */}
          <div className="grid grid-cols-1 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <span className="text-xs font-black text-slate-300 w-4">{idx + 1}</span>
                <img src={img.preview} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{img.file.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{(img.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveImage(idx, 'up')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600"><MoveUp size={16}/></button>
                  <button onClick={() => moveImage(idx, 'down')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600"><MoveDown size={16}/></button>
                  <button onClick={() => removeImage(idx)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg ml-2"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={generatePdf}
            disabled={isProcessing}
            className="w-full py-6 bg-[#1E1F4B] text-white rounded-[32px] font-black uppercase tracking-[2px] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
            Generate PDF Document
          </button>
        </div>
      )}
    </div>
  );
}