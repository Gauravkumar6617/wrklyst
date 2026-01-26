"use client";
import React, { useState, useMemo } from "react";
import { Brain, BookOpen, Gauge, Hash, Layout, Info } from "lucide-react";

export default function ReadabilityChecker() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    // 1. Safe Default State to prevent TS(18048)
    const emptyState = {
      score: 0,
      level: "N/A",
      grade: 0,
      sentences: 0,
      words: 0,
      paragraphs: 0,
      avgSentenceLength: 0,
    };

    if (!text.trim()) return emptyState;

    // 2. Core Metrics Extraction
    const wordsArray = text.trim().split(/\s+/);
    const words = wordsArray.length;
    const sentences = (text.match(/[.!?]/g) || []).length || 1;
    const paragraphs = text
      .split(/\n\s*\n/)
      .filter((p) => p.trim() !== "").length;

    // Rough syllable count using regex
    const syllables = (text.match(/[aeiouy]{1,2}/gi) || []).length;

    // 3. Formulas
    // Flesch Reading Ease
    const score = Math.round(
      206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    );

    // Flesch-Kincaid Grade Level
    const grade = Math.round(
      0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
    );

    const avgSentenceLength = Math.round(words / sentences);

    // 4. Labels
    let level = "College";
    if (score > 90) level = "Very Easy";
    else if (score > 60) level = "Standard";
    else if (score > 30) level = "Difficult";

    return {
      score,
      level,
      grade: Math.max(1, grade),
      sentences,
      words,
      paragraphs,
      avgSentenceLength,
    };
  }, [text]);

  return (
    <div className="space-y-8">
      {/* 1. Main Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-[#1E1F4B] rounded-[32px] text-white shadow-xl">
          <p className="text-[10px] font-black uppercase opacity-50 mb-2 tracking-[1px]">
            Reading Ease
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">{stats.score}</span>
            <span className="text-[10px] mb-1 font-bold text-emerald-400 uppercase">
              {stats.level}
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#5D5FEF] rounded-[32px] text-white shadow-xl">
          <p className="text-[10px] font-black uppercase opacity-50 mb-2 tracking-[1px]">
            Grade Level
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">Lvl {stats.grade}</span>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-slate-100 rounded-[32px] shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[1px]">
            Paragraphs
          </p>
          <span className="text-4xl font-black text-slate-800">
            {stats.paragraphs}
          </span>
        </div>

        <div className="p-6 bg-white border-2 border-slate-100 rounded-[32px] shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[1px]">
            Sentences
          </p>
          <span className="text-4xl font-black text-slate-800">
            {stats.sentences}
          </span>
        </div>
      </div>

      {/* 2. Secondary Stats & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Writing Canvas
            </label>
            <span className="text-[10px] font-bold text-[#5D5FEF]">
              {stats.words} Words Total
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-96 p-8 bg-slate-50 border-2 border-slate-100 rounded-[40px] focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all font-serif text-lg leading-relaxed shadow-inner"
            placeholder="Paste your article or essay here for a deep structure analysis..."
          />
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 h-full">
            <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-700">
              <Info size={16} className="text-[#5D5FEF]" /> Structural Analysis
            </h4>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Avg. Sentence Length
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {stats.avgSentenceLength} words per sentence
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-[#5D5FEF] h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min(stats.avgSentenceLength * 2, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  Tip: A standard reading level is between **60-70**. Aim for
                  shorter sentences to improve clarity for global audiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
