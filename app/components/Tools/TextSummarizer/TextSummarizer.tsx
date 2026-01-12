"use client";
import React, { useState } from "react";
import { ListFilter, FileText, Copy, ListOrdered } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TextSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "bullet">("medium");

  const summarize = () => {
    if (!text.trim()) return;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    // Logic: Grab the first few sentences and a few middle ones based on length
    let count = length === "short" ? 2 : 5;
    let result = sentences.slice(0, count);

    if (length === "bullet") {
      setSummary(result.map((s) => `• ${s.trim()}`).join("\n"));
    } else {
      setSummary(result.join(" "));
    }
    toast.success("Summary Generated!");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-4 bg-slate-900 rounded-[24px]">
        {["short", "medium", "bullet"].map((l) => (
          <button
            key={l}
            onClick={() => setLength(l as any)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${length === l ? "bg-[#5D5FEF] text-white" : "text-white/40"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste long article here..."
          className="w-full h-80 p-6 bg-slate-50 border border-slate-100 rounded-[32px] outline-none font-serif"
        />
        <div className="w-full h-80 p-8 bg-white border-2 border-[#5D5FEF]/10 rounded-[40px] overflow-auto whitespace-pre-wrap">
          {summary || (
            <span className="text-slate-300 italic">
              Summary will appear here...
            </span>
          )}
        </div>
      </div>
      <button
        onClick={summarize}
        className="w-full py-4 bg-[#5D5FEF] text-white rounded-2xl font-black uppercase tracking-widest text-xs"
      >
        Generate Summary
      </button>
    </div>
  );
}
