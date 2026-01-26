"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Smile,
  ArrowRightLeft,
  Copy,
  Trash2,
  Zap,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UNIVERSAL_EMOJI_REGEX =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

export default function EmojiConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"to-text" | "to-emoji">("to-text");

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    if (mode === "to-text") {
      const result = input.replace(UNIVERSAL_EMOJI_REGEX, (match) => {
        return `:${match}:`;
      });
      setOutput(result);
    } else {
      const result = input.replace(/:([^\s:]+):/g, (match, p1) => {
        return p1;
      });
      setOutput(result);
    }
  };

  useEffect(() => {
    const timer = setTimeout(convert, 200);
    return () => clearTimeout(timer);
  }, [input, mode]);

  const stats = useMemo(
    () => ({
      count: (input.match(UNIVERSAL_EMOJI_REGEX) || []).length,
      chars: input.length,
    }),
    [input],
  );

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-6 space-y-0 sm:space-y-6">
      {/* 1. Header Section - Full width on mobile (rounded-none) */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B0F1A] p-8 sm:p-10 rounded-none sm:rounded-[48px] border-b-4 border-emerald-500 gap-6 shadow-2xl">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="p-4 bg-emerald-500 rounded-[20px] sm:rounded-[24px] text-white shadow-xl shadow-emerald-500/20">
            <Smile size={32} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-tight">
              Universal <span className="text-emerald-400">Emoji Engine</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px]">
              Protocol:{" "}
              {mode === "to-text" ? "Symbol → Shortcode" : "Shortcode → Symbol"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMode(mode === "to-text" ? "to-emoji" : "to-text");
            setInput(output);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10"
        >
          <ArrowRightLeft size={16} /> Swap Logic
        </button>
      </div>

      {/* 2. Conversion Interface - Removed mobile horizontal padding for true p-0 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8">
        {/* Input Panel */}
        <div className="space-y-4 p-6 sm:p-0 bg-white sm:bg-transparent">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Source Input
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {stats.count} Emojis Found
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-72 sm:h-80 p-6 sm:p-8 bg-slate-50 sm:bg-white border-2 border-slate-100 rounded-[32px] sm:rounded-[48px] focus:border-emerald-200 outline-none transition-all font-mono text-xl shadow-inner resize-none"
            placeholder={
              mode === "to-text" ? "Paste emojis..." : "Enter shortcodes..."
            }
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-4 p-6 sm:p-0 bg-[#0B0F1A] sm:bg-transparent">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              Processed Result
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setInput("")}
                className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                aria-label="Clear All"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied!");
                }}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-emerald-500 hover:text-white"
              >
                <Copy size={12} /> Copy Output
              </button>
            </div>
          </div>
          <div className="w-full h-72 sm:h-80 p-6 sm:p-8 bg-[#0B0F1A] text-slate-100 border border-slate-800 rounded-[32px] sm:rounded-[48px] font-mono text-xl leading-relaxed overflow-auto shadow-2xl">
            {output || (
              <span className="text-slate-700 italic select-none">
                Translation pending...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Education/SEO Layer - Restored padding for readability */}
      <div className="px-8 sm:px-0 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 mt-10">
        <FeatureItem
          icon={<Globe size={18} />}
          title="Unicode 15.1"
          desc="Full support for complex sequences, skin tones, and the latest release of universal emojis."
        />
        <FeatureItem
          icon={<Zap size={18} />}
          title="Zero Latency"
          desc="Conversion is performed instantly in your browser's RAM for maximum speed and security."
        />
        <FeatureItem
          icon={<ShieldCheck size={18} />}
          title="Privacy First"
          desc="Your text and emojis never touch our servers. Processing is 100% client-side."
        />
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-emerald-600">
        {icon}{" "}
        <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">
          {title}
        </h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
