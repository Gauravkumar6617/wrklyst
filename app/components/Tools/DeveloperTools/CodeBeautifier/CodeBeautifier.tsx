"use client";
import React, { useState } from "react";
import {
  Copy,
  Trash2,
  Sparkles,
  RefreshCcw,
  Layout,
  Zap,
  Braces,
  Type,
  FileJson,
  Database,
  Coffee,
  Code,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";

type Language =
  | "babel"
  | "html"
  | "postcss"
  | "markdown"
  | "json"
  | "sql"
  | "java"
  | "yaml"
  | "xml";

export default function UniversalBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState<Language>("babel");
  const [isFormatting, setIsFormatting] = useState(false);

  const formatCode = async () => {
    if (!input.trim()) return toast.error("Please provide code first.");
    setIsFormatting(true);

    try {
      // FIX: Ensure path matches your project structure exactly
      // Use a relative path if the @ alias isn't resolving correctly
      const formatterModule = await import("@/app/utils/Formatter");

      // Call the named export from the module
      const formatted = await formatterModule.performFormat(input, lang);

      setOutput(formatted);
      toast.success(`${lang.toUpperCase()} Beautified!`);
    } catch (err: any) {
      console.error("Format Error:", err);
      // Clean up the error message for the UI
      const errorLines = err.message
        ? err.message.split("\n")
        : ["Unknown Error"];
      setOutput(`// ERROR: ${errorLines[0]}\n\n${input}`);
      toast.error("Format failed.");
    } finally {
      setIsFormatting(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-[#1E1F4B]">
          Universal <span className="text-indigo-600">Parser</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Professional multi-language code formatter.
        </p>
      </header>

      {/* LANGUAGE GRID */}
      <div className="bg-[#1E1F4B] p-6 rounded-[32px] shadow-2xl mb-8 border border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <LangButton
            active={lang === "babel"}
            onClick={() => setLang("babel")}
            label="JS / TS"
            icon={<Braces size={14} />}
          />
          <LangButton
            active={lang === "html"}
            onClick={() => setLang("html")}
            label="HTML"
            icon={<Layout size={14} />}
          />
          <LangButton
            active={lang === "sql"}
            onClick={() => setLang("sql")}
            label="SQL"
            icon={<Database size={14} />}
          />

          <LangButton
            active={lang === "java"}
            onClick={() => setLang("java")}
            label="Java"
            icon={<Coffee size={14} />}
          />
          <LangButton
            active={lang === "json"}
            onClick={() => setLang("json")}
            label="JSON"
            icon={<FileJson size={14} />}
          />
        </div>

        <button
          onClick={formatCode}
          disabled={isFormatting}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
        >
          {isFormatting ? (
            <RefreshCcw className="animate-spin" />
          ) : (
            <Sparkles />
          )}
          {isFormatting ? "Processing..." : "Format Now"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Input Code</span>
            <button
              onClick={() => setInput("")}
              className="hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[500px] p-6 bg-white border-2 border-slate-200 rounded-[24px] font-mono text-sm outline-none focus:border-indigo-500 shadow-inner resize-none"
            placeholder={`Paste your code here...`}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 text-xs font-bold text-indigo-500 uppercase tracking-widest">
            <span>Result</span>
            <button
              onClick={copyToClipboard}
              className="text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md font-bold uppercase text-[10px] hover:bg-indigo-100 transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="h-[500px] bg-[#0A0C1B] rounded-[24px] p-6 overflow-auto border border-slate-800 shadow-2xl">
            <pre className="font-mono text-sm text-indigo-100 whitespace-pre">
              {output || (
                <span className="opacity-20">
                  // Beautified code will appear here...
                </span>
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function LangButton({ active, onClick, label, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all border
        ${active ? "bg-indigo-600 text-white border-indigo-400 shadow-lg" : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"}
      `}
    >
      {icon} <span className="truncate">{label}</span>
    </button>
  );
}
