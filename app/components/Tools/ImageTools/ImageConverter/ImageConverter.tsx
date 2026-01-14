"use client";
import React, { useState, useRef, useEffect } from "react";
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { 
  Upload, Download, ImageIcon, RefreshCcw, 
  ShieldCheck, Sliders, Zap, X, CheckCircle2, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

// 1. Define the interface for the component props
interface ConverterProps {
  defaultTarget?: string;
  title?: string;
  isOptimizer?: boolean;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
}

// 2. Apply the interface to the component parameters
export default function ImageConverter({ 
  defaultTarget = "image/png", 
  title, 
  isOptimizer = false 
}: ConverterProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [targetFormat, setTargetFormat] = useState(defaultTarget);
  const [quality, setQuality] = useState(isOptimizer ? 0.7 : 0.92);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTargetFormat(defaultTarget); }, [defaultTarget]);

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizes = ["B", "KB", "MB"];
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newImages: ImageFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      originalSize: file.size
    }));
    setImages(prev => [...prev, ...newImages]);
    
    // Reset input value so same file can be uploaded again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Optional: Cleanup object URLs to prevent memory leaks
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    // Use functional update to ensure we have the latest state
    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === 'completed') continue;

      updatedImages[i].status = 'processing';
      setImages([...updatedImages]);

      try {
        const options = {
          maxSizeMB: 2,
          useWebWorker: true,
          initialQuality: quality,
          fileType: targetFormat as any,
        };

        const compressedBlob = await imageCompression(updatedImages[i].file, options);
        updatedImages[i].compressedSize = compressedBlob.size;
        updatedImages[i].compressedBlob = compressedBlob;
        updatedImages[i].status = 'completed';
      } catch (error) {
        updatedImages[i].status = 'error';
        console.error("Compression error:", error);
      }
      setImages([...updatedImages]);
    }
    setIsProcessingAll(false);
    toast.success("All images processed!");
  };

  const handleDownload = async () => {
    const completed = images.filter(img => img.compressedBlob);
    if (completed.length === 0) return;
  
    if (completed.length === 1) {
      // SINGLE FILE DOWNLOAD
      const img = completed[0];
      const ext = targetFormat.split('/')[1].replace('jpeg', 'jpg');
      const link = document.createElement("a");
      link.href = URL.createObjectURL(img.compressedBlob!);
      link.download = `${img.file.name.split('.')[0]}-optimized.${ext}`;
      link.click();
      toast.success("Image downloaded!");
    } else {
      // MULTIPLE FILES ZIP DOWNLOAD
      const zip = new JSZip();
      completed.forEach(img => {
        const ext = targetFormat.split('/')[1].replace('jpeg', 'jpg');
        zip.file(`${img.file.name.split('.')[0]}.${ext}`, img.compressedBlob!);
      });
  
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `wrklyst-batch-images.zip`;
      link.click();
      toast.success("ZIP archive downloaded!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-2xl text-[#5D5FEF]"><ImageIcon size={24} /></div>
          <div>
            <h2 className="text-xl font-black text-slate-800">{title || "Batch Image Pro"}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client-Side Batch Processing</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider"> Your data never leaves your browser</span>
        </div>
      </div>

      {/* Control Panel */}
   {/* 1. New Control Panel Design */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  {/* Quality Slider (Takes 7 columns) */}
  <div className="lg:col-span-7 p-8 bg-slate-50 border border-slate-100 rounded-[40px] space-y-6">
    <div className="flex justify-between items-center px-2">
      <div className="flex flex-col">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Sliders size={14} /> Compression Strength
        </label>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">
          {quality > 0.8 ? "High Quality" : quality > 0.4 ? "Balanced" : "Max Compression"}
        </p>
      </div>
      <span className="text-2xl font-black text-[#5D5FEF]">{Math.round(quality * 100)}%</span>
    </div>
    <input 
      type="range" min="0.1" max="1.0" step="0.05" 
      value={quality} 
      onChange={(e) => setQuality(parseFloat(e.target.value))} 
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5D5FEF]" 
    />
  </div>

  {/* NEW FORMAT GRID (Takes 5 columns) */}
  <div className="lg:col-span-5 p-8 bg-white border-2 border-slate-50 rounded-[40px] shadow-sm space-y-4">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Target Format</label>
    <div className="grid grid-cols-2 gap-2">
      {["image/png", "image/jpeg", "image/webp", "image/bmp"].map((fmt) => (
        <button
          key={fmt}
          onClick={() => setTargetFormat(fmt)}
          className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
            targetFormat === fmt 
            ? "bg-[#5D5FEF] border-[#5D5FEF] text-white shadow-lg shadow-indigo-100" 
            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
          }`}
        >
          {fmt.split("/")[1].replace('jpeg', 'jpg')}
        </button>
      ))}
    </div>
  </div>
</div>

{/* 2. Global Batch Stats Bar (Only shows when images exist) */}
{images.length > 0 && (
  <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#1E1F4B] rounded-[32px] text-white">
    <div className="flex items-center gap-6 px-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Files</span>
        <span className="text-xl font-black">{images.length}</span>
      </div>
      <div className="w-px h-8 bg-slate-700 hidden sm:block" />
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pending</span>
        <span className="text-xl font-black text-amber-400">
          {images.filter(i => i.status !== 'completed').length}
        </span>
      </div>
    </div>
    
    <div className="flex gap-3">
      <button 
        onClick={() => {
          images.forEach(img => URL.revokeObjectURL(img.preview));
          setImages([]);
        }}
        className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-400 transition-colors"
      >
        Clear All
      </button>
      <button 
        onClick={processAll}
        disabled={isProcessingAll || images.every(i => i.status === 'completed')}
        className="px-8 py-3 bg-[#5D5FEF] hover:bg-[#4a4ce0] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
      >
        {isProcessingAll ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
        Process Batch
      </button>
    </div>
  </div>
)}

      {/* Upload Zone & Gallery */}
      <div className="space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-12 border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-[#5D5FEF]/20 hover:bg-slate-50 transition-all cursor-pointer group"
        >
          <Upload className="text-slate-300 group-hover:text-[#5D5FEF] transition-all" size={40} />
          <p className="font-black text-slate-500 text-sm">Drag & Drop or Click to add photos</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            multiple 
            className="hidden" 
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex items-center gap-4 relative group hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={img.preview} className="w-full h-full object-cover" alt="prev" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{img.file.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {formatSize(img.originalSize)} → <span className="text-[#5D5FEF] font-bold">{img.compressedSize ? formatSize(img.compressedSize) : '...'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {img.status === 'processing' && <Loader2 className="animate-spin text-[#5D5FEF]" size={18} />}
                    {img.status === 'completed' && <CheckCircle2 className="text-emerald-500" size={18} />}
                    <button 
                      onClick={() => removeImage(img.id)} 
                      className="p-1 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-4 z-20">
  <button 
    onClick={processAll} 
    disabled={isProcessingAll || images.every(i => i.status === 'completed')}
    className="flex-1 py-5 bg-[#1E1F4B] text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#5D5FEF] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-100"
  >
    {isProcessingAll ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
    {images.every(i => i.status === 'completed') ? "Processing Finished" : "Start Batch Process"}
  </button>
  
  {images.some(i => i.status === 'completed') && (
    <button 
      onClick={handleDownload}
      className="flex-1 py-5 bg-emerald-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 animate-in zoom-in-95 duration-300"
    >
      <Download size={18} /> 
      {images.filter(i => i.status === 'completed').length === 1 
        ? "Download Image" 
        : `Download ${images.filter(i => i.status === 'completed').length} Files (ZIP)`}
    </button>
  )}
</div>
          </div>
        )}
      </div>
    </div>
  );
}