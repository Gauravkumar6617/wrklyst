"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  Copy,
  Clock,
  Hash,
  AlignLeft,
  BookOpen,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/) : [];
    const wordCount = wordsArray.length;

    // Keyword Analysis
    const freq: Record<string, number> = {};
    wordsArray.forEach((w) => {
      const word = w.toLowerCase().replace(/[^a-z]/g, "");
      if (word.length > 3) freq[word] = (freq[word] || 0) + 1;
    });

    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      words: wordCount,
      chars: text.length,
      sentences: trimmed ? trimmed.split(/[.!?]+\s/).filter(Boolean).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
      readingTime: Math.max(1, Math.ceil(wordCount / 225)),
      speakingTime: Math.max(1, Math.ceil(wordCount / 150)),
      keywords: topKeywords,
    };
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-0 space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Content Editor
        </h2>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => setText("")}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Text Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <textarea
              className="w-full min-h-[400px] p-6 md:p-10 bg-white border-2 border-slate-100 rounded-[32px] md:rounded-[48px] 
                         outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/20 
                         transition-all text-lg leading-relaxed shadow-sm resize-none"
              placeholder="Start typing or paste your content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Quick Metrics (Mobile & Tablet View) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<Hash size={14} />}
              label="Words"
              value={stats.words}
              color="indigo"
            />
            <StatCard
              icon={<AlignLeft size={14} />}
              label="Chars"
              value={stats.chars}
              color="blue"
            />
            <StatCard
              icon={<Clock size={14} />}
              label="Reading"
              value={`${stats.readingTime}m`}
              color="emerald"
            />
            <StatCard
              icon={<BookOpen size={14} />}
              label="Speaking"
              value={`${stats.speakingTime}m`}
              color="amber"
            />
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-[32px] text-white space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Density Analysis
              </h3>
            </div>
            {stats.keywords.length > 0 ? (
              stats.keywords.map(([word, count]) => (
                <div key={word} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize text-slate-400">{word}</span>
                    <span className="font-bold text-indigo-400">{count}x</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min((count / stats.words) * 500, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                Enter more than 3 words to see keyword density.
              </p>
            )}
          </div>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[32px]">
            <h3 className="text-[10px] font-black uppercase text-indigo-500 mb-3 tracking-widest">
              Structure
            </h3>
            <div className="space-y-3">
              <DetailRow label="Sentences" value={stats.sentences} />
              <DetailRow label="Paragraphs" value={stats.paragraphs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div
      className={`p-4 rounded-2xl border ${colors[color]} flex flex-col items-center text-center`}
    >
      <div className="mb-2 opacity-60">{icon}</div>
      <p className="text-xl font-black mb-0.5">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">
        {label}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-indigo-200/30 pb-2 last:border-0 last:pb-0">
      <span className="text-indigo-900/60 font-medium">{label}</span>
      <span className="text-indigo-900 font-bold">{value}</span>
    </div>
  );
}
