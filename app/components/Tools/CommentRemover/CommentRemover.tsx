"use client";
import React, { useState } from "react";
import { Trash2, Copy, FileCode, Code, Terminal, Eraser } from "lucide-react";
import { toast } from "react-hot-toast";

type LangMode = "js-style" | "html" | "python" | "css";

export default function CommentRemover() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<LangMode>("js-style");

  const removeComments = () => {
    if (!input) return;

    let result = input;

    // Regex library for different comment styles
    const regexMap = {
      "js-style": /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, // JS, TS, C++, Java, PHP
      html: /()/g, // HTML, XML
      python: /(#.*$)/gm, // Python, Ruby, Shell
      css: /(\/\*([\s\S]*?)\*\/)/g, // CSS
    };

    result = result.replace(regexMap[mode], "");

    // Optional: Remove extra empty lines left behind
    result = result.replace(/^\s*[\r\n]/gm, "");

    setOutput(result.trim());
    toast.success("Comments removed!");
  };

  return (
    <div className="space-y-8">
      {/* 1. Configuration Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-900 p-6 rounded-[32px] shadow-2xl">
        <div className="lg:col-span-3 flex flex-wrap gap-2">
          {[
            { id: "js-style", label: "JS / C / PHP", icon: <Code size={14} /> },
            {
              id: "python",
              label: "Python / Ruby",
              icon: <Terminal size={14} />,
            },
            { id: "html", label: "HTML / XML", icon: <FileCode size={14} /> },
            { id: "css", label: "CSS", icon: <Code size={14} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as LangMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === item.id
                  ? "bg-[#5D5FEF] text-white"
                  : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={removeComments}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[1px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Eraser size={16} /> Strip Comments
        </button>
      </div>

      {/* 2. Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Source Code
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-6 bg-slate-50 border-2 border-slate-100 rounded-[40px] font-mono text-xs focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all shadow-inner"
            placeholder="Paste code with comments here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">
              Clean Code
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Clean code copied!");
              }}
              className="text-[10px] font-bold text-slate-500 hover:text-[#5D5FEF] flex items-center gap-1 uppercase"
            >
              <Copy size={12} /> Copy Result
            </button>
          </div>
          <div className="w-full h-96 p-6 bg-slate-900 text-slate-300 rounded-[40px] font-mono text-xs overflow-auto whitespace-pre border-4 border-slate-800 shadow-xl">
            {output || (
              <span className="text-slate-600 italic">
                // Result will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
