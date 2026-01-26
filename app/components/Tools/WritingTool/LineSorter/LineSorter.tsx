"use client";
import React, { useState, useMemo } from "react";
import {
  SortAsc,
  SortDesc,
  Trash2,
  Copy,
  Type,
  Eraser,
  Filter,
  ListOrdered,
  RefreshCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function LineSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Memoized stats to prevent unnecessary recalculations
  const stats = useMemo(() => {
    const original = input.split(/\r?\n/).filter((l) => l.trim() !== "").length;
    const final = output.split(/\r?\n/).filter((l) => l.trim() !== "").length;
    return { original, final };
  }, [input, output]);

  const processLines = (
    type: "asc" | "desc" | "reverse" | "shuffle" | "dedupe",
  ) => {
    if (!input.trim()) return toast.error("Please enter some text first");

    let lines = input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");

    switch (type) {
      case "asc":
        lines.sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        );
        break;
      case "desc":
        lines.sort((a, b) =>
          b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }),
        );
        break;
      case "reverse":
        lines.reverse();
        break;
      case "shuffle":
        lines = lines.sort(() => Math.random() - 0.5);
        break;
      case "dedupe":
        lines = Array.from(new Set(lines));
        break;
    }

    setOutput(lines.join("\n"));
    toast.success("List Processed");
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <main className="max-w-6xl mx-auto p-0 sm:p-6 space-y-8">
      {/* Header */}
      <header className="px-4 sm:px-0 text-left space-y-2">
        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
          Utility Engine v1.1
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#1E1F4B] tracking-tighter">
          Line <span className="text-indigo-600">Sorter</span>
        </h1>
      </header>

      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0"
        aria-label="Editor"
      >
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="raw-input"
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Raw List
              </label>
              {stats.original > 0 && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {stats.original} lines
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setInput("");
                setOutput("");
              }}
              aria-label="Clear input"
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            id="raw-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[350px] sm:h-[400px] p-6 bg-white border-2 border-slate-100 rounded-[32px] font-mono text-sm outline-none focus:border-indigo-500 transition-all shadow-sm resize-none"
            placeholder="Paste your list here..."
          />
        </div>

        {/* Output Area */}
        <div className="space-y-4 flex flex-col">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                Sorted Result
              </span>
              {stats.final > 0 && (
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {stats.final} lines{" "}
                  {stats.original - stats.final > 0 &&
                    `(-${stats.original - stats.final} dupes)`}
                </span>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              aria-label="Copy result"
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase"
            >
              <Copy size={12} /> Copy
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              id="sorted-output"
              readOnly
              value={output}
              className="w-full h-[350px] sm:h-[400px] p-6 bg-[#0B0F1A] border border-slate-800 rounded-[32px] font-mono text-sm text-indigo-100 outline-none shadow-2xl resize-none"
              placeholder="Output will appear here..."
            />

            {/* Floating Controls */}
            <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl">
              <ToolBtn
                onClick={() => processLines("asc")}
                icon={<SortAsc size={18} />}
                tooltip="A-Z Sort"
              />
              <ToolBtn
                onClick={() => processLines("desc")}
                icon={<SortDesc size={18} />}
                tooltip="Z-A Sort"
              />
              <ToolBtn
                onClick={() => processLines("dedupe")}
                icon={<Filter size={18} />}
                tooltip="Remove Duplicates"
              />
              <ToolBtn
                onClick={() => processLines("reverse")}
                icon={<ListOrdered size={18} />}
                tooltip="Reverse Order"
              />
              <ToolBtn
                onClick={() => {
                  const cleaned = input
                    .split("\n")
                    .map((l) => l.trim())
                    .filter((l) => l)
                    .join("\n");
                  setInput(cleaned);
                  toast.success("Whitespace Cleared");
                }}
                icon={<Eraser size={18} />}
                tooltip="Clean Whitespace"
              />
            </nav>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <footer className="max-w-4xl mx-auto mt-16 border-t border-slate-100 pt-12 pb-20 px-6">
        <h2 className="text-xl font-black text-[#1E1F4B] mb-8 flex items-center gap-3">
          <Type className="text-indigo-600" aria-hidden="true" size={24} />
          Line Sorter User Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <InfoCard
            icon={<SortAsc size={16} />}
            title="Natural Sort"
            desc="Sorts 1, 2, 10 correctly instead of 1, 10, 2."
          />
          <InfoCard
            icon={<Filter size={16} />}
            title="Deduplication"
            desc="Cleans up repeat entries in your data sets instantly."
          />
          <InfoCard
            icon={<Eraser size={16} />}
            title="Deep Cleaning"
            desc="Removes invisible whitespace and empty lines."
          />
          <InfoCard
            icon={<RefreshCcw size={16} />}
            title="Local Processing"
            desc="Data stays in your browser. 100% private and secure."
          />
        </div>
      </footer>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-1">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span> {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function ToolBtn({
  onClick,
  icon,
  tooltip,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
    >
      {icon}
    </button>
  );
}
