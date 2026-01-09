"use client";
import React, { useState } from "react";
import { Smile, Trash2, Copy, Eraser } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RemoveEmojis() {
  const [text, setText] = useState("");

  const stripEmojis = () => {
    if (!text) return;
    // Modern Unicode Regex for Emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    setText(text.replace(emojiRegex, ""));
    toast.success("Emojis removed!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-6 bg-rose-50 rounded-[32px] border border-rose-100">
        <div className="flex items-center gap-3 text-rose-600">
          <Smile size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Emoji Stripper Mode</span>
        </div>
        <button onClick={stripEmojis} className="flex items-center gap-2 px-6 py-2 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
          <Eraser size={16} /> Remove All Emojis
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-80 p-8 bg-white border-2 border-slate-100 rounded-[40px] font-mono text-sm focus:border-rose-200 outline-none transition-all"
        placeholder="Paste text with emojis like 😀 🚀 🔥 here..."
      />
    </div>
  );
}