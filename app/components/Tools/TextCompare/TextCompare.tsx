"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  Columns,
  Trash2,
  Settings2,
  ArrowLeftRight,
  Copy,
  LayoutList,
  Zap,
  FileUp,
  Download,
  Info,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import * as Diff from "diff";
import { toast } from "react-hot-toast";

export default function TextCompare() {
  // --- State Management ---
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [viewMode, setViewMode] = useState<"side" | "unified">("side");
  const [diffLevel, setDiffLevel] = useState<"word" | "char" | "line">("word");

  // Options
  const [options, setOptions] = useState({
    ignoreCase: false,
    ignoreWhitespace: false,
    ignorePunctuation: false,
  });

  // --- Logic Functions ---
  const swapTexts = () => {
    setText1(text2);
    setText2(text1);
    toast.success("Texts swapped!");
  };
  const preprocessText = (text: string) => {
    let t = text;

    if (options.ignoreCase) {
      t = t.toLowerCase();
    }

    if (options.ignoreWhitespace) {
      // normalize whitespace but DO NOT remove it completely
      t = t.replace(/\s+/g, " ");
    }

    // ⚠️ DO NOT TOUCH SPECIAL CHARS unless user enables it
    if (options.ignorePunctuation) {
      t = t.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/g, "");
    }

    return t;
  };

  // 1. Bulletproof Diff Logic
  const diffResult = useMemo<Diff.Change[]>(() => {
    if (!text1 && !text2) return [];

    try {
      const t1 = preprocessText(text1);
      const t2 = preprocessText(text2);

      switch (diffLevel) {
        case "char":
          return Diff.diffChars(t1, t2);

        case "line":
          return Diff.diffLines(t1, t2);

        default:
          return Diff.diffWords(t1, t2);
      }
    } catch (err) {
      console.error("Diff failed:", err);
      return [];
    }
  }, [
    text1,
    text2,
    diffLevel,
    options.ignoreCase,
    options.ignoreWhitespace,
    options.ignorePunctuation,
  ]);

  // 2. Safe Stats Logic
  const stats = useMemo(() => {
    if (!text1 && !text2) {
      return { score: 100, added: 0, removed: 0 };
    }

    const added = diffResult
      .filter((p) => p.added)
      .reduce((sum, p) => sum + (p.value?.length || 0), 0);

    const removed = diffResult
      .filter((p) => p.removed)
      .reduce((sum, p) => sum + (p.value?.length || 0), 0);

    const total = Math.max(text1.length, text2.length);

    if (total === 0) {
      return { score: 100, added: 0, removed: 0 };
    }

    const score = Math.round(((total - (added + removed) / 2) / total) * 100);

    return {
      score: Math.max(0, Math.min(100, score)),
      added,
      removed,
    };
  }, [diffResult, text1, text2]);

  // Similarity Score Calculation
  const copyResult = () => {
    const resultText = diffResult.map((p) => p.value).join("");
    navigator.clipboard.writeText(resultText);
    toast.success("Comparison copied!");
  };
  return (
    <div className="space-y-6">
      {/* 1. TOP DASHBOARD (Stats & Mode) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-wrap gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <button
            onClick={() => setViewMode("side")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all ${
              viewMode === "side"
                ? "bg-white shadow-sm text-[#5D5FEF]"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Columns size={14} /> Side-by-Side
          </button>
          <button
            onClick={() => setViewMode("unified")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all ${
              viewMode === "unified"
                ? "bg-white shadow-sm text-[#5D5FEF]"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutList size={14} /> Unified View
          </button>
          <div className="w-px bg-slate-200 my-1 mx-2" />
          <select
            value={diffLevel}
            onChange={(e) => setDiffLevel(e.target.value as any)}
            className="bg-transparent text-xs font-black text-[#1E1F4B] outline-none px-2 cursor-pointer uppercase tracking-tighter"
          >
            <option value="line">Line Level</option>
            <option value="word">Word Level</option>
            <option value="char">Character Level</option>
          </select>
        </div>

        <div className="bg-[#1E1F4B] p-4 rounded-2xl flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Similarity
            </span>
          </div>
          <span className="text-xl font-black">{stats.score}%</span>
        </div>
      </div>

      {/* 2. SETTINGS PANEL */}
      <div className="flex flex-wrap items-center gap-6 px-4 py-2">
        {Object.keys(options).map((key) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={(options as any)[key]}
              onChange={() =>
                setOptions((prev) => ({ ...prev, [key]: !(prev as any)[key] }))
              }
              className="w-4 h-4 rounded border-slate-300 text-[#5D5FEF] focus:ring-[#5D5FEF]"
            />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
          </label>
        ))}
        <button
          onClick={swapTexts}
          className="ml-auto text-slate-400 hover:text-[#5D5FEF] transition-all"
        >
          <ArrowLeftRight size={18} />
        </button>
      </div>

      {/* 3. INPUT AREAS (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="Original Text..."
          className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-mono text-sm outline-none"
        />
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="Modified Text..."
          className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-mono text-sm outline-none"
        />
      </div>

      {/* 4. PREMIUM FILE UPLOAD (Freemium Hook) */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-[#5D5FEF]">
            <FileUp size={18} />
          </div>
          <div>
            <p className="text-xs font-black text-[#1E1F4B]">
              Upload Documents
            </p>
            <p className="text-[10px] text-slate-500 font-medium italic">
              Supports .docx, .pdf, .txt (Pro Feature)
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white border border-indigo-200 rounded-xl text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest hover:bg-indigo-50 transition-all">
          Try Pro
        </button>
      </div>

      {/* 5. RESULT VIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[#1E1F4B] uppercase tracking-widest text-xs">
            Analysis Output
          </h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Download size={16} />
            </button>
            <button onClick={copyResult}>
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="w-full min-h-[300px] p-8 bg-white border-2 border-slate-100 rounded-[40px] font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {diffResult.length === 0 ? (
            <div className="text-center py-20 text-slate-300 italic">
              Start typing to see differences...
            </div>
          ) : (
            diffResult.map((part, i) => (
              <span
                key={i}
                className={`${
                  part.added
                    ? "bg-emerald-100 text-emerald-800 rounded px-0.5"
                    : part.removed
                    ? "bg-rose-100 text-rose-800 line-through rounded px-0.5"
                    : "text-slate-600"
                }`}
              >
                {part.value}
              </span>
            ))
          )}
        </div>
      </div>

      {/* 6. SEO SUMMARY CARD */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
        <h4 className="text-sm font-black text-[#1E1F4B] mb-6 flex items-center gap-2">
          <Info size={16} className="text-[#5D5FEF]" /> Comparison Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Status
            </p>
            <p
              className={`text-xs font-bold ${
                stats.score === 100 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {stats.score === 100 ? "Identical" : "Modified"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Words Added
            </p>
            <p className="text-xs font-bold text-slate-700">
              {stats.added} chars
            </p>
          </div>
          {/* Add more stats here for SEO crawlers */}
        </div>
      </div>
    </div>
  );
}
