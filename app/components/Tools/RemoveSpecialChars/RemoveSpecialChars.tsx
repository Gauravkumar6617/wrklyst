"use client";
import React, { useState } from "react";
import { Trash2, Copy, ShieldCheck, Eraser } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RemoveSpecialChars() {
  const [text, setText] = useState("");
  const [keepNumbers, setKeepNumbers] = useState(true);

  const cleanText = () => {
    if (!text) return;
    // Regex: ^ means "not". We replace anything that is NOT a letter (and optionally not a number)
    const regex = keepNumbers ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z\s]/g;
    setText(text.replace(regex, ""));
    toast.success("Special characters removed!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 p-6 bg-slate-50 rounded-[32px] border border-slate-100 items-center">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={keepNumbers} 
            onChange={(e) => setKeepNumbers(e.target.checked)}
            className="w-4 h-4 accent-[#5D5FEF]" 
          />
          <span className="text-sm font-bold text-slate-600">Keep Numbers (0-9)</span>
        </label>
        <button onClick={cleanText} className="ml-auto flex items-center gap-2 px-6 py-2 bg-[#5D5FEF] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4d4fdf] transition-all">
          <Eraser size={16} /> Clean Text
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-80 p-8 bg-white border-2 border-slate-100 rounded-[40px] font-mono text-sm focus:border-[#5D5FEF]/20 outline-none transition-all"
        placeholder="Paste text with symbols like !@# $%^ &* here..."
      />
    </div>
  );
}