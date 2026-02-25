"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the router
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Loader2 } from "lucide-react";

export default function HeroDropzone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);

    const extension = file.name.split(".").pop()?.toLowerCase();

    // SMART ROUTING LOGIC
    setTimeout(() => {
      if (extension === "pdf") {
        router.push("/tools/merge-pdf");
      } else if (["jpg", "jpeg", "png", "webp"].includes(extension!)) {
        router.push("/tools/image-resize");
      } else if (["txt", "docx", "md"].includes(extension!)) {
        router.push("/tools/word-counter");
      } else {
        router.push("/tools"); // Fallback
      }
    }, 800); // Small delay to show the "processing" animation
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
        }}
        // Add click-to-upload functionality
        onClick={() => !file && document.getElementById("fileInput")?.click()}
        animate={{
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? "#5D5FEF" : "#E2E8F0",
          backgroundColor: isDragActive ? "rgba(93, 95, 239, 0.03)" : "white",
        }}
        className="relative border-2 border-dashed rounded-[32px] p-10 text-center cursor-pointer shadow-sm transition-all"
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-[#5D5FEF]/10 w-16 h-16 rounded-3xl flex items-center justify-center text-[#5D5FEF] mx-auto mb-4">
                <Upload size={28} />
              </div>
              <p className="text-[#2D2E5F] font-black text-lg">
                Drop or Click to Upload
              </p>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                Any PDF, Image, or Text file
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="bg-[#5D5FEF] p-2 rounded-lg text-white">
                  <File size={20} />
                </div>
                <div className="flex-1 text-left truncate">
                  <p className="font-bold text-[#2D2E5F] text-sm truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] uppercase font-black text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    setFile(null);
  }}
  aria-label="Remove file" // Added this
  className="hover:text-red-500 text-slate-500 transition-colors"
>
  <X size={20} />
</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {file && (
        <motion.button
          onClick={handleProcess}
          disabled={isProcessing}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-4 bg-[#1E1F4B] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2D2E5F] transition-all disabled:opacity-70 shadow-xl shadow-indigo-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Identifying Tool...
            </>
          ) : (
            "Analyze \u0026 Process File"
          )}
        </motion.button>
      )}
    </div>
  );
}
