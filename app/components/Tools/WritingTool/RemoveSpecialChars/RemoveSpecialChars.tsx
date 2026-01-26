"use client";
import React, { useState, useMemo } from "react";
import {
  Trash2,
  Copy,
  ShieldCheck,
  Eraser,
  Hash,
  Smile,
  AlignLeft,
  ArrowDownAz,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface SanitizerOptions {
  keepNumbers: boolean;
  keepSpaces: boolean;
  removeEmojis: boolean;
  normalizeWhitespace: boolean;
  toLowercase: boolean;
}

export default function RemoveSpecialChars() {
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<SanitizerOptions>({
    keepNumbers: true,
    keepSpaces: true,
    removeEmojis: false,
    normalizeWhitespace: true,
    toLowercase: false,
  });

  // Real-time Metadata
  const stats = useMemo(
    () => ({
      chars: text.length,
      symbols: (text.match(/[^a-zA-Z0-9\s]/g) || []).length,
      lines: text.split(/\r\n|\r|\n/).filter((l) => l).length,
    }),
    [text],
  );

  const cleanText = () => {
    if (!text.trim()) return toast.error("Please enter text first");

    let result = text;

    // 1. Emoji Removal Logic (Unicode Range)
    if (options.removeEmojis) {
      result = result.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        "",
      );
    }

    // 2. Core Sanitization Regex
    let pattern = "a-zA-Z";
    if (options.keepNumbers) pattern += "0-9";
    if (options.keepSpaces) pattern += "\\s";

    const regex = new RegExp(`[^${pattern}]`, "g");
    result = result.replace(regex, "");

    // 3. Transformation Logic
    if (options.toLowercase) result = result.toLowerCase();
    if (options.normalizeWhitespace)
      result = result.replace(/\s\s+/g, " ").trim();

    setText(result);
    toast.success("Text successfully sanitized");
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-6 space-y-6">
      {/* Header - Mobile Responsive Padding */}
      <div className="px-6 sm:px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
            Text <span className="text-[#5D5FEF]">Sanitizer</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Clean and format strings for databases or code.
          </p>
        </div>
        <div className="flex gap-3">
          <StatPill label="Symbols" value={stats.symbols} />
          <StatPill label="Lines" value={stats.lines} />
        </div>
      </div>

      {/* Control Panel - Grid layout for mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 px-6 sm:px-0">
        <OptionBtn
          active={options.keepNumbers}
          onClick={() =>
            setOptions({ ...options, keepNumbers: !options.keepNumbers })
          }
          icon={<Hash size={14} />}
          label="Numbers"
        />
        <OptionBtn
          active={options.removeEmojis}
          onClick={() =>
            setOptions({ ...options, removeEmojis: !options.removeEmojis })
          }
          icon={<Smile size={14} />}
          label="Strip Emojis"
        />
        <OptionBtn
          active={options.normalizeWhitespace}
          onClick={() =>
            setOptions({
              ...options,
              normalizeWhitespace: !options.normalizeWhitespace,
            })
          }
          icon={<AlignLeft size={14} />}
          label="Trim"
        />
        <OptionBtn
          active={options.toLowercase}
          onClick={() =>
            setOptions({ ...options, toLowercase: !options.toLowercase })
          }
          icon={<ArrowDownAz size={14} />}
          label="Lowercase"
        />
        <button
          onClick={cleanText}
          className="col-span-2 lg:col-span-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#5D5FEF] text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
        >
          <Eraser size={18} /> Run Clean
        </button>
      </div>

      {/* Main Editor - p-0 for Mobile */}
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          className="w-full h-[450px] p-8 bg-white border-y-2 sm:border-2 border-slate-100 rounded-none sm:rounded-[48px] font-mono text-sm focus:border-indigo-100 outline-none transition-all shadow-inner resize-none"
          placeholder="Paste text with symbols like !@# $%^ &* here..."
        />

        {/* Floating Desktop/Mobile Actions */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          <button
            onClick={() => setText("")}
            className="p-4 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all"
            aria-label="Clear All"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-black transition-all font-bold text-sm"
          >
            <Copy size={18} /> Copy Result
          </button>
        </div>
      </div>

      {/* Feature Footer */}
      <div className="px-6 sm:px-0 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100">
        <FeatureDesc
          title="SEO Safe"
          desc="Prepare post slugs or metadata by stripping non-standard characters automatically."
        />
        <FeatureDesc
          title="Clean Output"
          desc="Normalize double-spaces and broken line breaks for perfectly formatted data."
        />
        <FeatureDesc
          title="Privacy"
          desc="Your data is processed locally in your browser and is never stored on our servers."
        />
      </div>
    </div>
  );
}

// Sub-components
function OptionBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-4 rounded-[22px] border-2 transition-all font-black text-[10px] uppercase tracking-tighter
        ${active ? "bg-white border-[#5D5FEF] text-[#5D5FEF] shadow-sm" : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"}
      `}
    >
      {icon} {label}
    </button>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-xs font-black text-indigo-600">{value}</span>
    </div>
  );
}

function FeatureDesc({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
        <ShieldCheck size={14} className="text-[#5D5FEF]" /> {title}
      </h4>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
