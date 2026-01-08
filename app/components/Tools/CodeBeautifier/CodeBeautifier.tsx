"use client";
import React, { useState } from "react";
import { Code2, Copy, Trash2, Sparkles, FileCode, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import * as prettier from "prettier/standalone";
import estree from "prettier/plugins/estree";
import babel from "prettier/plugins/babel";
import html from "prettier/plugins/html";
import postcss from "prettier/plugins/postcss";

type Language = "html" | "babel" | "postcss";

export default function CodeBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState<Language>("babel");
  const [isFormatting, setIsFormatting] = useState(false);

  const formatCode = async () => {
    if (!input.trim()) return;
    setIsFormatting(true);
    try {
      // Determine the correct parser and specific options
      const options: any = {
        parser: lang,
        plugins: [babel, estree, html, postcss],
        printWidth: 80,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
      };

      // Fix for JS/TS: If using Babel, sometimes it needs to allow fragments
      if (lang === "babel") {
        options.trailingComma = "all";
      }

      const formatted = await prettier.format(input, options);
      setOutput(formatted);
      toast.success("Code Beautified!");
    } catch (err: any) {
      console.error("Prettier Error Details:", err);

      // SEO & UX: Show the specific line where the error is
      const errorLine = err.loc ? ` at line ${err.loc.start.line}` : "";
      toast.error(`Syntax Error${errorLine}. Please check your code.`);

      // Fallback: If it's a simple text error, don't leave output empty
      setOutput("// Error: Could not parse code. \n// " + err.message);
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-5 rounded-[32px] gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex bg-white/10 p-1 rounded-xl border border-white/10">
            {(["html", "babel", "postcss"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  lang === l
                    ? "bg-[#5D5FEF] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {l === "babel" ? "JS/TS" : l === "postcss" ? "CSS" : "HTML"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={formatCode}
          disabled={isFormatting}
          className="w-full md:w-auto px-8 py-3 bg-[#5D5FEF] hover:bg-[#4d4fdf] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles size={16} />{" "}
          {isFormatting ? "Formatting..." : "Beautify Code"}
        </button>
      </div>

      {/* Editor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Input Raw Code
            </span>
            <button
              onClick={() => setInput("")}
              className="text-slate-300 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[500px] p-6 bg-slate-50 border border-slate-200 rounded-[40px] font-mono text-sm outline-none focus:bg-white transition-all shadow-inner"
            placeholder="// Paste your messy code here..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between px-4">
            <span className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">
              Beautified Output
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied!");
              }}
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-[#5D5FEF] uppercase"
            >
              <Copy size={14} /> Copy
            </button>
          </div>
          <div className="w-full h-[500px] p-6 bg-[#1E1F4B] border border-slate-800 rounded-[40px] font-mono text-sm text-indigo-100 overflow-auto whitespace-pre shadow-2xl relative">
            {output || (
              <span className="text-white/20 italic">
                // Perfect code will appear here...
              </span>
            )}
            <div className="absolute top-6 right-6 opacity-5 text-white">
              <FileCode size={60} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
