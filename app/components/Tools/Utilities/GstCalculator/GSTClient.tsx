"use client";

import { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf"; // Import the library
import { motion, AnimatePresence } from "framer-motion";
import { 
  Receipt, RefreshCw, Plus, Minus, Calculator, 
  FileText, Truck, Building2, Copy, Check, Download, Trash2 ,Info
} from "lucide-react";
import { ToolHeader, ToolCard } from "@/app/components/ui/ToolPageElements";

// --- Types ---
interface LineItem {
  id: string;
  desc: string;
  price: number;
  rate: number;
}

export function GSTClient() {
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", desc: "Service/Product 1", price: 0, rate: 18 }
  ]);
  const [taxType, setTaxType] = useState<"local" | "interstate">("local");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [copied, setCopied] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Set Styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("GST TAX INVOICE SUMMARY", 20, 30);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${date}`, 20, 40);
    doc.line(20, 45, 190, 45); // Divider

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 60);
    doc.text("Base Price", 100, 60);
    doc.text("GST %", 140, 60);
    doc.text("Total", 170, 60);
    doc.line(20, 63, 190, 63);

    // Table Content
    let y = 75;
    doc.setFont("helvetica", "normal");
    items.forEach((item) => {
      doc.text(item.desc || "Item", 20, y);
      doc.text(`INR ${item.price.toFixed(2)}`, 100, y);
      doc.text(`${item.rate}%`, 140, y);
      
      const itemTax = mode === 'exclusive' ? (item.price * item.rate / 100) : (item.price - (item.price / (1 + item.rate / 100)));
      const itemTotal = mode === 'exclusive' ? (item.price + itemTax) : item.price;
      
      doc.text(`INR ${itemTotal.toFixed(2)}`, 170, y);
      y += 10;
    });

    // Summary Box
    y += 10;
    doc.line(100, y, 190, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("NET TOTAL:", 100, y);
    doc.text(`INR ${totals.net.toFixed(2)}`, 160, y);
    
    y += 10;
    doc.text("TAX TOTAL:", 100, y);
    doc.text(`INR ${totals.tax.toFixed(2)}`, 160, y);
    
    y += 15;
    doc.setFillColor(0, 0, 0); // Black background for final total
    doc.rect(100, y-7, 90, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text("GRAND TOTAL:", 105, y);
    doc.text(`INR ${totals.total.toFixed(2)}`, 160, y);

    // Save the file
    doc.save(`GST_Invoice_${Date.now()}.pdf`);
  };

  // --- Advanced Calculations ---
  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
      const amt = item.price || 0;
      let net, tax, total;

      if (mode === "exclusive") {
        net = amt;
        tax = (amt * item.rate) / 100;
        total = net + tax;
      } else {
        total = amt;
        net = amt / (1 + item.rate / 100);
        tax = total - net;
      }

      return {
        net: acc.net + net,
        tax: acc.tax + tax,
        total: acc.total + total
      };
    }, { net: 0, tax: 0, total: 0 });
  }, [items, mode]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), desc: "", price: 0, rate: 18 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 bg-[#F9FAFB] min-h-screen">
      <ToolHeader 
        title="GST Studio Pro" 
        description="Enterprise-grade tax engine for multi-item invoices and state tax splits."
        icon={Receipt}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        
        {/* LEFT: Multi-Item Ledger (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Global Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setMode("exclusive")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${mode === "exclusive" ? "bg-black text-white shadow-md" : "text-slate-500"}`}>EXCLUSIVE</button>
              <button onClick={() => setMode("inclusive")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${mode === "inclusive" ? "bg-black text-white shadow-md" : "text-slate-500"}`}>INCLUSIVE</button>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setTaxType("local")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${taxType === "local" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500"}`}><Building2 className="h-3 w-3" /> CGST/SGST</button>
              <button onClick={() => setTaxType("interstate")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${taxType === "interstate" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500"}`}><Truck className="h-3 w-3" /> IGST Only</button>
            </div>
          </div>

          {/* Ledger Items */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div layout key={item.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap md:flex-nowrap items-end gap-4 relative">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Item Description</label>
                  <input 
                    placeholder="E.g. Consultation Fee" 
                    value={item.desc}
                    onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  />
                </div>
                <div className="w-full md:w-44 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Amount (₹)</label>
                  <input 
                    type="number"
                    value={item.price || ""}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                    className="w-full bg-slate-50 p-4 rounded-2xl text-xl font-black outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  />
                </div>
                <div className="w-full md:w-32 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">GST %</label>
                  <select 
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value))}
                    className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-black outline-none appearance-none cursor-pointer"
                  >
                    {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                {items.length > 1 && (
                  <button onClick={() => removeItem(item.id)} className="p-4 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <button onClick={addItem} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" /> Add New Line Item
          </button>
        </div>

        {/* RIGHT: Tax Summary (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl sticky top-8">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2 italic">
              <FileText className="h-5 w-5 text-indigo-400" /> Tax Breakdown
            </h3>

            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Net</span>
                <span className="text-xl font-black">₹{totals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              {taxType === "local" ? (
                <>
                  <div className="flex justify-between items-center text-indigo-300">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">CGST ({(totals.tax / 2).toFixed(2)})</span>
                    <span className="font-black">+ ₹{(totals.tax / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-indigo-300 pb-4 border-b border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">SGST ({(totals.tax / 2).toFixed(2)})</span>
                    <span className="font-black">+ ₹{(totals.tax / 2).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center text-indigo-300 pb-4 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">IGST Total</span>
                  <span className="font-black">+ ₹{totals.tax.toLocaleString()}</span>
                </div>
              )}

              <div className="py-6">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 text-center">Final Payable Amount</p>
                <p className="text-6xl font-black text-center tracking-tighter">₹{Math.round(totals.total).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`Total: ₹${totals.total.toFixed(2)} (Net: ₹${totals.net.toFixed(2)}, GST: ₹${totals.tax.toFixed(2)})`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />} Copy Summary
                </button>
                <button onClick={downloadPDF} className="flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-500/20">
                  <Download className="h-4 w-4" /> Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Tax Compliance Info */}
          <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Info className="h-4 w-4 text-slate-400" /> Compliance Guide
            </h4>
            <ul className="space-y-4">
              {[
                { t: "Inter-state", d: "Use IGST when billing a client outside your registered state." },
                { t: "Local", d: "Use CGST + SGST when both parties are in the same state." },
                { t: "Rounding", d: "Invoices are typically rounded to the nearest whole rupee." }
              ].map((item, i) => (
                <li key={i}>
                  <p className="text-xs font-bold text-slate-900">{item.t}</p>
                  <p className="text-[11px] text-slate-500">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}