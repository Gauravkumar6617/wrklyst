"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, ImageIcon, Video, Search } from "lucide-react";

const toolCategories = [
  {
    category: "PDF Tools",
    icon: <FileText className="text-red-500" size={20} />,
    tools: [
      { 
        name: "Merge PDF", 
        slug: "merge-pdf", 
        desc: "Combine multiple PDFs into one document.", 
        image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=500&auto=format&fit=crop" 
      },
      { 
        name: "Compress PDF", 
        slug: "compress-pdf", 
        desc: "Reduce size while keeping quality.", 
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500&auto=format&fit=crop" 
      },
    ]
  },
  {
    category: "Image Tools",
    icon: <ImageIcon className="text-blue-500" size={20} />,
    tools: [
      { 
        name: "Remove Background", 
        slug: "remove-bg", 
        desc: "AI-powered instant BG removal.", 
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=500&auto=format&fit=crop" 
      },
      { 
        name: "Resize Image", 
        slug: "resize-image", 
        desc: "Perfect dimensions for social media.", 
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=500&auto=format&fit=crop" 
      },
    ]
  }
];

export default function ToolsDirectory() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-20 flex flex-col lg:flex-row gap-16">
      
      {/* Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-6 px-4">Categories</h3>
        <nav className="space-y-2">
          {toolCategories.map((cat) => (
            <button 
              key={cat.category}
              onClick={() => document.getElementById(cat.category.toLowerCase().replace(' ', '-'))?.scrollIntoView({behavior: 'smooth'})}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-[#5D5FEF] hover:shadow-sm transition-all text-sm group"
            >
              {cat.icon}
              {cat.category}
            </button>
          ))}
        </nav>
      </aside>

      {/* Tools Grid */}
      <div className="flex-1 space-y-24">
        {toolCategories.map((cat) => (
          <div key={cat.category} id={cat.category.toLowerCase().replace(' ', '-')}>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{cat.icon}</div>
              <h2 className="text-3xl font-black text-[#2D2E5F] tracking-tight">{cat.category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cat.tools.map((tool) => (
                <Link 
                  href={`/tools/${tool.slug}`} 
                  key={tool.slug}
                  className="group bg-white border border-slate-100 rounded-[40px] overflow-hidden hover:border-[#5D5FEF]/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500"
                >
                  {/* Tool Image Container */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                    <img 
                      src={tool.image} 
                      alt={tool.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <div className="p-8">
                    <h4 className="text-xl font-bold text-[#2D2E5F] group-hover:text-[#5D5FEF] transition-colors mb-2">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {tool.desc}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[#5D5FEF] font-black text-[10px] uppercase tracking-widest">
                      Launch Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}