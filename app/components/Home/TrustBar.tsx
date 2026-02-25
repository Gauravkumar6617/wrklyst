// components/Home/TrustBar.tsx
import { ShieldCheck, Rocket, GitBranch, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';

export default function TrustBar() {
  const milestones = [
    { label: "BETA LAUNCH", value: "2026", icon: <Rocket size={14} /> },
    { label: "TOOLS ADDED", value: "45+", icon: <GitBranch size={14} /> },
    { label: "USER FEEDBACK", value: "LIVE", icon: <MessageSquareHeart size={14} /> },
    { label: "SECURE & LOCAL", value: "100%", icon: <ShieldCheck size={14} /> }
  ];

  return (
    <div className="w-full bg-white py-10 border-y border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* 1. Transparency Label */}
          <div className="flex flex-col items-center lg:items-start shrink-0 space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#5D5FEF]/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5D5FEF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5D5FEF]"></span>
              </span>
              <span className="text-[#5D5FEF] font-black text-[10px] uppercase tracking-widest">
                Currently Improving
              </span>
            </div>
            <h3 className="text-[#2D2E5F] font-black text-xl tracking-tighter text-center lg:text-left">
              Building the future of <br className="hidden lg:block" /> 
              <span className="text-[#5D5FEF]">Productivity</span> together.
            </h3>
          </div>

          {/* 2. Platform Stats / Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 w-full lg:w-auto">
            {milestones.map((item, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  {item.icon} {item.label}
                </div>
                <div className="text-[#2D2E5F] font-black text-2xl tracking-tight">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* 3. CTA for Feedback */}
          <Link 
            href="/contact"
            className="shrink-0 flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-[#5D5FEF] hover:shadow-xl hover:shadow-[#5D5FEF]/10 transition-all duration-300 group"
          >
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing a tool?</span>
              <span className="text-sm font-bold text-[#2D2E5F]">Tell us what to build</span>
            </div>
            <div className="bg-[#5D5FEF] text-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <MessageSquareHeart size={18} />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}