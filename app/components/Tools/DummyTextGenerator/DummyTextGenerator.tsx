"use client";
import React, { useState, useEffect } from "react";
import {
  Copy,
  RefreshCw,
  Hash,
  AlignLeft,
  Sparkles,
  Layout,
} from "lucide-react";
import { toast } from "react-hot-toast";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const MODERN =
  "The quick brown fox jumps over the lazy dog. A dedicated design requires a balanced approach to typography and spacing. This placeholder content helps you visualize the final layout before the actual copy is written.";

export default function DummyTextGenerator() {
  const [type, setType] = useState<"paragraphs" | "sentences">("paragraphs");
  const [vibe, setVibe] = useState<"latin" | "english">("latin");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const generate = () => {
    const baseText = vibe === "latin" ? LOREM : MODERN;
    let result = [];

    for (let i = 0; i < count; i++) {
      let text = baseText;
      // Add randomness so it's not the same text repeated perfectly
      if (i > 0 || !startWithLorem) {
        const words = baseText.split(" ");
        text = words.sort(() => Math.random() - 0.5).join(" ");
      }

      result.push(type === "paragraphs" ? text : text.split(".")[0] + ".");
    }
    setOutput(result.join("\n\n"));
  };

  useEffect(() => {
    generate();
  }, [type, vibe, count, startWithLorem]);

  return (
    <div className="space-y-8">
      {/* 1. Pro Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-900 p-6 rounded-[32px] shadow-2xl">
        {/* Type Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">
            Text Type
          </label>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {["paragraphs", "sentences"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t as any)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${type === t ? "bg-[#5D5FEF] text-white" : "text-white/40 hover:text-white"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">
            Language Style
          </label>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {["latin", "english"].map((v) => (
              <button
                key={v}
                onClick={() => setVibe(v as any)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${vibe === v ? "bg-emerald-500 text-white" : "text-white/40 hover:text-white"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">
            Amount
          </label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Hash size={14} className="text-[#5D5FEF] mr-2" />
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-transparent text-white font-bold text-sm w-full outline-none"
            />
          </div>
        </div>

        {/* Start with Lorem Toggle */}
        <div className="space-y-2 flex flex-col justify-end">
          <button
            onClick={() => setStartWithLorem(!startWithLorem)}
            className={`w-full py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${startWithLorem ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5" : "border-white/10 text-white/40"}`}
          >
            Start with "Lorem"? {startWithLorem ? "YES" : "NO"}
          </button>
        </div>
      </div>

      {/* 2. Professional Result Area */}
      <div className="bg-white border-2 border-slate-100 rounded-[48px] p-10 relative group shadow-sm">
        <div className="absolute top-8 right-8 flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              toast.success("Copied!");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E1F4B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            <Copy size={16} /> Copy All
          </button>
          <button
            onClick={generate}
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-[#5D5FEF] transition-all"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="font-serif text-lg leading-loose text-slate-700 max-w-3xl whitespace-pre-wrap pt-12 lg:pt-0">
          {output}
        </div>
      </div>
    </div>
  );
}
