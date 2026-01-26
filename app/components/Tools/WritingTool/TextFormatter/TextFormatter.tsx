"use client";
import React, { useState, useEffect } from "react";
import {
  Type,
  Trash2,
  Copy,
  Sparkles,
  CaseUpper,
  CaseLower,
  Hash,
  Eraser,
  ArrowRight,
  Zap,
  ListFilter,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function TextFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("upper");

  // Real-time transformation
  useEffect(() => {
    transformText(input, activeTab);
  }, [input, activeTab]);

  const transformText = (text: string, action: string) => {
    if (!text) {
      setOutput("");
      return;
    }

    let result = text;
    switch (action) {
      case "upper":
        result = text.toUpperCase();
        break;
      case "lower":
        result = text.toLowerCase();
        break;
      case "capitalize":
        result = text.replace(/\b\w/g, (l) => l.toUpperCase());
        break;
      case "clean":
        result = text.replace(/\s+/g, " ").trim();
        break;
      case "slug":
        result = text
          .toLowerCase()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-");
        break;
      case "remove-lines":
        result = text.replace(/\n+/g, " ");
        break;
      case "trim":
        result = text.trim();
        break;
    }
    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Formatted text copied!");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-6 rounded-[32px] text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5D5FEF] rounded-xl">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">
              Live Formatter
            </h3>
            <p className="text-[10px] text-slate-400 font-bold">
              Transforms automatically as you type
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {["upper", "lower", "capitalize", "slug", "clean"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Side-by-Side Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Box */}
        <div className="space-y-2">
          <div className="flex justify-between px-4 items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Input Raw Text
            </span>
            <button
              onClick={() => setInput("")}
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text here..."
            className="w-full h-96 p-8 bg-slate-50 border border-slate-100 rounded-[40px] focus:bg-white transition-all outline-none font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Output Box */}
        <div className="space-y-2">
          <div className="flex justify-between px-4 items-center">
            <span className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">
              Formatted Result
            </span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-[#5D5FEF] font-bold text-[10px] uppercase"
            >
              <Copy size={14} /> Copy Result
            </button>
          </div>
          <div className="w-full h-96 p-8 bg-white border-2 border-[#5D5FEF]/10 rounded-[40px] font-mono text-sm leading-relaxed overflow-y-auto text-slate-700 shadow-xl shadow-indigo-100/20 relative">
            {output || (
              <span className="text-slate-300 italic">
                Result will appear here...
              </span>
            )}
            <div className="absolute top-6 right-6 opacity-10">
              <ArrowRight size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEO & Context Footer */}
      <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8">
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="text-[#5D5FEF]" size={18} />
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Transformation Logic
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-slate-500 font-medium leading-relaxed">
          <p>
            <strong>Case Conversion:</strong> Change between uppercase,
            lowercase, or sentence case instantly for social media or coding.
          </p>
          <p>
            <strong>Slugify Tool:</strong> Converts text into URL-friendly
            strings by removing special characters and adding hyphens.
          </p>
          <p>
            <strong>Space Cleaner:</strong> Removes double spaces,
            leading/trailing whitespace, and fixes broken line breaks from PDF
            copies.
          </p>
        </div>
      </div>
    </div>
  );
}
