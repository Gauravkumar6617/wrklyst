"use client";
import React, { useState, useMemo, useRef, ChangeEvent } from "react";
import { Columns, Trash2, LayoutList, Zap, Copy } from "lucide-react";
import * as Diff from "diff";
import { toast } from "react-hot-toast";

// --- Types & Interfaces ---
interface SideBySideLine {
  val: string;
  type: "rem" | "add" | "none" | "empty";
}

interface LabelProps {
  text: string;
  color: string;
  dotColor: string;
}

interface FilterToggleProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function TextCompare() {
  const [text1, setText1] = useState<string>("");
  const [text2, setText2] = useState<string>("");
  const [viewMode, setViewMode] = useState<"side" | "unified">("side");
  const [options, setOptions] = useState({
    ignoreWhitespace: false,
    skipEmptyLines: false,
    ignoreCase: false,
  });

  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const other =
      target === leftPaneRef.current
        ? rightPaneRef.current
        : leftPaneRef.current;
    if (other) {
      other.scrollTop = target.scrollTop;
    }
  };

  const diffResult = useMemo<Diff.Change[]>(() => {
    const process = (str: string) => {
      let result = str;
      if (options.ignoreCase) result = result.toLowerCase();

      // Handle "Skip Empty Lines" by filtering before diffing
      if (options.skipEmptyLines) {
        result = result
          .split("\n")
          .filter((l) => l.trim() !== "")
          .join("\n");
      }
      return result;
    };

    return Diff.diffLines(process(text1), process(text2), {
      ignoreWhitespace: options.ignoreWhitespace,
    });
  }, [text1, text2, options]);

  const sideBySideData = useMemo(() => {
    let left: SideBySideLine[] = [];
    let right: SideBySideLine[] = [];

    diffResult.forEach((part) => {
      const lines = part.value.split("\n");
      if (lines[lines.length - 1] === "" && lines.length > 1) lines.pop();

      lines.forEach((line) => {
        if (part.added) {
          left.push({ val: "", type: "empty" });
          right.push({ val: line, type: "add" });
        } else if (part.removed) {
          left.push({ val: line, type: "rem" });
          right.push({ val: "", type: "empty" });
        } else {
          left.push({ val: line, type: "none" });
          right.push({ val: line, type: "none" });
        }
      });
    });
    return { left, right };
  }, [diffResult]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-4 py-2 md:py-8 space-y-4 md:space-y-6 overflow-hidden">
      {/* 1. HEADER (Compact on Mobile) */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center lg:block">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-[#1E1F4B] tracking-tight">
              Wrklyst <span className="text-indigo-600">Diff</span>
            </h1>
            <div className="flex gap-3 mt-1 md:mt-2">
              <LegendItem color="bg-emerald-500" label="Added" />
              <LegendItem color="bg-rose-500" label="Removed" />
            </div>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <ViewButton
            active={viewMode === "side"}
            onClick={() => setViewMode("side")}
            icon={<Columns size={14} />}
            label="Side Split"
          />
          <ViewButton
            active={viewMode === "unified"}
            onClick={() => setViewMode("unified")}
            icon={<LayoutList size={14} />}
            label="Unified"
          />
        </div>
      </div>

      {/* 2. FILTERS (Compact scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <FilterToggle
          label="Spaces"
          active={options.ignoreWhitespace}
          onClick={() =>
            setOptions((o) => ({ ...o, ignoreWhitespace: !o.ignoreWhitespace }))
          }
        />
        <FilterToggle
          label="Lines"
          active={options.skipEmptyLines}
          onClick={() =>
            setOptions((o) => ({ ...o, skipEmptyLines: !o.skipEmptyLines }))
          }
        />
        <FilterToggle
          label="Case"
          active={options.ignoreCase}
          onClick={() =>
            setOptions((o) => ({ ...o, ignoreCase: !o.ignoreCase }))
          }
        />
        <button
          onClick={() => {
            setText1("");
            setText2("");
          }}
          className="ml-auto text-[10px] font-black uppercase text-slate-400 p-2 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 3. INPUT AREAS (Adaptive height) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <InputBox
          label="Original Source"
          value={text1}
          onChange={setText1}
          color="indigo"
        />
        <InputBox
          label="Revised Version"
          value={text2}
          onChange={setText2}
          color="emerald"
        />
      </div>

      {/* 4. COMPARISON ENGINE */}
      <div className="bg-white border md:border-2 border-slate-100 rounded-2xl md:rounded-[40px] overflow-hidden shadow-xl">
        <div className="bg-[#1E1F4B] px-4 md:px-8 py-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 text-indigo-300 font-black text-[10px] uppercase tracking-widest">
            <Zap size={14} /> Comparison
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(text2);
              toast.success("Copied!");
            }}
            className="text-white/50 hover:text-white transition-colors"
          >
            <Copy size={18} />
          </button>
        </div>

        <div className="flex flex-col">
          {viewMode === "side" ? (
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 h-[450px] md:h-[600px]">
              <div
                ref={leftPaneRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto bg-slate-50/50 font-mono text-xs md:text-sm"
              >
                <PaneHeader label="Original View" color="text-slate-400" />
                <div className="p-2 md:p-4">
                  {sideBySideData.left.map((line, i) => (
                    <LineRow
                      key={i}
                      line={line}
                      index={i}
                      color="bg-rose-50 text-rose-800"
                    />
                  ))}
                </div>
              </div>
              <div
                ref={rightPaneRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto font-mono text-xs md:text-sm"
              >
                <PaneHeader label="Modified View" color="text-indigo-600" />
                <div className="p-2 md:p-4">
                  {sideBySideData.right.map((line, i) => (
                    <LineRow
                      key={i}
                      line={line}
                      index={i}
                      color="bg-emerald-50 text-emerald-800 font-bold"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-10 font-mono text-xs md:text-sm leading-6 md:leading-8 h-[450px] md:h-[600px] overflow-y-auto bg-slate-50/20">
              {diffResult.map((part, i) => (
                <span
                  key={i}
                  className={`px-0.5 rounded ${part.added ? "bg-emerald-100 text-emerald-800 font-bold" : part.removed ? "bg-rose-100 text-rose-800 line-through decoration-rose-500" : "text-slate-500"}`}
                >
                  {part.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 ${color} rounded-full`} />
      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter md:tracking-widest">
        {label}
      </span>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-black transition-all flex items-center justify-center gap-2 ${active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function InputBox({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  color: string;
}) {
  return (
    <div className="space-y-1 md:space-y-2">
      <div className={`flex items-center gap-2 px-1 text-${color}-600`}>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        className="w-full h-32 md:h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-[24px] focus:bg-white focus:border-indigo-200 outline-none transition-all font-mono text-xs md:text-sm resize-none"
        placeholder="Paste text here..."
      />
    </div>
  );
}

function PaneHeader({ label, color }: { label: string; color: string }) {
  return (
    <div
      className={`sticky top-0 bg-white/95 backdrop-blur-sm p-2 px-4 text-[9px] font-black ${color} border-b border-slate-100 z-20 uppercase tracking-widest`}
    >
      {label}
    </div>
  );
}

function LineRow({
  line,
  index,
  color,
}: {
  line: SideBySideLine;
  index: number;
  color: string;
}) {
  return (
    <div
      className={`flex gap-2 md:gap-4 px-1 leading-6 min-h-[1.5rem] rounded ${line.type === "rem" || line.type === "add" ? color : "text-slate-400"}`}
    >
      <span className="w-6 text-right opacity-20 text-[9px] select-none pt-0.5">
        {index + 1}
      </span>
      <span className="whitespace-pre-wrap">{line.val || " "}</span>
    </div>
  );
}

function FilterToggle({ label, active, onClick }: FilterToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest border transition-all flex items-center gap-1 shrink-0 ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-200"}`}
    >
      {label}
    </button>
  );
}
