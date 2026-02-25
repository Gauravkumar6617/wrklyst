"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Percent, RefreshCw, TrendingUp, HelpCircle, 
  ChevronRight, Tag, Copy, Check, History, X 
} from "lucide-react";
import { ToolHeader } from "@/app/components/ui/ToolPageElements";

type Mode = "is" | "increase" | "what" | "discount";

export function PercentageClient() {
  const [val1, setVal1] = useState<string>("");
  const [val2, setVal2] = useState<string>("");
  const [mode, setMode] = useState<Mode>("is");
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<{label: string, value: string}[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const n1 = parseFloat(val1);
    const n2 = parseFloat(val2);

    if (isNaN(n1) || (mode !== "is" && isNaN(n2))) {
      setResult(null);
      return;
    }

    let res: number = 0;
    switch (mode) {
      case "is": res = (n1 / 100) * n2; break;
      case "increase": res = ((n2 - n1) / Math.abs(n1)) * 100; break;
      case "what": res = (n1 / n2) * 100; break;
      case "discount": res = n1 - (n1 * (n2 / 100)); break;
    }
    setResult(res);
  }, [val1, val2, mode]);

  const saveToHistory = () => {
    if (result === null) return;
    const entry = {
      label: `${mode.toUpperCase()}: ${val1} & ${val2}`,
      value: result.toFixed(2) + (mode === 'is' || mode === 'discount' ? '' : '%')
    };
    setHistory([entry, ...history.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 selection:bg-black selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ToolHeader 
          title="Percentage Studio" 
          description="Precision arithmetic with a modern edge."
          icon={Percent}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Main Calculator - 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Mode Selector */}
            <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              {(["is", "increase", "what", "discount"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setVal1(""); setVal2(""); }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mode === m ? "bg-black text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* Input Canvas */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-slate-200/50">
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex flex-wrap items-center justify-center gap-6 text-3xl md:text-5xl font-black">
                  <SentenceRenderer mode={mode} val1={val1} val2={val2} setVal1={setVal1} setVal2={setVal2} />
                </div>

                <AnimatePresence>
                  {result !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-16 text-center"
                    >
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Resulting Value</p>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[7rem] md:text-[10rem] leading-none tracking-tighter font-black text-black">
                          {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          {mode !== 'is' && mode !== 'discount' && <span className="text-4xl text-slate-300 ml-2">%</span>}
                        </span>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(result.toFixed(2));
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                              saveToHistory();
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Saved" : "Copy Result"}
                          </button>
                          <button 
                            onClick={() => {setVal1(""); setVal2("");}}
                            className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-400" /> Recent
                </h3>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="text-xs font-bold text-red-500 hover:underline">Clear</button>
                )}
              </div>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No recent calculations yet.</p>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-500">{item.label}</span>
                      <span className="font-black text-black">{item.value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200/50">
              <Tag className="h-8 w-8 mb-4 opacity-50" />
              <h4 className="font-black text-xl mb-2">Pro Tip</h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                Use the <strong>Change</strong> mode to calculate year-over-year growth or stock market fluctuations instantly.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Modernized Clear Input Sub-component
function ModernInput({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="relative group">
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-32 md:w-48 bg-white border-4 border-slate-100 text-black text-center p-5 rounded-3xl text-3xl font-black outline-none transition-all focus:border-black focus:ring-[12px] focus:ring-black/5 placeholder:text-slate-200" 
      />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-200 rounded-full group-focus-within:bg-black group-focus-within:w-16 transition-all" />
    </div>
  );
}

function SentenceRenderer({ mode, val1, val2, setVal1, setVal2 }: any) {
  const props = { setVal1, setVal2, val1, val2 };
  
  switch (mode) {
    case "is":
      return (
        <>
          <span className="text-slate-400">What is</span>
          <ModernInput value={val1} onChange={setVal1} placeholder="15" />
          <span className="text-slate-400">% of</span>
          <ModernInput value={val2} onChange={setVal2} placeholder="200" />
        </>
      );
    case "increase":
      return (
        <>
          <span className="text-slate-400">From</span>
          <ModernInput value={val1} onChange={setVal1} placeholder="100" />
          <span className="text-slate-400">to</span>
          <ModernInput value={val2} onChange={setVal2} placeholder="150" />
        </>
      );
    case "what":
      return (
        <>
          <ModernInput value={val1} onChange={setVal1} placeholder="50" />
          <span className="text-slate-400">is what % of</span>
          <ModernInput value={val2} onChange={setVal2} placeholder="250" />
        </>
      );
    case "discount":
      return (
        <>
          <span className="text-slate-400">Price</span>
          <ModernInput value={val1} onChange={setVal1} placeholder="99" />
          <span className="text-slate-400">minus</span>
          <ModernInput value={val2} onChange={setVal2} placeholder="20" />
          <span className="text-slate-400">% off</span>
        </>
      );
  }
}