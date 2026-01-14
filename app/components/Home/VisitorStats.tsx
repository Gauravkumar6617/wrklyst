"use client";
import { useEffect, useState, useRef } from "react";
import { Users, TrendingUp, Globe, Box } from "lucide-react";

export default function VisitorStats() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [toolsCount, setToolsCount] = useState(33); // Set your total tools here
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setVisitorCount(data.count || 12540);
      })
      .catch(() => {
        setVisitorCount(12842); // Fallback
      });
  }, []);

  return (
    <div className="w-full group relative overflow-hidden bg-[#0F172A] p-10 rounded-[48px] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-amber-500/40">
      {/* Glow Effect */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
            <Globe size={28} strokeWidth={2.5} className="animate-pulse" />
          </div>
          
          {/* UPDATED: Tools Count Pill */}
          <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
            <Box size={14} className="text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              {toolsCount}+ Pro Tools
            </span>
          </div>
        </div>

        {/* Numbers Section */}
        <div className="space-y-1">
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[3px]">
            Accumulated Traffic
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-[1000] text-white tracking-tighter">
              {visitorCount.toLocaleString()}
            </h2>
            <div className="flex items-center text-emerald-400 text-sm font-black bg-emerald-400/10 px-2 py-0.5 rounded-lg">
              <TrendingUp size={14} className="mr-1" />
              12%
            </div>
          </div>
        </div>

        {/* Visual Graph Bars */}
        <div className="flex items-end gap-1.5 h-12 mt-2">
          {[40, 65, 45, 90, 55, 75, 100, 80, 60, 85].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-white/5 rounded-full group-hover:bg-amber-500/30 transition-all duration-700"
              style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                <Users size={12} /> Unique Visitors
            </span>
            <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">
                Wrklyst Ecosystem
            </span>
        </div>
      </div>
    </div>
  );
}