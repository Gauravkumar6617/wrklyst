"use client";
import React, { useState, useEffect } from "react";
import { Clock, Calendar, ArrowDownUp, Copy, RefreshCw, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TimestampConverter() {
  const [unixInput, setUnixInput] = useState<string>("");
  const [humanInput, setHumanInput] = useState<string>("");
  const [currentUnix, setCurrentUnix] = useState(Math.floor(Date.now() / 1000));

  // Live Clock for UX
  useEffect(() => {
    const timer = setInterval(() => setCurrentUnix(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Unix -> Human Logic
  const convertUnixToHuman = (val: string) => {
    setUnixInput(val);
    if (!val) { setHumanInput(""); return; }
    try {
      const num = parseInt(val);
      // Check if it's milliseconds (13 digits) or seconds (10 digits)
      const date = val.length > 11 ? new Date(num) : new Date(num * 1000);
      if (isNaN(date.getTime())) throw new Error();
      setHumanInput(date.toISOString().replace('T', ' ').replace('Z', ' UTC'));
    } catch {
      setHumanInput("Invalid Timestamp");
    }
  };

  // Human -> Unix Logic
  const convertHumanToUnix = (val: string) => {
    setHumanInput(val);
    if (!val) { setUnixInput(""); return; }
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error();
      setUnixInput(Math.floor(date.getTime() / 1000).toString());
    } catch {
      setUnixInput("Invalid Date Format");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Live Epoch Counter */}
      <div className="bg-[#1E1F4B] p-6 rounded-[32px] text-white flex items-center justify-between shadow-xl border-b-4 border-indigo-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl text-indigo-400">
            <Clock className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">The Current Unix Epoch</p>
            <p className="text-2xl font-mono font-bold tracking-tighter text-emerald-400">{currentUnix}</p>
          </div>
        </div>
        <button 
          onClick={() => convertUnixToHuman(currentUnix.toString())}
          className="px-6 py-2 bg-[#5D5FEF] hover:bg-[#4d4fdf] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Convert Now
        </button>
      </div>

      {/* 2. Bidirectional Converter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
        {/* Unix Side */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Unix Timestamp (Seconds/ms)</label>
          <div className="relative">
            <input
              type="text"
              value={unixInput}
              onChange={(e) => convertUnixToHuman(e.target.value)}
              placeholder="e.g. 1736444398"
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-mono text-xl focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all"
            />
            <button 
              onClick={() => {navigator.clipboard.writeText(unixInput); toast.success("Unix copied!");}}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#5D5FEF]"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Center Arrow Icon (Visible on Desktop) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-white border-4 border-slate-50 rounded-full text-slate-300 shadow-sm">
          <ArrowDownUp size={24} />
        </div>

        {/* Human Side */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Human Date (Local/UTC)</label>
          <div className="relative">
            <input
              type="text"
              value={humanInput}
              onChange={(e) => convertHumanToUnix(e.target.value)}
              placeholder="YYYY-MM-DD HH:MM:SS"
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-mono text-xl focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all"
            />
            <button 
              onClick={() => {navigator.clipboard.writeText(humanInput); toast.success("Date copied!");}}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#5D5FEF]"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SEO Education Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> Pro Tip
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            A 10-digit timestamp is in <strong>seconds</strong>. A 13-digit timestamp is in <strong>milliseconds</strong>. Our tool detects both automatically for seamless conversion.
          </p>
        </div>
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-[#5D5FEF]" /> Common Date Formats
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            You can paste ISO strings, GMT dates, or even simple strings like <em>"Jan 1, 2026"</em> into the human date field to get the Unix epoch.
          </p>
        </div>
      </div>
    </div>
  );
}