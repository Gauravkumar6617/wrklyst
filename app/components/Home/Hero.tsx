// components/Hero.tsx
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero-bg-custom pt-24 pb-16 md:pt-32 md:pb-32 border-b border-white/20 relative overflow-hidden">
      
      {/* --- BACKGROUND ANIMATIONS --- */}
      <div className="absolute top-[5%] left-[5%] w-48 h-48 md:w-72 md:h-72 bg-[#5D5FEF]/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[5%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-400/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse-slow z-0" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-12 items-center relative z-10">
        
        {/* --- LEFT CONTENT --- */}
        <div className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left w-full">
          
          {/* 1. Headlines */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[900] text-[#1A1A1A] leading-[1.1] tracking-tight">
              Effortless File <br className="hidden sm:block" />
              Management. <span className="text-[#5D5FEF]">Instantly.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              All the tools you need to work smarter, not harder. 
              Free, secure, and works directly in your browser.
            </p>
          </div>

          {/* 2. Search & Quick Icons */}
          <div className="max-w-xl mx-auto lg:mx-0 space-y-8">
            <div className="flex items-center bg-white shadow-xl rounded-2xl overflow-hidden p-1.5 border border-slate-100 focus-within:ring-2 focus-within:ring-[#5D5FEF]/20 transition-all">
              <input 
                type="text" 
                placeholder="Search for a tool..." 
                className="w-full py-3 md:py-4 px-4 md:px-6 outline-none text-slate-700 font-medium placeholder:text-slate-300 text-sm md:text-base"
              />
              <button className="bg-[#5D5FEF] p-3 md:p-4 rounded-xl text-white shadow-lg shadow-[#5D5FEF]/30 hover:scale-105 active:scale-95 transition-all">
                <Search size={20} className="md:w-[22px]" strokeWidth={3} />
              </button>
            </div>
            
            {/* Quick-icons (Scrollable on small mobile) */}
            <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start gap-4 md:gap-6 mt-6">
              {[
                { name: 'Merge', icon: '1+1', color: 'from-purple-500/20' },
                { name: 'Edit', icon: '✎', color: 'from-blue-500/20' },
                { name: 'Convert', icon: '⇄', color: 'from-orange-500/20' },
                { name: 'Compress', icon: '⤓', color: 'from-emerald-500/20' },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <div className={`absolute -inset-2 bg-gradient-to-br ${item.color} to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl group-hover:border-[#5D5FEF]/30 transition-all duration-300">
                      <span className="text-[#5D5FEF] font-black text-sm md:text-base">{item.icon}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1A1A1A] transition-colors">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Social Proof (Centered on mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 py-2">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs md:text-sm font-bold text-[#2D2E5F]">1,402 users online</span>
              </div>
              <p className="text-[10px] md:text-[12px] text-slate-400 font-semibold uppercase tracking-tighter">Trusting Wrklyst right now</p>
            </div>
          </div>

          {/* 4. Main CTA */}
          <div className="flex justify-center lg:justify-start">
            <Link href="/tools">
              <button className="group bg-[#2D2E5F] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-sm md:text-[15px] shadow-2xl shadow-[#2D2E5F]/30 hover:scale-105 transition-all flex items-center gap-3">
                Explore All Tools
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FLOATING CARD (Hidden on mobile, visible from lg) --- */}
        <div className="hidden lg:block w-[360px] animate-float relative"> 
          <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-9 shadow-[0_40px_100px_-15px_rgba(93,95,239,0.18)] border border-white/60">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-black text-[11px] uppercase tracking-[3px] text-slate-300">Popular</h3>
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Split PDF', color: 'bg-purple-500' },
                { label: 'Convert JPG', color: 'bg-blue-500' },
                { label: 'Merge Files', color: 'bg-emerald-500' },
                { label: 'Compress', color: 'bg-orange-500' },
              ].map((tool, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[22px] bg-white border border-transparent hover:border-slate-100 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${tool.color} shadow-lg shadow-current/20`} />
                    <span className="font-bold text-slate-700 text-[15px]">{tool.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#5D5FEF] transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}