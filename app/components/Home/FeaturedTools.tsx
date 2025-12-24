// components/Home/FeaturedTools.tsx
import { ArrowRight } from 'lucide-react';

const tools = [
  { name: "PDF Merge", desc: "Combine multiple files", color: "from-purple-500 to-indigo-600" },
  { name: "PDF Split", desc: "Extract pages easily", color: "from-blue-500 to-cyan-500" },
  { name: "Image Edit", desc: "Resize and crop photos", color: "from-orange-400 to-pink-500" },
  { name: "Compress", desc: "Reduce file size fast", color: "from-emerald-400 to-teal-600" },
  { name: "Convert", desc: "Change file formats", color: "from-indigo-400 to-purple-500" },
];

export default function FeaturedTools() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      {/* Header section remains left-aligned for better visual flow */}
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight mb-3">Featured Tools</h2>
          <p className="text-slate-500 font-medium text-lg">Power up your productivity with our most popular utilities.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-[#5D5FEF] font-bold text-sm hover:underline group">
          View all 50+ tools 
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {tools.map((tool, i) => (
          <div 
            key={i} 
            /* items-center added to center the whole column contents */
            className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(93,95,239,0.12)] transition-all duration-500 hover:-translate-y-3 flex flex-col items-center text-center"
          >
            {/* 1. The Gradient Icon Box (Already centered by flex-col) */}
            <div className={`w-20 h-20 rounded-[22px] bg-gradient-to-br ${tool.color} mb-8 flex items-center justify-center text-white shadow-xl shadow-current/25 group-hover:rotate-6 transition-transform duration-500`}>
               {/* Inner icon placeholder matching the reference image's glow */}
               <div className="w-8 h-8 bg-white/30 rounded-xl backdrop-blur-md border border-white/20" />
            </div>

            {/* 2. Text Content */}
            <h3 className="font-extrabold text-xl text-[#1A1A1A] mb-3 tracking-tight group-hover:text-[#5D5FEF] transition-colors">
              {tool.name}
            </h3>
            <p className="text-[14px] text-slate-400 font-semibold mb-8 leading-relaxed">
              {tool.desc}
            </p>

            {/* 3. Button - Now always slightly visible but pops on hover */}
            <button className="w-full py-4 bg-[#5D5FEF] text-white rounded-[20px] font-bold text-[12px] uppercase tracking-[1px] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-[#5D5FEF]/40">
              Use Now
            </button>
            
            {/* Subtle glow effect behind the card on hover */}
            <div className={`absolute inset-0 bg-gradient-to-b ${tool.color} opacity-0 group-hover:opacity-[0.03] rounded-[32px] -z-10 transition-opacity`} />
          </div>
        ))}
      </div>
    </section>
  );
}