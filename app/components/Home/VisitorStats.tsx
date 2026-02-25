"use client";
import { useEffect, useState, useRef } from "react";
import { Users, TrendingUp, Globe, Box, Activity } from "lucide-react";
import CountUp from "react-countup";

export default function VisitorStats() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [toolsCount] = useState(45); // Updated to match your TrustBar
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setVisitorCount(data.count || 142580);
      })
      .catch(() => {
        setVisitorCount(142580); // Consistent Fallback
      });
  }, []);

  return (
    <div className="w-full group relative overflow-hidden bg-[#0F172A] p-8 rounded-[40px] border border-white/10 shadow-2xl transition-all duration-500 hover:border-blue-500/40">
      {/* Background Radial Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Activity size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">System Status</p>
              <p className="text-xs font-bold text-white uppercase tracking-tighter italic">Operational</p>
            </div>
          </div>
          
       
        </div>

        {/* Traffic Numbers with CountUp */}
        <div className="space-y-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[2px]">
            Accumulated Traffic
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-[1000] text-white tracking-tighter">
              {visitorCount > 0 ? (
                <CountUp end={visitorCount} duration={2.5} separator="," />
              ) : (
                "---,---"
              )}
            </h2>
            <div className="flex items-center text-emerald-400 text-[10px] font-black bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
              <TrendingUp size={12} className="mr-1" />
              +12%
            </div>
          </div>
        </div>

        {/* Dynamic Activity Bars */}
        <div className="flex items-end gap-1.5 h-16 mt-2 border-b border-white/5 pb-4">
          {[40, 65, 45, 90, 55, 75, 100, 80, 60, 85, 45, 70].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-white/5 rounded-t-md group-hover:bg-blue-500/40 transition-all duration-700 origin-bottom"
              style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
            />
          ))}
        </div>
        
        {/* Footer Info */}
        <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                <Users size={10} /> Live Community
            </span>
            <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest group-hover:underline cursor-default">
                Join the ecosystem
            </span>
        </div>
      </div>
    </div>
  );
}