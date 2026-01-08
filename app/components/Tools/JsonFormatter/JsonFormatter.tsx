"use client";
import React, { useState } from "react";
import {
  Code,
  Braces,
  Copy,
  Trash2,
  FileJson,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formatJson = (indent: number = 2) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
      toast.success("JSON Formatted!");
    } catch (err: any) {
      setError(err.message);
      toast.error("Invalid JSON");
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      toast.success("JSON Minified!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Control Toolbar */}
      <div className="flex flex-wrap justify-between items-center bg-slate-900 p-4 rounded-3xl gap-4">
        <div className="flex gap-2">
          <button onClick={() => formatJson(2)} className="json-btn-primary">
            <Braces size={16} /> Format (2 Spaces)
          </button>
          <button onClick={minifyJson} className="json-btn-secondary">
            <Code size={16} /> Minify
          </button>
        </div>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          className="text-slate-400 hover:text-red-400 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* 2. Error/Success Indicator */}
      {error ? (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold">
          <AlertCircle size={18} /> Error: {error}
        </div>
      ) : (
        output && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-bold">
            <CheckCircle2 size={18} /> Valid JSON Structure
          </div>
        )
      )}

      {/* 3. Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[500px] p-6 bg-slate-50 border border-slate-200 rounded-[40px] font-mono text-sm outline-none focus:bg-white transition-all"
            placeholder='{"key": "value"}'
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-4">
            <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">
              Prettified Output
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied!");
              }}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#5D5FEF]"
            >
              <Copy size={14} /> Copy
            </button>
          </div>
          <div className="w-full h-[500px] p-6 bg-slate-900 border border-slate-800 rounded-[40px] font-mono text-sm text-emerald-400 overflow-auto whitespace-pre">
            {output || (
              <span className="text-slate-600 italic">
                // Formatted JSON will appear here
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
