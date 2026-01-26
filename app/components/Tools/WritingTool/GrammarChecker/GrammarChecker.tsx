"use client";
import React, { useState, useMemo } from "react";
import { Search, CheckCircle2, AlertTriangle, Copy, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Common mistakes database (Basic Grammar/Spell engine)
const COMMON_MISTAKES = [
  { regex: /\b(recieve)\b/gi, fix: "receive", type: "spelling" },
  { regex: /\b(teh)\b/gi, fix: "the", type: "spelling" },
  { regex: /\b(your)\b(?=\s+(a|an|the|very|really))/gi, fix: "you're", type: "grammar" },
  { regex: /\b(its)\b(?=\s+(a|an|the|very|really|going))/gi, fix: "it's", type: "grammar" },
  { regex: /\b(\w+)\s+\1\b/gi, fix: "remove duplicate", type: "duplicate" }, // "the the"
  { regex: /(^|[.!?]\s+)([a-z])/g, fix: "Capitalize", type: "capital" },
];

export default function GrammarChecker() {
  const [text, setText] = useState("");

  const analysis = useMemo(() => {
    if (!text) return { html: "", errors: 0 };
    
    let highlighted = text;
    let errorCount = 0;

    COMMON_MISTAKES.forEach((mistake) => {
      const matches = highlighted.match(mistake.regex);
      if (matches) {
        errorCount += matches.length;
        highlighted = highlighted.replace(mistake.regex, (match) => 
          `<span class="bg-rose-100 text-rose-700 border-b-2 border-rose-500 cursor-help" title="Suggestion: ${mistake.fix}">${match}</span>`
        );
      }
    });

    return { html: highlighted, errors: errorCount };
  }, [text]);

  return (
    <div className="space-y-8">
      {/* 1. Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type your content</label>
            <button onClick={() => setText("")} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-80 p-8 bg-slate-50 border border-slate-100 rounded-[40px] focus:bg-white outline-none transition-all font-serif text-lg leading-relaxed shadow-inner"
            placeholder="Paste text here to check for 'teh' mistakes or 'the the' duplicate words..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">Analysis Result</label>
            <div className="flex items-center gap-2">
               {analysis.errors > 0 ? (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 italic">
                   <AlertTriangle size={12}/> {analysis.errors} issues found
                 </span>
               ) : (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                   <CheckCircle2 size={12}/> Text looks good
                 </span>
               )}
            </div>
          </div>
          <div 
            className="w-full h-80 p-8 bg-white border-2 border-slate-100 rounded-[40px] font-serif text-lg leading-relaxed overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: analysis.html || '<span class="text-slate-300 italic">Analysis will appear here...</span>' }}
          />
        </div>
      </div>

      {/* 2. SEO Explanation Card */}
      <div className="bg-[#1E1F4B] p-8 rounded-[40px] text-white/90">
        <h3 className="text-sm font-black uppercase tracking-[2px] mb-4 text-[#5D5FEF]">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed opacity-80">
          <p><strong>Duplicate Detection:</strong> We scan your text for accidental double words like "the the" or "and and" which are common when typing quickly.</p>
          <p><strong>Common Typos:</strong> Our engine fixes common "fat-finger" mistakes like "teh" or "recieve" automatically.</p>
          <p><strong>Contextual Grammar:</strong> Basic checks for homophones like "your" vs "you're" based on following adjectives or articles.</p>
        </div>
      </div>
    </div>
  );
}