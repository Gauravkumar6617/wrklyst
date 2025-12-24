// components/Home/TrustBar.tsx
import { ShieldCheck, Star } from 'lucide-react';

export default function TrustBar() {
  const partners = [
    "TECHFLOW", "NEXUS", "QUANTUM", "VELOCITY", "ORACLE", "STARK", "APEX"
  ];

  return (
    <div className="w-full bg-white py-14 border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* 1. Trust Label & Stats */}
          <div className="flex flex-col items-center lg:items-start shrink-0 space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-emerald-700 font-black text-[9px] uppercase tracking-wider">
                Enterprise Secure
              </span>
            </div>
            <h3 className="text-[#1A1A1A] font-black text-xl tracking-tighter">
              Trusted by <span className="text-[#5D5FEF]">10,000+</span> teams
            </h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={12} fill="#FACC15" className="text-yellow-400" />
              ))}
              <span className="text-slate-400 text-[11px] font-bold ml-1">4.9/5 Rating</span>
            </div>
          </div>

          {/* 2. Infinite Auto-Scrolling Logos */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <div className="flex gap-16 animate-infinite-scroll py-2">
              {/* First set of logos */}
              {partners.map((logo, i) => (
                <span 
                  key={i} 
                  className="text-slate-300 font-black text-2xl tracking-tighter hover:text-[#5D5FEF] transition-all duration-300 cursor-default grayscale hover:grayscale-0"
                >
                  {logo}
                </span>
              ))}
              {/* Duplicate set for seamless looping */}
              {partners.map((logo, i) => (
                <span 
                  key={`dup-${i}`} 
                  className="text-slate-300 font-black text-2xl tracking-tighter hover:text-[#5D5FEF] transition-all duration-300 cursor-default grayscale hover:grayscale-0"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}