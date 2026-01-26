"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Copy,
  RefreshCw,
  Link,
  ShieldCheck,
  Hash,
  FileCode,
  Zap,
  Info,
  Smartphone,
  ArrowRightLeft,
  Trash2,
  Download,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ToolConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  desc: string;
  placeholder: string;
}

interface ConverterProps {
  mode: "base64-enc" | "base64-dec" | "url-enc" | "url-dec" | "slug";
}

export default function ConverterTool({ mode }: ConverterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const config: Record<ConverterProps["mode"], ToolConfig> = {
    "base64-enc": {
      label: "Base64 Encoder",
      icon: <ShieldCheck size={20} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      desc: "Convert text to secure Base64 format.",
      placeholder: "Enter plain text to encode...",
    },
    "base64-dec": {
      label: "Base64 Decoder",
      icon: <FileCode size={20} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "Decode Base64 strings back to readable text.",
      placeholder: "Enter Base64 string to decode...",
    },
    "url-enc": {
      label: "URL Encoder",
      icon: <Link size={20} />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      desc: "Safe-encode URLs for web transmission.",
      placeholder: "Enter URL or text to encode...",
    },
    "url-dec": {
      label: "URL Decoder",
      icon: <Link size={20} />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "Decode %-encoded URL strings.",
      placeholder: "Enter encoded URL to decode...",
    },
    slug: {
      label: "Slug Generator",
      icon: <Hash size={20} />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: "Clean, SEO-friendly URLs for blogs.",
      placeholder: "Enter article title or text...",
    },
  };

  const current = config[mode];

  const stats = useMemo(() => {
    return {
      chars: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input.trim() ? input.split(/\r\n|\r|\n/).length : 0,
    };
  }, [input]);

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    try {
      if (mode === "base64-enc") {
        const bytes = new TextEncoder().encode(input);
        const binString = String.fromCodePoint(...bytes);
        setOutput(btoa(binString));
      } else if (mode === "base64-dec") {
        const binString = atob(input);
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        setOutput(new TextDecoder().decode(bytes));
      } else if (mode === "url-enc") setOutput(encodeURIComponent(input));
      else if (mode === "url-dec")
        setOutput(decodeURIComponent(input.replace(/\+/g, " ")));
      else if (mode === "slug") {
        setOutput(
          input
            .toLowerCase()
            .trim()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-")
            .replace(/--+/g, "-"),
        );
      }
    } catch (e) {
      setOutput("⚠️ ERROR: Invalid data format for " + current.label);
    }
  }, [input, mode, current.label]);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `wrklyst-${mode}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.success("File downloaded");
  };

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-4 space-y-8">
      {/* Dynamic Header Card */}
      <div
        className={`flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 ${current.bg} rounded-none sm:rounded-[40px] border-b sm:border border-white shadow-sm gap-6`}
      >
        <div className="flex items-center gap-5">
          <div
            className={`p-4 bg-white rounded-3xl shadow-sm ${current.color}`}
          >
            {current.icon}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {current.label}
            </h2>
            <p className="text-sm font-medium text-slate-500">{current.desc}</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <Badge text="UTF-8 Ready" />
          <Badge text="100% Private" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Input Data
              </label>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                {stats.chars} Chars • {stats.words} Words
              </span>
            </div>
            <button
              onClick={() => setInput("")}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              title="Clear Input"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-6 sm:p-8 bg-white border-2 border-slate-100 rounded-[32px] sm:rounded-[48px] focus:border-indigo-200 outline-none transition-all font-mono text-sm shadow-inner resize-none"
            placeholder={current.placeholder}
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label
              className={`text-[10px] font-black ${current.color} uppercase tracking-widest`}
            >
              Processed Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={!output}
                className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all disabled:opacity-0"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard");
                }}
                disabled={!output}
                className="px-6 py-2 bg-white border border-slate-100 text-slate-700 rounded-full text-[10px] font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-30"
              >
                <Copy size={12} /> Copy Result
              </button>
            </div>
          </div>
          <div className="w-full h-80 p-6 sm:p-8 bg-[#0B0F1A] text-emerald-400 rounded-[32px] sm:rounded-[48px] font-mono text-sm overflow-auto whitespace-pre-wrap border border-slate-800 shadow-2xl relative">
            {output || (
              <span className="text-slate-600 italic select-none">
                Waiting for input...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SEO & EDUCATIONAL SECTION - p-10 changed to p-0 */}
      <div className="pt-12 mt-12 border-t border-slate-100 px-6 sm:px-0">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <Info size={24} className="text-indigo-600" /> Professional Grade
          Details
        </h3>
        {/* pb-10 changed to pb-0 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-0">
          <FeatureItem
            icon={<Zap size={18} />}
            title="Instant Processing"
            desc="Transformation happens client-side. No data ever leaves your device."
          />
          <FeatureItem
            icon={<CheckCircle2 size={18} />}
            title="Unicode Support"
            desc="Fully handles emojis and special characters via modern TextEncoder logic."
          />
          <FeatureItem
            icon={<ArrowRightLeft size={18} />}
            title="Lossless Sync"
            desc="Switch between modes instantly without losing your original source material."
          />
        </div>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-4 py-2 bg-white/50 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
      {text}
    </span>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 text-indigo-600 group-hover:translate-x-1 transition-transform">
        {icon}{" "}
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tighter">
          {title}
        </h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
