// components/Legal/LegalLayout.tsx
import { FileText, Clock, ShieldCheck } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  version: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, subtitle, lastUpdated, version, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="hero-bg-custom pt-40 pb-20 relative overflow-hidden text-center">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[#5D5FEF]/10 rounded-full blur-[120px] animate-pulse-slow z-0" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5D5FEF]/5 rounded-full mb-6">
            <FileText size={16} className="text-[#5D5FEF]" />
            <span className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-[2px]">{subtitle}</span>
          </div>
          
          <h1 className="text-6xl font-[900] text-[#1A1A1A] mt-2 mb-6 tracking-tighter">
            {title} <span className="text-[#5D5FEF]">.</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              Last Updated: {lastUpdated}
            </div>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Version {version}
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="pb-32 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-16 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.02)]">
          <article className="prose prose-slate max-w-none">
            {children}
          </article>

          <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-sm font-medium italic">
              Questions? Reach out to legal@wrklyst.com
            </p>
            <button className="px-8 py-4 bg-[#F1F5F9] text-[#2D2E5F] rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
              Download as PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}