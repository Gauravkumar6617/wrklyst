"use client";
import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Link, ShieldCheck, Hash, FileCode } from "lucide-react";
import { toast } from "react-hot-toast";

interface ConverterProps {
  mode: "base64-enc" | "base64-dec" | "url-enc" | "url-dec" | "slug";
}

export default function ConverterTool({ mode }: ConverterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // UI Adaptive Content
  const config = {
    "base64-enc": { label: "Text to Base64", icon: <ShieldCheck size={20}/>, placeholder: "Enter plain text..." },
    "base64-dec": { label: "Base64 to Text", icon: <FileCode size={20}/>, placeholder: "Enter base64 string..." },
    "url-enc": { label: "URL Encoder", icon: <Link size={20}/>, placeholder: "Enter URL to encode..." },
    "url-dec": { label: "URL Decoder", icon: <Link size={20}/>, placeholder: "Enter encoded URL..." },
    "slug": { label: "Slug Generator", icon: <Hash size={20}/>, placeholder: "Enter article title..." },
  };

  const current = config[mode];

  useEffect(() => {
    if (!input) { setOutput(""); return; }
    try {
      if (mode === "base64-enc") setOutput(btoa(input));
      if (mode === "base64-dec") setOutput(atob(input));
      if (mode === "url-enc") setOutput(encodeURIComponent(input));
      if (mode === "url-dec") setOutput(decodeURIComponent(input));
      if (mode === "slug") setOutput(input.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-'));
    } catch (e) {
      setOutput("Invalid input for this operation. Please check your data.");
    }
  }, [input, mode]);

  return (
    <div className="space-y-6">
      {/* Dynamic Header for the specific tool */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
        <div className="text-[#5D5FEF]">{current.icon}</div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-700">{current.label} Mode Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-6 bg-white border-2 border-slate-100 rounded-[32px] focus:border-[#5D5FEF]/20 outline-none transition-all font-mono text-sm shadow-sm"
            placeholder={current.placeholder}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest ml-2">Output</label>
            <button 
              onClick={() => {navigator.clipboard.writeText(output); toast.success("Copied!");}} 
              className="px-4 py-1.5 bg-[#5D5FEF]/10 text-[#5D5FEF] rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#5D5FEF] hover:text-white transition-all"
            >
              <Copy size={12}/> Copy Result
            </button>
          </div>
          <div className="w-full h-80 p-6 bg-slate-900 text-emerald-400 rounded-[32px] font-mono text-sm overflow-auto whitespace-pre-wrap border-4 border-slate-800 shadow-xl">
            {output || <span className="text-slate-600 italic">Result will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}