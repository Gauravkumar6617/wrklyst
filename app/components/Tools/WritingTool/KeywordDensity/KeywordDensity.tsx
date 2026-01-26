"use client";
import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Trash2,
  Copy,
  Search,
  Target,
  FileText,
  Info,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function KeywordDensity() {
  const [text, setText] = useState("");

  const stopWords = useMemo(
    () => [
      "the",
      "and",
      "for",
      "with",
      "that",
      "this",
      "from",
      "your",
      "will",
      "have",
      "was",
      "are",
      "but",
      "not",
      "what",
      "all",
      "were",
      "when",
      "can",
      "said",
      "there",
      "use",
      "each",
      "which",
      "how",
      "their",
      "will",
      "up",
      "other",
      "about",
      "out",
      "many",
      "then",
      "them",
      "these",
      "some",
      "her",
      "would",
      "make",
      "like",
      "him",
      "into",
      "time",
      "has",
      "look",
      "two",
      "more",
      "write",
      "go",
      "see",
      "is",
      "are",
      "was",
      "were",
      "been",
      "being",
      "have",
      "has",
      "had",
      "does",
    ],
    [],
  );

  const densityData = useMemo(() => {
    if (!text.trim()) return [];

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    const filtered = words.filter(
      (w) => !stopWords.includes(w) && w.length > 3,
    );

    const freq: Record<string, number> = {};
    filtered.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

    return Object.entries(freq)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / totalWords) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [text, stopWords]);

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-6 space-y-0 sm:space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER: Edge-to-Edge on Mobile */}
      <div className="bg-[#0B0F1A] p-6 sm:p-12 rounded-none sm:rounded-[48px] border-b-4 border-[#5D5FEF] text-white shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase">
              Keyword <span className="text-[#5D5FEF]">Density</span>
            </h1>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[3px]">
              SEO Content Optimization Engine
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center px-4 border-r border-white/10">
              <span className="text-2xl font-black text-[#5D5FEF]">
                {text.trim() ? text.trim().split(/\s+/).length : 0}
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Words
              </span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-2xl font-black text-emerald-400">
                {densityData.length}
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Keywords
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8">
        {/* INPUT PANEL: p-0 Mobile */}
        <div className="bg-white p-6 sm:p-0">
          <div className="flex justify-between items-center mb-3 px-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Source Content
            </span>
            <button
              onClick={() => setText("")}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              aria-label="Clear Text"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[300px] sm:h-[500px] p-6 sm:p-8 bg-slate-50 border-2 border-slate-100 rounded-[24px] sm:rounded-[40px] focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all font-sans text-base leading-relaxed shadow-inner resize-none"
            placeholder="Paste your article or blog post here to analyze keyword frequency..."
          />
        </div>

        {/* ANALYSIS PANEL: High contrast data visualization */}
        <div className="bg-[#0B0F1A] p-6 sm:p-0 relative min-h-[400px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={14} /> Frequency Distribution
            </span>
            {densityData.length > 0 && (
              <button
                onClick={() => {
                  const result = densityData
                    .map((d) => `${d.word}: ${d.count}x (${d.percentage}%)`)
                    .join("\n");
                  navigator.clipboard.writeText(result);
                  toast.success("Analysis Copied!");
                }}
                className="text-[9px] font-bold text-white/40 hover:text-white flex items-center gap-1 uppercase transition-colors"
              >
                <Copy size={12} /> Copy Data
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {densityData.length > 0 ? (
              densityData.map((item) => (
                <div
                  key={item.word}
                  className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#5D5FEF]/30 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-200 capitalize text-sm">
                      {item.word}
                    </span>
                    <div className="flex gap-3 items-center">
                      <span className="text-[10px] font-black text-[#5D5FEF]">
                        {item.count}x
                      </span>
                      <span className="text-[10px] font-black text-slate-500">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5D5FEF] rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(parseFloat(item.percentage) * 10, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center">
                <Target size={48} className="text-white mb-4 animate-pulse" />
                <p className="text-[10px] font-black text-white uppercase tracking-[4px]">
                  Awaiting Analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: SEO Insights */}
      <div className="px-8 sm:px-0 py-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <FeatureItem
          icon={<Search size={16} />}
          title="SEO Optimization"
          desc="Identify over-used keywords to avoid keyword stuffing penalties from search engines."
        />
        <FeatureItem
          icon={<Zap size={16} />}
          title="Instant Processing"
          desc="Analysis happens locally in your browser. No data ever leaves your device."
        />
        <FeatureItem
          icon={<Info size={16} />}
          title="Smart Filtering"
          desc="Automatically ignores common stop words and small prepositions to find your real topics."
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
      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest">
        <span className="text-[#5D5FEF]">{icon}</span> {title}
      </h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
