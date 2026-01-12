"use client";
import React, { useState, useMemo } from "react";

export default function KeywordDensity() {
  const [text, setText] = useState("");
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "is",
    "are",
    "was",
    "to",
    "of",
    "in",
    "it",
  ];

  const density = useMemo(() => {
    if (!text.trim()) return [];
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const filtered = words.filter(
      (w) => !stopWords.includes(w) && w.length > 2
    );
    const freq: any = {};
    filtered.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

    return Object.entries(freq)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10);
  }, [text]);

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 p-6 bg-slate-50 border rounded-3xl outline-none"
        placeholder="Enter text to analyze keyword frequency..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {density.map(([word, count]: any) => (
          <div
            key={word}
            className="flex justify-between items-center p-4 bg-white border rounded-2xl"
          >
            <span className="font-bold text-slate-700 capitalize">{word}</span>
            <div className="flex gap-4">
              <span className="text-xs font-black text-[#5D5FEF]">
                {count}x
              </span>
              <span className="text-xs text-slate-400">
                {Math.round((count / text.split(" ").length) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
