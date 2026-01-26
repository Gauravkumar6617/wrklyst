"use client";
import React, { useState, useEffect } from "react";
import {
  Code,
  Braces,
  Copy,
  Trash2,
  FileJson,
  AlertCircle,
  Download,
  Terminal,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ size: "0 B", nodes: 0 });

  // Deep node counter logic
  const countNodes = (obj: any): number => {
    if (typeof obj !== "object" || obj === null) return 1;
    return Object.values(obj).reduce(
      (acc: number, val) => acc + countNodes(val),
      1,
    );
  };

  useEffect(() => {
    if (!input.trim()) {
      setError(null);
      setStats({ size: "0 B", nodes: 0 });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setError(null);
      const size = new Blob([input]).size;
      const formattedSize =
        size > 1024 ? (size / 1024).toFixed(2) + " KB" : size + " B";
      setStats({ size: formattedSize, nodes: countNodes(parsed) });
    } catch (err: any) {
      setError(err.message);
    }
  }, [input]);

  const processJson = (mode: "pretty" | "minify") => {
    try {
      if (!input.trim()) return toast.error("Input is empty");
      const parsed = JSON.parse(input);
      setOutput(
        mode === "pretty"
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed),
      );
      toast.success(mode === "pretty" ? "Prettified!" : "Minified!");
    } catch (err) {
      toast.error("Invalid JSON Syntax");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    toast.dismiss();
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-slate-50 md:p-6 lg:p-10 transition-all">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-[#0B0F1A] rounded-b-3xl md:rounded-[40px] lg:rounded-[60px] p-6 sm:p-10 lg:p-16 shadow-2xl border-b-4 border-indigo-600 mb-6 md:mb-10">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Terminal size={12} className="text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-[2px] text-indigo-400">
                Architect Engine v2.0
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              JSON <span className="text-indigo-500 text-glow">Architect</span>
            </h1>
            <div className="flex justify-center lg:justify-start gap-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase">
              <span className="flex items-center gap-1">
                <span className="text-indigo-500">SIZE:</span> {stats.size}
              </span>
              <span className="text-slate-700">/</span>
              <span className="flex items-center gap-1">
                <span className="text-indigo-500">NODES:</span> {stats.nodes}
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row bg-white/5 p-1.5 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-xl gap-2">
            <button
              onClick={() => processJson("pretty")}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              <Braces size={16} /> Prettify
            </button>
            <button
              onClick={() => processJson("minify")}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-slate-300 hover:text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
            >
              <Code size={16} /> Minify
            </button>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 px-4 md:px-0">
        {/* INPUT PANEL */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
              Source Stream
            </span>
            <button
              onClick={handleClear}
              className="group flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-all text-[10px] font-bold uppercase"
            >
              <RotateCcw
                size={14}
                className="group-hover:rotate-[-180deg] transition-transform duration-500"
              />
              Reset
            </button>
          </div>
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[350px] md:h-[550px] p-6 md:p-8 bg-white border-2 border-slate-200 rounded-[24px] md:rounded-[40px] focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-mono text-sm shadow-sm resize-none"
              placeholder='{"paste": "raw_json_here"}'
            />
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-4">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[2px]">
              Architectural Output
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard");
                }}
                className="text-[10px] font-black text-slate-500 hover:text-indigo-600 flex items-center gap-1 uppercase transition-colors"
              >
                <Copy size={14} /> Copy
              </button>
              {output && (
                <button
                  onClick={() => {
                    const blob = new Blob([output], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `architect_${Date.now()}.json`;
                    a.click();
                  }}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase transition-colors"
                >
                  <Download size={14} /> Save
                </button>
              )}
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[24px] md:rounded-[40px] bg-[#0B0F1A] border-2 border-slate-800 shadow-2xl">
            <div className="w-full h-[350px] md:h-[550px] p-6 md:p-8 font-mono text-sm text-emerald-400 overflow-auto whitespace-pre custom-scrollbar">
              {output || (
                <div className="h-full flex flex-col items-center justify-center text-slate-700">
                  <FileJson size={60} className="mb-4 opacity-20" />
                  <span className="font-black uppercase tracking-[4px] text-[9px] opacity-40">
                    Awaiting Structure
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ERROR INDICATOR */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider shadow-[0_20px_50px_rgba(225,29,72,0.3)]">
            <AlertCircle size={18} className="shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        </div>
      )}

      {/* DESCRIPTIVE FOOTER */}
      <footer className="mt-20 py-10 border-t border-slate-200">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[4px]">
            Verified Secure Format
          </h2>
          <p className="max-w-2xl mx-auto text-[13px] text-slate-500 leading-relaxed px-6">
            Input data is processed <b>locally in your browser memory</b>. No
            data ever reaches our servers, making this safe for internal API
            logs, customer data, and proprietary configurations.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
