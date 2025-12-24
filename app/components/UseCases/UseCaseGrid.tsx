"use client";
import { GraduationCap, Scale, Video, Briefcase, Zap, Globe } from "lucide-react";

const useCases = [
  {
    title: "Education & Students",
    icon: <GraduationCap size={32} className="text-blue-500" />,
    desc: "Merge research papers, compress heavy study materials, and convert lecture notes instantly. Perfect for managing semester workloads.",
    benefit: "Save 5+ hours/week",
    image: "https://images.unsplash.com/photo-1523240715632-d9846f119ed7?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Legal & Compliance",
    icon: <Scale size={32} className="text-[#1E1F4B]" />,
    desc: "Combine legal exhibits, protect sensitive documents with passwords, and ensure all filings meet file size requirements without losing quality.",
    benefit: "Bank-grade Security",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Content Creators",
    icon: <Video size={32} className="text-red-500" />,
    desc: "Resize social media assets, remove backgrounds for thumbnails, and convert high-res videos to lightweight GIFs for web sharing.",
    benefit: "Speed up Workflow",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Remote Teams",
    icon: <Globe size={32} className="text-emerald-500" />,
    desc: "Standardize file formats across global teams. Ensure everyone is using the right compression and document standards every time.",
    benefit: "Seamless Sync",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
  }
];

export default function UseCaseGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {useCases.map((item, i) => (
        <div 
          key={i} 
          className="group relative bg-white rounded-[48px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
        >
          <div className="h-64 relative">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            <div className="absolute bottom-6 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
              {item.icon}
              <span className="font-black text-[10px] uppercase tracking-widest text-[#1E1F4B]">{item.benefit}</span>
            </div>
          </div>
          
          <div className="p-10 pt-4">
            <h3 className="text-3xl font-black text-[#1A1A1A] mb-4 tracking-tight">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-6">
              {item.desc}
            </p>
            <button className="flex items-center gap-2 text-[#5D5FEF] font-bold hover:gap-4 transition-all">
              Learn more <Zap size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}