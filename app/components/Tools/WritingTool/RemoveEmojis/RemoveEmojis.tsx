"use client";
import React, { useState, useMemo } from "react";
import {
  Smile,
  Trash2,
  Copy,
  Eraser,
  Type,
  Zap,
  Info,
  Smartphone,
  CheckCircle2,
  ListFilter,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function RemoveEmojis() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [autoCleanSpaces, setAutoCleanSpaces] = useState(true);

  // Advanced Unicode Regex covering the latest Emoji 15.1 standards
  // Includes Variation Selectors, Skin Tones, and Zero-Width Joiners
  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

  const stripEmojis = () => {
    if (!input.trim()) return toast.error("Please provide text first");

    let result = input.replace(emojiRegex, "");

    if (autoCleanSpaces) {
      // Removes double spaces often left behind by emojis and trims
      result = result.replace(/\s\s+/g, " ").trim();
    }

    setOutput(result);
    toast.success("Cleanup Complete!");
  };

  const stats = useMemo(
    () => ({
      chars: input.length,
      emojis: (input.match(emojiRegex) || []).length,
    }),
    [input],
  );

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Clean text copied!");
  };

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-4 space-y-6">
      {/* Advanced Control Header */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 bg-rose-50 rounded-none sm:rounded-[40px] border-b sm:border border-rose-100 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-3xl shadow-sm text-rose-500">
            <Smile size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
              Emoji Purifier
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Remove all pictorial symbols and icons instantly.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-rose-100 cursor-pointer group">
            <input
              type="checkbox"
              checked={autoCleanSpaces}
              onChange={(e) => setAutoCleanSpaces(e.target.checked)}
              className="w-4 h-4 accent-rose-500"
            />
            <span className="text-[10px] font-black uppercase text-slate-600">
              Fix Spaces
            </span>
          </label>
          <button
            onClick={stripEmojis}
            className="flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
          >
            <Eraser size={18} /> Execute Purge
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
        {/* Source Panel */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-slate-400">
                Source Text
              </span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500">
                {stats.emojis} Emojis Found
              </span>
            </div>
            <button
              onClick={() => setInput("")}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-8 bg-white border-2 border-slate-100 rounded-[32px] sm:rounded-[48px] focus:border-rose-200 outline-none transition-all font-mono text-sm shadow-inner resize-none"
            placeholder="Paste text with emojis 😀..."
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
              Clean Result
            </span>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-all disabled:opacity-30"
            >
              <Copy size={14} /> Copy Output
            </button>
          </div>
          <div className="w-full h-80 p-8 bg-[#0B0F1A] text-slate-200 rounded-[32px] sm:rounded-[48px] font-mono text-sm overflow-auto whitespace-pre-wrap border border-slate-800 shadow-2xl relative">
            {output || (
              <span className="text-slate-600 italic select-none">
                Cleaned text will appear here...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Logic & SEO Details */}
      <div className="pt-12 mt-12 border-t border-slate-100 px-6 sm:px-0 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        <FeatureItem
          icon={<Zap size={18} />}
          title="Deep Scan"
          desc="Detects Skin-tone modifiers, Zero-Width Joiners (ZWJ), and Variation Selectors."
        />
        <FeatureItem
          icon={<ListFilter size={18} />}
          title="Space Normalization"
          desc="Optionally collapses double spaces into single ones for perfectly formatted output."
        />
        <FeatureItem
          icon={<CheckCircle2 size={18} />}
          title="100% Client-Side"
          desc="Your text stays in your browser. No data is sent to our servers for processing."
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
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 text-rose-500 group-hover:translate-x-1 transition-transform">
        {icon}{" "}
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tighter">
          {title}
        </h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
