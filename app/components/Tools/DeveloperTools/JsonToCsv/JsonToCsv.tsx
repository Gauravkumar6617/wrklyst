"use client";
import React, { useState } from "react";
import { FileJson, Table, Download, Copy, Trash2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const flattenObject = (obj: any, prefix = "") => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + "." : "";
      if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const convertToCsv = () => {
    try {
      if (!input.trim()) return;
      setError(null);
      
      const json = JSON.parse(input);
      const data = Array.isArray(json) ? json : [json];
      
      // 1. Flatten all objects in the array
      const flattenedData = data.map(item => flattenObject(item));
      
      // 2. Extract unique headers
      const headers = Array.from(
        new Set(flattenedData.flatMap(item => Object.keys(item)))
      );

      // 3. Build CSV string
      const csvRows = [];
      csvRows.push(headers.join(",")); // Header row

      for (const row of flattenedData) {
        const values = headers.map(header => {
          const val = row[header] === undefined || row[header] === null ? "" : row[header];
          const escaped = ("" + val).replace(/"/g, '""'); // Escape quotes
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      }

      setOutput(csvRows.join("\n"));
      toast.success("Converted successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error("Invalid JSON structure");
    }
  };

  const downloadCsv = () => {
    const blob = new Blob([output], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.csv");
    a.click();
    toast.success("Download started!");
  };

  return (
    <div className="space-y-6">
      {/* 1. Control Bar */}
      <div className="flex flex-wrap gap-4 p-6 bg-slate-900 rounded-[32px] items-center justify-between">
        <div className="flex gap-2">
          <button onClick={convertToCsv} className="flex items-center gap-2 px-6 py-2 bg-[#5D5FEF] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4d4fdf] transition-all">
            <Table size={16} /> Convert to CSV
          </button>
          {output && (
            <button onClick={downloadCsv} className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
              <Download size={16} /> Download CSV
            </button>
          )}
        </div>
        <button onClick={() => {setInput(""); setOutput(""); setError(null);}} className="text-slate-400 hover:text-red-400">
          <Trash2 size={20} />
        </button>
      </div>

      {/* 2. Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold">
          <AlertCircle size={16} /> JSON Error: {error}
        </div>
      )}

      {/* 3. Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Paste JSON Array</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-8 bg-slate-50 border border-slate-200 rounded-[40px] font-mono text-sm outline-none focus:bg-white transition-all"
            placeholder='[{"name": "John", "info": {"age": 30}}, ...]'
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-4">
             <label className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest">CSV Output</label>
             {output && (
               <button onClick={() => {navigator.clipboard.writeText(output); toast.success("Copied!");}} className="text-[#5D5FEF] font-bold text-[10px] uppercase flex items-center gap-1">
                 <Copy size={12}/> Copy
               </button>
             )}
          </div>
          <div className="w-full h-96 p-8 bg-white border-2 border-slate-100 rounded-[40px] font-mono text-sm overflow-auto text-slate-600">
            {output ? (
              <pre className="whitespace-pre">{output}</pre>
            ) : (
              <span className="text-slate-300 italic">Formatted CSV will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}