"use client";
import React, { useState, useMemo } from "react";
import { Copy, Zap, Clock, FileText, Trash2, SearchCheck } from "lucide-react";
import { toast } from "react-hot-toast";

type SummaryLength = "short" | "medium" | "bullet";

export default function TextSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [length, setLength] = useState<SummaryLength>("medium");

  const runAdvancedSummary = () => {
    const rawSentences = text
      .split(/[.!?]+\s+/)
      .filter((s) => s.trim().length > 10);
    if (rawSentences.length < 3)
      return toast.error("Provide more context (3+ sentences).");

    const words = text.toLowerCase().match(/\b(\w{4,})\b/g) || [];
    const freqMap: Record<string, number> = {};
    words.forEach((w) => (freqMap[w] = (freqMap[w] || 0) + 1));

    const scoredSentences = rawSentences.map((sentence, index) => {
      const sWords = sentence.toLowerCase().match(/\b(\w{4,})\b/g) || [];
      let score = 0;
      sWords.forEach((w) => {
        if (freqMap[w]) score += freqMap[w];
      });
      if (index === 0) score *= 1.5;
      if (index === rawSentences.length - 1) score *= 1.2;
      return { sentence, score, index };
    });

    let limit = length === "short" ? 2 : length === "medium" ? 3 : 5;
    const finalSelection = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .sort((a, b) => a.index - b.index);
    const result = finalSelection.map((s) => s.sentence.trim() + ".");

    setSummary(
      length === "bullet"
        ? result.map((s) => `• ${s}`).join("\n\n")
        : result.join(" "),
    );
    toast.success("Summary generated");
  };

  const stats = useMemo(() => {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    return {
      readingTime: Math.ceil(wordCount / 200),
      chars: text.length,
      reduction: summary
        ? Math.round((1 - summary.length / text.length) * 100)
        : 0,
    };
  }, [text, summary]);

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-6 space-y-0 sm:space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* HEADER: Compact Typography */}
      <div className="bg-[#0B0F1A] p-6 sm:p-12 rounded-none sm:rounded-[48px] border-b-4 border-[#5D5FEF] text-white shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
              Text <span className="text-[#5D5FEF]">Condenser</span>
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge
                icon={<Clock size={10} />}
                text={`${stats.readingTime}m`}
              />
              <Badge
                icon={<FileText size={10} />}
                text={`${stats.chars} Chars`}
              />
              {stats.reduction > 0 && (
                <Badge
                  icon={<Zap size={10} />}
                  text={`${stats.reduction}%`}
                  color="bg-emerald-500"
                />
              )}
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
            {(["short", "medium", "bullet"] as SummaryLength[]).map((l) => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${length === l ? "bg-[#5D5FEF] text-white" : "text-white/40"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-6">
        {/* INPUT: Base font size */}
        <div className="bg-white p-5 sm:p-0">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Input Text
            </span>
            <button
              onClick={() => setText("")}
              className="text-slate-300 hover:text-rose-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text..."
            className="w-full h-[300px] sm:h-[500px] p-5 sm:p-8 bg-slate-50 border border-slate-100 rounded-[24px] sm:rounded-[48px] focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all font-serif text-base leading-relaxed shadow-inner resize-none"
          />
        </div>

        {/* OUTPUT: High contrast but smaller text */}
        <div className="bg-[#0B0F1A] p-5 sm:p-0 relative">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[9px] font-black text-[#5D5FEF] uppercase tracking-widest">
              Summary
            </span>
            {summary && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(summary);
                  toast.success("Copied");
                }}
                className="text-[9px] font-bold text-white/40 flex items-center gap-1"
              >
                <Copy size={10} /> COPY
              </button>
            )}
          </div>
          <div className="w-full h-[300px] sm:h-[500px] p-5 sm:p-8 bg-[#0B0F1A] text-slate-300 border border-slate-800 rounded-[24px] sm:rounded-[48px] overflow-auto whitespace-pre-wrap font-medium text-base leading-relaxed shadow-2xl">
            {summary || (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-[10px] tracking-[3px] font-black uppercase">
                <SearchCheck size={32} className="mb-3" /> Ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE CTA: Compact padding */}
      <div className="p-5 sm:p-0 pb-10">
        <button
          onClick={runAdvancedSummary}
          className="w-full py-5 bg-[#5D5FEF] text-white rounded-[20px] sm:rounded-[40px] font-black uppercase tracking-[2px] text-[11px] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
        >
          <Zap size={16} /> Summarize Now
        </button>
      </div>
    </div>
  );
}

function Badge({
  icon,
  text,
  color = "bg-white/10",
}: {
  icon: React.ReactNode;
  text: string;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 ${color} rounded-full text-[9px] font-bold uppercase tracking-wider`}
    >
      {icon} {text}
    </div>
  );
}
