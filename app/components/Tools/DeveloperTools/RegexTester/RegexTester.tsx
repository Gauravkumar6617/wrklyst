"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Code2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function RegexTester() {
  const [pattern, setPattern] = useState(
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  );
  const [testString, setTestString] = useState(
    "Contact us at support@wrklyst.com or hello@example.org"
  );
  const [flags, setFlags] = useState("g");

  // Real-time Logic Engine
  const analysis = useMemo(() => {
    if (!pattern || !testString)
      return { html: testString, count: 0, error: null };

    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      const count = matches ? matches.length : 0;

      // Create highlighted HTML
      // We use a replacement function to wrap matches in a styled span
      const highlighted = testString.replace(
        regex,
        (match) =>
          `<span class="bg-indigo-500/20 border-b-2 border-indigo-500 text-indigo-900 rounded-sm font-bold">${match}</span>`
      );

      return { html: highlighted, count, error: null };
    } catch (err: any) {
      return { html: testString, count: 0, error: err.message };
    }
  }, [pattern, testString, flags]);

  return (
    <div className="space-y-8">
      {/* 1. Regex Input Header */}
      <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">
              Regular Expression
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-mono text-xl">
                /
              </span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full p-5 pl-10 pr-20 bg-white/5 border border-white/10 rounded-2xl text-indigo-300 font-mono text-lg outline-none focus:border-indigo-500/50 transition-all"
                placeholder="[a-z]+"
              />
              <span className="absolute right-14 top-1/2 -translate-y-1/2 text-white/20 font-mono text-xl">
                /
              </span>
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 bg-transparent text-emerald-400 font-mono text-lg outline-none"
                placeholder="g"
              />
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {analysis.error ? (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            <AlertCircle size={14} /> Invalid Regex: {analysis.error}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={14} /> Valid Regex: {analysis.count} matches
            found
          </div>
        )}
      </div>

      {/* 2. Test Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Test String
            </label>
            <button
              onClick={() => setTestString("")}
              className="text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full h-80 p-8 bg-slate-50 border border-slate-100 rounded-[40px] focus:bg-white outline-none transition-all font-mono text-sm leading-relaxed"
            placeholder="Paste text to test your regex against..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">
              Visual Results
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(testString);
                toast.success("Original text copied!");
              }}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#5D5FEF] uppercase"
            >
              <Copy size={14} /> Copy Source
            </button>
          </div>
          <div
            className="w-full h-80 p-8 bg-white border-2 border-slate-100 rounded-[40px] font-mono text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html:
                analysis.html ||
                '<span class="text-slate-300 italic">No matches...</span>',
            }}
          />
        </div>
      </div>
    </div>
  );
}
