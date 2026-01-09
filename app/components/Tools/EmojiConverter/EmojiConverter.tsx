"use client";
import React, { useState, useEffect } from "react";
import { Smile, Type, Copy, ArrowRightLeft, Sparkles, Hash } from "lucide-react";
import { toast } from "react-hot-toast";

// A small dictionary for demonstration - in production, you'd use a larger JSON map
const EMOJI_MAP: Record<string, string> = {
  "🔥": ":fire:",
  "❤️": ":heart:",
  "🚀": ":rocket:",
  "✨": ":sparkles:",
  "😂": ":joy:",
  "👍": ":thumbsup:",
  "✅": ":check:",
  "❌": ":x:",
  "⭐": ":star:",
  "🎉": ":tada:",
};

// Reverse map for Text to Emoji
const TEXT_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(EMOJI_MAP).map(([emoji, text]) => [text, emoji])
);

export default function EmojiConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"to-text" | "to-emoji">("to-text");

  const convert = () => {
    if (!input) { setOutput(""); return; }

    let result = input;
    if (mode === "to-text") {
      // Replace Emojis with Shortcodes
      Object.entries(EMOJI_MAP).forEach(([emoji, text]) => {
        result = result.replaceAll(emoji, text);
      });
    } else {
      // Replace Shortcodes with Emojis
      Object.entries(TEXT_MAP).forEach(([text, emoji]) => {
        result = result.replaceAll(text, emoji);
      });
    }
    setOutput(result);
  };

  useEffect(() => {
    convert();
  }, [input, mode]);

  const swapMode = () => {
    setMode(mode === "to-text" ? "to-emoji" : "to-text");
    setInput(output); // Move current output to input for easy back-and-forth
  };

  return (
    <div className="space-y-8">
      {/* 1. Tool Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-[32px] gap-4 shadow-xl border-b-4 border-emerald-500">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl text-white">
            <Smile size={20}/>
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Emoji Engine</h3>
            <p className="text-[10px] text-emerald-400 font-bold uppercase">Mode: {mode === 'to-text' ? 'Emoji → Shortcode' : 'Shortcode → Emoji'}</p>
          </div>
        </div>

        <button 
          onClick={swapMode}
          className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
        >
          <ArrowRightLeft size={14} /> Swap Direction
        </button>
      </div>

      {/* 2. Conversion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            {mode === 'to-text' ? 'Paste Emojis' : 'Enter Shortcodes (e.g. :fire:)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-8 bg-slate-50 border-2 border-slate-100 rounded-[40px] focus:bg-white focus:border-emerald-200 outline-none transition-all font-mono text-lg shadow-inner"
            placeholder={mode === 'to-text' ? "Paste: 🔥🚀✨" : "Type: :fire: :rocket:"}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Converted Result</label>
            <button 
              onClick={() => {navigator.clipboard.writeText(output); toast.success("Copied!");}}
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-emerald-600 uppercase transition-colors"
            >
              <Copy size={14}/> Copy
            </button>
          </div>
          <div className="w-full h-64 p-8 bg-white border-2 border-emerald-100 rounded-[40px] font-mono text-lg leading-relaxed overflow-auto shadow-sm">
            {output || <span className="text-slate-300 italic">Result will appear here...</span>}
          </div>
        </div>
      </div>

      {/* 3. SEO Content Footer */}
      <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
            <Hash size={16} className="text-emerald-500"/> What are Shortcodes?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Shortcodes are text-based aliases for emojis, like <code>:fire:</code> for 🔥. They are used by platforms like Discord, Slack, and GitHub to help users insert emojis without an emoji keyboard.
          </p>
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
            <Sparkles size={16} className="text-emerald-500"/> Use Cases
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Convert your Slack messages to clean text for documentation, or turn text shortcodes into emojis for social media posts and bio descriptions.
          </p>
        </div>
      </div>
    </div>
  );
}