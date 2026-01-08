"use client";

import React, { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState("");

  // Memoize calculations to keep performance high even with huge text
  const stats = useMemo(() => {
    const trimmedText = text.trim();
    return {
      words: trimmedText ? trimmedText.split(/\s+/).length : 0,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s+/g, '').length,
      sentences: trimmedText ? trimmedText.split(/[.!?]+\s/).filter(Boolean).length : 0,
      paragraphs: trimmedText ? trimmedText.split(/\n\s*\n/).filter(Boolean).length : 0,
      readingTime: Math.ceil((trimmedText ? trimmedText.split(/\s+/).length : 0) / 200) // Based on 200 wpm
    };
  }, [text]);

  const handleClear = () => setText("");

  return (
    <div className="w-full space-y-8">
      {/* Input Area */}
      <div className="relative group">
        <textarea 
          className="w-full h-80 p-8 bg-slate-50 border-2 border-slate-100 rounded-[40px] outline-none 
                     focus:ring-4 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF]/30 
                     transition-all text-lg leading-relaxed placeholder:text-slate-300"
          placeholder="Paste or type your text here to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck="false"
        />
        
        {text && (
          <button 
            onClick={handleClear}
            className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 
                       rounded-xl text-xs font-black text-slate-500 hover:text-red-500 transition-all shadow-sm"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Words" value={stats.words} primary />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="No Spaces" value={stats.charactersNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Read Time" value={`${stats.readingTime} min`} />
      </div>
    </div>
  );
}

// Reusable Stat Component for a clean UI
function StatCard({ label, value, primary = false }: { label: string, value: string | number, primary?: boolean }) {
  return (
    <div className={`p-5 rounded-3xl transition-all border ${
      primary 
      ? "bg-[#5D5FEF]/5 border-[#5D5FEF]/10 shadow-[0_10px_30px_rgba(93,95,239,0.05)]" 
      : "bg-slate-50 border-slate-100"
    }`}>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
        primary ? "text-[#5D5FEF]" : "text-slate-400"
      }`}>
        {label}
      </p>
      <p className="text-2xl font-black text-[#1E1F4B] tracking-tight">
        {value}
      </p>
    </div>
  );
}