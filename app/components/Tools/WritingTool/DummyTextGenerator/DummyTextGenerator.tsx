"use client";
import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Hash, Sparkles, AlignLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const MODERN =
  "The quick brown fox jumps over the lazy dog. A dedicated design requires a balanced approach to typography and spacing. This placeholder content helps you visualize the final layout.";

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
    /* Outer Container: Set to p-0 for edge-to-edge mobile feel */
    <div className="w-full max-w-5xl mx-auto p-0 md:p-6 lg:p-12 space-y-4 md:space-y-8">
      {/* 1. CONTROL PANEL - Dark Navy Card */}
      <div className="bg-[#1E1F4B] p-4 md:p-8 rounded-none md:rounded-[40px] shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {/* Unit Type */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest ml-1 block">
              Unit Type
            </label>
            <div className="flex bg-white/5 p-1 rounded-lg md:rounded-xl border border-white/10">
              {["paragraphs", "sentences"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as any)}
                  className={`flex-1 py-1.5 px-1 rounded-md text-[9px] md:text-[10px] font-black uppercase transition-all truncate ${type === t ? "bg-indigo-500 text-white" : "text-slate-400"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Styling */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest ml-1 block">
              Styling
            </label>
            <div className="flex bg-white/5 p-1 rounded-lg md:rounded-xl border border-white/10">
              {["latin", "english"].map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v as any)}
                  className={`flex-1 py-1.5 px-1 rounded-md text-[9px] md:text-[10px] font-black uppercase transition-all ${vibe === v ? "bg-emerald-500 text-white" : "text-slate-400"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest ml-1 block">
              Quantity
            </label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 py-1.5">
              <Hash size={12} className="text-indigo-400 mr-2 shrink-0" />
              <input
                type="number"
                value={count}
                onChange={(e) =>
                  setCount(Math.min(50, Math.max(1, Number(e.target.value))))
                }
                className="bg-transparent text-white font-bold text-xs w-full outline-none"
              />
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={() => setStartWithLorem(!startWithLorem)}
              className={`w-full py-2.5 rounded-lg md:rounded-xl border transition-all text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${startWithLorem ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-slate-500"}`}
            >
              <Sparkles size={12} />
              Lorem: {startWithLorem ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. RESULT AREA - White Card */}
      <div className="bg-white border-y md:border border-slate-200 rounded-none md:rounded-[32px] overflow-hidden flex flex-col">
        {/* Output Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-md text-white">
              <AlignLeft size={14} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-[#1E1F4B] uppercase tracking-widest">
              Live Output
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generate}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 active:scale-90 transition-transform"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied!");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E1F4B] text-white rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 transition-transform"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-5 md:p-12">
          <div className="font-serif text-sm md:text-lg leading-relaxed text-slate-700 max-w-3xl mx-auto whitespace-pre-wrap break-words">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}
